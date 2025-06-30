
export const csvToYaml = async (csvString: string): Promise<string> => {
  try {
    const lines = csvString.trim().split('\n');
    if (lines.length === 0) {
      throw new Error('Empty CSV input');
    }
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"(.*)"$/, '$1'));
    const rows = lines.slice(1);
    
    const data = rows.map(row => {
      const values = row.split(',').map(v => v.trim().replace(/^"(.*)"$/, '$1'));
      const obj: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index] || '';
        // Try to parse as number or boolean
        if (/^\d+$/.test(value)) {
          obj[header] = parseInt(value, 10);
        } else if (/^\d+\.\d+$/.test(value)) {
          obj[header] = parseFloat(value);
        } else if (value.toLowerCase() === 'true') {
          obj[header] = true;
        } else if (value.toLowerCase() === 'false') {
          obj[header] = false;
        } else {
          obj[header] = value;
        }
      });
      
      return obj;
    });
    
    // Convert to YAML format
    const convertToYaml = (obj: any, indent: number = 0): string => {
      const spaces = '  '.repeat(indent);
      
      if (Array.isArray(obj)) {
        return obj.map(item => `${spaces}- ${convertToYaml(item, indent + 1).replace(/^\s+/, '')}`).join('\n');
      }
      
      if (typeof obj === 'object' && obj !== null) {
        return Object.entries(obj).map(([key, value]) => {
          return `${spaces}${key}: ${typeof value === 'object' ? '\n' + convertToYaml(value, indent + 1) : value}`;
        }).join('\n');
      }
      
      return String(obj);
    };
    
    return convertToYaml(data);
  } catch (error) {
    throw new Error(`CSV to YAML conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
