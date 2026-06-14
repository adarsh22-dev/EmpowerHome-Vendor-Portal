import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  Smartphone, 
  Laptop, 
  Tv, 
  Watch, 
  Camera, 
  Headphones, 
  Gamepad, 
  Cpu,
  Zap,
  ShieldCheck,
  Truck,
  ArrowRight
} from 'lucide-react';

const categories = [
  {
    id: 'electronics',
    name: 'Electronics',
    icon: <Smartphone className="w-4 h-4" />,
    subcategories: [
      {
        name: 'Mobiles & Tablets',
        items: ['iPhone', 'Samsung Galaxy', 'Google Pixel', 'iPad Pro', 'Android Tablets', 'Accessories']
      },
      {
        name: 'Laptops & Computers',
        items: ['MacBook', 'Gaming Laptops', 'Ultrabooks', 'Desktop PCs', 'Monitors', 'PC Components']
      },
      {
        name: 'Audio & Video',
        items: ['Headphones', 'Bluetooth Speakers', 'Home Theater', 'Smart TVs', 'Cameras', 'Drones']
      }
    ],
    featured: {
      title: 'New Arrival',
      name: 'iPhone 15 Pro',
      image: 'https://picsum.photos/seed/iphone/300/200',
      link: '#'
    }
  },
  {
    id: 'fashion',
    name: 'Fashion',
    icon: <Zap className="w-4 h-4" />,
    subcategories: [
      {
        name: "Men's Wear",
        items: ['T-Shirts', 'Shirts', 'Jeans', 'Jackets', 'Suits', 'Footwear']
      },
      {
        name: "Women's Wear",
        items: ['Dresses', 'Tops', 'Skirts', 'Ethnic Wear', 'Handbags', 'Jewelry']
      },
      {
        name: 'Kids & Baby',
        items: ['Boys Clothing', 'Girls Clothing', 'Baby Essentials', 'Toys', 'School Supplies']
      }
    ],
    featured: {
      title: 'Summer Collection',
      name: 'Linen Essentials',
      image: 'https://picsum.photos/seed/fashion/300/200',
      link: '#'
    }
  },
  {
    id: 'home',
    name: 'Home & Living',
    icon: <Tv className="w-4 h-4" />,
    subcategories: [
      {
        name: 'Furniture',
        items: ['Sofas', 'Beds', 'Dining Tables', 'Wardrobes', 'Office Chairs', 'Storage']
      },
      {
        name: 'Home Decor',
        items: ['Wall Art', 'Lighting', 'Rugs', 'Curtains', 'Vases', 'Clocks']
      },
      {
        name: 'Kitchen',
        items: ['Cookware', 'Appliances', 'Dinnerware', 'Storage', 'Tools', 'Bakeware']
      }
    ],
    featured: {
      title: 'Modern Living',
      name: 'Minimalist Sofa',
      image: 'https://picsum.photos/seed/home/300/200',
      link: '#'
    }
  }
];

const MegaMenu = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-40 hidden lg:block">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-8 h-12">
          <div 
            className="flex items-center gap-2 h-full cursor-pointer group"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="flex flex-col gap-0.5">
              <span className="w-4 h-0.5 bg-black rounded-full" />
              <span className="w-3 h-0.5 bg-black rounded-full" />
              <span className="w-4 h-0.5 bg-black rounded-full" />
            </div>
            <span className="text-sm font-bold uppercase tracking-wider">All Categories</span>
            
            <AnimatePresence>
              {isOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-black/5 flex min-h-[400px]"
                >
                  {/* Sidebar */}
                  <div className="w-64 bg-gray-50 border-r border-black/5 p-4">
                    {categories.map((cat) => (
                      <div 
                        key={cat.id}
                        onMouseEnter={() => setActiveCategory(cat)}
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                          activeCategory.id === cat.id ? 'bg-white shadow-sm text-orange-600' : 'text-gray-600 hover:bg-white/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {cat.icon}
                          <span className="text-sm font-bold">{cat.name}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform ${activeCategory.id === cat.id ? 'translate-x-1' : ''}`} />
                      </div>
                    ))}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-8 grid grid-cols-4 gap-8">
                    {activeCategory.subcategories.map((sub, i) => (
                      <div key={i}>
                        <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">{sub.name}</h4>
                        <ul className="space-y-2">
                          {sub.items.map((item, j) => (
                            <li key={j}>
                              <a href="#" className="text-sm text-gray-500 hover:text-orange-600 transition-colors font-medium">{item}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {/* Featured Card */}
                    <div className="col-span-1 bg-zinc-50 rounded-2xl p-4 border border-black/5 flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 mb-2">{activeCategory.featured.title}</span>
                      <h5 className="font-bold text-gray-900 mb-4">{activeCategory.featured.name}</h5>
                      <div className="aspect-[3/2] rounded-xl overflow-hidden mb-4">
                        <img 
                          src={activeCategory.featured.image} 
                          alt={activeCategory.featured.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <button className="mt-auto flex items-center gap-2 text-xs font-bold text-gray-900 hover:gap-3 transition-all">
                        Shop Now <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <nav className="flex items-center gap-6 h-full">
            {['New Arrivals', 'Best Sellers', 'Daily Deals', 'Flash Sale', 'Brands', 'Support'].map((item) => (
              <a 
                key={item} 
                href="#" 
                className="text-xs font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-widest"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full">
              <Zap className="w-3 h-3" />
              <span>Flash Sale: 20:14:05</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
