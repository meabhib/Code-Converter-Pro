
import React, { useState } from 'react';
import { EnhancedConversionLayout } from '../EnhancedConversionLayout';
import { xmlToXsd } from '@/utils/converters/xmlToXsd';

export const EnhancedXmlToXsdConverter: React.FC = () => {
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
      const result = await xmlToXsd(input);
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setIsLoading(false);
    }
  };

  const converter = async (inputValue: string) => {
    return await xmlToXsd(inputValue);
  };

  return (
    <EnhancedConversionLayout
      title="XML to XSD Converter"
      description="Convert XML documents to XSD (XML Schema Definition) with live preview and smart validation"
      inputLabel="XML Input"
      outputLabel="XSD Output"
      inputPlaceholder="Paste your XML here..."
      inputValue={input}
      outputValue={output}
      onInputChange={setInput}
      onConvert={handleConvert}
      isLoading={isLoading}
      error={error}
      inputLanguage="xml"
      outputLanguage="xml"
      converter={converter}
    />
  );
};
