"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, Search, User, Menu, X, Heart, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/lib/auth";
import { fetchJson, getAuthToken, setAuthToken } from "@/lib/api";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useCurrentUser();

  const handleLogout = () => {
    try {
      setAuthToken(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('babyfiction_demo_user');
      }
    } catch {}
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop All", path: "/catalog" },
    {
      name: "NEW & BEST",
      path: "/catalog",
      sublinks: [
        { name: "All New Arrivals", path: "/catalog?category=new-arrivals" },
        { name: "Spring | Summer", path: "/catalog?category=spring-summer" },
        { name: "Piano People", path: "/catalog?category=piano-people" },
        { name: "New T-Shirts", path: "/catalog?category=new-t-shirts" },
        { name: "Best Sellers", path: "/catalog?category=best-sellers" },
        { name: "TOP PICKS", path: "/catalog?category=top-picks" },
        { name: "T-Shirts", path: "/catalog?category=t-shirts" },
        { name: "Sunglasses", path: "/catalog?category=sunglasses" },
        { name: "Hats", path: "/catalog?category=hats" },
        { name: "Bags", path: "/catalog?category=bags" },
        { name: "Last of the large", path: "/catalog?category=last-of-large" },
        { name: "All Products", path: "/catalog" },
      ],
    },
    {
      name: "PROMOS",
      path: "/catalog",
      sublinks: [
        { name: "Rocking The Daisies", path: "/catalog?promo=rocking-the-daisies" },
        { name: "Piano People", path: "/catalog?promo=piano-people" },
      ],
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    
    const syncCounts = async () => {
      try {
        const token = getAuthToken();
        if (token) {
          const [cartRes, wishRes]: any = await Promise.all([
            fetchJson('/api/cart/count'),
            fetchJson('/api/wishlist/count')
          ]);
          setCartCount(typeof cartRes?.count === 'number' ? cartRes.count : 0);
          setWishlistCount(typeof wishRes?.count === 'number' ? wishRes.count : 0);
        } else {
          setCartCount(0);
          setWishlistCount(0);
        }
      } catch {
        setCartCount(0);
        setWishlistCount(0);
      }
    };
    
    syncCounts();
    
    const onCartUpdated = () => syncCounts();
    const onWishlistUpdated = () => syncCounts();
    window.addEventListener('bf_cart_updated', onCartUpdated as EventListener);
    window.addEventListener('bf_wishlist_updated', onWishlistUpdated as EventListener);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('bf_cart_updated', onCartUpdated as EventListener);
      window.removeEventListener('bf_wishlist_updated', onWishlistUpdated as EventListener);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white dark:bg-black shadow-sm border-b border-gray-200 dark:border-gray-800" 
          : "bg-white dark:bg-black"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2 overflow-hidden">
          <span className="text-2xl font-bold tracking-tight text-black dark:text-white inline-flex">
            <span className="inline-block transition-all duration-500 group-hover:translate-y-[-100%] group-hover:opacity-0">B</span>
            <span className="inline-block transition-all duration-500 delay-[50ms] group-hover:translate-y-[-100%] group-hover:opacity-0">A</span>
            <span className="inline-block transition-all duration-500 delay-[100ms] group-hover:translate-y-[-100%] group-hover:opacity-0">B</span>
            <span className="inline-block transition-all duration-500 delay-[150ms] group-hover:translate-y-[-100%] group-hover:opacity-0">Y</span>
            <span className="inline-block transition-all duration-500 delay-[200ms] group-hover:translate-y-[-100%] group-hover:opacity-0">&nbsp;</span>
            <span className="inline-block transition-all duration-500 delay-[250ms] group-hover:translate-y-[-100%] group-hover:opacity-0">F</span>
            <span className="inline-block transition-all duration-500 delay-[300ms] group-hover:translate-y-[-100%] group-hover:opacity-0">I</span>
            <span className="inline-block transition-all duration-500 delay-[350ms] group-hover:translate-y-[-100%] group-hover:opacity-0">C</span>
            <span className="inline-block transition-all duration-500 delay-[400ms] group-hover:translate-y-[-100%] group-hover:opacity-0">T</span>
            <span className="inline-block transition-all duration-500 delay-[450ms] group-hover:translate-y-[-100%] group-hover:opacity-0">I</span>
            <span className="inline-block transition-all duration-500 delay-[500ms] group-hover:translate-y-[-100%] group-hover:opacity-0">O</span>
            <span className="inline-block transition-all duration-500 delay-[550ms] group-hover:translate-y-[-100%] group-hover:opacity-0">N</span>
            <span className="inline-block transition-all duration-500 delay-[600ms] group-hover:translate-y-[-100%] group-hover:opacity-0">S</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <div
              key={`${link.path}-${link.name}`}
              className="relative group"
              onMouseEnter={() => link.sublinks && setActiveDropdown(link.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={link.path}
                className={`px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors duration-200 relative flex items-center gap-1.5 rounded ${
                  pathname.startsWith(link.path.split("?")[0]) 
                    ? "text-white bg-black dark:text-black dark:bg-white" 
                    : "text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
                }`}
              >
                {link.name}
                {link.sublinks && <ChevronDown className="h-3.5 w-3.5" />}
              </Link>
              
              {/* Dropdown */}
              {link.sublinks && activeDropdown === link.name && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-black shadow-lg rounded border border-gray-200 dark:border-gray-800 py-2 z-50">
                  {link.sublinks.map((sublink) => (
                    <Link
                      key={sublink.path}
                      href={sublink.path}
                      className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                    >
                      {sublink.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(!searchOpen)}
            className="hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Auth / User display */}
          {!user ? (
            <>
              <Link href="/auth/login" className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
                Login
              </Link>
              <Link href="/auth/signup" className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
                Sign up
              </Link>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              <User className="h-4 w-4" />
              <span>Hello, {user.name || user.email}</span>
              <button onClick={handleLogout} className="underline hover:text-black dark:hover:text-white">Logout</button>
            </div>
          )}
          {user?.role === 'admin' && (
            <Link href="/admin" className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
              Admin
            </Link>
          )}
          {user?.role === 'driver' && (
            <Link href="/driver" className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
              Driver Portal
            </Link>
          )}

          {/* Wishlist */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-gray-100 dark:hover:bg-gray-900"
            asChild
          >
            <Link href="/wishlist" title="Wishlist">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black dark:bg-white text-white dark:text-black text-xs rounded-full h-5 min-w-5 px-1 flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </Button>

          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black dark:bg-white text-white dark:text-black text-xs rounded-full h-5 min-w-5 px-1 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="px-6 pb-4">
          <Input
            placeholder="Search products..."
            className="w-full"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const q = (searchText || '').trim();
                if (q) router.push(`/catalog?query=${encodeURIComponent(q)}`);
                setSearchOpen(false);
              }
            }}
          />
        </div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 shadow-lg">
          <div className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <div key={link.name}>
                {link.sublinks ? (
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {link.name}
                      </span>
                      <ChevronDown className="h-5 w-5" />
                    </div>
                    <div className="pl-4 mt-2 flex flex-col gap-2">
                      {link.sublinks.map((sublink) => (
                        <Link
                          key={sublink.name}
                          href={sublink.path}
                          onClick={() => setMobileOpen(false)}
                          className="text-base font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                        >
                          {sublink.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={link.path || '#'}
                    onClick={() => setMobileOpen(false)}
                    className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-black dark:hover:text-white"
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}

            <div className="mt-2 border-t border-gray-200 dark:border-gray-800 pt-4 flex flex-col gap-3">
              {!user ? (
                <>
                  <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
                    Login
                  </Link>
                  <Link href="/auth/signup" onClick={() => setMobileOpen(false)} className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
                    Sign up
                  </Link>
                </>
              ) : (
                <div className="flex items-center justify-between text-lg font-medium text-gray-700 dark:text-gray-300">
                  <span>Hello, {user.name || user.email}</span>
                  <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="ml-4 underline hover:text-black dark:hover:text-white">Logout</button>
                </div>
              )}
              {user?.role === 'admin' && (
                <Link href="/admin" onClick={() => setMobileOpen(false)} className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
                  Admin
                </Link>
              )}
              {user?.role === 'driver' && (
                <Link href="/driver" onClick={() => setMobileOpen(false)} className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
                  Driver Portal
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;