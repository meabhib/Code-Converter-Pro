
import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { 
  BookOpen, 
  Code, 
  Database, 
  FileText, 
  Shield, 
  Zap, 
  Settings,
  AlertTriangle,
  CheckCircle,
  Info,
  Terminal,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Documentation = () => {
  const converters = [
    {
      name: "XML to XSD",
      description: "Generates XML Schema Definition from XML documents",
      input: "Valid XML document",
      output: "XSD schema file",
      features: ["Complex type inference", "Namespace support", "Validation rules"],
      example: {
        input: `<?xml version="1.0"?>\n<person>\n  <name>John Doe</name>\n  <age>30</age>\n</person>`,
        output: `<?xml version="1.0"?>\n<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">\n  <xs:element name="person">\n    <xs:complexType>\n      <xs:sequence>\n        <xs:element name="name" type="xs:string"/>\n        <xs:element name="age" type="xs:int"/>\n      </xs:sequence>\n    </xs:complexType>\n  </xs:element>\n</xs:schema>`
      }
    },
    {
      name: "JSON to CSV",
      description: "Converts JSON arrays to CSV format with header detection",
      input: "JSON array of objects",
      output: "CSV with headers",
      features: ["Nested object flattening", "Custom delimiters", "Type preservation"],
      example: {
        input: `[{"name":"John","age":30},{"name":"Jane","age":25}]`,
        output: `name,age\nJohn,30\nJane,25`
      }
    },
    {
      name: "CSV to JSON",
      description: "Converts CSV data to JSON array format",
      input: "CSV with headers",
      output: "JSON array of objects",
      features: ["Auto-type detection", "Custom separators", "Empty value handling"],
      example: {
        input: `name,age\nJohn,30\nJane,25`,
        output: `[{"name":"John","age":"30"},{"name":"Jane","age":"25"}]`
      }
    }
  ];

  const securityFeatures = [
    {
      title: "Local Processing",
      description: "All conversions happen in your browser - no data sent to servers",
      icon: Shield
    },
    {
      title: "No Data Storage",
      description: "We don't store, log, or cache any of your input data",
      icon: Database
    },
    {
      title: "HTTPS Secured",
      description: "All connections are encrypted using modern TLS protocols",
      icon: Globe
    },
    {
      title: "Open Source",
      description: "Our code is transparent and auditable for security verification",
      icon: Code
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
                <BookOpen className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gradient mb-4">Technical Documentation</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Comprehensive technical documentation for Code Converter Pro. 
              Learn about supported formats, conversion algorithms, and implementation details.
            </p>
          </div>

          {/* Overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Info className="h-6 w-6 mr-3 text-blue-600" />
              Overview
            </h2>
            <Card className="tech-card">
              <CardContent className="pt-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Code Converter Pro is a comprehensive data conversion platform that supports bidirectional 
                  conversion between various data formats. Built with modern web technologies, it provides 
                  fast, secure, and reliable data transformation capabilities.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg mb-3">
                      <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto" />
                    </div>
                    <h3 className="font-semibold text-sm">Real-time Processing</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Live preview with debounced updates</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg mb-3">
                      <Shield className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto" />
                    </div>
                    <h3 className="font-semibold text-sm">Client-side Security</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">No server-side data processing</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg mb-3">
                      <Settings className="h-6 w-6 text-purple-600 dark:text-purple-400 mx-auto" />
                    </div>
                    <h3 className="font-semibold text-sm">Smart Validation</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Automatic format detection and validation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Supported Conversions */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Code className="h-6 w-6 mr-3 text-purple-600" />
              Supported Conversions
            </h2>
            <div className="space-y-6">
              {converters.map((converter, index) => (
                <Card key={index} className="tech-card">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{converter.name}</span>
                      <div className="flex gap-2">
                        {converter.features.map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{converter.description}</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-blue-600" />
                          Input Format
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{converter.input}</p>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          <pre className="text-xs overflow-x-auto">
                            <code>{converter.example.input}</code>
                          </pre>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-green-600" />
                          Output Format
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{converter.output}</p>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          <pre className="text-xs overflow-x-auto">
                            <code>{converter.example.output}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Technical Specifications */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Terminal className="h-6 w-6 mr-3 text-indigo-600" />
              Technical Specifications
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="tech-card">
                <CardHeader>
                  <CardTitle>Performance Limits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      <span>Maximum file size: 50MB</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      <span>Live preview: Up to 1MB</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      <span>Processing time: &lt; 2 seconds</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      <span>Memory usage: Optimized for browser</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="tech-card">
                <CardHeader>
                  <CardTitle>Browser Compatibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      <span>Chrome 80+ (Recommended)</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      <span>Firefox 75+</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      <span>Safari 13+</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      <span>Edge 80+</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Security & Privacy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Shield className="h-6 w-6 mr-3 text-green-600" />
              Security & Privacy
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {securityFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="tech-card">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Icon className="h-6 w-6 mr-3 text-green-600" />
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Error Handling */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <AlertTriangle className="h-6 w-6 mr-3 text-orange-600" />
              Error Handling
            </h2>
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Syntax Errors:</strong> The system will highlight specific line numbers and provide suggestions for common syntax issues.
                </AlertDescription>
              </Alert>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Format Detection:</strong> Automatic format detection helps identify mismatched input types and suggests appropriate converters.
                </AlertDescription>
              </Alert>
              
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Validation:</strong> Pre-conversion validation ensures data integrity and prevents conversion errors before processing.
                </AlertDescription>
              </Alert>
            </div>
          </section>

          {/* API Reference */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Code className="h-6 w-6 mr-3 text-cyan-600" />
              API Reference
            </h2>
            <Card className="tech-card">
              <CardHeader>
                <CardTitle>Core Conversion Functions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">xmlToXsd(xml: string): Promise&lt;string&gt;</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Converts XML document to XSD schema definition.
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <pre className="text-xs">
                        <code>{`const xsd = await xmlToXsd(xmlString);`}</code>
                      </pre>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">jsonToCsv(json: string): Promise&lt;string&gt;</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Converts JSON array to CSV format with automatic header detection.
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <pre className="text-xs">
                        <code>{`const csv = await jsonToCsv(jsonString);`}</code>
                      </pre>
                    </div>
                  </div>
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

export default Documentation;
