
import React, { useState } from 'react';
import { ConversionLayout } from '../ConversionLayout';
import { xmlToJson } from '@/utils/converters/xmlToJson';

export const XmlToJsonConverter: React.FC = () => {
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
      const result = await xmlToJson(input);
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConversionLayout
      title="XML to JSON Converter"
      description="Convert XML data to JSON format"
      inputLabel="XML Input"
      outputLabel="JSON Output"
      inputPlaceholder="Paste your XML here..."
      inputValue={input}
      outputValue={output}
      onInputChange={setInput}
      onConvert={handleConvert}
      isLoading={isLoading}
      error={error}
      inputLanguage="xml"
      outputLanguage="json"
    />
  );
};
