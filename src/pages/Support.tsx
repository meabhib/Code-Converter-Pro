
import React from 'react';
import { Coffee, Heart, Github, Linkedin, Mail, Star, Code, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Support = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900 transition-colors flex flex-col">
        <Header />
        
        <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-xl">
                  <Coffee className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gradient mb-4">
                Code Converter Pro - Built with Purpose
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Convert data, and formats — cleanly, intelligently, reliably.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Developer Profile */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="tech-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                        <Code className="h-5 w-5 text-white" />
                      </div>
                      <span>Meet the Developer</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          Abhishek Bhardwaj
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Full-Stack Developer
                          </Badge>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            Data Tools Enthusiast
                          </Badge>
                          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Open Source Contributor
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                          I'm a passionate full-stack developer and data tools enthusiast with a love for creating 
                          practical solutions that make developers' lives easier. Code Converter Pro is my labor of love - 
                          a platform built to simplify and accelerate data workflows for developers, analysts, and engineers worldwide.
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                          This project started as a personal need to quickly convert between different data formats during 
                          development work. What began as a simple tool has grown into a comprehensive platform that 
                          thousands of developers now rely on daily.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <a
                          href="https://www.linkedin.com/in/meabhib"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Linkedin className="h-4 w-4" />
                          <span>LinkedIn Profile</span>
                        </a>
                        <a
                          href="mailto:codeconverterpro@gmail.com"
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <Mail className="h-4 w-4" />
                          <span>Email Me</span>
                        </a>
                        <a
                          href="https://github.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                        >
                          <Github className="h-4 w-4" />
                          <span>GitHub</span>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Project Impact */}
                <Card className="tech-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-green-500 to-teal-500 p-2 rounded-lg">
                        <Star className="h-5 w-5 text-white" />
                      </div>
                      <span>Project Impact</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">15+</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Conversion Tools</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">1000+</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Daily Users</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">50k+</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Conversions</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Support Section */}
              <div className="space-y-6">
                <Card className="tech-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      <span>Support the Project</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        If Code Converter Pro has helped you in your work, consider supporting its continued development!
                      </p>
                      
                      <div className="space-y-3">
                        <Button 
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all"
                          onClick={() => window.open('https://buymeacoffee.com/abhishekb', '_blank')}
                        >
                          <Coffee className="h-5 w-5 mr-2" />
                          Buy Me a Coffee
                        </Button>
                        
                        <div className="text-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400">or</span>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => window.open('https://github.com/sponsors/abhishekb', '_blank')}
                        >
                          <Github className="h-4 w-4 mr-2" />
                          Sponsor on GitHub
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="tech-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      <span>Ways to Help & Support</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">Share with Others</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Tell your colleagues about Code Converter Pro
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">Report Issues</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Help improve the platform by reporting bugs
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">Suggest Features</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Request new converters or improvements
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="tech-card">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Coffee className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Every coffee helps keep the servers running and new features coming!
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Thank You Section */}
            <div className="mt-16 text-center">
              <Card className="tech-card">
                <CardContent className="p-8">
                  <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Thank You!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                    Your support means everything to me and helps keep Code Converter Pro free and accessible to developers worldwide. 
                    Together, we're building tools that make development faster and more enjoyable.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/contact">
                      <Button variant="outline">
                        Get in Touch
                      </Button>
                    </Link>
                    <Link to="/">
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Back to Tools
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Support;
