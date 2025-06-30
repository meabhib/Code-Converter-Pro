
import React, { useState } from 'react';
import { ConversionLayout } from '../ConversionLayout';
import { yamlToJson } from '@/utils/converters/yamlToJson';

export const YamlToJsonConverter: React.FC = () => {
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
      const result = await yamlToJson(input);
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConversionLayout
      title="YAML to JSON Converter"
      description="Convert YAML data to JSON format"
      inputLabel="YAML Input"
      outputLabel="JSON Output"
      inputPlaceholder="Paste your YAML here..."
      inputValue={input}
      outputValue={output}
      onInputChange={setInput}
      onConvert={handleConvert}
      isLoading={isLoading}
      error={error}
      inputLanguage="yaml"
      outputLanguage="json"
    />
  );
};
