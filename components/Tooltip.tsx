import React from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  return (
    <div className="relative group">
      {children}
      <div 
        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                   invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-200
                   pointer-events-none z-30 whitespace-nowrap"
      >
        <div 
          className="bg-gray-800 dark:bg-gray-200 text-gray-50 dark:text-gray-800 
                     text-xs font-semibold py-1 px-3 rounded-md shadow-lg"
        >
          {text}
          <svg 
            className="absolute text-gray-800 dark:text-gray-200 h-2 w-full left-0 top-full" 
            x="0px" y="0px" viewBox="0 0 255 255" 
            xmlSpace="preserve"
          >
            <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
