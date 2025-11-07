"use client";
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Heart, Loader2, AlertCircle, Search, Filter, X } from 'lucide-react';
import { fetchJson, getAuthToken } from '@/lib/api';
import { useCurrentUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type Product = {
  _id: string;
  name: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  thumbnail?: string;
  images?: string[];
  category?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  countInStock?: number;
  isOnSale?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

function CatalogContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    onSale: false,
    sortBy: 'newest',
  });
  
  const { user } = useCurrentUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || '';

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        limit: '24',
        fields: 'name,price,originalPrice,thumbnail,images,category,brand,rating,reviewCount,countInStock,isOnSale,isNewArrival,isFeatured,createdAt',
      });
      
      // Apply filters
      if (filters.category) params.set('category', filters.category);
      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
      if (filters.inStock) params.set('inStock', 'true');
      if (searchQuery) params.set('search', searchQuery);
      
      // Apply sorting
      switch (filters.sortBy) {
        case 'price-low':
          params.set('sort', 'price');
          break;
        case 'price-high':
          params.set('sort', '-price');
          break;
        case 'newest':
          params.set('sort', '-createdAt');
          break;
        case 'popular':
          params.set('sort', '-rating');
          break;
      }
      
      const res: any = await fetchJson(`/api/products?${params.toString()}`);
      let list: Product[] = [];
      
      // Handle different response structures
      if (Array.isArray(res)) {
        list = res;
      } else if (res && typeof res === 'object') {
        list = res.data || res.products || [];
      }
      
      setProducts(Array.isArray(list) ? list : []);
      
      // Load wishlist if authenticated
      const token = getAuthToken();
      if (token) {
        try {
          const wishRes: any = await fetchJson('/api/wishlist');
          const items = wishRes?.wishlist?.items || [];
          const ids = new Set<string>(
            items.map((it: any) => it?.product?._id || it?.product)
              .filter((id: any): id is string => typeof id === 'string')
          );
          setWishlistIds(ids);
        } catch (wishError) {
          console.error('Failed to load wishlist:', wishError);
        }
      }
    } catch (e: any) {
      console.error('Error fetching products:', e);
      setError(e.message || 'Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    let active = true;
    
    const timer = setTimeout(() => {
      if (active) {
        fetchProducts();
      }
    }, 300); // Debounce search
    
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [filters, searchQuery]);
  
  useEffect(() => {
    if (category) {
      setFilters(prev => ({ ...prev, category }));
    }
  }, [category]);

  const toggleWishlist = async (productId: string) => {
    const token = getAuthToken();
    if (!token) {
      router.push('/auth/login');
      return;
    }
    const isInWishlist = wishlistIds.has(productId);
    try {
      if (isInWishlist) {
        await fetchJson(`/api/wishlist/items/${productId}`, { method: 'DELETE' });
        setWishlistIds(prev => { const next = new Set(prev); next.delete(productId); return next; });
      } else {
        await fetchJson('/api/wishlist/items', { method: 'POST', body: JSON.stringify({ product: productId }) });
        setWishlistIds(prev => new Set(prev).add(productId));
      }
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('bf_wishlist_updated'));
    } catch {}
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 'All Products'}</h1>
        <div className="flex gap-3">
          <Link className="rounded border px-3 py-2" href="/">Back to Home</Link>
          {!user ? (
            <Link className="rounded bg-black px-3 py-2 text-white" href="/auth/login">Login</Link>
          ) : (
            <span className="rounded bg-emerald-600 px-3 py-2 text-white">Hello, {user.name || 'you'}</span>
          )}
        </div>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        Guests can freely browse Babyfiction products. To checkout, comment, or rate items, please login or create an account.
      </p>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            </div>
          </div>
          
          {/* Active filters */}
          <div className="flex flex-wrap gap-2">
            {filters.category && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.category}
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, category: '' }))}
                  className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.minPrice && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Min: ${filters.minPrice}
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, minPrice: '' }))}
                  className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.maxPrice && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Max: ${filters.maxPrice}
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, maxPrice: '' }))}
                  className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.inStock && (
              <Badge variant="secondary" className="flex items-center gap-1">
                In Stock
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, inStock: false }))}
                  className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>
        
        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product._id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <Link href={`/product/${product._id}`} className="block">
                <div className="aspect-square bg-gray-50 relative">
                  {product.images?.[0] || product.thumbnail ? (
                    <img
                      src={product.images?.[0] || product.thumbnail}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                      <span>No image available</span>
                    </div>
                  )}
                  
                  {/* Product Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isNewArrival && (
                      <Badge className="bg-green-500 hover:bg-green-600">New</Badge>
                    )}
                    {product.isOnSale && (
                      <Badge variant="destructive">Sale</Badge>
                    )}
                    {product.countInStock === 0 && (
                      <Badge variant="outline" className="bg-white/90 text-gray-800">Out of Stock</Badge>
                    )}
                  </div>
                  
                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      try {
                        const token = getAuthToken();
                        if (!token) {
                          router.push('/auth/login');
                          return;
                        }
                        
                        const isInWishlist = wishlistIds.has(product._id);
                        const method = isInWishlist ? 'DELETE' : 'POST';
                        
                        await fetchJson(`/api/wishlist/${product._id}`, {
                          method,
                          headers: {
                            'Content-Type': 'application/json',
                          },
                        });
                        
                        setWishlistIds(prev => {
                          const newSet = new Set(prev);
                          if (isInWishlist) {
                            newSet.delete(product._id);
                          } else {
                            newSet.add(product._id);
                          }
                          return newSet;
                        });
                      } catch (error) {
                        console.error('Error updating wishlist:', error);
                      }
                    }}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-sm"
                    aria-label={wishlistIds.has(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart 
                      className={`h-5 w-5 ${wishlistIds.has(product._id) ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} 
                    />
                  </button>
                </div>
                
                <CardHeader className="p-4">
                  <h3 className="font-medium text-gray-900 line-clamp-2 h-12">{product.name}</h3>
                  {product.brand && (
                    <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
                  )}
                  {product.rating && product.reviewCount ? (
                    <div className="flex items-center gap-1 mt-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`h-4 w-4 ${star <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({product.reviewCount})</span>
                    </div>
                  ) : null}
                </CardHeader>
                
                <CardFooter className="p-4 pt-0 flex items-center justify-between">
                  <div>
                    {product.isOnSale && product.originalPrice ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-semibold text-gray-900">
                          ${product.price?.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                        <span className="text-xs font-medium text-red-600">
                          {Math.round((1 - (product.price || 0) / product.originalPrice) * 100)}% OFF
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-semibold text-gray-900">
                        ${product.price?.toFixed(2) || 'N/A'}
                      </span>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`${product.countInStock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={product.countInStock === 0}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // TODO: Add to cart functionality
                    }}
                  >
                    {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="mt-10 flex justify-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={true}>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="font-medium">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
        <h2 className="text-lg font-semibold">Checkout</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          You must be logged in to proceed to checkout.
        </p>
        <div className="mt-3">
          <Link
            href={user ? '/cart' : '/auth/login'}
            className={`rounded px-4 py-2 ${user ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}
          >
            {user ? 'Go to Cart' : 'Login to checkout'}
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="text-center text-sm text-muted-foreground">Loading catalog...</div>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}