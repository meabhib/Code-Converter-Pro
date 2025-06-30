interface ElementInfo {
  name: string;
  type: string;
  minOccurs: number;
  maxOccurs: string;
  isAttribute: boolean;
  children: Map<string, ElementInfo>;
  attributes: Map<string, string>;
  hasTextContent: boolean;
  isMixed: boolean;
}

interface XsdGenerationOptions {
  generateDocumentation?: boolean;
  useOptionalElements?: boolean;
  inferDataTypes?: boolean;
  preserveOrder?: boolean;
  elementFormDefault?: 'qualified' | 'unqualified';
  attributeFormDefault?: 'qualified' | 'unqualified';
}

export class XmlToXsdConverter {
  private processedTypes = new Set<string>();
  private elementRegistry = new Map<string, ElementInfo>();
  private namespaces = new Map<string, string>();
  private options: Required<XsdGenerationOptions>;

  constructor(options: XsdGenerationOptions = {}) {
    this.options = {
      generateDocumentation: options.generateDocumentation ?? false,
      useOptionalElements: options.useOptionalElements ?? true,
      inferDataTypes: options.inferDataTypes ?? true,
      preserveOrder: options.preserveOrder ?? true,
      elementFormDefault: options.elementFormDefault ?? 'qualified',
      attributeFormDefault: options.attributeFormDefault ?? 'unqualified'
    };
  }

