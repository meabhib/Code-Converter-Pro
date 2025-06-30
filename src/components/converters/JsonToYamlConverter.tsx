
import React, { useState } from 'react';
import { ConversionLayout } from '../ConversionLayout';
import { jsonToYaml } from '@/utils/converters/jsonToYaml';

export const JsonToYamlConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConvert = async () => {
    if (!input.trim()) {
      setError('Please provide JSON input');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const result = await jsonToYaml(input);
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConversionLayout
      title="JSON to YAML Converter"
      description="Convert JSON data to YAML format"
      inputLabel="JSON Input"
      outputLabel="YAML Output"
      inputPlaceholder="Paste your JSON here..."
      inputValue={input}
      outputValue={output}
      onInputChange={setInput}
      onConvert={handleConvert}
      isLoading={isLoading}
      error={error}
      inputLanguage="json"
      outputLanguage="yaml"
    />
  );
};
