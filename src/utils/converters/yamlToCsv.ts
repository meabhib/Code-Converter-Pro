
export const yamlToCsv = async (yamlString: string): Promise<string> => {
  try {
    // Simple YAML parser for basic structures
    const parseYaml = (yamlText: string): any => {
      const lines = yamlText.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
      
      const result: any[] = [];
      let currentObj: any = {};
      
      for (const line of lines) {
        const trimmed = line.trim();
        
        if (trimmed.startsWith('- ')) {
          if (Object.keys(currentObj).length > 0) {
            result.push(currentObj);
            currentObj = {};
          }
          
          const content = trimmed.substring(2).trim();
          if (content.includes(':')) {
            const [key, value] = content.split(':', 2);
            currentObj[key.trim()] = value.trim();
          }
        } else if (trimmed.includes(':')) {
          const [key, value] = trimmed.split(':', 2);
          currentObj[key.trim()] = value.trim();
        }
      }
      
      if (Object.keys(currentObj).length > 0) {
        result.push(currentObj);
      }
      
      return result;
    };
    
    const data = parseYaml(yamlString.trim());
    
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('YAML must contain an array of objects for CSV conversion');
    }
    
    // Get all unique headers
    const headers = Array.from(new Set(data.flatMap(obj => Object.keys(obj))));
    
    // Create CSV
    const csvLines = [headers.join(',')];
    
    data.forEach(obj => {
      const row = headers.map(header => {
        const value = obj[header] || '';
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvLines.push(row.join(','));
    });
    
    return csvLines.join('\n');
  } catch (error) {
    throw new Error(`YAML to CSV conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
