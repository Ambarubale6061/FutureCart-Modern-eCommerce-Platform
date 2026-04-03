import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

const ImageGallery = ({ images, productName }: ImageGalleryProps) => {
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex gap-3">
      <div className="flex flex-col gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 p-1 transition-all active:scale-95 ${
              i === selected ? "border-primary shadow-sm" : "border-border"
            }`}
          >
            <img src={img} alt={`${productName} ${i + 1}`} className="h-full w-full object-contain" />
          </button>
        ))}
      </div>
      <div className="flex flex-1 items-center justify-center rounded-md bg-secondary/30 p-4">
        <AnimatePresence mode="wait">
          <motion.img
            key={selected}
            src={images[selected]}
            alt={productName}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="max-h-[420px] w-full object-contain"
          />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ImageGallery;
