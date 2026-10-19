
import {
  ArrowUpRight,
  ArrowRight,
  Code2,
  Camera,
  BriefcaseBusiness,
  PlayCircle,
  Mail,
} from "lucide-react";

import { useState, type FormEvent } from "react";
const navigation = [
  { label: "Início", href: "#inicio" },
  { label: "Categorias", href: "#categorias" },
  { label: "Produtos", href: "#produtos" },
  { label: "Sobre nós", href: "#sobre" },
  { label: "Contato", href: "#contato" },
];

const categories = [
  "Eletrônicos",
  "Roupas",
  "Casa e decoração",
  "Esportes",
  "Livros",
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com", Icon: Code2 },
  { label: "Instagram", href: "https://instagram.com", Icon: Camera },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: BriefcaseBusiness },
  { label: "YouTube", href: "https://youtube.com", Icon: PlayCircle },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) return;

    // Integre aqui um serviço de newsletter ou uma API.
    setMessage(
      "Formulário pronto! A integração de newsletter ainda precisa ser configurada."
    );
  }

  return (
    <footer className="border-t border-white/10 bg-[#090a10] text-zinc-300">
      <div className="mx-auto max-w-[1440px] px-5 pb-6 pt-14 md:px-10 md:pt-20">

        {/* Colunas */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.75fr_0.9fr_1.3fr] lg:gap-12">

          {/* Marca */}
          <div>
            <a
              href="#inicio"
              className="inline-flex items-center gap-3"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-violet-700 text-xl font-black text-white">
                C
              </span>
              <span className="text-xl font-bold tracking-tight text-white">
                Catálogo<span className="text-violet-400">.</span>
              </span>
            </a>

            <p className="mt-5 max-w-sm text-sm leading-7 text-zinc-400">
              Descubra novas possibilidades em um só lugar.
              Explore coleções, encontre seus favoritos e
              conheça tudo o que preparamos para você.
            </p>

            <div className="mt-6 flex gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
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
            <h2 className="text-sm font-semibold text-white">
              Navegação
            </h2>

            <ul className="mt-5 space-y-4">
              {navigation.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="group flex items-center justify-between gap-2 text-sm text-zinc-400 transition hover:text-violet-300"
                  >
                    {item.label}
                    <ArrowUpRight
                      size={15}
                      className="opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categorias */}
          <div className="lg:border-l lg:border-white/10 lg:pl-8">
            <h2 className="text-sm font-semibold text-white">
              Categorias
            </h2>

            <ul className="mt-5 space-y-4">
              {categories.map((category) => (
                <li key={category}>
                  <a
                    href={`#categorias`}
                    className="group flex items-center justify-between gap-2 text-sm text-zinc-400 transition hover:text-violet-300"
                  >
                    {category}
                    <ArrowRight
                      size={15}
                      className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </a>
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
              Receba novidades, lançamentos e conteúdos
              selecionados diretamente no seu e-mail.
            </p>

            <form onSubmit={handleSubscribe} className="mt-5">
              <label htmlFor="newsletter-email" className="sr-only">
                Seu e-mail
              </label>

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1.5 pl-4 transition focus-within:border-violet-400/60">
                <Mail size={18} className="shrink-0 text-zinc-500" />

                <input
                  id="newsletter-email"
                  type="email"
                  required
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
                <p role="status" className="mt-3 text-xs leading-5 text-violet-300">
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Rodapé inferior */}
        <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Catálogo. Todos os direitos reservados.
          </p>

          <nav aria-label="Links legais" className="flex flex-wrap gap-x-6 gap-y-3">
            <a href="#termos" className="transition hover:text-white">
              Termos de uso
            </a>
            <a href="#privacidade" className="transition hover:text-white">
              Privacidade
            </a>
            <a href="#contato" className="transition hover:text-white">
              Fale conosco
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
