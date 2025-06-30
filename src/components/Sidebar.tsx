
import React, { useState } from 'react';
import { 
  FileCode, FileText, Database, Code2, Sparkles, 
  FileJson, FileSpreadsheet, Globe, Settings, 
  FileX, Braces, Hash, ChevronDown, ChevronRight,
  Table, Workflow, GitBranch, Terminal, Box
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeConverter: string;
  onConverterChange: (converter: string) => void;
}

const converterCategories = [
  {
    id: 'core',
    label: 'Core Conversions',
    icon: Sparkles,
    converters: [
      { id: 'xml-to-xsd', label: 'XML to XSD', icon: FileCode, color: 'text-blue-600' },
      { id: 'csv-to-xml', label: 'CSV to XML', icon: Database, color: 'text-green-600' },
      { id: 'json-to-csv', label: 'JSON to CSV', icon: FileText, color: 'text-orange-600' },
      { id: 'csv-to-json', label: 'CSV to JSON', icon: Code2, color: 'text-purple-600' },
      { id: 'xml-to-csv', label: 'XML to CSV', icon: FileCode, color: 'text-red-600' },
      { id: 'json-to-xml', label: 'JSON to XML', icon: FileJson, color: 'text-blue-700' },
      { id: 'xml-to-json', label: 'XML to JSON', icon: FileX, color: 'text-green-700' },
    ]
  },
  {
    id: 'excel',
    label: 'Excel & Tabular',
    icon: FileSpreadsheet,
    converters: [
      { id: 'excel-to-csv', label: 'Excel to CSV', icon: FileSpreadsheet, color: 'text-green-700' },
      { id: 'excel-to-json', label: 'Excel to JSON', icon: FileSpreadsheet, color: 'text-blue-700' },
      { id: 'csv-to-yaml', label: 'CSV to YAML', icon: FileText, color: 'text-indigo-600' },
      { id: 'yaml-to-csv', label: 'YAML to CSV', icon: FileText, color: 'text-indigo-700' },
      { id: 'csv-to-html', label: 'CSV to HTML Table', icon: Globe, color: 'text-pink-600' },
      { id: 'csv-to-sql', label: 'CSV to SQL', icon: Database, color: 'text-teal-600' },
    ]
  },
  {
    id: 'developer',
    label: 'Developer Formats',
    icon: Terminal,
    converters: [
      { id: 'json-to-yaml', label: 'JSON to YAML', icon: FileJson, color: 'text-yellow-600' },
      { id: 'yaml-to-json', label: 'YAML to JSON', icon: FileText, color: 'text-yellow-700' },
      { id: 'json-to-toml', label: 'JSON to TOML', icon: FileJson, color: 'text-orange-700' },
      { id: 'xml-to-yaml', label: 'XML to YAML', icon: FileX, color: 'text-purple-700' },
      { id: 'json-to-typescript', label: 'JSON to TypeScript', icon: Braces, color: 'text-blue-800' },
      { id: 'json-to-schema', label: 'JSON to Schema', icon: Hash, color: 'text-indigo-800' },
      { id: 'openapi-to-json', label: 'OpenAPI to JSON', icon: Globe, color: 'text-green-800' },
    ]
  },
  {
    id: 'config',
    label: 'Config & Settings',
    icon: Settings,
    converters: [
      { id: 'ini-to-json', label: 'INI to JSON', icon: FileText, color: 'text-gray-600' },
      { id: 'env-to-json', label: '.env to JSON', icon: FileText, color: 'text-emerald-600' },
      { id: 'yaml-to-json', label: 'YAML to JSON', icon: FileText, color: 'text-cyan-600' },
    ]
  },
  {
    id: 'web',
    label: 'Web & Data Tools',
    icon: Globe,
    converters: [
      { id: 'html-table-to-csv', label: 'HTML Table to CSV', icon: Table, color: 'text-rose-600' },
      { id: 'markdown-to-html', label: 'Markdown to HTML', icon: FileText, color: 'text-slate-600' },
      { id: 'html-to-markdown', label: 'HTML to Markdown', icon: FileText, color: 'text-slate-700' },
      { id: 'json-diff', label: 'JSON Diff Viewer', icon: GitBranch, color: 'text-violet-600' },
      { id: 'csv-merge', label: 'CSV Merge Tool', icon: Workflow, color: 'text-amber-600' },
      { id: 'rest-api-to-csv', label: 'REST API to CSV', icon: Globe, color: 'text-lime-600' },
    ]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ activeConverter, onConverterChange }) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['core']);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <aside className="w-64 sm:w-72 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-lg border-r border-gray-200/50 dark:border-gray-700/50 h-full min-h-screen overflow-y-auto scrollbar-hide flex flex-col">
      <div className="p-4 sm:p-6 safe-area flex-1">
        <div className="flex items-center space-x-3 mb-6 sm:mb-8">
          <div className="gradient-accent p-2 rounded-lg flex-shrink-0">
            <Box className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gradient">
            Converters
          </h2>
        </div>
        
        <nav className="space-y-1 sm:space-y-2 flex-1">
          {converterCategories.map((category) => {
            const CategoryIcon = category.icon;
            const isExpanded = expandedCategories.includes(category.id);
            
            return (
              <div key={category.id} className="space-y-1">
                <Button
                  variant="ghost"
                  onClick={() => toggleCategory(category.id)}
                  className="w-full justify-between h-auto p-2 sm:p-3 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 rounded-lg transition-all touch-target"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                    <CategoryIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                    <span className="font-semibold text-sm sm:text-base text-gray-700 dark:text-gray-300 truncate">
                      {category.label}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                  )}
                </Button>
                
                {isExpanded && (
                  <div className="pl-2 sm:pl-4 space-y-1">
                    {category.converters.map((converter) => {
                      const Icon = converter.icon;
                      const isActive = activeConverter === converter.id;
                      
                      return (
                        <button
                          key={converter.id}
                          onClick={() => onConverterChange(converter.id)}
                          className={cn(
                            "w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-left transition-all duration-200 touch-target min-w-0 group relative overflow-hidden",
                            isActive
                              ? "tech-card shadow-md border-2 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 dark:hover:from-gray-700/50 dark:hover:to-blue-900/20 hover:text-gray-900 dark:hover:text-white hover:shadow-sm"
                          )}
                        >
                          <Icon className={cn("h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 transition-colors", isActive ? converter.color : "")} />
                          <span className="font-medium text-xs sm:text-sm truncate">{converter.label}</span>
                          {/* Hover indicator */}
                          <div className={cn(
                            "absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent translate-x-[-100%] transition-transform duration-300 group-hover:translate-x-[100%]",
                            isActive ? "hidden" : ""
                          )} />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
      
      {/* Extended footer to fill remaining space */}
      <div className="bg-gradient-to-b from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 border-t border-gray-200/50 dark:border-gray-700/50 p-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Code Converter Pro v1.0
        </p>
      </div>
    </aside>
  );
};
