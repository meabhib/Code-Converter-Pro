
import React, { useState } from 'react';
import { ConversionLayout } from '../ConversionLayout';
import { csvToJson } from '@/utils/converters/csvToJson';

export const CsvToJsonConverter: React.FC = () => {
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
      const result = await csvToJson(input);
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConversionLayout
      title="CSV to JSON Converter"
      description="Convert CSV data to JSON format"
      inputLabel="CSV Input"
      outputLabel="JSON Output"
      inputPlaceholder="Paste your CSV here..."
      inputValue={input}
      outputValue={output}
      onInputChange={setInput}
      onConvert={handleConvert}
      isLoading={isLoading}
      error={error}
      inputLanguage="csv"
      outputLanguage="json"
    />
  );
};
