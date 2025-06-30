export const xmlToXsd = async (xmlInput: string): Promise<string> => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlInput, 'text/xml');

    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
      throw new Error('Invalid XML format');
    }

    const rootElement = xmlDoc.documentElement;
    const complexTypes: string[] = [];
    const elementDefs: string[] = [];

    const processElement = (
      element: Element,
      typeName?: string,
      level = 0
    ): string => {
      const indent = '  '.repeat(level);
      const name = element.tagName;
      const children = Array.from(element.children);
      const attributes = Array.from(element.attributes);
      const hasChildren = children.length > 0;

      const isComplex = hasChildren || attributes.length > 0;

      const localTypeName = typeName || `${name}Type`;
      if (complexTypes.includes(localTypeName)) return localTypeName;

      let complexType = `${indent}<xs:complexType name="${localTypeName}">\n`;

      if (hasChildren) {
        complexType += `${indent}  <xs:sequence>\n`;

        const childGroups = groupElements(children);
        for (const [childName, group] of Object.entries(childGroups)) {
          const firstChild = group[0];
          const childTypeName = processElement(firstChild, `${childName}Type`, level + 2);
          complexType += `${indent}    <xs:element name="${childName}" type="${childTypeName}" minOccurs="0"${group.length > 1 ? ' maxOccurs="unbounded"' : ''}/>\n`;
        }

        complexType += `${indent}  </xs:sequence>\n`;
      }

      for (const attr of attributes) {
        const attrType = getDataType(attr.value);
        complexType += `${indent}  <xs:attribute name="${attr.name}" type="${attrType}" use="required"/>\n`;
      }

      complexType += `${indent}</xs:complexType>\n`;
      complexTypes.push(localTypeName);
      return localTypeName;
    };

    const rootTypeName = processElement(rootElement);
    elementDefs.push(`<xs:element name="${rootElement.tagName}" type="${rootTypeName}"/>`);

    let xsd = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xsd += `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">\n\n`;

    elementDefs.forEach(def => xsd += `  ${def}\n\n`);
    complexTypes.forEach(typeDef => xsd += `  ${typeDef}\n`);

    xsd += `</xs:schema>`;

    return formatXml(xsd);
  } catch (error) {
    throw new Error(`XSD generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const groupElements = (elements: Element[]): Record<string, Element[]> => {
  return elements.reduce((acc, el) => {
    const name = el.tagName;
    acc[name] = acc[name] || [];
    acc[name].push(el);
    return acc;
  }, {} as Record<string, Element[]>);
};

const getDataType = (value: string): string => {
  if (!value.trim()) return 'xs:string';
  if (/^\d+$/.test(value)) return 'xs:integer';
  if (/^\d*\.\d+$/.test(value)) return 'xs:decimal';
  if (/^(true|false)$/i.test(value)) return 'xs:boolean';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'xs:date';
  return 'xs:string';
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

    if (
      trimmed.startsWith('<') &&
      !trimmed.startsWith('</') &&
      !trimmed.endsWith('/>') &&
      !trimmed.includes('<?xml')
    ) {
      indent += 2;
    }
  });

  return formatted;
};
