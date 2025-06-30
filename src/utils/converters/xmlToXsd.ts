// XmlToXsd.ts
import * as fs from "fs";
import { XMLParser } from "fast-xml-parser";

type ElementInfo = {
  name: string;
  type: string;
  attributes?: Record<string, string>;
  children?: ElementInfo[];
  isArray?: boolean;
};

const inferXsdType = (value: any): string => {
  if (value === "true" || value === "false") return "xs:boolean";
  if (!isNaN(Date.parse(value))) return "xs:date";
  if (!isNaN(Number(value))) return Number.isInteger(Number(value)) ? "xs:integer" : "xs:decimal";
  return "xs:string";
};

const analyzeElement = (name: string, data: any): ElementInfo => {
  const element: ElementInfo = {
    name,
    type: "complex",
    attributes: {},
    children: [],
  };

  if (Array.isArray(data)) {
    element.isArray = true;
    data = data[0]; // Sample first for schema
  }

  if (typeof data === "object" && data !== null) {
    for (const key in data) {
      if (key.startsWith("@_")) {
        const attrName = key.replace("@_", "");
        element.attributes![attrName] = inferXsdType(data[key]);
      } else {
        const child = analyzeElement(key, data[key]);
        element.children!.push(child);
      }
    }
  } else {
    element.type = inferXsdType(data);
    delete element.children;
    delete element.attributes;
  }

  return element;
};

const elementToXsd = (element: ElementInfo, indent = "  "): string => {
  const occurs = element.isArray ? ` maxOccurs="unbounded"` : "";
  if (element.type !== "complex") {
    return `${indent}<xs:element name="${element.name}" type="${element.type}"${occurs} />`;
  }

  let result = `${indent}<xs:element name="${element.name}"${occurs}>\n`;
  result += `${indent}  <xs:complexType>\n`;

  if (element.children && element.children.length > 0) {
    result += `${indent}    <xs:sequence>\n`;
    for (const child of element.children) {
      result += elementToXsd(child, indent + "      ") + "\n";
    }
    result += `${indent}    </xs:sequence>\n`;
  }

  if (element.attributes && Object.keys(element.attributes).length > 0) {
    for (const attr in element.attributes) {
      result += `${indent}    <xs:attribute name="${attr}" type="${element.attributes[attr]}" />\n`;
    }
  }

  result += `${indent}  </xs:complexType>\n`;
  result += `${indent}</xs:element>`;
  return result;
};

const convertXmlToXsd = (inputXmlPath: string, outputXsdPath: string) => {
  const xmlData = fs.readFileSync(inputXmlPath, "utf-8");

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    allowBooleanAttributes: true,
    parseAttributeValue: true,
  });

  const jsonObj = parser.parse(xmlData);
  const rootName = Object.keys(jsonObj)[0];
  const rootData = jsonObj[rootName];

  const schemaRoot = analyzeElement(rootName, rootData);

  const xsdOutput =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">\n` +
    elementToXsd(schemaRoot, "  ") +
    `\n</xs:schema>`;

  fs.writeFileSync(outputXsdPath, xsdOutput, "utf-8");
  console.log(`✅ XSD generated: ${outputXsdPath}`);
};

// Example usage:
convertXmlToXsd("input.xml", "output.xsd");
