
import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import {
  Mail,
  MessageCircle,
  MapPin,
  Send,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

const contactMethods = [
  {
    icon: Mail,
    title: "E-mail",
    description: "Entre em contato por e-mail.",
    value: "contato@seudominio.com",
    href: "mailto:contato@seudominio.com",
  },
  {
    icon: MessageCircle,
    title: "Redes sociais",
    description: "Acompanhe nossas novidades.",
    value: "Fale com a gente",
    href: "#redes-sociais",
  },
  {
    icon: MapPin,
    title: "Atendimento",
    description: "Estamos aqui para ajudar.",
    value: "Atendimento online",
    href: "#formulario",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

function Contato() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    assunto: "Dúvida sobre produto",
    mensagem: "",
  });

  const [enviado, setEnviado] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { nome, email, assunto, mensagem } = form;

    const destinatario = "contato@seudominio.com";
    const corpo = [
      `Nome: ${nome}`,
      `E-mail: ${email}`,
      `Assunto: ${assunto}`,
      "",
      mensagem,
    ].join("\n");

    const mailto = `mailto:${destinatario}?subject=${encodeURIComponent(
      assunto
    )}&body=${encodeURIComponent(corpo)}`;

    window.location.href = mailto;
    setEnviado(true);
  }

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setEnviado(false);
  }

  return (
    <main className="min-h-screen bg-[var(--page-bg)] text-[var(--text-primary)]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--border-color)]">
        <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-fuchsia-600/10 blur-[120px]" />

        <div className="relative mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.p
              variants={itemVariants}
              className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-400"
            >
              Estamos aqui para você
            </motion.p>

            <motion.h1
              variants={itemVariants}
              className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl"
            >
              Vamos conversar
              <span className="text-violet-400">.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg"
            >
              Tem alguma dúvida, sugestão ou precisa de ajuda? Envie sua
              mensagem. Será um prazer conversar com você.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Métodos de contato */}
      <section className="mx-auto max-w-[1440px] px-5 py-14 md:px-10 md:py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-5 md:grid-cols-3"
        >
          {contactMethods.map((method) => {
            const Icon = method.icon;

            return (
              <motion.a
                key={method.title}
                variants={itemVariants}
                href={method.href}
                className="group rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-500/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 transition group-hover:bg-violet-500 group-hover:text-white">
                  <Icon size={22} />
                </div>

                <h2 className="mt-5 text-lg font-semibold">
                  {method.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {method.description}
                </p>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-violet-400">
                    {method.value}
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="shrink-0 text-[var(--text-secondary)] transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-violet-400"
                  />
                </div>
              </motion.a>
            );
          })}
        </motion.div>

        {/* Formulário */}
        <div
          id="formulario"
          className="mt-16 grid scroll-mt-28 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20"
        >
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-400">
              Entre em contato
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Envie sua mensagem
              <span className="text-violet-400">.</span>
            </h2>

            <p className="mt-5 max-w-lg leading-7 text-[var(--text-secondary)]">
              Preencha o formulário ao lado com seus dados e conte um pouco
              sobre o que você precisa. Nossa equipe ficará feliz em ajudar.
            </p>

            <div className="mt-8 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
                <MessageCircle size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Estamos à disposição</h3>
                <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                  Dúvidas, sugestões, feedbacks ou informações sobre nossos
                  produtos são sempre bem-vindos.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="rounded-3xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-5 sm:p-8 md:p-10"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="nome"
                  className="mb-2 block text-sm font-medium"
                >
                  Nome completo
                </label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={100}
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--page-bg)] px-4 py-3.5 text-sm outline-none transition placeholder:text-[var(--text-secondary)] focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={form.email}
                  onChange={handleChange}
                  placeholder="voce@exemplo.com"
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--page-bg)] px-4 py-3.5 text-sm outline-none transition placeholder:text-[var(--text-secondary)] focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15"
                />
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor="assunto"
                className="mb-2 block text-sm font-medium"
              >
                Assunto
              </label>
              <select
                id="assunto"
                name="assunto"
                required
                value={form.assunto}
                onChange={handleChange}
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--page-bg)] px-4 py-3.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15"
              >
                <option>Dúvida sobre produto</option>
                <option>Sugestão</option>
                <option>Problema técnico</option>
                <option>Parceria comercial</option>
                <option>Outro assunto</option>
              </select>
            </div>

            <div className="mt-5">
              <label
                htmlFor="mensagem"
                className="mb-2 block text-sm font-medium"
              >
                Mensagem
              </label>
              <textarea
                id="mensagem"
                name="mensagem"
                required
                minLength={10}
                maxLength={3000}
                rows={6}
                value={form.mensagem}
                onChange={handleChange}
                placeholder="Como podemos ajudar?"
                className="w-full resize-y rounded-xl border border-[var(--border-color)] bg-[var(--page-bg)] px-4 py-3.5 text-sm outline-none transition placeholder:text-[var(--text-secondary)] focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15"
              />
              <p className="mt-2 text-right text-xs text-[var(--text-secondary)]">
                {form.mensagem.length}/3000 caracteres
              </p>
            </div>

            {enviado && (
              <div
                role="status"
                className="mt-5 flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400"
              >
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                <p>
                  Seu aplicativo tentou abrir o programa de e-mail. Se isso não
                  aconteceu, verifique se há um aplicativo de e-mail configurado.
                </p>
              </div>
            )}

            <button
              type="submit"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-[var(--surface-bg)]"
            >
              Enviar mensagem
              <Send size={17} />
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-[var(--text-secondary)]">
              O envio abrirá seu aplicativo de e-mail com a mensagem preenchida.
            </p>
          </motion.form>
        </div>
      </section>
    </main>
  );
}

export default Contato;
