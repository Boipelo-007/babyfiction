import 'dotenv/config';
import connectDB from '../config/database.js';
import Product from '../models/Product.js';

const streetwearProducts = [
  // T-Shirts
  {
    name: "Oversized Graphic Tee - Black",
    description: "Premium oversized fit graphic t-shirt with bold streetwear design. Made from 100% cotton for ultimate comfort.",
    price: 450,
    compareAtPrice: 650,
    category: "t-shirts",
    subcategory: "graphic-tees",
    brand: "Baby Fiction",
    SKU: "BF-TSH-001",
    stock: 50,
    images: ["/images/products/tshirt-black-graphic.jpg"],
    thumbnail: "/images/products/tshirt-black-graphic-thumb.jpg",
    tags: ["streetwear", "oversized", "graphic", "new-arrivals", "best-sellers"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black"],
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Piano People Signature Tee",
    description: "Exclusive Piano People collection tee with unique artistic design. Limited edition streetwear piece.",
    price: 550,
    compareAtPrice: 750,
    category: "t-shirts",
    subcategory: "piano-people",
    brand: "Piano People",
    SKU: "PP-TSH-001",
    stock: 30,
    images: ["/images/products/piano-people-tee.jpg"],
    thumbnail: "/images/products/piano-people-tee-thumb.jpg",
    tags: ["piano-people", "limited-edition", "streetwear", "new-arrivals"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black"],
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Vintage Wash Oversized Tee",
    description: "Relaxed fit vintage wash t-shirt. Perfect for layering and everyday streetwear style.",
    price: 420,
    compareAtPrice: 600,
    category: "t-shirts",
    subcategory: "spring-summer",
    brand: "Baby Fiction",
    SKU: "BF-TSH-002",
    stock: 45,
    images: ["/images/products/vintage-wash-tee.jpg"],
    thumbnail: "/images/products/vintage-wash-tee-thumb.jpg",
    tags: ["vintage", "oversized", "spring-summer", "casual"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Grey", "Beige", "Black"],
    isActive: true,
  },
  
  // Hoodies & Sweatshirts
  {
    name: "Rocking The Daisies Hoodie",
    description: "Official Rocking The Daisies festival hoodie. Premium heavyweight cotton blend with embroidered logo.",
    price: 850,
    compareAtPrice: 1200,
    category: "hoodies",
    subcategory: "promos",
    brand: "Rocking The Daisies",
    SKU: "RTD-HOOD-001",
    stock: 25,
    images: ["/images/products/rtd-hoodie.jpg"],
    thumbnail: "/images/products/rtd-hoodie-thumb.jpg",
    tags: ["rocking-the-daisies", "festival", "hoodie", "limited-edition"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Navy"],
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Oversized Pullover Hoodie",
    description: "Ultra-comfortable oversized hoodie with dropped shoulders. Perfect for streetwear layering.",
    price: 750,
    compareAtPrice: 950,
    category: "hoodies",
    subcategory: "new-arrivals",
    brand: "Baby Fiction",
    SKU: "BF-HOOD-001",
    stock: 40,
    images: ["/images/products/oversized-hoodie.jpg"],
    thumbnail: "/images/products/oversized-hoodie-thumb.jpg",
    tags: ["oversized", "hoodie", "streetwear", "new-arrivals", "best-sellers"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Grey", "Cream"],
    isFeatured: true,
    isActive: true,
  },
  
  // Accessories
  {
    name: "Retro Sunglasses - Black Frame",
    description: "Classic retro-style sunglasses with UV protection. Essential streetwear accessory.",
    price: 350,
    compareAtPrice: 500,
    category: "sunglasses",
    subcategory: "top-picks",
    brand: "Baby Fiction",
    SKU: "BF-SUN-001",
    stock: 60,
    images: ["/images/products/retro-sunglasses.jpg"],
    thumbnail: "/images/products/retro-sunglasses-thumb.jpg",
    tags: ["sunglasses", "accessories", "retro", "top-picks"],
    colors: ["Black", "Tortoise"],
    isActive: true,
  },
  {
    name: "Streetwear Bucket Hat",
    description: "Classic bucket hat with embroidered logo. One size fits most.",
    price: 320,
    compareAtPrice: 450,
    category: "hats",
    subcategory: "top-picks",
    brand: "Baby Fiction",
    SKU: "BF-HAT-001",
    stock: 55,
    images: ["/images/products/bucket-hat.jpg"],
    thumbnail: "/images/products/bucket-hat-thumb.jpg",
    tags: ["hat", "bucket-hat", "accessories", "streetwear"],
    colors: ["Black", "Khaki", "Navy"],
    isActive: true,
  },
  {
    name: "Embroidered Dad Cap",
    description: "Adjustable dad cap with subtle embroidered branding. Perfect everyday accessory.",
    price: 280,
    compareAtPrice: 400,
    category: "hats",
    subcategory: "new-arrivals",
    brand: "Baby Fiction",
    SKU: "BF-HAT-002",
    stock: 70,
    images: ["/images/products/dad-cap.jpg"],
    thumbnail: "/images/products/dad-cap-thumb.jpg",
    tags: ["hat", "cap", "accessories", "new-arrivals"],
    colors: ["Black", "White", "Navy", "Olive"],
    isActive: true,
  },
  
  // Bags
  {
    name: "Canvas Tote Bag - Large",
    description: "Spacious canvas tote bag with reinforced handles. Perfect for daily use.",
    price: 380,
    compareAtPrice: 550,
    category: "bags",
    subcategory: "top-picks",
    brand: "Baby Fiction",
    SKU: "BF-BAG-001",
    stock: 45,
    images: ["/images/products/canvas-tote.jpg"],
    thumbnail: "/images/products/canvas-tote-thumb.jpg",
    tags: ["bag", "tote", "canvas", "accessories"],
    colors: ["Natural", "Black"],
    isActive: true,
  },
  {
    name: "Mini Crossbody Bag",
    description: "Compact crossbody bag with adjustable strap. Perfect for essentials.",
    price: 450,
    compareAtPrice: 650,
    category: "bags",
    subcategory: "new-arrivals",
    brand: "Baby Fiction",
    SKU: "BF-BAG-002",
    stock: 35,
    images: ["/images/products/crossbody-bag.jpg"],
    thumbnail: "/images/products/crossbody-bag-thumb.jpg",
    tags: ["bag", "crossbody", "accessories", "new-arrivals"],
    colors: ["Black", "Brown"],
    isActive: true,
  },
  
  // Pants & Bottoms
  {
    name: "Cargo Pants - Black",
    description: "Relaxed fit cargo pants with multiple pockets. Essential streetwear bottom.",
    price: 680,
    compareAtPrice: 900,
    category: "pants",
    subcategory: "new-arrivals",
    brand: "Baby Fiction",
    SKU: "BF-PNT-001",
    stock: 40,
    images: ["/images/products/cargo-pants.jpg"],
    thumbnail: "/images/products/cargo-pants-thumb.jpg",
    tags: ["pants", "cargo", "streetwear", "new-arrivals"],
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Black", "Olive", "Khaki"],
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Wide Leg Jeans",
    description: "Vintage-inspired wide leg jeans. Comfortable fit with modern streetwear aesthetic.",
    price: 750,
    compareAtPrice: 1000,
    category: "pants",
    subcategory: "best-sellers",
    brand: "Baby Fiction",
    SKU: "BF-PNT-002",
    stock: 35,
    images: ["/images/products/wide-leg-jeans.jpg"],
    thumbnail: "/images/products/wide-leg-jeans-thumb.jpg",
    tags: ["jeans", "wide-leg", "streetwear", "best-sellers"],
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Light Wash", "Dark Wash"],
    isFeatured: true,
    isActive: true,
  },
  
  // Jackets
  {
    name: "Denim Jacket - Oversized",
    description: "Classic oversized denim jacket. Perfect layering piece for any season.",
    price: 950,
    compareAtPrice: 1300,
    category: "jackets",
    subcategory: "new-arrivals",
    brand: "Baby Fiction",
    SKU: "BF-JKT-001",
    stock: 25,
    images: ["/images/products/denim-jacket.jpg"],
    thumbnail: "/images/products/denim-jacket-thumb.jpg",
    tags: ["jacket", "denim", "oversized", "new-arrivals", "best-sellers"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Light Blue", "Black"],
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Windbreaker Jacket",
    description: "Lightweight windbreaker with hood. Perfect for unpredictable weather.",
    price: 850,
    compareAtPrice: 1100,
    category: "jackets",
    subcategory: "spring-summer",
    brand: "Baby Fiction",
    SKU: "BF-JKT-002",
    stock: 30,
    images: ["/images/products/windbreaker.jpg"],
    thumbnail: "/images/products/windbreaker-thumb.jpg",
    tags: ["jacket", "windbreaker", "spring-summer", "lightweight"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Navy", "Olive"],
    isActive: true,
  },
  
  // Last of the Large Collection
  {
    name: "Last of the Large - Graphic Hoodie",
    description: "Exclusive 'Last of the Large' collection hoodie. Limited quantities available.",
    price: 880,
    compareAtPrice: 1200,
    category: "hoodies",
    subcategory: "last-of-the-large",
    brand: "Baby Fiction",
    SKU: "LOTL-HOOD-001",
    stock: 15,
    images: ["/images/products/lotl-hoodie.jpg"],
    thumbnail: "/images/products/lotl-hoodie-thumb.jpg",
    tags: ["last-of-the-large", "hoodie", "limited-edition", "graphic"],
    sizes: ["L", "XL", "XXL"],
    colors: ["Black", "Grey"],
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Last of the Large - Oversized Tee",
    description: "Final pieces from our Last of the Large collection. Oversized fit, premium quality.",
    price: 480,
    compareAtPrice: 650,
    category: "t-shirts",
    subcategory: "last-of-the-large",
    brand: "Baby Fiction",
    SKU: "LOTL-TSH-001",
    stock: 20,
    images: ["/images/products/lotl-tee.jpg"],
    thumbnail: "/images/products/lotl-tee-thumb.jpg",
    tags: ["last-of-the-large", "oversized", "t-shirt", "limited-edition"],
    sizes: ["L", "XL", "XXL"],
    colors: ["Black", "White"],
    isActive: true,
  },
];

async function seedProducts() {
  try {
    console.log('🌱 Connecting to database...');
    await connectDB();
    
    console.log('🗑️  Clearing existing products...');
    await Product.deleteMany({});
    
    console.log('📦 Adding streetwear products...');
    const products = await Product.insertMany(streetwearProducts);
    
    console.log(`✅ Successfully added ${products.length} products!`);
    console.log('\nProduct Categories:');
    console.log('- T-Shirts: 5');
    console.log('- Hoodies: 3');
    console.log('- Accessories (Sunglasses, Hats): 3');
    console.log('- Bags: 2');
    console.log('- Pants: 2');
    console.log('- Jackets: 2');
    console.log('\nTotal: 17 products');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();
