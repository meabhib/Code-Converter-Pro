
import React from 'react';
import { Construction, Sparkles, Zap, Code, FileText, Rocket } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ComingSoonConverterProps {
  converterType: string;
}

const getConverterInfo = (type: string) => {
  const converterMap: Record<string, { 
    title: string; 
    description: string; 
    features: string[];
    icon: React.ElementType;
    color: string;
  }> = {
    'excel-to-csv': {
      title: 'Excel to CSV Converter',
      description: 'Convert Excel spreadsheets to CSV format with support for multiple sheets and advanced formatting preservation.',
      features: ['Multi-sheet support', 'Formula evaluation', 'Formatting preservation', 'Data validation'],
      icon: FileText,
      color: 'from-green-500 to-emerald-600'
    },
    'json-to-yaml': {
      title: 'JSON to YAML Converter',
      description: 'Transform JSON data into human-readable YAML format with proper indentation and syntax highlighting.',
      features: ['Syntax highlighting', 'Format validation', 'Comment preservation', 'Structure optimization'],
      icon: Code,
      color: 'from-blue-500 to-cyan-600'
    },
    'json-to-typescript': {
      title: 'JSON to TypeScript Converter',
      description: 'Generate TypeScript interfaces and types from JSON data with intelligent type inference.',
      features: ['Type inference', 'Interface generation', 'Optional properties', 'Nested objects support'],
      icon: Sparkles,
      color: 'from-purple-500 to-pink-600'
    },
    'markdown-to-html': {
      title: 'Markdown to HTML Converter',
      description: 'Convert Markdown documents to HTML with support for tables, code blocks, and extensions.',
      features: ['GFM support', 'Syntax highlighting', 'Table conversion', 'Custom styling'],
      icon: FileText,
      color: 'from-orange-500 to-red-600'
    }
  };

  return converterMap[type] || {
    title: 'Advanced Converter',
    description: 'A powerful conversion tool with enterprise-grade features and performance optimization.',
    features: ['High performance', 'Advanced validation', 'Batch processing', 'API integration'],
    icon: Zap,
    color: 'from-indigo-500 to-purple-600'
  };
};

export const ComingSoonConverter: React.FC<ComingSoonConverterProps> = ({ converterType }) => {
  const converterInfo = getConverterInfo(converterType);
  const Icon = converterInfo.icon;

  return (
    <div className="flex items-center justify-center min-h-[600px] p-8">
      <Card className="max-w-2xl w-full tech-card hover-lift">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className={`bg-gradient-to-r ${converterInfo.color} p-4 rounded-2xl shadow-lg`}>
              <Icon className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gradient mb-2">
            {converterInfo.title}
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {converterInfo.description}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Badge 
              variant="secondary" 
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 text-sm font-medium"
            >
              <Construction className="h-4 w-4 mr-2" />
              Coming Soon
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {converterInfo.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Button 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              disabled
            >
              <Rocket className="h-4 w-4 mr-2" />
              Notify Me When Available
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Be the first to know when this converter is ready!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
