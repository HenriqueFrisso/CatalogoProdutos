
import type { Product } from "../components/ProductCard";

export const products: Product[] = [
  {
    id: "1",
    name: "Headphone Wireless Studio",
    category: "Eletrônicos",
    price: 1.99,
    oldPrice: 429.9,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop",
    badge: "Mais vendido",
  },
  {
    id: "2",
    name: "Tênis Urban Essential",
    category: "Moda",
    price: 289.9,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop",
    badge: "Destaque",
  },
  {
    id: "3",
    name: "Relógio Minimal Classic",
    category: "Acessórios",
    price: 459.9,
    oldPrice: 529.9,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&auto=format&fit=crop",
  },
  {
    id: "4",
    name: "Câmera Instantânea Retro",
    category: "Fotografia",
    price: 599.9,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=700&auto=format&fit=crop",
    badge: "Novo",
  },
];
