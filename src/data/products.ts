import { categories, getBrands } from "./categories";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  brand: string;
  category: string;
  subcategory: string;
  specs: Record<string, string>;
  highlights: string[];
  inStock: boolean;
}

const productImages: Record<string, string[]> = {
  electronics: [
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=400&h=400&fit=crop",
  ],
  mobiles: [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1580910051074-3eb694886f5b?w=400&h=400&fit=crop",
  ],
  "fashion-men": [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
  ],
  "fashion-women": [
    "https://images.unsplash.com/photo-1434389677669-e08b4cda3a20?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop",
  ],
  "home-furniture": [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&h=400&fit=crop",
  ],
  appliances: [
    "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop",
  ],
  beauty: [
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop",
  ],
  sports: [
    "https://images.unsplash.com/photo-1461896836934-bd45ba3e7051?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400&h=400&fit=crop",
  ],
  books: [
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400&h=400&fit=crop",
  ],
  toys: [
    "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=400&h=400&fit=crop",
  ],
};

const productNamePrefixes: Record<string, string[]> = {
  electronics: ["Pro", "Ultra", "Elite", "Max", "Prime", "Neo", "Quantum", "Stellar", "Fusion", "Apex"],
  mobiles: ["Galaxy", "Pixel", "Nova", "Spark", "Edge", "Pro", "Max", "Lite", "Ultra", "Plus"],
  "fashion-men": ["Classic", "Slim Fit", "Regular", "Comfort", "Premium", "Urban", "Street", "Elite", "Heritage", "Modern"],
  "fashion-women": ["Elegant", "Chic", "Trendy", "Classic", "Bohemian", "Royal", "Grace", "Bloom", "Radiance", "Luxe"],
  "home-furniture": ["Royal", "Comfort", "Modern", "Classic", "Premium", "Elite", "Urban", "Heritage", "Nordic", "Zen"],
  appliances: ["Smart", "Eco", "Pro", "Ultra", "Max", "Elite", "Prime", "Power", "Turbo", "Advanced"],
  beauty: ["Glow", "Radiance", "Pure", "Natural", "Fresh", "Luxe", "Bloom", "Silk", "Crystal", "Velvet"],
  sports: ["Pro", "Elite", "Champion", "Victory", "Power", "Speed", "Endurance", "Flex", "Impact", "Storm"],
  books: ["The Art of", "Mastering", "Complete Guide to", "Introduction to", "Advanced", "Essential", "Ultimate", "Practical", "Modern", "Classic"],
  toys: ["Super", "Magic", "Wonder", "Fun", "Happy", "Creative", "Adventure", "Rainbow", "Star", "Power"],
};

