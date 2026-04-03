import { useState } from "react";
import { Star, ChevronDown, ChevronUp } from "lucide-react";

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
}

const FilterSidebar = ({
  brands,
  selectedBrands,
  onBrandsChange,
  priceRange,
  onPriceRangeChange,
  selectedRating,
  onRatingChange,
  selectedDiscount,
  onDiscountChange,
}: FilterSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    brand: true,
    price: true,
    rating: true,
    discount: true,
  });

  const toggleSection = (section: string) =>
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));

  const toggleBrand = (brand: string) => {
    onBrandsChange(
      selectedBrands.includes(brand)
        ? selectedBrands.filter((b) => b !== brand)
        : [...selectedBrands, brand]
    );
  };

  const priceRanges: [number, number][] = [
    [0, 500],
    [500, 1000],
    [1000, 5000],
    [5000, 10000],
    [10000, 20000],
    [20000, 50000],
  ];

  return (
    <aside className="w-full rounded bg-card p-4 shadow-sm">
      <h3 className="mb-3 border-b pb-2 text-sm font-bold uppercase text-card-foreground">Filters</h3>

      {/* Price */}
      <div className="mb-4">
        <button onClick={() => toggleSection("price")} className="flex w-full items-center justify-between py-1 text-xs font-bold uppercase text-card-foreground">
          Price {expandedSections.price ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {expandedSections.price && (
          <div className="mt-2 space-y-1">
            {priceRanges.map(([min, max]) => (
              <label key={`${min}-${max}`} className="flex cursor-pointer items-center gap-2 text-xs text-card-foreground">
                <input
                  type="radio"
                  name="price"
                  checked={priceRange[0] === min && priceRange[1] === max}
                  onChange={() => onPriceRangeChange([min, max])}
                  className="accent-primary"
                />
                ₹{min.toLocaleString()} - ₹{max.toLocaleString()}
              </label>
            ))}
            <label className="flex cursor-pointer items-center gap-2 text-xs text-card-foreground">
              <input
                type="radio"
                name="price"
                checked={priceRange[0] === 0 && priceRange[1] === Infinity}
                onChange={() => onPriceRangeChange([0, Infinity])}
                className="accent-primary"
              />
              All Prices
            </label>
          </div>
        )}
      </div>

      {/* Brand */}
      <div className="mb-4">
        <button onClick={() => toggleSection("brand")} className="flex w-full items-center justify-between py-1 text-xs font-bold uppercase text-card-foreground">
          Brand {expandedSections.brand ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {expandedSections.brand && (
          <div className="mt-2 max-h-[200px] space-y-1 overflow-y-auto">
            {brands.map((brand) => (
              <label key={brand} className="flex cursor-pointer items-center gap-2 text-xs text-card-foreground">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="accent-primary"
                />
                {brand}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="mb-4">
        <button onClick={() => toggleSection("rating")} className="flex w-full items-center justify-between py-1 text-xs font-bold uppercase text-card-foreground">
          Customer Rating {expandedSections.rating ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {expandedSections.rating && (
          <div className="mt-2 space-y-1">
            {[4, 3, 2, 1].map((r) => (
              <label key={r} className="flex cursor-pointer items-center gap-2 text-xs text-card-foreground">
                <input
                  type="radio"
                  name="rating"
                  checked={selectedRating === r}
                  onChange={() => onRatingChange(r)}
                  className="accent-primary"
                />
                <span className="flex items-center gap-0.5">
                  {r} <Star size={10} fill="currentColor" className="text-flipkart-yellow" /> & above
                </span>
              </label>
            ))}
            <label className="flex cursor-pointer items-center gap-2 text-xs text-card-foreground">
              <input type="radio" name="rating" checked={selectedRating === 0} onChange={() => onRatingChange(0)} className="accent-primary" />
              All
            </label>
          </div>
        )}
      </div>

      {/* Discount */}
      <div className="mb-4">
        <button onClick={() => toggleSection("discount")} className="flex w-full items-center justify-between py-1 text-xs font-bold uppercase text-card-foreground">
          Discount {expandedSections.discount ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {expandedSections.discount && (
          <div className="mt-2 space-y-1">
            {[10, 20, 30, 40, 50, 60].map((d) => (
              <label key={d} className="flex cursor-pointer items-center gap-2 text-xs text-card-foreground">
                <input
                  type="radio"
                  name="discount"
                  checked={selectedDiscount === d}
                  onChange={() => onDiscountChange(d)}
                  className="accent-primary"
                />
                {d}% or more
              </label>
            ))}
            <label className="flex cursor-pointer items-center gap-2 text-xs text-card-foreground">
              <input type="radio" name="discount" checked={selectedDiscount === 0} onChange={() => onDiscountChange(0)} className="accent-primary" />
              All
            </label>
          </div>
        )}
      </div>
    </aside>
  );
};

export default FilterSidebar;
