import { parseDocument } from 'htmlparser2';
import { Element } from 'domhandler';

function inferDataType(value: string): string {
  if (/^\d+$/.test(value)) return 'xs:integer';
  if (/^\d+\.\d+$/.test(value)) return 'xs:decimal';
  if (/^(true|false)$/i.test(value)) return 'xs:boolean';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'xs:date';
  return 'xs:string';
}

function capitalize(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function getTypeName(node: Element): string {
  const path = [];
  let current: Element | null = node;
  while (current && current.parent && current.parent.type === 'tag') {
    path.unshift(capitalize(current.name));
    current = current.parent as Element;
  }
  path.unshift(capitalize(node.name));
  return path.join('') + 'Type';
}

function formatXSD(xml: string): string {
  const lines = xml.trim().split('\n');
  let indent = 0;
  return lines.map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('</') || trimmed.startsWith('/>')) indent--;
    const padded = '  '.repeat(Math.max(indent, 0)) + trimmed;
    if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>') && !trimmed.includes('</')) indent++;
    return padded;
  }).join('\n');
}

export function xmlToXsd(xml: string): string {
  const dom = parseDocument(xml, { xmlMode: true });
  const rootElement = dom.children.find(node => node.type === 'tag') as Element;

  const definedTypes = new Set<string>();
  const xsdLines: string[] = [];

  function defineComplexType(element: Element) {
    const typeName = getTypeName(element);
    if (definedTypes.has(typeName)) return;
    definedTypes.add(typeName);

    const children = (element.children || []).filter(child => child.type === 'tag') as Element[];
    const hasAttributes = element.attribs && Object.keys(element.attribs).length > 0;
    const hasChildren = children.length > 0;
    const hasText = (element.firstChild && element.firstChild.type === 'text' && element.firstChild.data.trim().length > 0);

    if (hasText && hasChildren) {
      throw new Error(`Mixed content in <${element.name}> is not supported`);
    }

    let complexType = `  <xs:complexType name="${typeName}">\n`;

    if (hasChildren) {
      const childCounts: Record<string, number> = {};
      for (const child of children) {
        childCounts[child.name] = (childCounts[child.name] || 0) + 1;
      }

      complexType += `    <xs:sequence>\n`;
      for (const child of children) {
        const childName = child.name;
        const childType = child.children.length > 0 ? getTypeName(child) : inferDataType(child.firstChild?.data || '');
        const minOccurs = '0';
        const maxOccurs = childCounts[childName] > 1 ? 'unbounded' : '1';
        complexType += `      <xs:element name="${childName}" type="${childType}" minOccurs="${minOccurs}" maxOccurs="${maxOccurs}"/>\n`;
        defineComplexType(child);
      }
      complexType += `    </xs:sequence>\n`;
    } else if (hasText) {
      complexType += `    <xs:simpleContent>\n      <xs:extension base="${inferDataType(element.firstChild?.data || '')}"/>\n    </xs:simpleContent>\n`;
    } else {
      complexType += `    <xs:sequence/>\n`;
    }

    // Handle attributes
    for (const [attrName, attrValue] of Object.entries(element.attribs)) {
      complexType += `    <xs:attribute name="${attrName}" type="${inferDataType(attrValue)}"/>\n`;
    }

    complexType += `  </xs:complexType>`;
    xsdLines.push(complexType);
  }

  const rootType = getTypeName(rootElement);
  defineComplexType(rootElement);

  const schema = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">',
    `  <xs:element name="${rootElement.name}" type="${rootType}"/>`,
    ...xsdLines,
    '</xs:schema>',
  ];

  return formatXSD(schema.join('\n'));
}
