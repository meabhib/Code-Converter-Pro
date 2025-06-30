
export const xmlToJson = async (xmlString: string): Promise<string> => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString.trim(), 'text/xml');
    
    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Invalid XML format');
    }
    
    const xmlToObject = (node: Element): any => {
      const result: any = {};
      
      // Handle attributes
      if (node.attributes.length > 0) {
        result['@attributes'] = {};
        for (let i = 0; i < node.attributes.length; i++) {
          const attr = node.attributes[i];
          result['@attributes'][attr.name] = attr.value;
        }
      }
      
      // Handle child nodes
      if (node.hasChildNodes()) {
        for (let i = 0; i < node.childNodes.length; i++) {
          const child = node.childNodes[i];
          
          if (child.nodeType === Node.TEXT_NODE) {
            const text = child.textContent?.trim();
            if (text) {
              if (Object.keys(result).length === 0) {
                return text;
              } else {
                result['#text'] = text;
              }
            }
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            const childElement = child as Element;
            const childName = childElement.nodeName;
            const childValue = xmlToObject(childElement);
            
            if (result[childName]) {
              if (!Array.isArray(result[childName])) {
                result[childName] = [result[childName]];
              }
              result[childName].push(childValue);
            } else {
              result[childName] = childValue;
            }
          }
        }
      }
      
      return result;
    };
    
    const rootElement = xmlDoc.documentElement;
    const jsonObject = {
      [rootElement.nodeName]: xmlToObject(rootElement)
    };
    
    return JSON.stringify(jsonObject, null, 2);
  } catch (error) {
    throw new Error(`XML parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
