
import React, { useState } from 'react';
import { Moon, Sun, Code, Zap, Sparkles, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/help', label: 'Help' },
    { href: '/docs', label: 'Documentation' },
    { href: '/contact', label: 'Contact' },
    { href: '/support', label: 'Developer' },
  ];

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 safe-area-top">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 safe-area">
        <div className="flex items-center h-14 sm:h-16 space-x-4 lg:space-x-8">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3 sm:space-x-4 group">
              <img
                src="/ccp_logo.png"
                alt="Code Converter Pro Logo"
                className="h-10 sm:h-12 w-10 sm:w-12 rounded-full object-contain dark:brightness-110 transition-transform duration-200 group-hover:scale-105"
              />
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-gradient flex items-center space-x-2">
                  <span className="truncate">Code Converter Pro</span>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hidden sm:inline-flex"
                  >
                    v2.0
                  </Badge>
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium hidden sm:block leading-tight">
                  The Professional's Toolkit for Converting Data Formats
                </p>
              </div>
            </Link>
          </div>


          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6 flex-1 justify-center">
            <nav className="flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "px-2 xl:px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-700",
                    location.pathname === item.href
                      ? "bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden xl:flex items-center space-x-3 glass-effect px-4 py-2 rounded-full">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Live Preview
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Smart Detection
              </span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="h-8 w-8 sm:h-10 sm:w-10 p-0 border-2 hover:scale-105 transition-transform rounded-full touch-target"
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
              ) : (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              )}
            </Button>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="h-8 w-8 sm:h-10 sm:w-10 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full touch-target"
                title="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200/50 dark:border-gray-700/50 py-3 sm:py-4">
            <nav className="flex flex-col space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-3 py-3 rounded-lg text-sm font-medium transition-colors touch-target",
                    location.pathname === item.href
                      ? "bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            
            {/* Mobile Features Info */}
            <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                <Zap className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                <span>Live Preview</span>
                <span>•</span>
                <span>Smart Detection</span>
                <span>•</span>
                <span>Schema Validation</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
