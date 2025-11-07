"use client";
import { ReactNode, useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import HelpBot from "./HelpBot";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface LayoutProps {
  children: ReactNode;
}

// Cookie Consent Component
const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <Card className="bg-white shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Click OK to accept cookies.
            </p>
            <Button onClick={handleAccept} size="sm">
              OK
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Newsletter Popup Component
const NewsletterPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const newsletterConsent = localStorage.getItem('newsletterConsent');
    const timer = setTimeout(() => {
      if (!newsletterConsent) {
        setIsVisible(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Successfully subscribed to newsletter!');
        localStorage.setItem('newsletterConsent', 'subscribed');
        setTimeout(() => setIsVisible(false), 2000);
      } else {
        setMessage(data.message || 'Subscription failed. Please try again.');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Subscribe to Our Newsletter</CardTitle>
          <CardDescription>
            Subscribe to our newsletter for exclusive offers and product updates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubscribe} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {message && (
              <Badge variant={message.includes('Successfully') ? 'default' : 'destructive'}>
                {message}
              </Badge>
            )}
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsVisible(false)}
                disabled={isSubmitting}
              >
                Later
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <HelpBot />
      <NewsletterPopup />
      <CookieConsentBanner />
    </div>
  );
};

export default Layout;
