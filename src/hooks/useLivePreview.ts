
import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash-es';

interface UseLivePreviewProps {
  input: string;
  converter: (input: string) => Promise<string>;
  enabled: boolean;
  delay?: number;
}

export const useLivePreview = ({
  input,
  converter,
  enabled,
  delay = 1000
}: UseLivePreviewProps) => {
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const debouncedConvert = useCallback(
    debounce(async (inputValue: string) => {
      if (!inputValue.trim() || !enabled) {
        setOutput('');
        return;
      }

      setIsProcessing(true);
      setError('');

      try {
        const result = await converter(inputValue);
        setOutput(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Conversion failed');
        setOutput('');
      } finally {
        setIsProcessing(false);
      }
    }, delay),
    [converter, enabled, delay]
  );

  useEffect(() => {
    debouncedConvert(input);
    return () => {
      debouncedConvert.cancel();
    };
  }, [input, debouncedConvert]);

  return { output, isProcessing, error };
};
