
export const jsonToXml = async (jsonString: string): Promise<string> => {
  try {
    const jsonData = JSON.parse(jsonString.trim());
    
    const convertToXml = (obj: any, rootName: string = 'root'): string => {
      if (obj === null || obj === undefined) {
        return `<${rootName}></${rootName}>`;
      }
      
      if (typeof obj !== 'object') {
        return `<${rootName}>${String(obj).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</${rootName}>`;
      }
      
      if (Array.isArray(obj)) {
        return obj.map(item => convertToXml(item, 'item')).join('\n');
      }
      
      let xml = `<${rootName}>`;
      for (const [key, value] of Object.entries(obj)) {
        const cleanKey = key.replace(/[^a-zA-Z0-9_-]/g, '_');
        if (Array.isArray(value)) {
          xml += value.map(item => convertToXml(item, cleanKey)).join('');
        } else if (typeof value === 'object' && value !== null) {
          xml += convertToXml(value, cleanKey);
        } else {
          const escapedValue = String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          xml += `<${cleanKey}>${escapedValue}</${cleanKey}>`;
        }
      }
      xml += `</${rootName}>`;
      
      return xml;
    };
    
    const xmlResult = convertToXml(jsonData, 'root');
    
    // Pretty format the XML
    const formatted = xmlResult.replace(/></g, '>\n<');
    let indented = '';
    let indent = 0;
    
    formatted.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('</')) {
        indent--;
      }
      indented += '  '.repeat(Math.max(0, indent)) + trimmed + '\n';
      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
        indent++;
      }
    });
    
    return `<?xml version="1.0" encoding="UTF-8"?>\n${indented.trim()}`;
  } catch (error) {
    throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
