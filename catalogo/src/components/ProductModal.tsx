import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Star,
  ImageOff,
  Heart,
} from "lucide-react";
import { type Product } from "./ProductCard";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
}

export default function ProductModal({
  product,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
}: ProductModalProps) {
  const [failedImage, setFailedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!product) return null;

  const imageError = failedImage === product.image;

  const price = product.price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const oldPrice = product.oldPrice?.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="product-modal"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 28,
            }}
            role="dialog"
            aria-modal="true"
            aria-label={product.name}
            className="relative my-auto flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-fg/10 bg-surface text-fg shadow-2xl shadow-black/60 md:flex-row"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Image */}
            <div className="relative flex aspect-[5/4] shrink-0 items-center justify-center overflow-hidden bg-fg/[0.03] sm:aspect-video md:aspect-auto md:w-1/2">
              {!imageError ? (
                <img
                  src={product.image}
                  alt={product.name}
                  onError={() => setFailedImage(product.image)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 p-8 text-center text-subtle">
                  <ImageOff size={48} strokeWidth={1.2} />
                  <span className="text-sm">
                    Imagem indisponível
                  </span>
                </div>
              )}

              {/* Image badge */}
              {product.badge && (
                <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet-300 backdrop-blur-md">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Product details */}
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-5 sm:p-7 md:p-8">
              {/* Header: category and independent actions */}
              <div className="flex items-center justify-between gap-3">
                <span className="min-w-0 text-xs font-semibold uppercase tracking-[0.18em] text-violet-400 sm:tracking-[0.2em]">
                  {product.category}
                </span>

                <div className="flex shrink-0 items-center gap-2">
                  {/* Favorite */}
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(product)}
                    aria-label={
                      isFavorite
                        ? "Remover dos favoritos"
                        : "Adicionar aos favoritos"
                    }
                    aria-pressed={isFavorite}
                    title={
                      isFavorite
                        ? "Remover dos favoritos"
                        : "Adicionar aos favoritos"
                    }
                    className={`flex h-10 w-10 items-center justify-center rounded-full border transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                      isFavorite
                        ? "border-violet-500 bg-violet-600 text-white"
                        : "border-fg/10 bg-fg/[0.05] text-fg/80 hover:border-violet-400/50 hover:bg-violet-500/10 hover:text-violet-300"
                    }`}
                  >
                    <Heart
                      size={18}
                      className={
                        isFavorite ? "fill-current" : ""
                      }
                    />
                  </button>

                  {/* Close */}
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Fechar detalhes do produto"
                    title="Fechar"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-fg/10 bg-fg/[0.05] text-fg/80 transition duration-200 hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Name */}
              <h2 className="mt-4 break-words text-2xl font-bold tracking-tight sm:text-3xl">
                {product.name}
              </h2>

              {/* Rating */}
              {product.rating !== undefined && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <Star
                      size={16}
                      className="fill-amber-400 text-amber-400"
                    />
                    <span className="text-sm font-semibold">
                      {product.rating.toFixed(1).replace(".", ",")}
                    </span>
                  </div>

                  <span className="text-xs text-subtle">
                    Avaliações verificadas
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="mt-5 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {price}
                </span>

                {oldPrice &&
                  product.oldPrice !== undefined &&
                  product.oldPrice > product.price && (
                    <span className="text-base text-subtle line-through">
                      {oldPrice}
                    </span>
                  )}
              </div>

              {/* Description */}
              <p className="mt-4 text-sm leading-relaxed text-fg/80">
                Produto de alta qualidade selecionado especialmente
                para você, com excelente acabamento.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}