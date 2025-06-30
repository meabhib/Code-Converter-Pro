
export const csvToXml = async (csvInput: string): Promise<string> => {
  try {
    const lines = csvInput.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV must have at least a header and one data row');
    }

    // Parse CSV headers
    const headers = parseCsvLine(lines[0]);
    const rows = lines.slice(1).map(line => parseCsvLine(line));

    // Generate XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<data>\n`;

    rows.forEach((row, index) => {
      xml += `  <record id="${index + 1}">\n`;
      
      headers.forEach((header, headerIndex) => {
        const value = row[headerIndex] || '';
        const elementName = sanitizeElementName(header);
        xml += `    <${elementName}>${escapeXml(value)}</${elementName}>\n`;
      });
      
      xml += `  </record>\n`;
    });

    xml += `</data>`;

    return formatXml(xml);
  } catch (error) {
    throw new Error(`CSV to XML conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const parseCsvLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
};

const sanitizeElementName = (name: string): string => {
  return name
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/^[^a-zA-Z_]/, '_')
    .toLowerCase();
};

const escapeXml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

const formatXml = (xml: string): string => {
  const lines = xml.split('\n');
  let formatted = '';
  let indent = 0;
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;
    
    if (trimmed.startsWith('</')) {
      indent = Math.max(0, indent - 2);
    }
    
    formatted += ' '.repeat(indent) + trimmed + '\n';
    
    if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>') && !trimmed.includes('<?xml')) {
      indent += 2;
    }
  });
  
  return formatted;
};
