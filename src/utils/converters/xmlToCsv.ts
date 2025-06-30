
export const xmlToCsv = async (xmlInput: string): Promise<string> => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlInput, 'text/xml');
    
    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
      throw new Error('Invalid XML format');
    }

    const rootElement = xmlDoc.documentElement;
    const records: Record<string, string>[] = [];
    
    // Find repeating elements (records)
    const childElements = Array.from(rootElement.children);
    
    if (childElements.length === 0) {
      throw new Error('XML must contain child elements to convert to CSV');
    }

    // Extract data from each record
    childElements.forEach(element => {
      const record: Record<string, string> = {};
      extractElementData(element, record);
      records.push(record);
    });

    if (records.length === 0) {
      return '';
    }

    // Get all unique headers
    const allHeaders = new Set<string>();
    records.forEach(record => {
      Object.keys(record).forEach(key => allHeaders.add(key));
    });

    const headers = Array.from(allHeaders).sort();
    
    // Create CSV content
    let csv = headers.map(header => escapeCsvField(header)).join(',') + '\n';
    
    records.forEach(record => {
      const row = headers.map(header => escapeCsvField(record[header] || ''));
      csv += row.join(',') + '\n';
    });

    return csv.trim();
  } catch (error) {
    throw new Error(`XML to CSV conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const extractElementData = (element: Element, record: Record<string, string>, prefix = ''): void => {
  const currentPrefix = prefix ? `${prefix}_` : '';
  
  // Add attributes
  Array.from(element.attributes).forEach(attr => {
    record[`${currentPrefix}${element.tagName}_${attr.name}`] = attr.value;
  });
  
  if (element.children.length === 0) {
    // Leaf element - add text content
    record[`${currentPrefix}${element.tagName}`] = element.textContent || '';
  } else {
    // Has child elements
    Array.from(element.children).forEach(child => {
      extractElementData(child, record, `${currentPrefix}${element.tagName}`);
    });
  }
};

const escapeCsvField = (field: string): string => {
  if (field.includes(',') || field.includes('"') || field.includes('\n') || field.includes('\r')) {
    return '"' + field.replace(/"/g, '""') + '"';
  }
  return field;
};
