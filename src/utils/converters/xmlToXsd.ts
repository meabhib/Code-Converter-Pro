import * as fs from "fs";
import { XMLParser } from "fast-xml-parser";

// Structure to hold element metadata
type ElementInfo = {
  name: string;
  isComplex: boolean;
  isArray: boolean;
  xsdType?: string;
  attributes: Map<string, string>;
  children: Map<string, ElementInfo>;
};

// Infer XSD simple type from value
const inferType = (val: string): string => {
  if (/^(true|false)$/i.test(val)) return "xs:boolean";
  if (!isNaN(Date.parse(val))) return "xs:date";
  if (!isNaN(Number(val))) {
    return /^\d+$/.test(val) ? "xs:integer" : "xs:decimal";
  }
  return "xs:string";
};

// Recursively build element map
const buildInfo = (name: string, data: any, map: Map<string, ElementInfo>) => {
  let info: ElementInfo;
  const key = name;

  if (map.has(key)) {
    info = map.get(key)!;
  } else {
    info = {
      name,
      isComplex: false,
      isArray: false,
      attributes: new Map(),
      children: new Map(),
    };
    map.set(key, info);
  }

  if (Array.isArray(data)) {
    info.isArray = true;
    data = data[0];
  }

  if (data && typeof data === "object") {
    info.isComplex = true;
    Object.entries(data).forEach(([k, v]) => {
      if (k.startsWith("@_")) {
        info.attributes.set(k.slice(2), inferType(String(v)));
      } else {
        buildInfo(k, v, info.children as any);
      }
    });
  } else {
    info.xsdType = inferType(String(data));
  }
};

// Generate complex types with recursion
const writeElement = (info: ElementInfo, indent: string = "  "): string => {
  const occurs = info.isArray ? ` maxOccurs="unbounded"` : "";
  const typeAttr = info.isComplex ? "" : ` type="${info.xsdType}"`;
  
  let result = `${indent}<xs:element name="${info.name}"${typeAttr}${occurs}`;
  if (!info.isComplex) {
    result += ` />\n`;
    return result;
  }
  result += `>\n${indent}  <xs:complexType>\n`;

  if (info.children.size > 0) {
    result += `${indent}    <xs:sequence>\n`;
    info.children.forEach(child => {
      result += writeElement(child, indent + "      ");
    });
    result += `${indent}    </xs:sequence>\n`;
  }

  info.attributes.forEach((type, attr) => {
    result += `${indent}    <xs:attribute name="${attr}" type="${type}" />\n`;
  });

  result += `${indent}  </xs:complexType>\n${indent}</xs:element>\n`;
  return result;
};

// Main conversion function
export const convertXmlToXsd = (xml: string): string => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    parseAttributeValue: false, // keep text raw for inference
  });
  
  const json = parser.parse(xml);
  const rootName = Object.keys(json)[0];
  const map = new Map<string, ElementInfo>();
  buildInfo(rootName, json[rootName], map);

  const rootInfo = map.get(rootName)!;

  let xsd = `<?xml version="1.0" encoding="UTF-8"?>\n<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">\n`;
  xsd += writeElement(rootInfo, "  ");
  xsd += `</xs:schema>`;
  return xsd;
};

// Example CLI usage
if (require.main === module) {
  const xmlInput = fs.readFileSync(process.argv[2], "utf-8");
  const xsdOutput = convertXmlToXsd(xmlInput);
  fs.writeFileSync(process.argv[3], xsdOutput);
  console.log("✅ XSD generated to", process.argv[3]);
}
