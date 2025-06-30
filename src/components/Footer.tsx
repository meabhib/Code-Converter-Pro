import React from 'react';
import { Github, Linkedin, Mail, Heart, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 mt-auto safe-area-bottom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 safe-area">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Brand Section */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-3 mb-2">
              <div className="gradient-primary p-2 rounded-lg flex-shrink-0">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gradient">Code Converter Pro</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2 max-w-md leading-relaxed">
              The Professional's Toolkit for Converting Data Formats. A smarter way to transform, 
              structure, and deliver your data — instantly and accurately.
            </p>
            <div className="flex space-x-2 sm:space-x-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors touch-target p-2 -m-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                title="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/meabhib"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors touch-target p-2 -m-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                title="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:codeconverterpro@gmail.com"
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors touch-target p-2 -m-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <Link
                to="/support"
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors touch-target p-2 -m-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Buy Me a Coffee"
              >
                <Coffee className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors block py-1">Home</Link></li>
              <li><Link to="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors block py-1">About Us</Link></li>
              <li><Link to="/help" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors block py-1">Help</Link></li>
              <li><Link to="/docs" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors block py-1">Documentation</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors block py-1">Contact</Link></li>
              <li><Link to="/support" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors block py-1">Know the Developer</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors block py-1">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors block py-1">Terms of Use</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200/50 dark:border-gray-700/50 mt-4 sm:mt-5 pt-2 sm:pt-3">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              © {currentYear} Code Converter Pro - All rights reserved.
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm text-center sm:text-right">
              Developed by Abhishek Bhardwaj with ❤️
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
