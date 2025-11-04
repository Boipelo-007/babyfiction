"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowRight, ChevronDown, Heart, ShoppingBag, User } from 'lucide-react';
import { fetchJson, getAuthToken } from '@/lib/api';

type Product = { 
  id: string; 
  name: string; 
  price: number; 
  image: string; 
  category?: string; 
  additional_images?: string[];
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const heroImages = [
    '/assets/images/products/Product1.jpg',
    '/assets/images/products/Product2.jpg'
  ];

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res: any = await fetchJson('/api/products/featured?limit=3');
        const list = Array.isArray(res?.products) ? res.products : [];
        const mapped: Product[] = list.map((p: any) => ({
          id: p._id,
          name: p.name,
          price: p.price || 0,
          image: p.thumbnail || (Array.isArray(p.images) ? p.images[0] : ''),
          category: p.category,
          additional_images: p.images || [],
        }));
        if (active) setProducts(mapped);
      } catch {
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <>
    

      <main className="relative bg-white">
        {/* Search Bar */}
        <div className="absolute top-[137px] left-[50px] z-10">
          <div className="relative w-[367px] h-[50px]">
            <input
              type="text"
              placeholder="Search"
              className="w-full h-full bg-[#d9d9d9] border-none rounded-[2px] px-5 pr-[50px] font-[family-name:var(--font-accent)] text-xs text-black/66 tracking-[2px] uppercase placeholder:text-black/66 outline-none"
            />
            <div className="absolute right-[15px] top-1/2 -translate-y-1/2 text-black/66">
              <Search className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative min-h-[800px] pt-[200px] px-[50px]">
          {/* Hero Text */}
          <div className="absolute top-[222px] left-[50px]">
            <h1 className="font-[family-name:var(--font-headers)] text-[48px] leading-[40px] tracking-[2px] uppercase mb-[60px]">
              <span className="block">New</span>
              <span className="block">Collection</span>
            </h1>
            <p className="font-[family-name:var(--font-accent)] text-base tracking-[2px] uppercase">
              <span className="block">Wear Your</span>
              <span className="block">Energy</span>
            </p>
          </div>

          {/* Product Gallery */}
          <div className="absolute top-[257px] right-[50px] flex gap-5">
            <div className="w-[366px] h-[376px] border border-[d7d7d7] overflow-hidden">
              <img
                src={heroImages[currentImageIndex]}
                alt="Product"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-[366px] h-[376px] border border-[d7d7d7] overflow-hidden">
              <img
                src={heroImages[(currentImageIndex + 1) % heroImages.length]}
                alt="Product"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Gallery Navigation */}
          <div className="absolute top-[656px] left-1/2 -translate-x-1/2 flex gap-5">
            <button
              onClick={prevImage}
              className="w-10 h-10 border border-black/40 bg-transparent flex items-center justify-center hover:opacity-70 transition-opacity opacity-66"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="w-10 h-10 border border-black/40 bg-transparent flex items-center justify-center hover:opacity-70 transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Shop Button */}
          <Link
            href="/catalog"
            className="absolute bottom-[40px] left-[50px] bg-[#d9d9d9] w-[265px] h-10 flex items-center justify-between px-5 font-[family-name:var(--font-nav)] text-base text-black hover:opacity-80 transition-opacity"
          >
            <span>Go To Shop</span>
            <div className="w-[47.5px] h-3 flex items-center justify-center rotate-180 scale-y-[-1]">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </section>

        {/* Categories Masonry Section */}
        <section className="mt-[100px] px-[50px]">
          <div className="max-w-[1340px] mx-auto grid grid-cols-4 gap-5">
            {/* Caps - small */}
            <div className="relative h-[230px] overflow-hidden cursor-pointer group">
              <img
                src="/assets/images/banners/caps.jpg"
                alt="Caps"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>

            {/* T-Shirts - tall */}
            <div className="relative row-span-2 h-[616px] overflow-hidden cursor-pointer group">
              <img
                src="/assets/images/banners/tshirts.jpg"
                alt="T-Shirts"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>

            {/* Hoodies - wide and tall */}
            <div className="relative col-span-2 row-span-2 h-[616px] overflow-hidden cursor-pointer group">
              <img
                src="/assets/images/banners/hoodies.jpg"
                alt="Hoodies"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>

            {/* Accessories - medium */}
            <div className="relative h-[372px] overflow-hidden cursor-pointer group">
              <img
                src="/assets/images/banners/accessories.jpg"
                alt="Accessories"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>
          </div>
        </section>

        {/* Collections Section */}
        <section className="mt-[100px] px-[50px]">
          <div className="mb-8">
            <h2 className="font-[family-name:var(--font-headers)] text-[48px] leading-[40px] tracking-[2px] uppercase mb-8">
              <span className="block">XXII</span>
              <span className="block">Collections</span>
              <span className="block">25-26</span>
            </h2>
            <div className="h-px bg-black mb-8" />
            <p className="font-[family-name:var(--font-body)] font-medium text-base uppercase tracking-[2px]">
              (All)
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-3 gap-8 mb-12">
            {loading && <div className="col-span-3 p-6 text-sm">Loading products...</div>}
            {products.map((product, index) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group relative"
              >
                <div className="border border-[d7d7d7] h-[376px] overflow-hidden mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-[34px] h-[34px] bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Heart className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="font-[family-name:var(--font-nav)] text-xs text-black/66 mb-1">
                    {product.category || 'Cotton T Shirt'}
                  </p>
                  <h3 className="font-[family-name:var(--font-nav)] text-sm capitalize mb-2">
                    {product.name}
                  </h3>
                  {product.additional_images && product.additional_images.length > 0 && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-white border-[0.5px] border-neutral-400" />
                      <span className="font-[family-name:var(--font-body)] text-[10px] text-black/66">
                        +{product.additional_images.length}
                      </span>
                    </div>
                  )}
                  <p className="font-[family-name:var(--font-nav)] text-base">
                    R{product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* More Button */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="flex flex-col items-center">
              <p className="font-[family-name:var(--font-body)] text-base text-[8a8a8a] mb-2">
                More
              </p>
              <ChevronDown className="w-4 h-4 text-[8a8a8a]" />
            </div>
            <div className="w-[244px] h-px bg-[8a8a8a]" />
          </div>

          {/* See More Link */}
          <div className="text-right">
            <Link
              href="/catalog"
              className="font-[family-name:var(--font-body)] text-sm text-[5e5e5e] underline hover:opacity-70"
            >
              See More
            </Link>
          </div>
        </section>

        {/* Fashion Approach Section */}
        <section className="mt-[100px] px-[50px] pb-[100px]">
          <h2 className="font-[family-name:var(--font-accent)] text-[48px] leading-[40px] tracking-[2px] uppercase text-center mb-8">
            Our Approach to fashion design
          </h2>
          <p className="font-[family-name:var(--font-body)] text-base text-center max-w-[685px] mx-auto mb-12 tracking-[2px]">
            Step into our gallery — a showcase of bold expression and everyday luxury. Here, streetwear meets artistry, blending clean design with raw attitude. Each piece tells its own story — crafted for movement, confidence, and authenticity. Discover the looks that define the streets and inspire the culture.
          </p>

          {/* Approach Gallery - Staggered Layout */}
          <div className="max-w-[1340px] mx-auto grid grid-cols-4 gap-5">
            {/* Item 1 */}
            <div className="border border-[d7d7d7] h-[389px] overflow-hidden">
              <img
                src="/assets/images/gallery/FashionDesign1.jpg"
                alt="Fashion Design 1"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Item 2 - offset top */}
            <div className="border border-[d7d7d7] h-[419px] mt-[73px] overflow-hidden">
              <img
                src="/assets/images/gallery/FashionDesign3.jpg"
                alt="Fashion Design 2"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Item 3 - starts lower */}
            <div className="border border-[d7d7d7] h-[419px] overflow-hidden">
              <img
                src="/assets/images/gallery/FashionDesign2.jpg"
                alt="Fashion Design 3"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Item 4 - offset down more */}
            <div className="border border-[d7d7d7] h-[389px] mt-[103px] overflow-hidden">
              <img
                src="/assets/images/gallery/FashionDesign4.jpg"
                alt="Fashion Design 4"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}


