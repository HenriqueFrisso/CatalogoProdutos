
import { useState } from "react";
import {
  Heart,
  ShoppingBag,
  ArrowUpRight,
  Star,
} from "lucide-react";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  image: string;
  badge?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onViewProduct?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onViewProduct,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  const price = product.price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const oldPrice = product.oldPrice?.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <article className="group min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101117] transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-950/20">

      {/* Imagem */}
      <div className="relative aspect-[4/5] overflow-hidden bg-white/[0.04]">

        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-zinc-600">
            <ShoppingBag size={36} strokeWidth={1.2} />
            <span className="text-xs">Imagem indisponível</span>
          </div>
        )}

        {/* Gradiente inferior */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 to-transparent opacity-70" />

        {/* Selo */}
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-[#090a10]/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-violet-200 backdrop-blur-md">
            {product.badge}
          </span>
        )}

        {/* Favoritos */}
        <button
          type="button"
          onClick={() => setIsFavorite((value) => !value)}
          aria-label={
            isFavorite
              ? "Remover dos favoritos"
              : "Adicionar aos favoritos"
          }
          aria-pressed={isFavorite}
          className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 backdrop-blur-md transition-all duration-300 ${
            isFavorite
              ? "border-violet-400/40 bg-violet-600 text-white"
              : "bg-[#090a10]/70 text-zinc-300 hover:bg-violet-600 hover:text-white"
          }`}
        >
          <Heart
            size={18}
            className={isFavorite ? "fill-current" : ""}
          />
        </button>

        {/* Ação sobre a imagem */}
        <button
          type="button"
          onClick={() => onViewProduct?.(product)}
          className="absolute bottom-3 left-3 right-3 flex translate-y-3 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 opacity-0 transition-all duration-300 hover:bg-violet-100 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
        >
          Ver produto
          <ArrowUpRight size={17} />
        </button>
      </div>

      {/* Informações */}
      <div className="p-4 sm:p-5">

        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-violet-400">
          {product.category}
        </p>

        <button
          type="button"
          onClick={() => onViewProduct?.(product)}
          className="mt-2 block w-full text-left"
        >
          <h3 className="line-clamp-2 min-h-[3rem] text-base font-semibold leading-6 text-white transition-colors group-hover:text-violet-200">
            {product.name}
          </h3>
        </button>

        {/* Avaliação */}
        {product.rating !== undefined && (
          <div className="mt-2 flex items-center gap-1.5">
            <Star
              size={14}
              className="fill-amber-400 text-amber-400"
            />
            <span className="text-xs font-medium text-zinc-300">
              {product.rating.toFixed(1).replace(".", ",")}
            </span>
            <span className="text-xs text-zinc-600">
              / 5
            </span>
          </div>
        )}

        {/* Preço e botão */}
        <div className="mt-4 flex items-end justify-between gap-2 border-t border-white/[0.07] pt-4">
          <div className="min-w-0">
            {oldPrice && product.oldPrice! > product.price && (
              <p className="text-xs text-zinc-500 line-through">
                {oldPrice}
              </p>
            )}

            <p className="text-lg font-bold tracking-tight text-white">
              {price}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onAddToCart?.(product)}
            aria-label={`Adicionar ${product.name} à sacola`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white transition-all duration-300 hover:scale-105 hover:bg-violet-500 active:scale-95"
          >
            <ShoppingBag size={19} />
          </button>
        </div>
      </div>
    </article>
  );
}
