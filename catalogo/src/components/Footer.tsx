
import { useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Code2,
  Camera,
  BriefcaseBusiness,
  PlayCircle,
  Mail,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type Page = "inicio" | "sobre" | "contato";

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
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );

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

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setMessageType("error");
      setMessage("Informe um endereço de e-mail válido.");
      return;
    }

    // A inscrição real depende de uma API ou serviço de newsletter.
    // Não informamos que o usuário foi inscrito sem confirmar isso no servidor.
    setMessageType("info");
    setMessage(
      "A newsletter ainda não está conectada a um serviço de inscrição. Nenhum cadastro foi realizado."
    );
  }

  return (
    <footer className="border-t border-white/10 bg-[#090a10] text-zinc-300">
      <div className="mx-auto max-w-[1440px] px-5 pb-6 pt-14 md:px-10 md:pt-20">
        {/* Colunas */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.75fr_0.9fr_1.3fr] lg:gap-12">
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

              <span className="text-xl font-bold tracking-tight text-white">
                Catálogo<span className="text-violet-400">.</span>
              </span>
            </button>

            <p className="mt-5 max-w-sm text-sm leading-7 text-zinc-400">
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
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400 transition duration-300 hover:-translate-y-1 hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-violet-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navegação */}
          <div className="lg:border-l lg:border-white/10 lg:pl-8">
            <h2 className="text-sm font-semibold text-white">Navegação</h2>

            <ul className="mt-5 space-y-4">
              {navigation.map((item) => (
                <li key={item.page}>
                  <button
                    type="button"
                    onClick={() => handleNavigate(item.page)}
                    className="group flex w-full items-center justify-between gap-2 text-left text-sm text-zinc-400 transition hover:text-violet-300"
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
          <div className="lg:border-l lg:border-white/10 lg:pl-8">
            <h2 className="text-sm font-semibold text-white">Categorias</h2>

            <ul className="mt-5 space-y-4">
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryClick("Todas")}
                  className="group flex w-full items-center justify-between gap-2 text-left text-sm text-zinc-400 transition hover:text-violet-300"
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
                    className="group flex w-full items-center justify-between gap-2 text-left text-sm text-zinc-400 transition hover:text-violet-300"
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

          {/* Newsletter */}
          <div className="lg:border-l lg:border-white/10 lg:pl-8">
            <h2 className="text-sm font-semibold text-white">
              Receba novidades
            </h2>

            <p className="mt-5 text-sm leading-7 text-zinc-400">
              Cadastre seu e-mail para receber novidades e lançamentos quando
              a newsletter estiver disponível.
            </p>

            <form onSubmit={handleSubscribe} className="mt-5">
              <label htmlFor="newsletter-email" className="sr-only">
                Seu e-mail
              </label>

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1.5 pl-4 transition focus-within:border-violet-400/60">
                <Mail size={18} className="shrink-0 text-zinc-500" />

                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setMessage("");
                  }}
                  placeholder="Seu e-mail"
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-zinc-500"
                />

                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500"
                >
                  Inscrever
                </button>
              </div>

              {message && (
                <div
                  role="status"
                  className={`mt-3 flex items-start gap-2 text-xs leading-5 ${
                    messageType === "error"
                      ? "text-red-400"
                      : messageType === "success"
                        ? "text-emerald-400"
                        : "text-violet-300"
                  }`}
                >
                  {messageType === "success" ? (
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                  ) : (
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  )}

                  <p>{message}</p>
                </div>
              )}
            </form>

            <button
              type="button"
              onClick={() => handleNavigate("contato")}
              className="mt-5 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-violet-300"
            >
              Precisa de ajuda? Fale conosco
              <ArrowUpRight size={15} />
            </button>
          </div>
        </div>

        {/* Rodapé inferior */}
        <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
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
