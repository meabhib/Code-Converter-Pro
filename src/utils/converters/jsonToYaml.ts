
export const jsonToYaml = async (jsonString: string): Promise<string> => {
  try {
    const jsonData = JSON.parse(jsonString.trim());
    
    const convertToYaml = (obj: any, indent: number = 0): string => {
      const spaces = '  '.repeat(indent);
      
      if (obj === null) {
        return 'null';
      }
      
      if (typeof obj === 'string') {
        // Check if string needs quotes
        if (obj.includes('\n') || obj.includes(':') || obj.includes('#') || obj.trim() !== obj) {
          return `"${obj.replace(/"/g, '\\"')}"`;
        }
        return obj;
      }
      
      if (typeof obj === 'number' || typeof obj === 'boolean') {
        return String(obj);
      }
      
      if (Array.isArray(obj)) {
        if (obj.length === 0) return '[]';
        return obj.map(item => `${spaces}- ${convertToYaml(item, indent + 1)}`).join('\n');
      }
      
      if (typeof obj === 'object') {
        const entries = Object.entries(obj);
        if (entries.length === 0) return '{}';
        
        return entries.map(([key, value]) => {
          const yamlValue = convertToYaml(value, indent + 1);
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            return `${spaces}${key}:\n${yamlValue}`;
          } else if (Array.isArray(value) && value.length > 0) {
            return `${spaces}${key}:\n${yamlValue}`;
          } else {
            return `${spaces}${key}: ${yamlValue}`;
          }
        }).join('\n');
      }
      
      return String(obj);
    };
    
    return convertToYaml(jsonData);
  } catch (error) {
    throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
