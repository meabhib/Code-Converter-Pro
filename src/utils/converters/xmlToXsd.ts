export const xmlToXsd = async (xmlInput: string): Promise<string> => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlInput, 'application/xml');

    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
      throw new Error('Invalid XML format');
    }

    const rootElement = xmlDoc.documentElement;
    const usedTypes = new Set<string>();
    const typeDefinitions: string[] = [];

    let xsd = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xsd += `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">\n\n`;

    xsd += `  <xs:element name="${rootElement.tagName}" type="${rootElement.tagName}Type"/>\n\n`;
    typeDefinitions.push(generateComplexType(rootElement, usedTypes));

    xsd += typeDefinitions.join('');
    xsd += `</xs:schema>`;

    return formatXml(xsd);
  } catch (error) {
    throw new Error(`XSD generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const generateComplexType = (element: Element, usedTypes: Set<string>): string => {
  const typeName = `${element.tagName}Type`;
  if (usedTypes.has(typeName)) return '';
  usedTypes.add(typeName);

  const children = Array.from(element.children);
  const hasChildren = children.length > 0;
  const attributes = Array.from(element.attributes);
  const textContent = element.textContent?.trim();
  const hasText = textContent && children.length === 0;

  let complex = `  <xs:complexType name="${typeName}">\n`;

  if (hasChildren) {
    complex += `    <xs:sequence>\n`;

    const tagCount: Record<string, number> = {};
    children.forEach(child => {
      const tag = child.tagName;
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });

    const processed: Set<string> = new Set();
    children.forEach(child => {
      const tag = child.tagName;
      if (processed.has(tag)) return;
      processed.add(tag);

      const childType = child.children.length > 0
        ? `${tag}Type`
        : getDataType(child.textContent || '');

      const maxOccurs = tagCount[tag] > 1 ? ' maxOccurs="unbounded"' : '';
      complex += `      <xs:element name="${tag}" type="${childType}" minOccurs="0"${maxOccurs}/>\n`;
    });

    complex += `    </xs:sequence>\n`;
  } else if (hasText) {
    complex += `    <xs:simpleContent>\n`;
    complex += `      <xs:extension base="${getDataType(textContent!)}">\n`;
    attributes.forEach(attr => {
      complex += `        <xs:attribute name="${attr.name}" type="${getDataType(attr.value)}" use="required"/>\n`;
    });
    complex += `      </xs:extension>\n`;
    complex += `    </xs:simpleContent>\n`;
    complex += `  </xs:complexType>\n\n`;
    return complex;
  }

  // Add attributes if not already handled
  attributes.forEach(attr => {
    complex += `    <xs:attribute name="${attr.name}" type="${getDataType(attr.value)}" use="required"/>\n`;
  });

  complex += `  </xs:complexType>\n\n`;

  // Recursively generate complex types for nested elements
  children.forEach(child => {
    if (child.children.length > 0 || child.attributes.length > 0) {
      complex += generateComplexType(child, usedTypes);
    }
  });

  return complex;
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
      !trimmed.includes('<?xml') &&
      !trimmed.includes('<xs:attribute')
    ) {
      indent += 2;
    }
  });

  return formatted;
};
