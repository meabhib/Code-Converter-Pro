
export const xmlToXsd = async (xmlInput: string): Promise<string> => {
  try {
    // Parse XML to extract structure
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlInput, 'text/xml');
    
    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
      throw new Error('Invalid XML format');
    }
    
    const rootElement = xmlDoc.documentElement;
    const namespace = rootElement.namespaceURI || '';
    const prefix = namespace ? 'tns:' : '';
    
    // Generate XSD based on XML structure
    let xsd = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xsd += `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"`;
    
    if (namespace) {
      xsd += `\n           targetNamespace="${namespace}"`;
      xsd += `\n           xmlns:tns="${namespace}"`;
    }
    
    xsd += `>\n\n`;
    
    // Add root element definition
    xsd += `  <xs:element name="${rootElement.tagName}" type="${prefix}${rootElement.tagName}Type"/>\n\n`;
    
    // Add complex type definition
    xsd += `  <xs:complexType name="${rootElement.tagName}Type">\n`;
    xsd += `    <xs:sequence>\n`;
    
    // Process child elements
    const processedElements = new Set<string>();
    const childElements = Array.from(rootElement.children);
    
    childElements.forEach(child => {
      if (!processedElements.has(child.tagName)) {
        processedElements.add(child.tagName);
        const hasChildren = child.children.length > 0;
        const dataType = hasChildren ? `${prefix}${child.tagName}Type` : getDataType(child.textContent || '');
        
        xsd += `      <xs:element name="${child.tagName}" type="${dataType}" minOccurs="0"/>\n`;
      }
    });
    
    xsd += `    </xs:sequence>\n`;
    xsd += `  </xs:complexType>\n\n`;
    
    // Add complex types for child elements with children
    childElements.forEach(child => {
      if (child.children.length > 0 && !processedElements.has(`${child.tagName}Type`)) {
        processedElements.add(`${child.tagName}Type`);
        xsd += generateComplexType(child, prefix);
      }
    });
    
    xsd += `</xs:schema>`;
    
    return formatXml(xsd);
  } catch (error) {
    throw new Error(`XSD generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const getDataType = (value: string): string => {
  if (!value.trim()) return 'xs:string';
  if (/^\d+$/.test(value)) return 'xs:integer';
  if (/^\d*\.\d+$/.test(value)) return 'xs:decimal';
  if (/^(true|false)$/i.test(value)) return 'xs:boolean';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'xs:date';
  return 'xs:string';
};

const generateComplexType = (element: Element, prefix: string): string => {
  let complexType = `  <xs:complexType name="${element.tagName}Type">\n`;
  complexType += `    <xs:sequence>\n`;
  
  const processedElements = new Set<string>();
  Array.from(element.children).forEach(child => {
    if (!processedElements.has(child.tagName)) {
      processedElements.add(child.tagName);
      const hasChildren = child.children.length > 0;
      const dataType = hasChildren ? `${prefix}${child.tagName}Type` : getDataType(child.textContent || '');
      
      complexType += `      <xs:element name="${child.tagName}" type="${dataType}" minOccurs="0"/>\n`;
    }
  });
  
  complexType += `    </xs:sequence>\n`;
  complexType += `  </xs:complexType>\n\n`;
  
  return complexType;
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
