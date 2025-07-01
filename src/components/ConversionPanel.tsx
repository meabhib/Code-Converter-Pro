import React from 'react';
import { EnhancedXmlToXsdConverter } from './converters/EnhancedXmlToXsdConverter';
import { CsvToXmlConverter } from './converters/CsvToXmlConverter';
import { JsonToCsvConverter } from './converters/JsonToCsvConverter';
import { CsvToJsonConverter } from './converters/CsvToJsonConverter';
import { XmlToCsvConverter } from './converters/XmlToCsvConverter';
import { JsonToXmlConverter } from './converters/JsonToXmlConverter';
import { XmlToJsonConverter } from './converters/XmlToJsonConverter';
import { JsonToYamlConverter } from './converters/JsonToYamlConverter';
import { YamlToJsonConverter } from './converters/YamlToJsonConverter';
import { CsvToYamlConverter } from './converters/CsvToYamlConverter';
import { YamlToCsvConverter } from './converters/YamlToCsvConverter';
import { MarkdownToHtmlConverter } from './converters/MarkdownToHtmlConverter';
import { HtmlToMarkdownConverter } from './converters/HtmlToMarkdownConverter';
import { ComingSoonConverter } from './converters/ComingSoonConverter';
import { CodeEditor } from './components/CodeEditor';

interface ConversionPanelProps {
  activeConverter: string;
}

export const ConversionPanel: React.FC<ConversionPanelProps> = ({ activeConverter }) => {
  const renderConverter = () => {
    switch (activeConverter) {
      case 'xml-to-xsd':
        return <EnhancedXmlToXsdConverter />;
      case 'csv-to-xml':
        return <CsvToXmlConverter />;
      case 'json-to-csv':
        return <JsonToCsvConverter />;
      case 'csv-to-json':
        return <CsvToJsonConverter />;
      case 'xml-to-csv':
        return <XmlToCsvConverter />;
      case 'json-to-xml':
        return <JsonToXmlConverter />;
      case 'xml-to-json':
        return <XmlToJsonConverter />;
      case 'json-to-yaml':
        return <JsonToYamlConverter />;
      case 'yaml-to-json':
        return <YamlToJsonConverter />;
      case 'csv-to-yaml':
        return <CsvToYamlConverter />;
      case 'yaml-to-csv':
        return <YamlToCsvConverter />;
      case 'markdown-to-html':
        return <MarkdownToHtmlConverter />;
      case 'html-to-markdown':
        return <HtmlToMarkdownConverter />;
      default:
        return <ComingSoonConverter converterType={activeConverter} />;
    }
  };

  return (
    <div className="h-full">
      {renderConverter()}
    </div>
  );
};
