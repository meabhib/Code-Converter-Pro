
import React, { useState } from 'react';
import { ConversionLayout } from '../ConversionLayout';
import { yamlToCsv } from '@/utils/converters/yamlToCsv';

export const YamlToCsvConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConvert = async () => {
    if (!input.trim()) {
      setError('Please provide YAML input');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const result = await yamlToCsv(input);
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConversionLayout
      title="YAML to CSV Converter"
      description="Convert YAML data to CSV format"
      inputLabel="YAML Input"
      outputLabel="CSV Output"
      inputPlaceholder="Paste your YAML here..."
      inputValue={input}
      outputValue={output}
      onInputChange={setInput}
      onConvert={handleConvert}
      isLoading={isLoading}
      error={error}
      inputLanguage="yaml"
      outputLanguage="csv"
    />
  );
};
