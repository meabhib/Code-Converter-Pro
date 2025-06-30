
import React, { useState } from 'react';
import { ConversionLayout } from '../ConversionLayout';
import { htmlToMarkdown } from '@/utils/converters/htmlToMarkdown';

export const HtmlToMarkdownConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConvert = async () => {
    if (!input.trim()) {
      setError('Please provide HTML input');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const result = await htmlToMarkdown(input);
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConversionLayout
      title="HTML to Markdown Converter"
      description="Convert HTML to Markdown format"
      inputLabel="HTML Input"
      outputLabel="Markdown Output"
      inputPlaceholder="Paste your HTML here..."
      inputValue={input}
      outputValue={output}
      onInputChange={setInput}
      onConvert={handleConvert}
      isLoading={isLoading}
      error={error}
      inputLanguage="html"
      outputLanguage="markdown"
    />
  );
};
