import fs from 'fs';
import { XMLParser } from 'fast-xml-parser';
import { create } from 'xmlbuilder2';

type ElementType = {
  name: string;
  type: string;
  children?: Map<string, ElementType>;
  attributes?: Map<string, string>;
  isArray?: boolean;
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  allowBooleanAttributes: true,
  parseAttributeValue: true,
  parseTagValue: false,
});

const getXsdType = (value: any): string => {
  if (typeof value === 'boolean') return 'xs:boolean';
  if (!isNaN(Date.parse(value))) return 'xs:date';
  if (!isNaN(Number(value))) return Number.isInteger(Number(value)) ? 'xs:integer' : 'xs:decimal';
  return 'xs:string';
};

const buildElementModel = (
  node: any,
  name: string,
  model: Map<string, ElementType>,
  path: string = ''
) => {
  const key = path + name;

  const isArray = Array.isArray(node);
  const nodeValue = isArray ? node[0] : node;

  let element: ElementType = model.get(key) || {
    name,
    type: name + 'Type',
    children: new Map(),
    attributes: new Map(),
    isArray,
  };

  // Attributes
  if (nodeValue && typeof nodeValue === 'object') {
    Object.entries(nodeValue).forEach(([k, v]) => {
      if (k.startsWith('@_')) {
        const attrName = k.slice(2);
        element.attributes?.set(attrName, getXsdType(v));
      }
    });

    // Children
    Object.entries(nodeValue).forEach(([k, v]) => {
      if (!k.startsWith('@_')) {
        buildElementModel(v, k, element.children!, path + name + '/');
      }
    });
  }

  model.set(key, element);
};

const buildXsd = (model: Map<string, ElementType>, rootName: string) => {
  const doc = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('xs:schema', { xmlns: 'http://example.org/schema', 'xmlns:xs': 'http://www.w3.org/2001/XMLSchema' });

  doc.ele('xs:element', { name: rootName, type: `${rootName}Type` }).up();

  const writeComplexType = (element: ElementType, model: Map<string, ElementType>) => {
    const complex = doc.ele('xs:complexType', { name: element.type });

    if (element.children && element.children.size > 0) {
      const seq = complex.ele('xs:sequence');

      for (const child of element.children.values()) {
        seq.ele('xs:element', {
          name: child.name,
          type: child.children!.size > 0 || child.attributes!.size > 0 ? `${child.name}Type` : getXsdType(''),
          minOccurs: child.isArray ? 0 : 1,
          maxOccurs: child.isArray ? 'unbounded' : 1,
        }).up();

        // Recursive call for complex children
        if (child.children!.size > 0 || child.attributes!.size > 0) {
          writeComplexType(child, model);
        }
      }

      seq.up();
    }

    // Attributes
    if (element.attributes) {
      for (const [attrName, attrType] of element.attributes) {
        complex.ele('xs:attribute', { name: attrName, type: attrType }).up();
      }
    }

    complex.up();
  };

  const topElement = model.get(rootName)!;
  writeComplexType(topElement, model);

  return doc.end({ prettyPrint: true });
};

const generateXSD = (xmlPath: string, xsdPath: string) => {
  const xmlContent = fs.readFileSync(xmlPath, 'utf-8');
  const json = parser.parse(xmlContent);
  const rootName = Object.keys(json)[0];
  const root = json[rootName];

  const model: Map<string, ElementType> = new Map();
  buildElementModel(root, rootName, model);

  const xsd = buildXsd(model, rootName);
  fs.writeFileSync(xsdPath, xsd);
  console.log(`✅ XSD generated at: ${xsdPath}`);
};

// Example usage:
generateXSD('input.xml', 'output.xsd');
