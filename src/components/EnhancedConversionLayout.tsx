
import React, { useState, useCallback, useEffect } from 'react';
import { Upload, Download, Copy, RotateCcw, FileText, Sparkles, Undo, Redo, Eye, EyeOff, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CodeEditor } from './CodeEditor';
import { FileUpload } from './FileUpload';
import { useHistory } from '@/hooks/useHistory';
import { useLivePreview } from '@/hooks/useLivePreview';
import { detectFormat } from '@/utils/formatDetector';

interface EnhancedConversionLayoutProps {
  title: string;
  description: string;
  inputLabel: string;
  outputLabel: string;
  inputPlaceholder: string;
  inputValue: string;
  outputValue: string;
  onInputChange: (value: string) => void;
  onConvert: () => Promise<void>;
  isLoading: boolean;
  error: string;
  inputLanguage: string;
  outputLanguage: string;
  converter: (input: string) => Promise<string>;
}

export const EnhancedConversionLayout: React.FC<EnhancedConversionLayoutProps> = ({
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
  converter,
}) => {
  const { toast } = useToast();
  const [livePreviewEnabled, setLivePreviewEnabled] = useState(false);
  const [detectedFormat, setDetectedFormat] = useState<string>('unknown');
  
  const {
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory
  } = useHistory();

  const { 
    output: liveOutput, 
    isProcessing: isLiveProcessing 
  } = useLivePreview({
    input: inputValue,
    converter,
    enabled: livePreviewEnabled,
    delay: 1500
  });

  // Detect format when input changes
  useEffect(() => {
    if (inputValue.trim()) {
      const format = detectFormat(inputValue);
      setDetectedFormat(format);
    } else {
      setDetectedFormat('unknown');
    }
  }, [inputValue]);

  const handleFileUpload = useCallback((content: string) => {
    onInputChange(content);
    toast({
      title: "File uploaded successfully",
      description: "Your file content has been loaded into the input area.",
    });
  }, [onInputChange, toast]);

  const handleConvert = useCallback(async () => {
    await onConvert();
    if (inputValue && outputValue) {
      addToHistory({
        input: inputValue,
        output: outputValue,
        converter: title
      });
    }
  }, [onConvert, inputValue, outputValue, addToHistory, title]);

  const handleUndo = useCallback(() => {
    const previousState = undo();
    if (previousState) {
      onInputChange(previousState.input);
      toast({
        title: "Undo successful",
        description: "Reverted to previous state.",
      });
    }
  }, [undo, onInputChange, toast]);

  const handleRedo = useCallback(() => {
    const nextState = redo();
    if (nextState) {
      onInputChange(nextState.input);
      toast({
        title: "Redo successful",
        description: "Applied next state.",
      });
    }
  }, [redo, onInputChange, toast]);

  const handleCopy = useCallback(async () => {
    const textToCopy = livePreviewEnabled && liveOutput ? liveOutput : outputValue;
    if (!textToCopy) return;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
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
  }, [outputValue, liveOutput, livePreviewEnabled, toast]);

  const handleDownload = useCallback(() => {
    const textToDownload = livePreviewEnabled && liveOutput ? liveOutput : outputValue;
    if (!textToDownload) return;

    const blob = new Blob([textToDownload], { type: 'text/plain' });
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
  }, [outputValue, liveOutput, livePreviewEnabled, outputLanguage, toast]);

  const handleReset = useCallback(() => {
    onInputChange('');
    clearHistory();
    toast({
      title: "Reset complete",
      description: "Input and output areas have been cleared.",
    });
  }, [onInputChange, clearHistory, toast]);

  const displayOutput = livePreviewEnabled && liveOutput ? liveOutput : outputValue;
  const isOutputLoading = livePreviewEnabled ? isLiveProcessing : isLoading;

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="text-center space-y-6">
        <div className="relative">
          <h1 className="text-4xl font-bold text-gradient mb-4">
            {title}
          </h1>
          <div className="absolute -top-2 -right-4 opacity-20">
            <Sparkles className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
        
        {/* Enhanced Controls */}
        <div className="flex flex-wrap justify-center items-center gap-6">
          <div className="flex items-center space-x-3 glass-effect px-4 py-2 rounded-full">
            <Switch
              checked={livePreviewEnabled}
              onCheckedChange={setLivePreviewEnabled}
              id="live-preview"
            />
            <label htmlFor="live-preview" className="text-sm font-semibold cursor-pointer flex items-center space-x-2">
              {livePreviewEnabled ? (
                <Eye className="h-4 w-4 text-green-500" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-500" />
              )}
              <span>Live Preview</span>
            </label>
          </div>
          
          {detectedFormat !== 'unknown' && (
            <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-3 py-1">
              <Wand2 className="h-3 w-3 mr-1" />
              Detected: {detectedFormat.toUpperCase()}
            </Badge>
          )}
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndo}
              disabled={!canUndo}
              title="Undo"
              className="hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-700"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRedo}
              disabled={!canRedo}
              title="Redo"
              className="hover:bg-purple-50 dark:hover:bg-purple-900/20 border-purple-200 dark:border-purple-700"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="max-w-4xl mx-auto">
          <AlertDescription className="text-center">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Input Section */}
        <Card className="tech-card hover-lift">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">{inputLabel}</span>
              </div>
              {detectedFormat !== 'unknown' && detectedFormat !== inputLanguage && (
                <Badge variant="outline" className="text-xs border-amber-200 text-amber-700 dark:text-amber-400">
                  Format mismatch detected
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* File Upload */}
            <FileUpload onFileUpload={handleFileUpload} />
            
            {/* Code Editor */}
            <CodeEditor
              value={inputValue}
              onChange={onInputChange}
              language={inputLanguage}
              placeholder={inputPlaceholder}
              height="450px"
            />
            
            {/* Action Buttons */}
            <div className="flex space-x-3">
              {!livePreviewEnabled && (
                <Button
                  onClick={handleConvert}
                  disabled={!inputValue.trim() || isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Convert
                    </>
                  )}
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-700"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="tech-card hover-lift">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">{outputLabel}</span>
                {livePreviewEnabled && (
                  <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-teal-500 text-white border-0">
                    <Eye className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                )}
                {isOutputLoading && (
                  <Sparkles className="h-5 w-5 animate-spin text-blue-500" />
                )}
              </div>
              {displayOutput && (
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCopy}
                    className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDownload}
                    className="hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CodeEditor
              value={displayOutput}
              onChange={() => {}}
              language={outputLanguage}
              placeholder={livePreviewEnabled ? "Live preview will appear here as you type..." : "Converted output will appear here..."}
              height="450px"
              readOnly
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
