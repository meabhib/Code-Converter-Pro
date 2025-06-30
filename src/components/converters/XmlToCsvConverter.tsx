
import React, { useState } from 'react';
import { ConversionLayout } from '../ConversionLayout';
import { xmlToCsv } from '@/utils/converters/xmlToCsv';

export const XmlToCsvConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConvert = async () => {
    if (!input.trim()) {
      setError('Please provide XML input');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const result = await xmlToCsv(input);
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConversionLayout
      title="XML to CSV Converter"
      description="Convert XML data to CSV format"
      inputLabel="XML Input"
      outputLabel="CSV Output"
      inputPlaceholder="Paste your XML here..."
      inputValue={input}
      outputValue={output}
      onInputChange={setInput}
      onConvert={handleConvert}
      isLoading={isLoading}
      error={error}
      inputLanguage="xml"
      outputLanguage="csv"
    />
  );
};
