export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  subcategories: string[];
}

export const categories: Category[] = [
  {
    id: "electronics",
    name: "Electronics",
    icon: "Monitor",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop",
    subcategories: ["Laptops", "Cameras", "Headphones", "Speakers", "Smart Watches", "Tablets", "Monitors", "Printers"],
  },
  {
    id: "mobiles",
    name: "Mobiles",
    icon: "Smartphone",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop",
    subcategories: ["Smartphones", "Feature Phones", "Mobile Accessories", "Cases & Covers", "Screen Guards", "Power Banks", "Chargers"],
  },
  {
    id: "fashion-men",
    name: "Fashion Men",
    icon: "Shirt",
    image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=200&h=200&fit=crop",
    subcategories: ["T-Shirts", "Shirts", "Jeans", "Trousers", "Jackets", "Shoes", "Watches", "Sunglasses"],
  },
  {
    id: "fashion-women",
    name: "Fashion Women",
    icon: "ShoppingBag",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=200&fit=crop",
    subcategories: ["Dresses", "Tops", "Sarees", "Kurtas", "Jeans", "Handbags", "Jewellery", "Footwear"],
  },
  {
    id: "home-furniture",
    name: "Home & Furniture",
    icon: "Sofa",
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=200&h=200&fit=crop",
    subcategories: ["Sofas", "Beds", "Wardrobes", "Dining Tables", "TV Units", "Curtains", "Cushions", "Lamps"],
  },
  {
    id: "appliances",
    name: "Appliances",
    icon: "Refrigerator",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&h=200&fit=crop",
    subcategories: ["Washing Machines", "Refrigerators", "Air Conditioners", "Microwaves", "Mixers", "Iron", "Vacuum Cleaners"],
  },
  {
    id: "beauty",
    name: "Beauty & Health",
    icon: "Sparkles",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop",
    subcategories: ["Skincare", "Haircare", "Makeup", "Fragrances", "Bath & Body", "Health Devices", "Supplements"],
  },
  {
    id: "sports",
    name: "Sports & Fitness",
    icon: "Dumbbell",
    image: "https://images.unsplash.com/photo-1461896836934-bd45ba3e7051?w=200&h=200&fit=crop",
    subcategories: ["Cricket", "Football", "Gym Equipment", "Yoga", "Running Shoes", "Cycling", "Swimming"],
  },
  {
    id: "books",
    name: "Books",
    icon: "BookOpen",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&h=200&fit=crop",
    subcategories: ["Fiction", "Non-Fiction", "Academic", "Comics", "Self-Help", "Children", "Competitive Exams"],
  },
  {
    id: "toys",
    name: "Toys & Baby",
    icon: "Baby",
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=200&h=200&fit=crop",
    subcategories: ["Action Figures", "Board Games", "Dolls", "Educational Toys", "Baby Care", "Strollers", "Diapers"],
  },
];

export const getBrands = (categoryId: string): string[] => {
  const brandMap: Record<string, string[]> = {
    electronics: ["Samsung", "Sony", "LG", "Dell", "HP", "Lenovo", "Asus", "Acer", "Apple", "Bose", "JBL", "Philips"],
    mobiles: ["Samsung", "Apple", "OnePlus", "Xiaomi", "Realme", "Oppo", "Vivo", "Nothing", "Google", "Motorola", "Nokia"],
    "fashion-men": ["Nike", "Adidas", "Puma", "Levi's", "H&M", "Zara", "US Polo", "Allen Solly", "Peter England", "Van Heusen"],
    "fashion-women": ["Zara", "H&M", "Forever 21", "Biba", "W", "FabIndia", "Vero Moda", "Only", "AND", "Global Desi"],
    "home-furniture": ["IKEA", "Nilkamal", "Urban Ladder", "Godrej", "Pepperfry", "HomeTown", "Durian", "Sleepwell"],
    appliances: ["Samsung", "LG", "Whirlpool", "Bosch", "Haier", "IFB", "Panasonic", "Godrej", "Voltas", "Daikin"],
    beauty: ["Lakme", "Maybelline", "L'Oreal", "Neutrogena", "Nivea", "Biotique", "Himalaya", "Dove", "Garnier", "Olay"],
    sports: ["Nike", "Adidas", "Puma", "Reebok", "Under Armour", "Yonex", "Wilson", "Cosco", "Nivia", "SG"],
    books: ["Penguin", "HarperCollins", "Rupa", "Bloomsbury", "Oxford", "Pearson", "McGraw-Hill", "Arihant", "S Chand"],
    toys: ["Lego", "Hasbro", "Fisher-Price", "Hot Wheels", "Barbie", "Funskool", "Nerf", "Play-Doh", "Disney"],
  };
  return brandMap[categoryId] || ["Brand A", "Brand B", "Brand C"];
};
