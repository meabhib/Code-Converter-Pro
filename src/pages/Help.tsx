
import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { 
  HelpCircle, 
  FileCode, 
  Database, 
  Code2, 
  FileText, 
  Zap, 
  Shield, 
  Clock,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Help = () => {
  const faqs = [
    {
      question: "How do I use the converters?",
      answer: "Simply paste your data into the input area or upload a file, then click 'Convert'. The output will appear in the right panel with options to copy or download."
    },
    {
      question: "What file formats are supported?",
      answer: "We support XML, JSON, CSV, YAML, HTML, Markdown, and XSD. Each converter handles specific format combinations with validation and error checking."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, all conversions happen locally in your browser. No data is sent to external servers, ensuring complete privacy and security."
    },
    {
      question: "Can I convert large files?",
      answer: "Yes, but performance depends on your device. For files over 10MB, we recommend using the desktop version of your browser for better performance."
    },
    {
      question: "What happens if my input has errors?",
      answer: "Our smart validation will highlight syntax errors and provide helpful suggestions to fix common issues before conversion."
    },
    {
      question: "Can I save my conversion history?",
      answer: "Yes, use the history feature (Undo/Redo buttons) to navigate through your recent conversions during your session."
    }
  ];

  const tools = [
    {
      name: "XML to XSD",
      description: "Generate XML Schema Definition files from sample XML documents",
      icon: FileCode,
      features: ["Schema validation", "Namespace support", "Complex type detection"]
    },
    {
      name: "JSON ↔ CSV",
      description: "Convert between JSON arrays/objects and CSV tabular format",
      icon: Database,
      features: ["Nested object flattening", "Custom delimiters", "Header detection"]
    },
    {
      name: "XML ↔ JSON",
      description: "Bidirectional conversion between XML and JSON formats",
      icon: Code2,
      features: ["Attribute preservation", "Namespace handling", "Array detection"]
    },
    {
      name: "YAML ↔ JSON",
      description: "Convert between YAML configuration files and JSON",
      icon: FileText,
      features: ["Comment preservation", "Multi-document support", "Type validation"]
    },
    {
      name: "Markdown ↔ HTML",
      description: "Convert Markdown to HTML and vice versa",
      icon: FileText,
      features: ["Syntax highlighting", "Table support", "Link validation"]
    }
  ];

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background transition-colors flex flex-col">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="gradient-primary p-4 rounded-2xl">
                <HelpCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gradient mb-4">Help & Support</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Everything you need to know about using Code Converter Pro effectively. 
              From basic usage to advanced features and troubleshooting.
            </p>
          </div>

          {/* Quick Start Guide */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Zap className="h-6 w-6 mr-3 text-blue-600" />
              Quick Start Guide
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="tech-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                    Choose Your Tool
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    Select the appropriate converter from the sidebar based on your input and desired output format.
                  </p>
                </CardContent>
              </Card>

              <Card className="tech-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <span className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                    Input Your Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    Paste your data directly or upload a file. Enable live preview for real-time conversion as you type.
                  </p>
                </CardContent>
              </Card>

              <Card className="tech-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <span className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
                    Get Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    View the converted output, copy to clipboard, or download as a file. Use the history feature to track changes.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Available Tools */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Code2 className="h-6 w-6 mr-3 text-purple-600" />
              Available Tools
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {tools.map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <Card key={index} className="tech-card hover-lift">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Icon className="h-6 w-6 mr-3 text-blue-600" />
                        {tool.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{tool.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {tool.features.map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Features Overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <CheckCircle className="h-6 w-6 mr-3 text-green-600" />
              Key Features
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">Live Preview</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">See results in real-time as you type</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">Secure & Private</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">All processing happens locally in your browser</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">Fast Processing</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Lightning-fast conversions with smart caching</p>
              </div>
              
              <div className="text-center">
                <div className="bg-orange-100 dark:bg-orange-900 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold mb-2">Error Detection</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Smart validation with helpful error messages</p>
              </div>
            </div>
          </section>

          {/* Frequently Asked Questions */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <HelpCircle className="h-6 w-6 mr-3 text-indigo-600" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="tech-card">
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Tips & Best Practices */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Info className="h-6 w-6 mr-3 text-cyan-600" />
              Tips & Best Practices
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Performance Tip:</strong> For large files, disable live preview and use manual conversion for better performance.
                </AlertDescription>
              </Alert>
              
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Accuracy Tip:</strong> Always validate your input data before conversion to ensure the best results.
                </AlertDescription>
              </Alert>
              
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Privacy Tip:</strong> No data leaves your browser - all conversions are processed locally for maximum security.
                </AlertDescription>
              </Alert>
              
              <Alert>
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  <strong>Workflow Tip:</strong> Use the history feature to compare different conversion attempts and find the best result.
                </AlertDescription>
              </Alert>
            </div>
          </section>

          {/* Contact Support */}
          <section className="text-center">
            <Card className="tech-card max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-xl">Need More Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Can't find the answer you're looking for? We're here to help!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/contact" 
                    className="btn-interactive bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Contact Support
                  </a>
                  <a 
                    href="/docs" 
                    className="btn-interactive border-2 border-blue-600 text-blue-600 dark:text-blue-400 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                  >
                    View Documentation
                  </a>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Help;
