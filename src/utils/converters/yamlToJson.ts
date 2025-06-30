
export const yamlToJson = async (yamlString: string): Promise<string> => {
  try {
    const parseYaml = (yamlText: string): any => {
      const lines = yamlText.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
      
      const result: any = {};
      const stack: Array<{obj: any, indent: number}> = [{obj: result, indent: -1}];
      
      for (const line of lines) {
        const indent = line.length - line.trimStart().length;
        const trimmed = line.trim();
        
        // Pop stack to current indent level
        while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
          stack.pop();
        }
        
        const current = stack[stack.length - 1].obj;
        
        if (trimmed.startsWith('- ')) {
          // Array item
          const value = trimmed.substring(2).trim();
          if (!Array.isArray(current)) {
            throw new Error('Invalid YAML structure');
          }
          
          if (value.includes(':')) {
            const obj = {};
            current.push(obj);
            stack.push({obj, indent});
            
            const [key, val] = value.split(':', 2);
            obj[key.trim()] = parseValue(val.trim());
          } else {
            current.push(parseValue(value));
          }
        } else if (trimmed.includes(':')) {
          const colonIndex = trimmed.indexOf(':');
          const key = trimmed.substring(0, colonIndex).trim();
          const value = trimmed.substring(colonIndex + 1).trim();
          
          if (value === '') {
            // Object or array follows
            const next = {};
            current[key] = next;
            stack.push({obj: next, indent});
          } else {
            current[key] = parseValue(value);
          }
        }
      }
      
      return result;
    };
    
    const parseValue = (value: string): any => {
      if (value === 'null') return null;
      if (value === 'true') return true;
      if (value === 'false') return false;
      if (value.startsWith('"') && value.endsWith('"')) {
        return value.slice(1, -1).replace(/\\"/g, '"');
      }
      if (/^\d+$/.test(value)) return parseInt(value, 10);
      if (/^\d+\.\d+$/.test(value)) return parseFloat(value);
      return value;
    };
    
    const parsed = parseYaml(yamlString.trim());
    return JSON.stringify(parsed, null, 2);
  } catch (error) {
    throw new Error(`YAML parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
