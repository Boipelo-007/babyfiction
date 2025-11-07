'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface NewsletterResponse {
  success: boolean;
  message: string;
}

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Only show popup if user hasn't subscribed or dismissed it in this session
    const hasSeenPopup = sessionStorage.getItem('hasSeenNewsletterPopup');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('hasSeenNewsletterPopup', 'true');
      }, 5000); // Show after 5 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data: NewsletterResponse = await response.json();
      
      if (data.success) {
        setStatus('success');
        setMessage('Thank you for subscribing!');
        // Close popup after 2 seconds
        setTimeout(() => setIsOpen(false), 2000);
      } else {
        throw new Error(data.message || 'Subscription failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to subscribe. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl relative overflow-hidden">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-1 text-gray-700 hover:text-gray-900 shadow-md"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left side - Image */}
          <div className="relative h-64 md:h-auto">
            <img
              src="/images/newsletter-promo.jpg"
              alt="Subscribe"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback gradient if image doesn't load
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
              }}
            />
          </div>
          
          {/* Right side - Form */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Subscribe for
              </h2>
              <div className="bg-black text-white px-4 py-2 inline-block mb-2">
                <span className="text-2xl md:text-3xl font-bold">BLACK FRIDAY</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold">
                updates & more.
              </h3>
            </div>
            
            <p className="text-center text-sm text-gray-600 mb-6">
              Stand a chance to be 1 of 20 subscribers to win<br />
              R1000 voucher before Black Friday.
            </p>
          
            {status === 'success' ? (
              <div className="bg-green-50 text-green-800 p-4 rounded-md text-center">
                <p className="font-semibold">{message}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full px-4 py-3 bg-black text-white placeholder-gray-400 border-none rounded-md focus:ring-2 focus:ring-gray-600 focus:outline-none"
                    required
                    disabled={status === 'loading'}
                  />
                </div>
                
                {status === 'error' && (
                  <p className="text-sm text-red-600 text-center">{message}</p>
                )}
                
                <Button
                  type="submit"
                  className="w-full bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-md text-base font-bold uppercase tracking-wide"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Signing up...' : 'SIGN UP'}
                </Button>
                
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 px-6 border-2 border-black text-black rounded-md text-base font-semibold uppercase tracking-wide hover:bg-gray-50 transition-colors"
                >
                  NO, THANKS
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
