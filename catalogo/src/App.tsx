
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductCard from "./components/ProductCard";
import { products } from "./data/products";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut" as const,
    },
  },
};

function App() {
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))].sort(),
    []
  );

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          selectedCategory === "Todas" ||
          product.category === selectedCategory
      ),
    [selectedCategory]
  );

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--text-primary)] transition-colors duration-300">
      <Header
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <main
        id="inicio"
        className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24"
      >
        <section id="produtos" className="scroll-mt-28">
          {/* Abertura do catálogo */}
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
                {selectedCategory === "Todas"
                  ? "Produtos em destaque"
                  : selectedCategory}
                <span className="text-violet-400">.</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
                Descubra produtos selecionados para você.
              </p>
            </div>

            <p className="text-sm text-zinc-400">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "produto encontrado"
                : "produtos encontrados"}
            </p>
          </motion.div>

          {/* Entrada sequencial dos produtos */}
          {filteredProducts.length > 0 ? (
            <motion.div
              key={selectedCategory}
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
                    onAddToCart={(item) =>
                      console.log("Adicionar à sacola:", item.name)
                    }
                    onViewProduct={(item) =>
                      console.log("Visualizar produto:", item.name)
                    }
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
                Não existem produtos cadastrados nesta categoria.
              </p>

              <button
                type="button"
                onClick={() => setSelectedCategory("Todas")}
                className="mt-5 rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                Ver todos os produtos
              </button>
            </motion.div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
