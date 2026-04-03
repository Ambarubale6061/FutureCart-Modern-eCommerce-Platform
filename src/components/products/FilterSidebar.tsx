import { useState } from "react";
import { Star, ChevronDown, ChevronUp, SlidersHorizontal, X } from "lucide-react";

interface FilterSidebarProps {
  brands: string[];
  selectedBrands: string[];
  onBrandsChange: (brands: string[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  selectedRating: number;
  onRatingChange: (rating: number) => void;
  selectedDiscount: number;
  onDiscountChange: (discount: number) => void;
  onClearAll?: () => void;
}

const PRICE_RANGES: [number, number][] = [
  [0, 500],
  [500, 1000],
  [1000, 5000],
  [5000, 10000],
  [10000, 20000],
  [20000, 50000],
];

interface SectionProps {
  label: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const Section = ({ label, expanded, onToggle, children }: SectionProps) => (
  <div className="border-b border-border/50 py-3.5">
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between text-xs font-bold uppercase tracking-wide text-foreground"
    >
      {label}
      {expanded
        ? <ChevronUp size={14} className="text-muted-foreground" />
        : <ChevronDown size={14} className="text-muted-foreground" />
      }
    </button>
    {expanded && <div className="mt-3">{children}</div>}
  </div>
);

const RadioItem = ({
  name, checked, onChange, children,
}: {
  name: string; checked: boolean; onChange: () => void; children: React.ReactNode;
}) => (
  <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1 text-xs text-foreground transition-colors hover:bg-muted">
    <span
      className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors
        ${checked ? "border-primary bg-primary" : "border-border bg-background"}`}
    >
      {checked && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
    </span>
    <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
    {children}
  </label>
);

const CheckItem = ({
  checked, onChange, children,
}: {
  checked: boolean; onChange: () => void; children: React.ReactNode;
}) => (
  <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1 text-xs text-foreground transition-colors hover:bg-muted">
    <span
      className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-md border-2 transition-colors
        ${checked ? "border-primary bg-primary" : "border-border bg-background"}`}
    >
      {checked && (
        <svg viewBox="0 0 10 8" className="h-2.5 w-2.5 fill-white">
          <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    {children}
  </label>
);

const FilterSidebar = ({
  brands, selectedBrands, onBrandsChange,
  priceRange, onPriceRangeChange,
  selectedRating, onRatingChange,
  selectedDiscount, onDiscountChange,
  onClearAll,
}: FilterSidebarProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    price: true, brand: true, rating: true, discount: true,
  });
  const [brandSearch, setBrandSearch] = useState("");

  const toggle = (key: string) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleBrand = (brand: string) =>
    onBrandsChange(
      selectedBrands.includes(brand)
        ? selectedBrands.filter((b) => b !== brand)
        : [...selectedBrands, brand]
    );

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    priceRange[1] !== Infinity ||
    selectedRating > 0 ||
    selectedDiscount > 0;

  const filteredBrands = brandSearch
    ? brands.filter((b) => b.toLowerCase().includes(brandSearch.toLowerCase()))
    : brands;

  return (
    <aside className="w-full rounded-2xl border border-border/40 bg-card shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-3.5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-primary" />
          <span className="text-sm font-bold text-foreground">Filters</span>
        </div>
        {hasActiveFilters && onClearAll && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 text-[11px] font-semibold text-destructive hover:underline"
          >
            <X size={11} /> Clear all
          </button>
        )}
      </div>

      <div className="px-4 pb-2">
        {/* Price */}
        <Section label="Price" expanded={expanded.price} onToggle={() => toggle("price")}>
          <div className="space-y-0.5">
            {PRICE_RANGES.map(([min, max]) => (
              <RadioItem
                key={`${min}-${max}`}
                name="price"
                checked={priceRange[0] === min && priceRange[1] === max}
                onChange={() => onPriceRangeChange([min, max])}
              >
                ₹{min.toLocaleString()} – ₹{max.toLocaleString()}
              </RadioItem>
            ))}
            <RadioItem
              name="price"
              checked={priceRange[0] === 0 && priceRange[1] === Infinity}
              onChange={() => onPriceRangeChange([0, Infinity])}
            >
              All Prices
            </RadioItem>
          </div>
        </Section>

        {/* Brand */}
        <Section label="Brand" expanded={expanded.brand} onToggle={() => toggle("brand")}>
          <input
            type="text"
            placeholder="Search brands…"
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
            className="mb-2 h-8 w-full rounded-xl border border-border bg-background px-3 text-xs placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <div className="max-h-[180px] space-y-0.5 overflow-y-auto pr-1">
            {filteredBrands.map((brand) => (
              <CheckItem
                key={brand}
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
              >
                {brand}
              </CheckItem>
            ))}
          </div>
        </Section>

        {/* Rating */}
        <Section label="Customer Rating" expanded={expanded.rating} onToggle={() => toggle("rating")}>
          <div className="space-y-0.5">
            {[4, 3, 2, 1].map((r) => (
              <RadioItem
                key={r}
                name="rating"
                checked={selectedRating === r}
                onChange={() => onRatingChange(r)}
              >
                <span className="flex items-center gap-1">
                  {r}
                  <Star size={10} fill="currentColor" className="text-amber-400" />
                  <span className="text-muted-foreground">& above</span>
                </span>
              </RadioItem>
            ))}
            <RadioItem name="rating" checked={selectedRating === 0} onChange={() => onRatingChange(0)}>
              All Ratings
            </RadioItem>
          </div>
        </Section>

        {/* Discount */}
        <Section label="Discount" expanded={expanded.discount} onToggle={() => toggle("discount")}>
          <div className="space-y-0.5">
            {[60, 50, 40, 30, 20, 10].map((d) => (
              <RadioItem
                key={d}
                name="discount"
                checked={selectedDiscount === d}
                onChange={() => onDiscountChange(d)}
              >
                {d}% or more
              </RadioItem>
            ))}
            <RadioItem name="discount" checked={selectedDiscount === 0} onChange={() => onDiscountChange(0)}>
              All
            </RadioItem>
          </div>
        </Section>
      </div>
    </aside>
  );
};

export default FilterSidebar;