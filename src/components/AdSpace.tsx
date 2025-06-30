
import React from 'react';
import { ExternalLink } from 'lucide-react';

interface AdSpaceProps {
  position: 'sidebar' | 'footer' | 'header';
}

export const AdSpace: React.FC<AdSpaceProps> = ({ position }) => {
  const getAdContent = () => {
    switch (position) {
      case 'sidebar':
        return {
          title: 'Premium Tools',
          description: 'Unlock advanced features with DataForge Pro+',
          cta: 'Upgrade Now',
          className: 'h-80'
        };
      case 'footer':
        return {
          title: 'Boost Your Productivity',
          description: 'Professional data conversion tools for your business',
          cta: 'Learn More',
          wrapperClass: 'py-10 px-6 sm:px-10 w-full max-w-4xl'
        };
      default:
        return {
          title: 'Ad Space',
          description: 'Your advertisement here',
          cta: 'Contact Us',
          className: 'h-32'
        };
    }
  };

  const ad = getAdContent();

  return (
    <div className={`bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4 flex flex-col justify-center items-center text-center border border-dashed border-gray-300 dark:border-gray-600 ${ad.className}`}>
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
          {ad.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {ad.description}
        </p>
        <button className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
          <span>{ad.cta}</span>
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};
