
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { motion } from "motion/react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductCard, { type Product } from "./components/ProductCard";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import Admin from "./pages/Admin";
import ProductModal from "./components/ProductModal";

import {
  deleteProduct,
  getProducts,
  saveProduct,
} from "./services/products";

type Page = "inicio" | "sobre" | "contato";

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

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("inicio");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [searchQuery, setSearchQuery] = useState("");
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
  const [savingProduct, setSavingProduct] = useState(false);

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
        normalize(
          `${product.name} ${product.category} ${product.badge ?? ""}`
        ).includes(query)
    );
  }, [products, selectedCategory, searchQuery]);

  // Salva o produto no Supabase e atualiza a tela após o sucesso.
  async function handleSaveProduct(product: Product) {
    if (savingProduct) return;

    setSavingProduct(true);

    try {
      const saved = await saveProduct(product);

      setProducts((current) => {
        const exists = current.some((item) => item.id === saved.id);

        return exists
          ? current.map((item) => (item.id === saved.id ? saved : item))
          : [...current, saved];
      });

      setProductsError(null);
    } catch (error) {
      console.error("Não foi possível salvar o produto:", error);

      window.alert(
        error instanceof Error
          ? `Não foi possível salvar o produto: ${error.message}`
          : "Não foi possível salvar o produto no Supabase."
      );

      throw error;
    } finally {
      setSavingProduct(false);
    }
  }

  // Exclui o produto do Supabase e atualiza a lista.
  async function handleDeleteProduct(id: string) {
    try {
      await deleteProduct(id);

      setProducts((current) =>
        current.filter((product) => product.id !== id)
      );

      setProductsError(null);
    } catch (error) {
      console.error("Não foi possível excluir o produto:", error);

      window.alert(
        error instanceof Error
          ? `Não foi possível excluir o produto: ${error.message}`
          : "Não foi possível excluir o produto no Supabase."
      );

      throw error;
    }
  }

  function handleNavigate(page: Page) {
    setCurrentPage(page);

    if (page === "inicio") {
      setSelectedCategory("Todas");
      setSearchQuery("");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSelectCategory(category: string) {
    setSelectedCategory(category);
    setSearchQuery("");
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
      <Admin
        products={products}
        onSave={handleSaveProduct}
        onDelete={handleDeleteProduct}
      />
    );
  }

  function renderPage() {
    switch (currentPage) {
      case "sobre":
        return <Sobre />;

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
                    {searchQuery
                      ? `Resultados para "${searchQuery}"`
                      : selectedCategory === "Todas"
                        ? "Produtos em destaque"
                        : selectedCategory}
                    <span className="text-violet-400">.</span>
                  </h1>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
                    Descubra produtos selecionados para você.
                  </p>
                </div>

                <div className="flex items-center gap-4 text-sm text-zinc-400">
                  <p>
                    {filteredProducts.length}{" "}
                    {filteredProducts.length === 1
                      ? "produto encontrado"
                      : "produtos encontrados"}
                  </p>

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-violet-400 transition hover:text-violet-300"
                    >
                      Limpar busca
                    </button>
                  )}
                </div>
              </motion.div>

              {loadingProducts ? (
                <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] px-6 py-12 text-center">
                  <p className="text-sm text-zinc-400">
                    Carregando produtos...
                  </p>
                </div>
              ) : productsError ? (
                <div className="rounded-2xl border border-red-500/30 bg-[var(--surface-bg)] px-6 py-12 text-center">
                  <h2 className="text-xl font-semibold">
                    Não foi possível carregar o catálogo
                  </h2>

                  <p className="mt-2 text-sm text-zinc-400">
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
                  key={`${selectedCategory}-${searchQuery}`}
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

                  <p className="mt-2 text-sm text-zinc-400">
                    {searchQuery
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
      />
    </div>
  );
}

export default App;
