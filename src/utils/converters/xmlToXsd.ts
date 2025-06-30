/**
 * XMLtoXSD.ts
 *
 * Purpose:
 * Converts complex and deeply nested XML data into a well-structured, type-inferred XSD schema.
 *
 * Approach:
 * 1. Parse XML string into a DOM structure.
 * 2. Traverse nodes recursively, collecting:
 *    - element names and occurrences
 *    - attribute names/types
 *    - value types (date, boolean, string, integer)
 * 3. Identify repeating elements for maxOccurs.
 * 4. Build complexTypes with reuse and modularity.
 * 5. Return a valid, readable, and extensible XSD string.
 */

import { XMLParser } from 'fast-xml-parser';

type ElementMeta = {
  name: string;
  attributes: Record<string, string>;
  children: ElementMeta[];
  valueType?: string;
  occurs?: number;
};

const inferType = (value: any): string => {
  if (typeof value === 'boolean' || value === 'true' || value === 'false') return 'xs:boolean';
  if (!isNaN(Number(value))) return Number(value) % 1 === 0 ? 'xs:integer' : 'xs:decimal';
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'xs:date';
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(value)) return 'xs:time';
  }
  return 'xs:string';
};

const extractMeta = (
  obj: any,
  nodeName: string,
  counter: Record<string, number> = {}
): ElementMeta => {
  const meta: ElementMeta = {
    name: nodeName,
    attributes: {},
    children: [],
  };

  counter[nodeName] = (counter[nodeName] || 0) + 1;

  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
    meta.valueType = inferType(obj);
    return meta;
  }

  if (typeof obj === 'object') {
    for (const key in obj) {
      if (key.startsWith('@_')) {
        const attrName = key.substring(2);
        meta.attributes[attrName] = inferType(obj[key]);
      } else if (Array.isArray(obj[key])) {
        for (const item of obj[key]) {
          meta.children.push(extractMeta(item, key, counter));
        }
      } else if (typeof obj[key] === 'object') {
        meta.children.push(extractMeta(obj[key], key, counter));
      } else {
        meta.children.push({
          name: key,
          attributes: {},
          children: [],
          valueType: inferType(obj[key]),
        });
      }
    }
  }

  return meta;
};

const buildXSDFromMeta = (meta: ElementMeta, definedTypes = new Set<string>()): string => {
  let xsd = '';
  const typeName = `${meta.name}Type`;

  if (definedTypes.has(typeName)) return ''; // Avoid redefining
  definedTypes.add(typeName);

  if (meta.children.length > 0) {
    xsd += `  <xs:complexType name="${typeName}">\n    <xs:sequence>\n`;

    const seen = new Set<string>();
    meta.children.forEach((child) => {
      const maxOccurs = child.occurs && child.occurs > 1 ? ' maxOccurs="unbounded"' : '';
      const minOccurs = ' minOccurs="0"';

      const childType = child.children.length > 0
        ? `${child.name}Type`
        : child.valueType || 'xs:string';

      xsd += `      <xs:element name="${child.name}" type="${childType}"${minOccurs}${maxOccurs}/>\n`;

      // Recursively define complex children
      xsd += buildXSDFromMeta(child, definedTypes);
    });

    xsd += `    </xs:sequence>\n`;

    // Handle attributes
    for (const attr in meta.attributes) {
      xsd += `    <xs:attribute name="${attr}" type="${meta.attributes[attr]}" use="optional"/>\n`;
    }

    xsd += `  </xs:complexType>\n`;
  } else if (meta.valueType) {
    // Simple type with just a value
    xsd += `  <xs:simpleType name="${typeName}">\n`;
    xsd += `    <xs:restriction base="${meta.valueType}"/>\n`;
    xsd += `  </xs:simpleType>\n`;
  }

  return xsd;
};

export const convertXMLToXSD = (xmlString: string): string => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    parseAttributeValue: true,
    parseTagValue: true,
    trimValues: true,
  });

  const parsed = parser.parse(xmlString);
  const rootName = Object.keys(parsed)[0];
  const root = parsed[rootName];

  const counter: Record<string, number> = {};
  const rootMeta = extractMeta(root, rootName, counter);

  let xsd = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xsd += `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">\n`;
  xsd += `  <xs:element name="${rootName}" type="${rootName}Type"/>\n`;

  xsd += buildXSDFromMeta(rootMeta);

  xsd += `</xs:schema>\n`;

  return xsd;
};
