import React from 'react';
import { ExternalLink } from 'lucide-react';

interface AdSpaceProps {
  position: 'sidebar' | 'footer' | 'header';
}

const quotes = [
  {
    text: "Data is a precious thing and will last longer than the systems themselves.",
    author: "Tim Berners-Lee"
  },
  {
    text: "Without data, you're just another person with an opinion.",
    author: "W. Edwards Deming"
  },
  {
    text: "In God we trust. All others must bring data.",
    author: "W. Edwards Deming"
  },
  {
    text: "The goal is to turn data into information, and information into insight.",
    author: "Carly Fiorina"
  },
  // Add more quotes as desired
];

export const AdSpace: React.FC<AdSpaceProps> = ({ position }) => {
  const getAdContent = () => {
    switch (position) {
      case 'sidebar':
        return {
          title: 'Premium Access',
          description: 'Unlock advanced features with Code Converter Pro+',
          cta: 'Coming Soon',
          className: 'h-80'
        };
      case 'footer': {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        return {
          title: randomQuote.text,
          description: `— ${randomQuote.author}`,
          cta: null,
          wrapperClass: 'py-10 px-6 sm:px-10 w-full max-w-4xl'
        };
      }
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
    <div className={`bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4 flex flex-col justify-center items-center text-center border border-dashed border-gray-300 dark:border-gray-600 ${ad.wrapperClass || ad.className}`}>
      <div className="space-y-3">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
          {ad.title}
        </h3>
        <p className="text-md italic text-gray-600 dark:text-gray-400">
          {ad.description}
        </p>
        {ad.cta && (
          <button className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
            <span>{ad.cta}</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
};
