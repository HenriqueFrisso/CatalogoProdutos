
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { motion } from "motion/react";

import Header, { type Page } from "./components/Header";
import Footer from "./components/Footer";
import ProductCard, { type Product } from "./components/ProductCard";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import Admin from "./pages/Admin";
import ProductModal from "./components/ProductModal";

import { getProducts } from "./services/products";

const MODAL_EXIT_DURATION = 400;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

const FAVORITES_KEY = "catalogo-favoritos";

function loadFavorites(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("inicio");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>(loadFavorites);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isAdmin, setIsAdmin] = useState(
    () => window.location.pathname.replace(/\/+$/, "") === "/admin"
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  // Carrega os produtos do Supabase.
  const reloadProducts = useCallback(async () => {
    try {
      const rows = await getProducts();

      setProducts(rows);
      setProductsError(null);
    } catch (error) {
      console.error(
        "Não foi possível carregar os produtos do Supabase:",
        error
      );

      setProductsError(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os produtos."
      );
    } finally {
      setLoadingProducts(false);
    }
  }, []);

// Carregamento inicial do catálogo.
useEffect(() => {
  const timeoutId = setTimeout(() => {
    void reloadProducts();
  }, 0);

  return () => clearTimeout(timeoutId);
}, [reloadProducts]);

  // Atualiza a página quando o usuário navega pelo histórico do navegador.
  useEffect(() => {
    function handlePopState() {
      setIsAdmin(
        window.location.pathname.replace(/\/+$/, "") === "/admin"
      );
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Limpa o temporizador ao desmontar o componente.
  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const categories = useMemo(
    () =>
      [...new Set(products.map((product) => product.category))].sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = normalize(searchQuery);

    return products.filter(
      (product) =>
        (selectedCategory === "Todas" ||
          product.category === selectedCategory) &&
        (!showFavorites || favorites.includes(product.id)) &&
        normalize(
          `${product.name} ${product.category} ${product.badge ?? ""}`
        ).includes(query)
    );
  }, [products, selectedCategory, searchQuery, showFavorites, favorites]);

  function toggleFavorite(product: Product) {
    const next = favorites.includes(product.id)
      ? favorites.filter((id) => id !== product.id)
      : [...favorites, product.id];

    setFavorites(next);

    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    } catch {
      // Sem armazenamento (ex.: navegação privada), vale só nesta sessão.
    }
  }

  function handleNavigate(page: Page) {
    setCurrentPage(page);

    if (page === "inicio") {
      clearFilters();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSelectCategory(category: string) {
    clearFilters();
    setSelectedCategory(category);
    setCurrentPage("inicio");

    window.setTimeout(() => {
      document.getElementById("produtos")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }

  function handleSearch(query: string) {
    handleSelectCategory("Todas");
    setSearchQuery(query);
  }

  function clearFilters() {
    setSelectedCategory("Todas");
    setSearchQuery("");
    setShowFavorites(false);
  }

  function handleShowFavorites() {
    handleSelectCategory("Todas");
    setShowFavorites(true);
  }

  const handleViewProduct = useCallback((product: Product) => {
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setSelectedProduct(product);
    setIsProductModalOpen(true);
  }, []);

  const handleCloseProductModal = useCallback(() => {
    if (!isProductModalOpen) return;

    setIsProductModalOpen(false);

    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = setTimeout(() => {
      setSelectedProduct(null);
      closeTimerRef.current = null;
    }, MODAL_EXIT_DURATION);
  }, [isProductModalOpen]);

  if (isAdmin) {
    return (
      <Admin />
    );
  }

  function renderPage() {
    switch (currentPage) {
      case "sobre":
        return <Sobre onExplore={() => handleNavigate("inicio")} />;

      case "contato":
        return <Contato />;

      case "inicio":
      default:
        return (
          <main
            id="inicio"
            className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24"
          >
            <section id="produtos" className="scroll-mt-28">
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-400">
                    Seleção especial
                  </p>

                  <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                    {showFavorites
                      ? "Seus favoritos"
                      : searchQuery
                      ? `Resultados para "${searchQuery}"`
                      : selectedCategory === "Todas"
                        ? "Produtos em destaque"
                        : selectedCategory}
                    <span className="text-violet-400">.</span>
                  </h1>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-muted sm:text-base">
                    Descubra produtos selecionados para você.
                  </p>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted">
                  <p>
                    {filteredProducts.length}{" "}
                    {filteredProducts.length === 1
                      ? "produto encontrado"
                      : "produtos encontrados"}
                  </p>

                  {(searchQuery || showFavorites) && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-violet-400 transition hover:text-violet-300"
                    >
                      {showFavorites ? "Ver todos" : "Limpar busca"}
                    </button>
                  )}
                </div>
              </motion.div>

              {loadingProducts ? (
                <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] px-6 py-12 text-center">
                  <p className="text-sm text-muted">
                    Carregando produtos...
                  </p>
                </div>
              ) : productsError ? (
                <div className="rounded-2xl border border-red-500/30 bg-[var(--surface-bg)] px-6 py-12 text-center">
                  <h2 className="text-xl font-semibold">
                    Não foi possível carregar o catálogo
                  </h2>

                  <p className="mt-2 text-sm text-muted">
                    {productsError}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setProductsError(null);
                      setLoadingProducts(true);
                      void reloadProducts();
                    }}
                    className="mt-5 rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
                  >
                    Tentar novamente
                  </button>
                </div>
              ) : filteredProducts.length > 0 ? (
                <motion.div
                  key={`${selectedCategory}-${searchQuery}-${showFavorites}`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      variants={itemVariants}
                      className="h-full"
                    >
                      <ProductCard
                        product={product}
                        isFavorite={favorites.includes(product.id)}
                        onToggleFavorite={toggleFavorite}
                        onViewProduct={handleViewProduct}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] px-6 py-12 text-center"
                >
                  <h2 className="text-xl font-semibold">
                    Nenhum produto encontrado
                  </h2>

                  <p className="mt-2 text-sm text-muted">
                    {showFavorites
                      ? "Toque no coração de um produto para salvá-lo aqui."
                      : searchQuery
                      ? "Tente buscar por outro nome ou categoria."
                      : "Não existem produtos cadastrados neste catálogo."}
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
                  >
                    Ver todos os produtos
                  </button>
                </motion.div>
              )}
            </section>
          </main>
        );
    }
  }

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--text-primary)] transition-colors duration-300">
      <Header
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onNavigate={handleNavigate}
        onSearch={handleSearch}
        favoritesCount={favorites.length}
        showFavorites={showFavorites}
        onShowFavorites={handleShowFavorites}
      />

      <motion.div
        key={currentPage}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        {renderPage()}
      </motion.div>

      <Footer
        categories={categories}
        onNavigate={handleNavigate}
        onSelectCategory={handleSelectCategory}
      />

      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={handleCloseProductModal}
        isFavorite={
          selectedProduct !== null && favorites.includes(selectedProduct.id)
        }
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}

export default App;
