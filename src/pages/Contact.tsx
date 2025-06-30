
import React, { useState } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Mail, MessageSquare, Send, CheckCircle, Linkedin, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });

    toast({
      title: "Message sent successfully!",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background transition-colors flex flex-col">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="gradient-primary p-4 rounded-2xl">
                <Mail className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gradient mb-4">Get in Touch</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Have questions, suggestions, or need help? We'd love to hear from you. 
              Reach out and we'll get back to you as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="tech-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-6 w-6 mr-3 text-blue-600" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <Alert className="mb-6">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Thank you!</strong> Your message has been sent successfully. 
                      We'll get back to you within 24 hours.
                    </AlertDescription>
                  </Alert>
                ) : null}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What's this about?"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us more about your question or feedback..."
                      rows={6}
                      className="w-full resize-none"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="tech-card">
                <CardHeader>
                  <CardTitle>Direct Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                      <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <a 
                        href="mailto:codeconverterpro@gmail.com" 
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        codeconverterpro@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                      <Linkedin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">LinkedIn</p>
                      <a 
                        href="https://www.linkedin.com/in/meabhib" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Connect with Abhishek
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="tech-card">
                <CardHeader>
                  <CardTitle>Developer Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-xl">AB</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Abhishek Bhardwaj</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Full-stack developer and data tools enthusiast. Creator of Code Converter Pro.
                    </p>
                    <div className="flex justify-center space-x-4">
                      <a
                        href="https://www.linkedin.com/in/meabhib"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                      <a
                        href="/support"
                        className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
                      >
                        <Coffee className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="tech-card">
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a href="/help" className="block text-blue-600 dark:text-blue-400 hover:underline">
                    📋 Help & FAQ
                  </a>
                  <a href="/docs" className="block text-blue-600 dark:text-blue-400 hover:underline">
                    📖 Technical Documentation
                  </a>
                  <a href="/support" className="block text-blue-600 dark:text-blue-400 hover:underline">
                    ☕ Buy Me a Coffee
                  </a>
                  <a href="/about" className="block text-blue-600 dark:text-blue-400 hover:underline">
                    ℹ️ About Code Converter Pro
                  </a>
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

export default Contact;
