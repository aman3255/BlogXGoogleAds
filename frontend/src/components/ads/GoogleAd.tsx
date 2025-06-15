import React, { useEffect, useRef } from 'react';

interface GoogleAdProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  adLayout?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const GoogleAd: React.FC<GoogleAdProps> = ({
  adSlot,
  adFormat = 'auto',
  adLayout,
  className = '',
  style = {}
}) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      // Check if Google AdSense is available
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('Error loading Google Ad:', error);
    }
  }, []);

  return (
    <div className={`google-ad-container ${className}`} style={style}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX" // Replace with your AdSense client ID
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-full-width-responsive="true"
      />
    </div>
  );
};

// Fallback component for development/preview
export const AdPlaceholder: React.FC<{ placement: string; className?: string }> = ({ 
  placement, 
  className = '' 
}) => {
  return (
    <div className={`p-6 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-center ${className}`}>
      <div className="text-gray-500">
        <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="font-medium">Google Ad - {placement}</p>
        <p className="text-sm text-gray-400 mt-1">Advertisement will appear here</p>
      </div>
    </div>
  );
};