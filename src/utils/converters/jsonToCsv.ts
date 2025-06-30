
export const jsonToCsv = async (jsonInput: string): Promise<string> => {
  try {
    const data = JSON.parse(jsonInput);
    
    if (!Array.isArray(data)) {
      throw new Error('JSON must be an array of objects');
    }
    
    if (data.length === 0) {
      return '';
    }

    // Extract all unique headers from all objects
    const allHeaders = new Set<string>();
    data.forEach(obj => {
      if (typeof obj === 'object' && obj !== null) {
        Object.keys(obj).forEach(key => allHeaders.add(key));
      }
    });

    const headers = Array.from(allHeaders);
    
    // Create CSV content
    let csv = headers.map(header => escapeCsvField(header)).join(',') + '\n';
    
    data.forEach(obj => {
      const row = headers.map(header => {
        const value = obj && typeof obj === 'object' ? obj[header] : '';
        return escapeCsvField(String(value || ''));
      });
      csv += row.join(',') + '\n';
    });

    return csv.trim();
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON format');
    }
    throw new Error(`JSON to CSV conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const escapeCsvField = (field: string): string => {
  // If field contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (field.includes(',') || field.includes('"') || field.includes('\n') || field.includes('\r')) {
    return '"' + field.replace(/"/g, '""') + '"';
  }
  return field;
};
