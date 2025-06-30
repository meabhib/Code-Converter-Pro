import { XMLParser } from 'fast-xml-parser';

interface SchemaNode {
  name: string;
  type: string;
  attributes: Record<string, string>;
  children: SchemaNode[];
  isArray: boolean;
}

const inferXsdType = (value: string): string => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'xs:date';
  if (/^\d+$/.test(value)) return 'xs:integer';
  if (/^\d+\.\d+$/.test(value)) return 'xs:decimal';
  if (/^(true|false)$/i.test(value)) return 'xs:boolean';
  return 'xs:string';
};

const countPaths = (obj: any, path = '', map = new Map<string, number>()) => {
  if (typeof obj !== 'object' || obj === null) return;

  Object.entries(obj).forEach(([key, value]) => {
    const fullPath = `${path}/${key}`;
    const count = map.get(fullPath) || 0;
    map.set(fullPath, count + 1);

    if (Array.isArray(value)) {
      value.forEach(v => countPaths(v, fullPath, map));
    } else if (typeof value === 'object') {
      countPaths(value, fullPath, map);
    }
  });

  return map;
};

const analyzeNode = (
  name: string,
  obj: any,
  pathMap: Map<string, number>
): SchemaNode => {
  const attributes: Record<string, string> = {};
  const children: SchemaNode[] = [];
  const isArray = (pathMap.get(name) || 0) > 1;

  const seen = new Set<string>();

  if (obj && typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('@_')) {
        attributes[key.substring(2)] = inferXsdType(String(value));
      } else if (Array.isArray(value)) {
        const child = analyzeNode(`${name}/${key}`, value[0], pathMap);
        child.name = key;
        child.isArray = true;
        children.push(child);
      } else if (typeof value === 'object') {
        const child = analyzeNode(`${name}/${key}`, value, pathMap);
        child.name = key;
        children.push(child);
      } else {
        if (!seen.has(key)) {
          children.push({
            name: key,
            type: inferXsdType(String(value)),
            attributes: {},
            children: [],
            isArray: false
          });
          seen.add(key);
        }
      }
    }
  }

  return { name: name.split('/').pop() || name, type: 'xs:string', attributes, children, isArray };
};

const generateXsdElement = (node: SchemaNode, indent = '  '): string => {
  const occurs = node.isArray ? ' maxOccurs="unbounded"' : '';
  if (node.children.length === 0) {
    return `${indent}<xs:element name="${node.name}" type="${node.type}"${occurs}/>`;
  }

  const complexType = [
    `${indent}<xs:element name="${node.name}"${occurs}>`,
    `${indent}  <xs:complexType>`,
    `${indent}    <xs:sequence>`,
    ...node.children.map(child => generateXsdElement(child, indent + '      ')),
    `${indent}    </xs:sequence>`
  ];

  Object.entries(node.attributes).forEach(([attrName, attrType]) => {
    complexType.push(`${indent}    <xs:attribute name="${attrName}" type="${attrType}" use="optional"/>`);
  });

  complexType.push(`${indent}  </xs:complexType>`, `${indent}</xs:element>`);
  return complexType.join('\n');
};

export const convertXmlToXsd = (xml: string): string => {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
  const jsonObj = parser.parse(xml);
  const rootName = Object.keys(jsonObj)[0];
  const rootObj = jsonObj[rootName];
  const pathMap = countPaths(rootObj, `/${rootName}`)!;
  const root = analyzeNode(`/${rootName}`, rootObj, pathMap);

  return `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" elementFormDefault="qualified">
${generateXsdElement(root, '  ')}
</xs:schema>`;
};
