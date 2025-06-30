import { parseStringPromise } from 'xml2js';
import { create } from 'xmlbuilder2';

export async function convertXmlToXsd(xmlString: string): Promise<string> {
  try {
    const parsedXml = await parseStringPromise(xmlString, { mergeAttrs: true });
    const rootName = Object.keys(parsedXml)[0];
    const schema = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('xs:schema', {
        xmlns: 'http://www.w3.org/2001/XMLSchema',
        'xmlns:xs': 'http://www.w3.org/2001/XMLSchema',
        elementFormDefault: 'qualified'
      });

    buildElement(schema, rootName, parsedXml[rootName]);
    return schema.end({ prettyPrint: true });
  } catch (error) {
    console.error('Failed to convert XML to XSD:', error);
    throw error;
  }
}

function buildElement(parent: any, name: string, node: any) {
  const element = parent.ele('xs:element', { name });

  if (typeof node === 'object' && node !== null && !Array.isArray(node)) {
    const complexType = element.ele('xs:complexType');
    const sequence = complexType.ele('xs:sequence');

    for (const childName of Object.keys(node)) {
      const child = node[childName];
      const occurrences = Array.isArray(child);
      const childNode = occurrences ? child[0] : child;

      const options: any = { name: childName };
      if (occurrences) {
        options.maxOccurs = 'unbounded';
      }
      sequence.ele('xs:element', { ...options, type: inferType(childNode) });
    }
  } else {
    element.att('type', inferType(node));
  }
}

function inferType(value: any): string {
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'xs:date';
    if (/^\d+$/.test(value)) return 'xs:integer';
    return 'xs:string';
  }
  if (typeof value === 'number') return Number.isInteger(value) ? 'xs:integer' : 'xs:decimal';
  if (typeof value === 'boolean') return 'xs:boolean';
  return 'xs:string';
}
