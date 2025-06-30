/**
 * XMLtoXSD.ts
 * Converts complex XML to an XSD Schema.
 *
 * Approach:
 * 1. Parse XML into a DOM object.
 * 2. Recursively walk elements and attributes.
 * 3. Track structure to define reusable complexTypes.
 * 4. Handle type inference (basic: string, int, boolean, date).
 * 5. Detect repeating elements for maxOccurs.
 */

import { DOMParser } from '@xmldom/xmldom';
import * as fs from 'fs';

// Infer XSD data type from value
function inferType(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'xs:date';
  if (/^\d+$/.test(value)) return 'xs:integer';
  if (/^(true|false)$/i.test(value)) return 'xs:boolean';
  return 'xs:string';
}

// Track seen element structures to avoid duplicates
const definedTypes: Map<string, string> = new Map();

function toPascalCase(name: string): string {
  return name.replace(/(^|_)(\w)/g, (_, __, c) => c.toUpperCase());
}

function sanitizeTypeName(name: string): string {
  return toPascalCase(name) + 'Type';
}

function processElement(
  node: Element,
  typeNameHint?: string,
  parentCounts: Record<string, number> = {}
): { typeName: string; xsd: string } {
  const nodeName = node.nodeName;
  const children = Array.from(node.childNodes).filter(n => n.nodeType === 1) as Element[];
  const attributes = Array.from(node.attributes || []);

  const childCount: Record<string, number> = {};
  for (const child of children) {
    childCount[child.nodeName] = (childCount[child.nodeName] || 0) + 1;
  }

  const typeName = typeNameHint || sanitizeTypeName(nodeName);

  if (definedTypes.has(typeName)) {
    return { typeName, xsd: '' }; // already processed
  }

  let xsd = `<xs:complexType name="${typeName}">\n`;
  xsd += `  <xs:sequence>\n`;

  for (const [name, count] of Object.entries(childCount)) {
    const elements = children.filter(c => c.nodeName === name);
    const exampleChild = elements[0];

    const { typeName: childType, xsd: childXSD } = processElement(exampleChild, sanitizeTypeName(name));
    if (childXSD) xsd += childXSD;

    xsd += `    <xs:element name="${name}" type="${childType}"${count > 1 ? ' maxOccurs="unbounded"' : ''} minOccurs="0"/>\n`;
  }

  xsd += `  </xs:sequence>\n`;

  for (const attr of attributes) {
    const attrType = inferType(attr.value);
    xsd += `  <xs:attribute name="${attr.name}" type="${attrType}" use="required"/>\n`;
  }

  xsd += `</xs:complexType>\n\n`;

  definedTypes.set(typeName, xsd);
  return { typeName, xsd };
}

// Entry function
function convertXMLtoXSD(xmlContent: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlContent, 'text/xml');
  const root = doc.documentElement;

  definedTypes.clear();

  const { typeName, xsd: mainXSD } = processElement(root);
  const schemaParts: string[] = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">`,
    `  <xs:element name="${root.nodeName}" type="${typeName}"/>\n`,
  ];

  for (const def of definedTypes.values()) {
    schemaParts.push(def);
  }

  schemaParts.push(`</xs:schema>`);
  return schemaParts.join('\n');
}

// Example usage
if (require.main === module) {
  const xml = fs.readFileSync('input.xml', 'utf-8');
  const xsd = convertXMLtoXSD(xml);
  fs.writeFileSync('output.xsd', xsd);
  console.log('XSD generated and saved to output.xsd');
}

export { convertXMLtoXSD };
