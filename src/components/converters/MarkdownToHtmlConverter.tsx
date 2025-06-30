
import React, { useState } from 'react';
import { ConversionLayout } from '../ConversionLayout';
import { markdownToHtml } from '@/utils/converters/markdownToHtml';

export const MarkdownToHtmlConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConvert = async () => {
    if (!input.trim()) {
      setError('Please provide Markdown input');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const result = await markdownToHtml(input);
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConversionLayout
      title="Markdown to HTML Converter"
      description="Convert Markdown to HTML format"
      inputLabel="Markdown Input"
      outputLabel="HTML Output"
      inputPlaceholder="Paste your Markdown here..."
      inputValue={input}
      outputValue={output}
      onInputChange={setInput}
      onConvert={handleConvert}
      isLoading={isLoading}
      error={error}
      inputLanguage="markdown"
      outputLanguage="html"
    />
  );
};