const productNameSuffixes: Record<string, string[]> = {
  electronics: ["Laptop", "Headphones", "Speaker", "Camera", "Smartwatch", "Tablet", "Monitor", "Keyboard", "Mouse", "Webcam"],
  mobiles: ["Smartphone", "Phone", "Mobile", "Handset", "Device"],
  "fashion-men": ["T-Shirt", "Shirt", "Jeans", "Trousers", "Jacket", "Sneakers", "Watch", "Polo", "Shorts", "Blazer"],
  "fashion-women": ["Dress", "Top", "Saree", "Kurta", "Handbag", "Earrings", "Sandals", "Scarf", "Skirt", "Blouse"],
  "home-furniture": ["Sofa", "Bed", "Table", "Chair", "Wardrobe", "Shelf", "Lamp", "Rug", "Curtain", "Cushion"],
  appliances: ["Washing Machine", "Refrigerator", "AC", "Microwave", "Mixer Grinder", "Iron", "Vacuum", "Water Purifier", "Oven", "Heater"],
  beauty: ["Face Cream", "Shampoo", "Lipstick", "Foundation", "Serum", "Moisturizer", "Sunscreen", "Perfume", "Hair Oil", "Face Wash"],
  sports: ["Cricket Bat", "Football", "Shoes", "Yoga Mat", "Dumbbells", "Resistance Band", "Gloves", "Jersey", "Track Pants", "Water Bottle"],
  books: ["Programming", "History", "Science", "Philosophy", "Fiction", "Business", "Cooking", "Travel", "Art", "Mathematics"],
  toys: ["Building Set", "Puzzle", "Action Figure", "Board Game", "Doll", "Car Set", "Art Kit", "Robot", "Plush Toy", "Science Kit"],
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function generateProducts(): Product[] {
  const products: Product[] = [];
  const rand = seededRandom(42);
  let id = 1;

  for (const category of categories) {
    const brands = getBrands(category.id);
    const images = productImages[category.id] || productImages.electronics;
    const prefixes = productNamePrefixes[category.id] || productNamePrefixes.electronics;
    const suffixes = productNameSuffixes[category.id] || productNameSuffixes.electronics;
    const productsPerCategory = category.id === "electronics" || category.id === "mobiles" ? 120 : 100;

    for (let i = 0; i < productsPerCategory; i++) {
      const prefix = prefixes[Math.floor(rand() * prefixes.length)];
      const suffix = suffixes[Math.floor(rand() * suffixes.length)];
      const brand = brands[Math.floor(rand() * brands.length)];
      const subcategory = category.subcategories[Math.floor(rand() * category.subcategories.length)];
      const originalPrice = Math.floor(rand() * 50000) + 199;
      const discountPercent = Math.floor(rand() * 70) + 5;
      const price = Math.floor(originalPrice * (1 - discountPercent / 100));
      const rating = Math.round((rand() * 2 + 3) * 10) / 10;
      const reviewsCount = Math.floor(rand() * 50000) + 10;
      const imageIndex = Math.floor(rand() * images.length);

      products.push({
        id: `prod-${id}`,
        name: `${brand} ${prefix} ${suffix} ${Math.floor(rand() * 900) + 100}`,
        description: `${brand} ${prefix} ${suffix} - High quality ${subcategory.toLowerCase()} with premium features. Perfect for everyday use. Comes with manufacturer warranty and free shipping on orders above ₹499.`,
        price,
        originalPrice,
        discount: discountPercent,
        rating: Math.min(rating, 5),
        reviewsCount,
        image: images[imageIndex],
        images: images,
        brand,
        category: category.id,
        subcategory,
        specs: {
          Brand: brand,
          Category: category.name,
          Type: subcategory,
          "Model Number": `${prefix.substring(0, 2).toUpperCase()}${Math.floor(rand() * 9000) + 1000}`,
          Color: ["Black", "White", "Blue", "Red", "Silver", "Gold", "Green"][Math.floor(rand() * 7)],
          Warranty: `${Math.floor(rand() * 2) + 1} Year`,
          "Country of Origin": ["India", "China", "Japan", "USA", "Germany", "South Korea"][Math.floor(rand() * 6)],
        },
        highlights: [
          `Premium ${subcategory} by ${brand}`,
          `${discountPercent}% off on MRP`,
          "Free delivery available",
          `${Math.floor(rand() * 2) + 1} year warranty`,
          "Easy returns within 7 days",
        ],
        inStock: rand() > 0.1,
      });
      id++;
    }
  }

  return products;
}

export const allProducts = generateProducts();

export const getProductById = (id: string): Product | undefined =>
  allProducts.find((p) => p.id === id);

export const getProductsByCategory = (categoryId: string): Product[] =>
  allProducts.filter((p) => p.category === categoryId);

export const searchProducts = (query: string): Product[] => {
  const q = query.toLowerCase();
  return allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
};

export const getDealsOfTheDay = (): Product[] =>
  allProducts.filter((p) => p.discount >= 50).slice(0, 20);

export const getTopOffers = (): Product[] =>
  allProducts.filter((p) => p.rating >= 4.5).slice(0, 20);

export const getTrendingProducts = (): Product[] =>
  allProducts.filter((p) => p.reviewsCount > 10000).slice(0, 20);
