import { ArrowRight, LayoutGrid } from "lucide-react";

interface CategoriesProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function Categories({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoriesProps) {
  const allCategories = ["Todas", ...categories];

  return (
    <section id="categorias" className="scroll-mt-28 py-16 md:py-20">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="mb-3 block text-xs font-bold uppercase tracking-[0.25em] text-violet-400">
              Explore a coleção
            </span>

            <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-4xl">
              Categorias
            </h2>

            <p className="mt-2 text-sm text-[var(--text-secondary)] md:text-base">
              Encontre produtos de acordo com o que você procura.
            </p>
          </div>

          <ArrowRight
            size={22}
            className="mb-1 hidden text-violet-400 sm:block"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {allCategories.map((category) => {
            const isSelected = selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => onSelectCategory(category)}
                aria-pressed={isSelected}
                className={`group flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-all duration-300 ${
                  isSelected
                    ? "border-violet-500 bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                    : "border-[var(--border-color)] bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:border-violet-500/60 hover:text-violet-400"
                }`}
              >
                {category === "Todas" && <LayoutGrid size={16} />}
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}