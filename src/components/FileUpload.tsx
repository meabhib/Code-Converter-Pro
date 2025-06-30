
import React, { useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileUpload: (content: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const { toast } = useToast();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Please select a file smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileUpload(content);
    };
    reader.onerror = () => {
      toast({
        title: "File read error",
        description: "Unable to read the selected file.",
        variant: "destructive",
      });
    };
    reader.readAsText(file);
  }, [onFileUpload, toast]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileUpload(content);
    };
    reader.onerror = () => {
      toast({
        title: "File read error",
        description: "Unable to read the dropped file.",
        variant: "destructive",
      });
    };
    reader.readAsText(file);
  }, [onFileUpload, toast]);

  return (
    <div
      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileSelect}
        accept=".txt,.json,.xml,.csv,.xsd"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="space-y-2">
          <div className="flex justify-center">
            <Upload className="h-8 w-8 text-gray-400" />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium text-blue-600 hover:text-blue-500">
              Click to upload
            </span>{' '}
            or drag and drop
          </div>
          <div className="text-xs text-gray-500">
            Supports: TXT, JSON, XML, CSV, XSD (Max 5MB)
          </div>
        </div>
      </label>
    </div>
  );
};
