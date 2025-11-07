'use client';

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem('cookieConsent');
    if (consent !== 'accepted') {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md bg-black dark:bg-white text-white dark:text-black shadow-2xl rounded-lg p-6 z-50 border border-gray-800 dark:border-gray-200 animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 pr-4">
          <h3 className="text-lg font-bold mb-2">🍪 Cookie Notice</h3>
          <p className="text-sm text-gray-300 dark:text-gray-700 leading-relaxed">
            We use cookies to enhance your shopping experience, personalize content, and analyze our traffic. 
            By clicking "Accept", you consent to our use of cookies.
          </p>
        </div>
        <button
          onClick={() => setShow(false)}
          className="text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-black transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={handleAccept}
          className="flex-1 bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 font-semibold py-2.5 rounded-lg transition-colors"
        >
          Accept All Cookies
        </Button>
        <Button 
          onClick={() => setShow(false)}
          variant="outline"
          className="flex-1 border-2 border-gray-700 dark:border-gray-300 text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100 font-semibold py-2.5 rounded-lg transition-colors"
        >
          Decline
        </Button>
      </div>
    </div>
  );
}
