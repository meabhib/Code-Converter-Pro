
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const validateXmlAgainstXsd = async (xml: string, xsd: string): Promise<ValidationResult> => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    const xsdDoc = parser.parseFromString(xsd, 'text/xml');
    
    // Check for parsing errors
    const xmlErrors = xmlDoc.getElementsByTagName('parsererror');
    const xsdErrors = xsdDoc.getElementsByTagName('parsererror');
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (xmlErrors.length > 0) {
      errors.push('Invalid XML format');
    }
    
    if (xsdErrors.length > 0) {
      errors.push('Invalid XSD format');
    }
    
    // Basic validation (in a real implementation, you'd use a proper XML Schema validator)
    if (errors.length === 0) {
      // Simple structural validation
      const rootElement = xmlDoc.documentElement;
      if (!rootElement) {
        errors.push('XML document has no root element');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [error instanceof Error ? error.message : 'Validation failed'],
      warnings: []
    };
  }
};

export const validateJson = (json: string): ValidationResult => {
  try {
    JSON.parse(json);
    return {
      isValid: true,
      errors: [],
      warnings: []
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [error instanceof Error ? error.message : 'Invalid JSON format'],
      warnings: []
    };
  }
};

export const validateCsv = (csv: string): ValidationResult => {
  const lines = csv.trim().split('\n');
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (lines.length < 2) {
    errors.push('CSV must have at least a header row and one data row');
  }
  
  if (lines.length > 1) {
    const headerColumns = lines[0].split(',').length;
    const inconsistentRows = lines.slice(1).filter(line => 
      line.split(',').length !== headerColumns
    );
    
    if (inconsistentRows.length > 0) {
      warnings.push(`${inconsistentRows.length} rows have inconsistent column count`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};
