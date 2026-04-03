import { Link } from "react-router-dom";

const footerLinks = {
  "GET TO KNOW US": [
    { label: "Careers", to: "/" },
    { label: "Blog", to: "/" },
    { label: "About FutureCart", to: "/" },
    { label: "Investor Relations", to: "/" },
    { label: "FutureCart Devices", to: "/" },
    { label: "FutureCart Science", to: "/" },
  ],
  "MAKE MONEY WITH US": [
    { label: "Sell products on FutureCart", to: "/seller" },
    { label: "Sell on FutureCart Business", to: "/seller" },
    { label: "Become an Affiliate", to: "/" },
    { label: "Advertise Your Products", to: "/" },
    { label: "Self-Publish with Us", to: "/" },
  ],
  "PAYMENT PRODUCTS": [
    { label: "FutureCart Business Card", to: "/" },
    { label: "Shop with Points", to: "/" },
    { label: "Reload Your Balance", to: "/" },
    { label: "Currency Converter", to: "/" },
  ],
  "LET US HELP YOU": [
    { label: "Your Account", to: "/profile" },
    { label: "Your Orders", to: "/profile" },
    { label: "Shipping Rates & Policies", to: "/" },
    { label: "Returns & Replacements", to: "/" },
    { label: "Manage Your Content", to: "/" },
    { label: "Help", to: "/" },
  ],
};

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-[1400px] px-4 py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-foreground">{title}</h4>
              <ul className="space-y-1.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-center gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Conditions of Use</Link>
            <Link to="/" className="hover:text-foreground transition-colors">Privacy Notice</Link>
            <Link to="/" className="hover:text-foreground transition-colors">Interest-Based Ads</Link>
          </div>
          <p className="text-[11px] text-muted-foreground">© {new Date().getFullYear()} FutureCart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
