export const xmlToXsd = async (xmlInput: string): Promise<string> => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlInput, 'application/xml');

    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
      throw new Error('Invalid XML format');
    }

    const root = xmlDoc.documentElement;
    const complexTypes = new Map<string, string>();
    const definedTypes = new Set<string>();

    const buildComplexType = (element: Element): string => {
      const typeName = `${element.tagName}Type`;
      if (definedTypes.has(typeName)) return ''; // Avoid redefinition
      definedTypes.add(typeName);

      const children = Array.from(element.children);
      const occurrences: Record<string, number> = {};

      children.forEach(child => {
        occurrences[child.tagName] = (occurrences[child.tagName] || 0) + 1;
      });

      let sequence = '';
      const nestedTypes: string[] = [];

      children.forEach(child => {
        const name = child.tagName;
        const maxOccurs = occurrences[name] > 1 ? ' maxOccurs="unbounded"' : '';
        const minOccurs = ' minOccurs="0"';
        const hasNested = child.children.length > 0;

        let type;
        if (hasNested) {
          type = `${name}Type`;
          nestedTypes.push(buildComplexType(child));
        } else {
          type = inferDataType(child.textContent || '');
        }

        sequence += `      <xs:element name="${name}" type="xs:${type}"${minOccurs}${maxOccurs}/>\n`;
      });

      const complexType = `
  <xs:complexType name="${typeName}">
    <xs:sequence>
${sequence.trimEnd()}
    </xs:sequence>
  </xs:complexType>`;

      complexTypes.set(typeName, complexType);
      return nestedTypes.join('\n') + '\n' + complexType;
    };

    const rootTypeName = `${root.tagName}Type`;
    buildComplexType(root);

    let schema = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    schema += `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">\n\n`;
    schema += `  <xs:element name="${root.tagName}" type="${rootTypeName}"/>\n\n`;

    schema += Array.from(complexTypes.values()).join('\n\n') + '\n';
    schema += `</xs:schema>\n`;

    return formatXml(schema);
  } catch (err) {
    throw new Error(`XSD generation failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
};

const inferDataType = (value: string): string => {
  const v = value.trim();
  if (!v) return 'string';
  if (/^\d+$/.test(v)) return 'integer';
  if (/^\d*\.\d+$/.test(v)) return 'decimal';
  if (/^(true|false)$/i.test(v)) return 'boolean';
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return 'date';
  return 'string';
};

const formatXml = (xml: string): string => {
  const PADDING = '  ';
  let formatted = '';
  let pad = 0;

  xml.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (trimmed.match(/^<\/\w/)) pad -= 1;
    formatted += PADDING.repeat(pad) + trimmed + '\n';
    if (trimmed.match(/^<\w[^>]*[^/]?>.*$/) && !trimmed.includes('</')) pad += 1;
  });

  return formatted.trim();
};
