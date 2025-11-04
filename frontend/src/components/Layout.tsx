import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import HelpBot from "./HelpBot";
import NewsletterPopup from "./ui/alert";
import CookieConsent from "./ui/badge";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <HelpBot />
      <NewsletterPopup />
      <CookieConsent />
    </div>
  );
};

export default Layout;
