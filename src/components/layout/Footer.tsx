import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const FOOTER_LINKS = {
  "SHOP": [
    { label: "All Products", to: "/products" },
    { label: "Featured Collections", to: "/" },
    { label: "New Arrivals", to: "/" },
    { label: "Discounts & Offers", to: "/" },
  ],
  "SUPPORT": [
    { label: "Your Account", to: "/profile" },
    { label: "Order Tracking", to: "/orders" },
    { label: "Shipping Policy", to: "/" },
    { label: "Returns & Exchanges", to: "/" },
    { label: "Help Center", to: "/" },
  ],
  "COMPANY": [
    { label: "About FutureCart", to: "/" },
    { label: "Our Story", to: "/" },
    { label: "Careers", to: "/" },
    { label: "Sustainability", to: "/" },
  ],
  "LEGAL": [
    { label: "Terms of Service", to: "/" },
    { label: "Privacy Policy", to: "/" },
    { label: "Cookie Policy", to: "/" },
  ],
};

const Footer = () => {
  return (
    <footer className="mt-20 bg-white border-t border-gray-100 font-sans">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-y-12 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          
          {/* Brand Identity Column */}
          <div className="col-span-2 lg:col-span-1 pr-8">
            {/* Logo and Text PNG in a single line */}
            <Link to="/" className="flex items-center gap-2 mb-6 hover:opacity-90 transition-opacity">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="h-10 w-10 object-contain"
              />
              <img 
                src="/text.png" 
                alt="FutureCart" 
                className="h-7 w-auto object-contain" 
              />
            </Link>

            <p className="text-[13px] leading-relaxed text-gray-500 mb-6">
              Elevating your shopping experience with curated collections and seamless delivery. 
            </p>
            <div className="flex gap-4 text-gray-400">
              <Instagram size={18} className="hover:text-black cursor-pointer transition-colors" />
              <Twitter size={18} className="hover:text-black cursor-pointer transition-colors" />
              <Facebook size={18} className="hover:text-black cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title} className="flex flex-col">
              <h4 className="mb-5 text-[12px] font-bold text-black uppercase tracking-[0.1em]">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-[13px] text-gray-500 transition-colors hover:text-black"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-20 border-t border-gray-50 pt-10 flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
            <p className="text-[12px] font-medium text-gray-600">
              © {new Date().getFullYear()} FutureCart. All Rights Reserved.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <p className="text-[13px] font-semibold text-black tracking-wide">
              Developed by <span className="text-blue-600">Ambar Ubale</span>
            </p>
            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">
              Full Stack Developer
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;