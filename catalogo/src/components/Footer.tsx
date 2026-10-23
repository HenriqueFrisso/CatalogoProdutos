
import {
  ArrowUpRight,
  ArrowRight,
  Code2,
  Camera,
  BriefcaseBusiness,
  PlayCircle,
} from "lucide-react";

import type { Page } from "./Header";

interface FooterProps {
  categories: string[];
  onNavigate: (page: Page) => void;
  onSelectCategory: (category: string) => void;
}

const navigation: { label: string; page: Page }[] = [
  { label: "Início", page: "inicio" },
  { label: "Sobre nós", page: "sobre" },
  { label: "Contato", page: "contato" },
];

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com",
    Icon: Code2,
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    Icon: Camera,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    Icon: BriefcaseBusiness,
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    Icon: PlayCircle,
  },
];

export default function Footer({
  categories,
  onNavigate,
  onSelectCategory,
}: FooterProps) {

  function handleNavigate(page: Page) {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCategoryClick(category: string) {
    onSelectCategory(category);
    onNavigate("inicio");

    window.setTimeout(() => {
      document.getElementById("produtos")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
  }

  return (
    <footer className="border-t border-fg/10 bg-page text-fg/80">
      <div className="mx-auto max-w-[1440px] px-5 pb-6 pt-14 md:px-10 md:pt-20">
        {/* Colunas */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-12">
          {/* Marca */}
          <div>
            <button
              type="button"
              onClick={() => handleNavigate("inicio")}
              className="inline-flex items-center gap-3"
              aria-label="Ir para a página inicial"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-violet-700 text-xl font-black text-white">
                C
              </span>

              <span className="text-xl font-bold tracking-tight text-fg">
                Catálogo<span className="text-violet-400">.</span>
              </span>
            </button>

            <p className="mt-5 max-w-sm text-sm leading-7 text-muted">
              Descubra novas possibilidades em um só lugar. Explore coleções,
              encontre seus favoritos e conheça tudo o que preparamos para você.
            </p>

            <div className="mt-6 flex gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-fg/10 bg-fg/[0.04] text-muted transition duration-300 hover:-translate-y-1 hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-violet-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navegação */}
          <div className="lg:border-l lg:border-fg/10 lg:pl-8">
            <h2 className="text-sm font-semibold text-fg">Navegação</h2>

            <ul className="mt-5 space-y-4">
              {navigation.map((item) => (
                <li key={item.page}>
                  <button
                    type="button"
                    onClick={() => handleNavigate(item.page)}
                    className="group flex w-full items-center justify-between gap-2 text-left text-sm text-muted transition hover:text-violet-300"
                  >
                    {item.label}

                    <ArrowUpRight
                      size={15}
                      className="opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categorias dinâmicas */}
          <div className="lg:border-l lg:border-fg/10 lg:pl-8">
            <h2 className="text-sm font-semibold text-fg">Categorias</h2>

            <ul className="mt-5 space-y-4">
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryClick("Todas")}
                  className="group flex w-full items-center justify-between gap-2 text-left text-sm text-muted transition hover:text-violet-300"
                >
                  Todas as categorias
                  <ArrowRight
                    size={15}
                    className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                  />
                </button>
              </li>

              {categories.map((category) => (
                <li key={category}>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(category)}
                    className="group flex w-full items-center justify-between gap-2 text-left text-sm text-muted transition hover:text-violet-300"
                  >
                    <span className="truncate">{category}</span>

                    <ArrowRight
                      size={15}
                      className="shrink-0 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Rodapé inferior */}
        <div className="mt-14 flex flex-col gap-5 border-t border-fg/10 pt-6 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Catálogo. Todos os direitos reservados.
          </p>

          <p>
            Feito para ajudar você a encontrar o que procura.
          </p>
        </div>
      </div>
    </footer>
  );
}
