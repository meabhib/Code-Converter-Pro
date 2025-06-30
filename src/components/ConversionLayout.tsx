
import React, { useCallback } from 'react';
import { Upload, Download, Copy, RotateCcw, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { CodeEditor } from './CodeEditor';
import { FileUpload } from './FileUpload';

interface ConversionLayoutProps {
  title: string;
  description: string;
  inputLabel: string;
  outputLabel: string;
  inputPlaceholder: string;
  inputValue: string;
  outputValue: string;
  onInputChange: (value: string) => void;
  onConvert: () => void;
  isLoading: boolean;
  error: string;
  inputLanguage: string;
  outputLanguage: string;
}

export const ConversionLayout: React.FC<ConversionLayoutProps> = ({
  title,
  description,
  inputLabel,
  outputLabel,
  inputPlaceholder,
  inputValue,
  outputValue,
  onInputChange,
  onConvert,
  isLoading,
  error,
  inputLanguage,
  outputLanguage,
}) => {
  const { toast } = useToast();

  const handleFileUpload = useCallback((content: string) => {
    onInputChange(content);
    toast({
      title: "File uploaded successfully",
      description: "Your file content has been loaded into the input area.",
    });
  }, [onInputChange, toast]);

  const handleCopy = useCallback(async () => {
    if (!outputValue) return;
    
    try {
      await navigator.clipboard.writeText(outputValue);
      toast({
        title: "Copied to clipboard",
        description: "The converted data has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please select and copy manually.",
        variant: "destructive",
      });
    }
  }, [outputValue, toast]);

  const handleDownload = useCallback(() => {
    if (!outputValue) return;

    const blob = new Blob([outputValue], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted-${Date.now()}.${outputLanguage}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download started",
      description: "Your converted file is being downloaded.",
    });
  }, [outputValue, outputLanguage, toast]);

  const handleReset = useCallback(() => {
    onInputChange('');
    toast({
      title: "Reset complete",
      description: "Input and output areas have been cleared.",
    });
  }, [onInputChange, toast]);

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2 px-2 sm:px-0">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient leading-tight">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mx-2 sm:mx-0">
          <AlertDescription className="text-center text-sm sm:text-base">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 px-2 sm:px-0">
        {/* Input Section */}
        <Card className="tech-card hover-lift h-fit">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center space-x-2 sm:space-x-3 text-base sm:text-xl">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <span className="truncate">{inputLabel}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {/* File Upload */}
            <FileUpload onFileUpload={handleFileUpload} />
            
            {/* Code Editor */}
            <CodeEditor
              value={inputValue}
              onChange={onInputChange}
              language={inputLanguage}
              placeholder={inputPlaceholder}
              height="350px"
            />
            
            {/* Action Buttons */}
            <div className="mobile-stack">
              <Button
                onClick={onConvert}
                disabled={!inputValue.trim() || isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 sm:py-3 text-sm sm:text-base touch-target btn-interactive"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Convert
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-700 touch-target btn-interactive"
                title="Reset"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="tech-card hover-lift h-fit">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center justify-between text-base sm:text-xl">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <span className="truncate">{outputLabel}</span>
              </div>
              {outputValue && (
                <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCopy}
                    className="hover:bg-blue-50 dark:hover:bg-blue-900/20 touch-target btn-interactive"
                    title="Copy to clipboard"
                  >
                    <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline ml-1">Copy</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDownload}
                    className="hover:bg-green-50 dark:hover:bg-green-900/20 touch-target btn-interactive"
                    title="Download file"
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline ml-1">Download</span>
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CodeEditor
              value={outputValue}
              onChange={() => {}}
              language={outputLanguage}
              placeholder="Converted output will appear here..."
              height="350px"
              readOnly
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
