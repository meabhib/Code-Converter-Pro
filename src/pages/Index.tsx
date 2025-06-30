
import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { ConversionPanel } from '@/components/ConversionPanel';
import { AdSpace } from '@/components/AdSpace';
import { Footer } from '@/components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [activeConverter, setActiveConverter] = useState('xml-to-xsd');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background transition-colors flex flex-col">
        <Header />
        
        <div className="flex flex-1 relative">
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={toggleSidebar}
            />
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSidebar}
            className="fixed top-16 sm:top-20 left-4 z-50 lg:hidden touch-target bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>

          {/* Sidebar Navigation - Extended to bottom */}
          <div className={`
            fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
            transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 transition-transform duration-300 ease-in-out
            lg:transition-none h-full min-h-screen
          `}>
            <Sidebar 
              activeConverter={activeConverter} 
              onConverterChange={(converter) => {
                setActiveConverter(converter);
                setSidebarOpen(false);
              }}
            />
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col lg:flex-row min-w-0">
            {/* Conversion Panel */}
            <div className="flex-1 p-3 sm:p-4 lg:p-6 min-w-0">
              <div className="lg:ml-0 ml-0">
                <ConversionPanel activeConverter={activeConverter} />
              </div>
            </div>
            
            {/* Right Ad Space - Hidden on mobile and tablet */}
            <div className="hidden xl:block w-80 p-4 flex-shrink-0">
              <div className="sticky top-24">
                <AdSpace position="sidebar" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Ad Space */}
        <div className="p-2 sm:p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm no-print">
          <AdSpace position="footer" />
        </div>

        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Index;
