
import { motion } from "motion/react";
import {
  ArrowRight,
  Heart,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Fácil de explorar",
    description:
      "Encontre produtos com facilidade e navegue pelas categorias disponíveis.",
  },
  {
    icon: Heart,
    title: "Seleção especial",
    description:
      "Uma experiência pensada para apresentar os produtos de maneira clara e organizada.",
  },
  {
    icon: ShieldCheck,
    title: "Informações claras",
    description:
      "Consulte as informações disponíveis de cada produto antes de decidir.",
  },
];

export default function Sobre({ onExplore }: { onExplore: () => void }) {
  return (
    <main className="min-h-screen overflow-hidden bg-[var(--page-bg)] text-[var(--text-primary)]">
      {/* Apresentação */}
      <section className="relative px-5 py-20 md:px-10 md:py-28">
        <div className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-32 h-80 w-80 rounded-full bg-indigo-600/10 blur-[100px]" />

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative mx-auto max-w-5xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
            <Sparkles size={14} />
            Conheça o catálogo
          </span>

          <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl">
            Mais do que produtos.
            <br />
            <span className="bg-gradient-to-r from-violet-300 via-violet-500 to-indigo-400 bg-clip-text text-transparent">
              Uma experiência.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-muted md:text-lg">
            Criamos um espaço para você descobrir, explorar e conhecer
            produtos de forma simples, intuitiva e agradável.
          </p>

          <a
            href="#proposito"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:-translate-y-0.5 hover:bg-violet-500"
          >
            Conheça nossa proposta
            <ArrowRight size={17} />
          </a>
        </motion.div>
      </section>

      {/* Propósito */}
      <section
        id="proposito"
        className="scroll-mt-28 px-5 py-16 md:px-10 md:py-24"
      >
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-400">
              Nosso propósito
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Descobrir o que você procura deve ser simples.
            </h2>

            <p className="mt-6 leading-8 text-muted">
              O Catálogo nasceu com a proposta de reunir produtos em um
              ambiente digital organizado, moderno e fácil de utilizar.
              Queremos tornar a navegação mais intuitiva, facilitando a
              descoberta de itens por meio de categorias e informações
              apresentadas com clareza.
            </p>

            <p className="mt-4 leading-8 text-muted">
              Cada detalhe da interface busca combinar funcionalidade,
              acessibilidade e uma experiência visual agradável.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-violet-600/20 to-indigo-600/5 blur-2xl" />

            <div className="relative rounded-3xl border border-fg/10 bg-fg/[0.03] p-8 md:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
                <Target size={28} />
              </div>

              <h3 className="mt-7 text-2xl font-bold">
                Nossa missão
              </h3>

              <p className="mt-4 leading-7 text-muted">
                Oferecer uma experiência de catálogo que valorize a
                organização dos produtos, a facilidade de navegação e
                a descoberta de novas possibilidades.
              </p>

              <div className="mt-8 h-px bg-gradient-to-r from-violet-500/50 to-transparent" />

              <p className="mt-5 text-sm font-medium text-violet-300">
                Simplicidade em cada detalhe.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-12 max-w-2xl text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-400">
              Nossos diferenciais
            </p>

            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Pensado para você.
            </h2>

            <p className="mt-4 leading-7 text-muted">
              Uma interface construída para tornar a experiência de
              explorar produtos mais agradável.
            </p>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.12,
                  }}
                  whileHover={{ y: -5 }}
                  className="rounded-2xl border border-fg/10 bg-fg/[0.025] p-7 transition-colors hover:border-violet-500/30 hover:bg-fg/[0.04]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-6 text-lg font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-muted">
                    {feature.description}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Chamada final */}
      <section className="px-5 py-20 md:px-10 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/15 via-surface to-indigo-500/10 px-6 py-14 text-center sm:px-12 md:py-20"
        >
          <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 rounded-full bg-violet-500/15 blur-[90px]" />

          <div className="relative">
            <Sparkles className="mx-auto text-violet-300" size={28} />

            <h2 className="mt-6 text-3xl font-bold sm:text-4xl">
              Pronto para explorar?
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-muted">
              Descubra os produtos disponíveis e encontre algo que
              combine com você.
            </p>

            <button
              type="button"
              onClick={onExplore}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-violet-500"
            >
              Explorar produtos
              <ArrowRight size={17} />
            </button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
