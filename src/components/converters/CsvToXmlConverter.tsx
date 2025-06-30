
import React, { useState } from 'react';
import { ConversionLayout } from '../ConversionLayout';
import { csvToXml } from '@/utils/converters/csvToXml';

export const CsvToXmlConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConvert = async () => {
    if (!input.trim()) {
      setError('Please provide CSV input');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const result = await csvToXml(input);
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConversionLayout
      title="CSV to XML Converter"
      description="Convert CSV data to XML format"
      inputLabel="CSV Input"
      outputLabel="XML Output"
      inputPlaceholder="Paste your CSV here..."
      inputValue={input}
      outputValue={output}
      onInputChange={setInput}
      onConvert={handleConvert}
      isLoading={isLoading}
      error={error}
      inputLanguage="csv"
      outputLanguage="xml"
    />
  );
};
