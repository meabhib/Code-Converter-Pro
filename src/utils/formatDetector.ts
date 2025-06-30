
export const detectFormat = (input: string): string => {
  const trimmed = input.trim();
  
  if (!trimmed) return 'unknown';
  
  // JSON detection
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || 
      (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch {
      // Continue to other checks
    }
  }
  
  // XML detection
  if (trimmed.startsWith('<') && trimmed.includes('>')) {
    if (trimmed.includes('<?xml') || 
        (trimmed.match(/<[^>]+>/g) && trimmed.includes('</'))) {
      return 'xml';
    }
  }
  
  // HTML detection
  if (trimmed.includes('<!DOCTYPE html') || 
      trimmed.includes('<html') || 
      trimmed.includes('<head>') || 
      trimmed.includes('<body>')) {
    return 'html';
  }
  
  // CSV detection
  const lines = trimmed.split('\n');
  if (lines.length >= 2) {
    const firstLine = lines[0];
    const secondLine = lines[1];
    
    // Check if it looks like CSV (commas, consistent structure)
    if (firstLine.includes(',') && secondLine.includes(',')) {
      const firstCommas = (firstLine.match(/,/g) || []).length;
      const secondCommas = (secondLine.match(/,/g) || []).length;
      
      if (firstCommas === secondCommas && firstCommas > 0) {
        return 'csv';
      }
    }
  }
  
  // YAML detection
  if (trimmed.includes(':') && 
      (trimmed.includes('\n- ') || trimmed.match(/^\s*[\w-]+:\s/m))) {
    // Simple heuristic for YAML
    const colonLines = trimmed.split('\n').filter(line => 
      line.trim().includes(':') && !line.trim().startsWith('#')
    ).length;
    
    if (colonLines > 0) {
      return 'yaml';
    }
  }
  
  // Markdown detection
  if (trimmed.includes('# ') || 
      trimmed.includes('## ') || 
      trimmed.includes('**') || 
      trimmed.includes('*') || 
      trimmed.includes('[') && trimmed.includes('](')) {
    return 'markdown';
  }
  
  // XSD detection (XML Schema)
  if (trimmed.includes('<xs:schema') || 
      trimmed.includes('<xsd:schema') ||
      trimmed.includes('xmlns:xs=') ||
      trimmed.includes('xmlns:xsd=')) {
    return 'xsd';
  }
  
  return 'unknown';
};