  public async convert(xmlInput: string): Promise<string> {
    try {
      // Reset state for new conversion
      this.reset();
      
      // Parse and validate XML
      const xmlDoc = this.parseXml(xmlInput);
      const rootElement = xmlDoc.documentElement;
      
      // Extract namespaces
      this.extractNamespaces(rootElement);
      
      // Analyze XML structure
      const rootElementInfo = this.analyzeElement(rootElement);
      
      // Generate XSD
      return this.generateXsd(rootElementInfo);
      
    } catch (error) {
      throw new Error(`XSD generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private reset(): void {
    this.processedTypes.clear();
    this.elementRegistry.clear();
    this.namespaces.clear();
  }

  private parseXml(xmlInput: string): Document {
    if (!xmlInput || typeof xmlInput !== 'string') {
      throw new Error('Invalid XML input: must be a non-empty string');
    }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlInput.trim(), 'text/xml');
    
    // Check for parser errors
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      throw new Error(`XML parsing error: ${parseError.textContent}`);
    }
    
    if (!xmlDoc.documentElement) {
      throw new Error('Invalid XML: no root element found');
    }
    
    return xmlDoc;
  }

  private extractNamespaces(element: Element): void {
    // Extract namespace declarations from the root element
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      if (attr.name === 'xmlns') {
        this.namespaces.set('', attr.value);
      } else if (attr.name.startsWith('xmlns:')) {
        const prefix = attr.name.substring(6);
        this.namespaces.set(prefix, attr.value);
      }
    }
    
    // Set default namespace if element has one
    if (element.namespaceURI && !this.namespaces.has('')) {
      this.namespaces.set('', element.namespaceURI);
    }
  }

  private analyzeElement(element: Element, parentPath = ''): ElementInfo {
    const elementName = this.getLocalName(element);
    const currentPath = parentPath ? `${parentPath}.${elementName}` : elementName;
    
    const elementInfo: ElementInfo = {
      name: elementName,
      type: '',
      minOccurs: 1,
      maxOccurs: '1',
      isAttribute: false,
      children: new Map(),
      attributes: new Map(),
      hasTextContent: false,
      isMixed: false
    };

    // Analyze attributes
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      // Skip namespace declarations
      if (!attr.name.startsWith('xmlns')) {
        const attrName = this.getLocalName(attr);
        const attrType = this.inferDataType(attr.value);
        elementInfo.attributes.set(attrName, attrType);
      }
    }

    // Analyze child elements and text content
    const childElements = new Map<string, ElementInfo[]>();
    let hasTextContent = false;
    let hasElementChildren = false;

    for (let i = 0; i < element.childNodes.length; i++) {
      const child = element.childNodes[i];
      
      if (child.nodeType === Node.ELEMENT_NODE) {
        hasElementChildren = true;
        const childElement = child as Element;
        const childInfo = this.analyzeElement(childElement, currentPath);
        
        const childName = childInfo.name;
        if (!childElements.has(childName)) {
          childElements.set(childName, []);
        }
        childElements.get(childName)!.push(childInfo);
        
      } else if (child.nodeType === Node.TEXT_NODE) {
        const textContent = child.textContent?.trim();
        if (textContent) {
          hasTextContent = true;
        }
      }
    }

    // Determine occurrence constraints and merge child information
    childElements.forEach((children, childName) => {
      const mergedChild = this.mergeChildElements(children);
      mergedChild.minOccurs = this.options.useOptionalElements ? 0 : 1;
      mergedChild.maxOccurs = children.length > 1 ? 'unbounded' : '1';
      elementInfo.children.set(childName, mergedChild);
    });

    // Determine if element has mixed content
    elementInfo.hasTextContent = hasTextContent;
    elementInfo.isMixed = hasTextContent && hasElementChildren;

    // Determine element type
    if (elementInfo.children.size === 0 && elementInfo.attributes.size === 0) {
      // Simple element with text content only
      elementInfo.type = hasTextContent ? 
        this.inferDataType(element.textContent || '') : 'xs:string';
    } else {
      // Complex element
      elementInfo.type = `${elementName}Type`;
    }

    return elementInfo;
  }

  private mergeChildElements(children: ElementInfo[]): ElementInfo {
    if (children.length === 1) {
      return children[0];
    }

    // Merge multiple occurrences of the same element
    const merged = { ...children[0] };
    
    for (let i = 1; i < children.length; i++) {
      const child = children[i];
      
      // Merge attributes (union of all attributes)
      child.attributes.forEach((type, name) => {
        if (!merged.attributes.has(name)) {
          merged.attributes.set(name, type);
        } else if (merged.attributes.get(name) !== type) {
          // If types differ, use string as fallback
          merged.attributes.set(name, 'xs:string');
        }
      });
      
      // Merge children (union of all children)
      child.children.forEach((childInfo, name) => {
        if (!merged.children.has(name)) {
          merged.children.set(name, childInfo);
        }
      });
      
      // Update mixed content and text content flags
      merged.hasTextContent = merged.hasTextContent || child.hasTextContent;
      merged.isMixed = merged.isMixed || child.isMixed;
    }
    
    return merged;
  }

  private getLocalName(node: Node | Attr): string {
    return node.localName || node.nodeName;
  }

  private inferDataType(value: string): string {
    if (!this.options.inferDataTypes || !value.trim()) {
      return 'xs:string';
    }

    const trimmed = value.trim();
    
    // Boolean
    if (/^(true|false)$/i.test(trimmed)) {
      return 'xs:boolean';
    }
    
    // Integer
    if (/^[+-]?\d+$/.test(trimmed)) {
      const num = parseInt(trimmed, 10);
      if (num >= -2147483648 && num <= 2147483647) {
        return 'xs:int';
      }
      return 'xs:long';
    }
    
    // Decimal/Float
    if (/^[+-]?\d*\.\d+$/.test(trimmed) || /^[+-]?\d+\.\d*$/.test(trimmed)) {
      return 'xs:decimal';
    }
    
    // Scientific notation
    if (/^[+-]?\d*\.?\d+[eE][+-]?\d+$/.test(trimmed)) {
      return 'xs:double';
    }
    
    // Date (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return 'xs:date';
    }
    
    // DateTime (ISO 8601)
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(trimmed)) {
      return 'xs:dateTime';
    }
    
    // Time (HH:MM:SS)
    if (/^\d{2}:\d{2}:\d{2}/.test(trimmed)) {
      return 'xs:time';
    }
    
    // Base64 encoded data (rough heuristic)
    if (/^[A-Za-z0-9+/]*={0,2}$/.test(trimmed) && trimmed.length % 4 === 0 && trimmed.length > 20) {
      return 'xs:base64Binary';
    }
    
    return 'xs:string';
  }

  private generateXsd(rootElement: ElementInfo): string {
    let xsd = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xsd += '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"';
    
    // Add target namespace if present
    const targetNamespace = this.namespaces.get('');
    if (targetNamespace) {
      xsd += `\n           targetNamespace="${this.escapeXml(targetNamespace)}"`;
      xsd += `\n           xmlns:tns="${this.escapeXml(targetNamespace)}"`;
    }
    
    // Add form defaults
    xsd += `\n           elementFormDefault="${this.options.elementFormDefault}"`;
    xsd += `\n           attributeFormDefault="${this.options.attributeFormDefault}"`;
    
    xsd += '>\n\n';
    
    // Add documentation if enabled
    if (this.options.generateDocumentation) {
      xsd += '  <xs:annotation>\n';
      xsd += '    <xs:documentation>Generated XSD schema from XML document</xs:documentation>\n';
      xsd += '  </xs:annotation>\n\n';
    }
    
    // Add root element declaration
    const rootTypeRef = this.isComplexType(rootElement) ? 
      (targetNamespace ? `tns:${rootElement.type}` : rootElement.type) : 
      rootElement.type;
    
    xsd += `  <xs:element name="${this.escapeXml(rootElement.name)}" type="${rootTypeRef}"/>\n\n`;
    
    // Generate complex types
    xsd += this.generateComplexTypes(rootElement, targetNamespace ? 'tns:' : '');
    
    xsd += '</xs:schema>';
    
    return this.formatXsd(xsd);
  }

  private generateComplexTypes(element: ElementInfo, prefix: string): string {
    let xsd = '';
    
    if (this.isComplexType(element) && !this.processedTypes.has(element.type)) {
      this.processedTypes.add(element.type);
      xsd += this.generateComplexType(element, prefix);
    }
    
    // Recursively generate types for children
    element.children.forEach(child => {
      xsd += this.generateComplexTypes(child, prefix);
    });
    
    return xsd;
  }

  private generateComplexType(element: ElementInfo, prefix: string): string {
    let xsd = `  <xs:complexType name="${this.escapeXml(element.type)}"`;
    
    if (element.isMixed) {
      xsd += ' mixed="true"';
    }
    
    xsd += '>\n';
    
    // Generate sequence for child elements
    if (element.children.size > 0) {
      if (this.options.preserveOrder) {
        xsd += '    <xs:sequence>\n';
      } else {
        xsd += '    <xs:all>\n';
      }
      
      element.children.forEach(child => {
        const childTypeRef = this.isComplexType(child) ? 
          `${prefix}${child.type}` : child.type;
        
        xsd += `      <xs:element name="${this.escapeXml(child.name)}" type="${childTypeRef}"`;
        
        if (child.minOccurs !== 1) {
          xsd += ` minOccurs="${child.minOccurs}"`;
        }
        
        if (child.maxOccurs !== '1') {
          xsd += ` maxOccurs="${child.maxOccurs}"`;
        }
        
        xsd += '/>\n';
      });
      
      if (this.options.preserveOrder) {
        xsd += '    </xs:sequence>\n';
      } else {
        xsd += '    </xs:all>\n';
      }
    }
    
    // Generate attributes
    element.attributes.forEach((type, name) => {
      xsd += `    <xs:attribute name="${this.escapeXml(name)}" type="${type}"`;
      
      if (this.options.useOptionalElements) {
        xsd += ' use="optional"';
      }
      
      xsd += '/>\n';
    });
    
    xsd += '  </xs:complexType>\n\n';
    
    return xsd;
  }

  private isComplexType(element: ElementInfo): boolean {
    return element.children.size > 0 || element.attributes.size > 0 || element.isMixed;
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private formatXsd(xsd: string): string {
    const lines = xsd.split('\n');
    let formatted = '';
    let indent = 0;
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      
      // Decrease indent for closing tags
      if (trimmed.startsWith('</')) {
        indent = Math.max(0, indent - 2);
      }
      
      formatted += ' '.repeat(indent) + trimmed + '\n';
      
      // Increase indent for opening tags (but not self-closing or XML declaration)
      if (trimmed.startsWith('<') && 
          !trimmed.startsWith('</') && 
          !trimmed.endsWith('/>') && 
          !trimmed.startsWith('<?xml') &&
          !trimmed.startsWith('<!')) {
        indent += 2;
      }
    }
    
    return formatted;
  }
}

// Convenience function for backward compatibility
export const xmlToXsd = async (xmlInput: string, options?: XsdGenerationOptions): Promise<string> => {
  const converter = new XmlToXsdConverter(options);
  return converter.convert(xmlInput);
};

// Export additional types for advanced usage
export type { XsdGenerationOptions, ElementInfo };