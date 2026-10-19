
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Search,
  Heart,
  ShoppingBag,
  Sun,
  Moon,
  X,
  ChevronDown,
  Check,
  Menu,
  Home,
  Info,
  Mail,
} from "lucide-react";
import { useTheme } from "../hooks/useTheme";

type Page = "inicio" | "sobre" | "contato";

interface HeaderProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onNavigate: (page: Page) => void;
}

export default function Header({
  categories,
  selectedCategory,
  onSelectCategory,
  onNavigate,
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  const categoriesRef = useRef<HTMLDivElement>(null);
  const mobileCategoriesRef = useRef<HTMLDivElement>(null);

  const categoryOptions = ["Todas", ...categories];

  const navItems = [
    { label: "Início", icon: Home, page: "inicio" as Page },
    { label: "Sobre", icon: Info, page: "sobre" as Page },
    { label: "Contato", icon: Mail, page: "contato" as Page },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(target)
      ) {
        setCategoriesOpen(false);
      }

      if (
        mobileCategoriesRef.current &&
        !mobileCategoriesRef.current.contains(target)
      ) {
        setMobileCategoriesOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setCategoriesOpen(false);
        setMobileCategoriesOpen(false);
        setSearchOpen(false);
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function navigateTo(page: Page) {
    onNavigate(page);
    setMenuOpen(false);
    setSearchOpen(false);
    setCategoriesOpen(false);
    setMobileCategoriesOpen(false);
  }

  function selectCategory(category: string) {
    onSelectCategory(category);
    onNavigate("inicio");

    setCategoriesOpen(false);
    setMobileCategoriesOpen(false);
    setMenuOpen(false);
    setSearchOpen(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById("produtos")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });
  }

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const query = String(data.get("q") ?? "").trim();

    if (!query) return;

    // TODO: integrar a busca ao filtro de produtos no App.tsx.
    console.log("Buscar produtos:", query);

    setSearchOpen(false);
    setMenuOpen(false);
    form.reset();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090a10]/90 text-white shadow-lg shadow-black/5 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-4 px-5 md:gap-6 md:px-10">
        {/* Logo */}
        <button
          type="button"
          onClick={() => navigateTo("inicio")}
          className="group flex shrink-0 items-center gap-3"
          aria-label="Ir para a página inicial"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-violet-700 text-xl font-black text-white shadow-lg shadow-violet-500/20 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
            C
          </span>

          <span className="text-xl font-bold tracking-tight">
            Catálogo<span className="text-violet-400">.</span>
          </span>
        </button>

        {/* Navegação desktop */}
        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <button
              key={item.page}
              type="button"
              onClick={() => navigateTo(item.page)}
              className="group relative py-2 text-sm text-zinc-400 transition-colors duration-300 hover:text-violet-300"
            >
              {item.label}

              <span className="absolute -bottom-2 left-0 h-0.5 w-0 bg-violet-500 transition-all duration-300 group-hover:w-full" />
            </button>
          ))}

          {/* Dropdown de categorias */}
          <div ref={categoriesRef} className="relative">
            <button
              type="button"
              onClick={() => setCategoriesOpen((open) => !open)}
              aria-expanded={categoriesOpen}
              aria-haspopup="true"
              className={`flex items-center gap-1 py-2 text-sm transition-colors hover:text-violet-300 ${
                selectedCategory !== "Todas"
                  ? "text-violet-300"
                  : "text-zinc-400"
              }`}
            >
              Categorias

              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  categoriesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`absolute left-1/2 top-full z-50 mt-4 w-72 -translate-x-1/2 rounded-2xl border border-white/10 bg-[#101117] p-2 shadow-2xl shadow-black/40 transition-all duration-200 ${
                categoriesOpen
                  ? "visible translate-y-0 opacity-100"
                  : "invisible -translate-y-2 opacity-0"
              }`}
            >
              <div className="px-3 pb-2 pt-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Filtrar por categoria
                </p>
                <p className="mt-1 text-xs text-zinc-600">
                  Escolha o que deseja explorar.
                </p>
              </div>

              <div className="max-h-72 overflow-y-auto">
                {categoryOptions.map((category) => {
                  const isSelected = selectedCategory === category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => selectCategory(category)}
                      aria-pressed={isSelected}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm transition-colors ${
                        isSelected
                          ? "bg-violet-600/15 text-violet-300"
                          : "text-zinc-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span>{category}</span>

                      {isSelected && (
                        <Check size={16} className="text-violet-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 border-t border-white/10 px-3 py-3">
                <p className="text-xs text-zinc-500">
                  {categories.length}{" "}
                  {categories.length === 1
                    ? "categoria disponível"
                    : "categorias disponíveis"}
                </p>
              </div>
            </div>
          </div>
        </nav>

        {/* Ações */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
          {/* Busca desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden w-52 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 transition-all focus-within:border-violet-500/60 focus-within:bg-white/[0.07] lg:flex xl:w-64"
          >
            <Search size={18} className="shrink-0 text-zinc-500" />

            <input
              name="q"
              type="search"
              placeholder="Buscar produtos..."
              aria-label="Buscar produtos"
              className="w-full min-w-0 bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-zinc-500"
            />

            <button
              type="submit"
              aria-label="Pesquisar"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white transition hover:bg-violet-500"
            >
              <ArrowRight size={15} />
            </button>
          </form>

          {/* Busca mobile */}
          <button
            type="button"
            onClick={() => {
              setSearchOpen((open) => !open);
              setMenuOpen(false);
            }}
            aria-label={searchOpen ? "Fechar busca" : "Abrir busca"}
            aria-expanded={searchOpen}
            className="rounded-full p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </button>

          {/* Alternar tema */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark"
                ? "Ativar modo claro"
                : "Ativar modo escuro"
            }
            title={
              theme === "dark"
                ? "Ativar modo claro"
                : "Ativar modo escuro"
            }
            className="hidden rounded-full p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white sm:block"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Favoritos */}
          <button
            type="button"
            onClick={() => console.log("Abrir favoritos")}
            aria-label="Favoritos"
            className="hidden rounded-full p-2 text-zinc-400 transition hover:bg-white/10 hover:text-violet-300 sm:block"
          >
            <Heart size={21} />
          </button>

          {/* Sacola */}
          <button
            type="button"
            onClick={() => console.log("Abrir sacola")}
            aria-label="Sacola"
            className="relative rounded-full p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            <ShoppingBag size={21} />

            <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-500 px-1 text-[10px] font-bold text-white">
              0
            </span>
          </button>

          {/* Menu mobile */}
          <button
            type="button"
            onClick={() => {
              setMenuOpen((open) => !open);
              setSearchOpen(false);
            }}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            className="rounded-full p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {/* Campo de busca mobile */}
      <div
        className={`grid overflow-hidden transition-[grid-template-rows] duration-300 lg:hidden ${
          searchOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-3 border-t border-white/10 px-5 py-4"
          >
            <Search size={19} className="shrink-0 text-zinc-500" />

            <input
              name="q"
              type="search"
              placeholder="O que você está procurando?"
              aria-label="Buscar produtos"
              className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-zinc-500"
            />

            <button
              type="submit"
              aria-label="Pesquisar"
              className="rounded-full bg-violet-600 p-2.5 text-white transition hover:bg-violet-500"
            >
              <ArrowRight size={17} />
            </button>
          </form>
        </div>
      </div>

      {/* Navegação mobile */}
      <div
        className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out lg:hidden ${
          menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <nav className="min-h-0 overflow-y-auto border-t border-white/10 px-5 py-3">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.page}
                  type="button"
                  onClick={() => navigateTo(item.page)}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-zinc-300 transition hover:bg-white/5 hover:text-violet-300"
                >
                  <Icon size={17} />
                  {item.label}
                </button>
              );
            })}

            {/* Categorias mobile */}
            <div ref={mobileCategoriesRef}>
              <button
                type="button"
                onClick={() =>
                  setMobileCategoriesOpen((open) => !open)
                }
                aria-expanded={mobileCategoriesOpen}
                className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm transition hover:bg-white/5 ${
                  selectedCategory !== "Todas"
                    ? "text-violet-300"
                    : "text-zinc-300"
                }`}
              >
                <span className="flex items-center gap-2">
                  Categorias

                  {selectedCategory !== "Todas" && (
                    <span className="max-w-32 truncate rounded-full bg-violet-600/20 px-2 py-0.5 text-xs text-violet-300">
                      {selectedCategory}
                    </span>
                  )}
                </span>

                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    mobileCategoriesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`grid transition-[grid-template-rows] duration-200 ${
                  mobileCategoriesOpen
                    ? "grid-rows-[1fr]"
                    : "grid-rows-[0fr]"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="ml-3 space-y-1 border-l border-white/10 py-2 pl-3">
                    {categoryOptions.map((category) => {
                      const isSelected = selectedCategory === category;

                      return (
                        <button
                          key={category}
                          type="button"
                          onClick={() => selectCategory(category)}
                          aria-pressed={isSelected}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                            isSelected
                              ? "bg-violet-600/15 text-violet-300"
                              : "text-zinc-400 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <span>{category}</span>

                          {isSelected && (
                            <Check
                              size={16}
                              className="text-violet-400"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
