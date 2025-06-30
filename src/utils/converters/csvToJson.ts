
export const csvToJson = async (csvInput: string): Promise<string> => {
  try {
    const lines = csvInput.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV must have at least a header and one data row');
    }

    // Parse CSV headers
    const headers = parseCsvLine(lines[0]);
    const rows = lines.slice(1).map(line => parseCsvLine(line));

    // Convert to JSON objects
    const jsonData = rows.map(row => {
      const obj: Record<string, any> = {};
      headers.forEach((header, index) => {
        const value = row[index] || '';
        obj[header.trim()] = parseValue(value);
      });
      return obj;
    });

    return JSON.stringify(jsonData, null, 2);
  } catch (error) {
    throw new Error(`CSV to JSON conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
};

const parseValue = (value: string): any => {
  const trimmed = value.trim();
  
  // Try to parse as number
  if (/^\d+$/.test(trimmed)) {
    return parseInt(trimmed, 10);
  }
  
  if (/^\d*\.\d+$/.test(trimmed)) {
    return parseFloat(trimmed);
  }
  
  // Try to parse as boolean
  if (trimmed.toLowerCase() === 'true') return true;
  if (trimmed.toLowerCase() === 'false') return false;
  
  // Return as string
  return trimmed;
};
