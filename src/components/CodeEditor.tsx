
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  placeholder?: string;
  height?: string;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  placeholder,
  height = '300px',
  readOnly = false,
}) => {
  const getLanguageClass = () => {
    switch (language) {
      case 'json':
        return 'language-json';
      case 'xml':
        return 'language-xml';
      case 'csv':
        return 'language-csv';
      case 'yaml':
        return 'language-yaml';
      case 'html':
        return 'language-html';
      case 'markdown':
        return 'language-markdown';
      default:
        return 'language-text';
    }
  };

  // Responsive height calculation
  const getResponsiveHeight = () => {
    if (typeof window !== 'undefined') {
      const screenHeight = window.innerHeight;
      const isMobile = window.innerWidth < 768;
      
      if (isMobile) {
        return Math.min(300, screenHeight * 0.3) + 'px';
      }
      
      return height;
    }
    return height;
  };

  return (
    <div className="relative code-container">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`
          font-mono text-xs sm:text-sm resize-none w-full
          ${getLanguageClass()}
          bg-transparent border-0 focus:ring-0 focus:border-0
          p-3 sm:p-4
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          ${readOnly ? 'cursor-default' : 'cursor-text'}
        `}
        style={{ 
          minHeight: getResponsiveHeight(),
          maxHeight: typeof window !== 'undefined' && window.innerWidth < 768 ? '400px' : '600px'
        }}
      />
      {language && (
        <div className="code-badge">
          {language.toUpperCase()}
        </div>
      )}
    </div>
  );
};
