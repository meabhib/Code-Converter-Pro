
import React from 'react';
import { Code, Zap, Shield, Users, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';

const About = () => {
  const features = [
    {
      icon: Code,
      title: 'Developer-First',
      description: 'Built by developers, for developers. Clean APIs, robust validation, and extensible architecture.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized parsing algorithms and client-side processing ensure instant conversions.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'All conversions happen in your browser. Your data never leaves your device.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Open source core with active community contributions and feature requests.'
    }
  ];

  const services = [
    'XML to XSD Schema Generation',
    'CSV to JSON/XML Conversion',
    'JSON to CSV/YAML Transformation',
    'Excel to Multiple Formats',
    'Schema Validation & Beautification',
    'Bulk File Processing',
    'Real-time Live Preview',
    'Smart Format Detection',
    'API Access & Integration',
    'Batch Processing Tools'
  ];

  const upcomingFeatures = [
    'Excel to Parquet',
    'GraphQL Schema Generation',
    'Protobuf Support',
    'Advanced SQL Export',
    'Custom Templates',
    'Team Collaboration'
  ];

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900 transition-colors flex flex-col">
        <Header />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="relative mb-8">
                <h1 className="text-5xl font-bold text-gradient mb-6">
                  About Code Converter Pro
                </h1>
                <div className="absolute -top-4 -right-8 opacity-20">
                  <Sparkles className="h-12 w-12 text-purple-500" />
                </div>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
                We're building the world's most comprehensive data format conversion platform, 
                designed specifically for developers, data analysts, and technical professionals 
                who demand precision, speed, and reliability.
              </p>
            </div>
          </section>

          {/* Mission Statement */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  To eliminate the friction in data format conversions by providing fast, accurate, 
                  and secure tooling that empowers technical professionals to focus on what matters most.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={index} className="tech-card hover-lift text-center">
                      <CardHeader className="pb-4">
                        <div className="mx-auto bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl w-fit mb-4">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 dark:text-gray-400">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Our Services
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    Comprehensive data format conversion tools designed for professional use cases.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {services.map((service, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Card className="tech-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                      <span>We're Growing</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">
                      Our roadmap is packed with exciting features based on community feedback and industry needs.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Coming Soon:</h4>
                      {upcomingFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 space-y-2">
                      <Link to="/contact">
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 mb-2">
                          Request a Feature
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                      <Link to="/support">
                        <Button variant="outline" className="w-full">
                          Support the Project
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-blue-600">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Transform Your Data?
              </h2>
              <p className="text-xl text-purple-100 mb-8">
                Join thousands of developers who trust Code Converter Pro for their data conversion needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/">
                  <Button size="lg" variant="secondary" className="font-semibold">
                    Try It Now
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default About;
