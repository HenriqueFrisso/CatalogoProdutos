import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ImagePlus,
  LogOut,
  Package,
  Pencil,
  Plus,
  Search,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import type { Product } from "../components/ProductCard";
import { supabase } from "../lib/supabase";
import {
  deleteProduct as deleteProductFromSupabase,
  getProducts,
  saveProduct as saveProductToSupabase,
} from "../services/products";

type ProductForm = {
  name: string;
  category: string;
  price: string;
  oldPrice: string;
  rating: string;
  image: string;
  badge: string;
};

const emptyForm: ProductForm = {
  name: "",
  category: "",
  price: "",
  oldPrice: "",
  rating: "5",
  image: "",
  badge: "",
};

const inputClass =
  "mt-2 w-full rounded-xl border border-fg/10 bg-surface px-4 py-3 text-sm text-fg outline-none transition placeholder:text-subtle focus:border-violet-500";

const formatPrice = (price: number) =>
  price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const catalogId = import.meta.env.VITE_SUPABASE_CATALOGO_ID as
  | string
  | undefined;

// ID da loja associada ao catálogo configurado neste projeto.
const storeId = "ccb44ea6-7025-4873-9396-c0f1eb52bb59";
// const storeId = "7f7b49ee-cd63-4c0c-a48a-1461bb7eaa13";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Ocorreu um erro inesperado. Tente novamente.";
}

function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [checkingAccess, setCheckingAccess] = useState(false);
  const [hasStoreAccess, setHasStoreAccess] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [codeValid, setCodeValid] = useState(false);
  const [checkingCode, setCheckingCode] = useState(false);
  const [codeError, setCodeError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [pageError, setPageError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [formOpen, setFormOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [savingProduct, setSavingProduct] = useState(false);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) setLoginError(error.message);
      setSession(data.session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setAuthLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    // Sem sessão a tela de login é exibida; o estado é zerado no próximo loadStore.
    if (!session) return;

    // Captura o ID após confirmar que a sessão existe, evitando o erro de null
    // dentro da função assíncrona.
    const userId = session.user.id;

    async function loadStore() {
      setProducts([]);
      setCheckingAccess(true);
      setLoadingProducts(true);
      setPageError("");
      setHasStoreAccess(false);

      try {
        if (!catalogId) {
          throw new Error(
            "Configure VITE_SUPABASE_CATALOGO_ID no arquivo .env.local."
          );
        }

        // Confere que a conta autenticada pertence à loja deste catálogo.
        const { data: membership, error: membershipError } = await supabase
          .from("loja_usuario")
          .select("id_loja")
          .eq("id_loja", storeId)
          .eq("id_usuario", userId)
          .maybeSingle();

        if (membershipError) {
          throw new Error(
            `Não foi possível verificar o vínculo com a loja: ${membershipError.message}`
          );
        }

        if (!membership) {
          throw new Error(
            "Esta conta não está vinculada à loja deste catálogo. Entre com a conta correta ou vincule o usuário em loja_usuario."
          );
        }

        if (cancelled) return;

        setHasStoreAccess(true);

        // Reaproveita a validação gravada no Supabase para o ciclo vigente.
        const { data: monthlyAccess, error: monthlyAccessError } = await supabase.rpc(
          "verificar_assinatura_mensal",
          { p_id_loja: storeId }
        );

        if (monthlyAccessError) {
          throw new Error(
            `Não foi possível verificar a validação mensal: ${monthlyAccessError.message}`
          );
        }

        if (cancelled) return;

        if (monthlyAccess === true) {
          const data = await getProducts();
          if (cancelled) return;
          setProducts(data);
          setCodeValid(true);
          setCodeError("");
        } else {
          setProducts([]);
          setCodeValid(false);
        }
      } catch (error) {
        if (!cancelled) setPageError(getErrorMessage(error));
      } finally {
        if (!cancelled) {
          setCheckingAccess(false);
          setLoadingProducts(false);
        }
      }
    }

    void loadStore();

    return () => {
      cancelled = true;
    };
  }, [session]);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))].sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);
      const matchesCategory =
        categoryFilter === "Todas" || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      setPassword("");
    } catch (error) {
      setLoginError(getErrorMessage(error));
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) setPageError(`Não foi possível sair: ${error.message}`);
  };

  const verifyCurrentCode = async (code: string): Promise<boolean> => {
    const { data, error } = await supabase.rpc("validar_codigo_mensal", {
      p_id_loja: storeId,
      p_codigo: code.trim().toUpperCase(),
    });
    if (error) throw new Error(`Não foi possível validar o código mensal: ${error.message}`);
    return data === true;
  };

  const handleVerifyCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCheckingCode(true);
    setCodeError("");
    setPageError("");

    try {
      const valid = await verifyCurrentCode(accessCode);
      if (!valid) {
        setCodeValid(false);
        setProducts([]);
        setCodeError("O código mensal está incorreto ou não existe um ciclo vigente.");
        return;
      }

      const data = await getProducts();
      setProducts(data);
      setCodeValid(true);
      setAccessCode((current) => current.trim().toUpperCase());
      setCodeError("");
    } catch (error) {
      setCodeValid(false);
      setProducts([]);
      setCodeError(getErrorMessage(error));
    } finally {
      setCheckingCode(false);
    }
  };

  const requireValidCurrentCode = async (): Promise<boolean> => {
    const { data, error } = await supabase.rpc("verificar_assinatura_mensal", {
      p_id_loja: storeId,
    });

    if (error) {
      throw new Error(`Não foi possível verificar a validação mensal: ${error.message}`);
    }

    if (data !== true) {
      setCodeValid(false);
      setProducts([]);
      setFormOpen(false);
      setCodeError("A validação mensal não está mais válida. Informe o código do mês atual para continuar.");
      return false;
    }
    return true;
  };

  const openNewProduct = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setPageError("");
    setFormOpen(true);
  };

  const openEditProduct = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      oldPrice: product.oldPrice == null ? "" : String(product.oldPrice),
      rating: String(product.rating ?? 5),
      image: product.image,
      badge: product.badge ?? "",
    });
    setFormError("");
    setPageError("");
    setFormOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setPageError("");

    const price = Number(form.price.replace(",", "."));
    const oldPrice =
      form.oldPrice.trim() === ""
        ? undefined
        : Number(form.oldPrice.replace(",", "."));
    const rating = Number(form.rating.replace(",", "."));

    if (!form.name.trim() || !form.category.trim()) {
      setFormError("Preencha o nome e a categoria do produto.");
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setFormError("Informe um preço válido.");
      return;
    }
    if (
      oldPrice !== undefined &&
      (!Number.isFinite(oldPrice) || oldPrice < 0)
    ) {
      setFormError("Informe um preço anterior válido ou deixe o campo vazio.");
      return;
    }
    if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
      setFormError("A avaliação deve estar entre 0 e 5.");
      return;
    }

    const product: Product = {
      id: editingId ?? crypto.randomUUID(),
      name: form.name.trim(),
      category: form.category.trim(),
      price,
      ...(oldPrice !== undefined ? { oldPrice } : {}),
      rating,
      image: form.image.trim(),
      ...(form.badge.trim() ? { badge: form.badge.trim() } : {}),
    };

    setSavingProduct(true);
    try {
      const codeIsValid = await requireValidCurrentCode();
      if (!codeIsValid) return;
      const saved = await saveProductToSupabase(product);
      setProducts((current) => {
        const exists = current.some((item) => item.id === saved.id);
        return exists
          ? current.map((item) => (item.id === saved.id ? saved : item))
          : [...current, saved];
      });
      setFormOpen(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDelete = useCallback(async (product: Product) => {
    const confirmed = window.confirm(
      `Deseja realmente excluir "${product.name}"?`
    );
    if (!confirmed) return;

    setPageError("");
    try {
      const codeIsValid = await requireValidCurrentCode();
      if (!codeIsValid) return;
      await deleteProductFromSupabase(product.id);
      setProducts((current) =>
        current.filter((item) => item.id !== product.id)
      );
    } catch (error) {
      setPageError(getErrorMessage(error));
    }
  }, [accessCode]);

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--page-bg)] px-4 text-[var(--text-primary)]">
        <p className="text-sm text-muted">Verificando sua sessão...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--page-bg)] px-4 py-10 text-[var(--text-primary)]">
        <section className="w-full max-w-md rounded-3xl border border-fg/10 bg-fg/[0.03] p-7 shadow-2xl sm:p-9">
          <a
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition hover:text-violet-400"
          >
            <ArrowLeft size={16} />
            Voltar ao catálogo
          </a>

          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
            <LockKeyholeFallback />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-400">
            Área restrita
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            Administração<span className="text-violet-400">.</span>
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            Entre com o e-mail e a senha da sua conta Supabase para gerenciar os
            produtos da loja.
          </p>

          <form onSubmit={handleLogin} className="mt-7 space-y-5">
            <label className="block text-sm text-fg/80">
              E-mail
              <input
                className={inputClass}
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@exemplo.com"
                required
              />
            </label>

            <label className="block text-sm text-fg/80">
              Senha
              <input
                className={inputClass}
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Sua senha"
                required
              />
            </label>

            {loginError && (
              <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loginLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  if (checkingAccess || loadingProducts) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--page-bg)] px-4 text-[var(--text-primary)]">
        <p className="text-sm text-muted">Verificando acesso à loja...</p>
      </main>
    );
  }

  if (!hasStoreAccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--page-bg)] px-4 py-10 text-[var(--text-primary)]">
        <section className="w-full max-w-lg rounded-3xl border border-fg/10 bg-fg/[0.03] p-7 sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-400">
            Acesso à loja
          </p>
          <h1 className="mt-2 text-2xl font-bold">Não foi possível abrir o painel</h1>
          <p role="alert" className="mt-4 text-sm leading-6 text-red-300">
            {pageError || "Sua conta não tem acesso a esta loja."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-500"
            >
              Tentar novamente
            </button>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="rounded-xl border border-fg/10 px-4 py-3 text-sm font-semibold text-fg/80 hover:bg-fg/5"
            >
              Sair da conta
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (!codeValid) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--page-bg)] px-4 py-10 text-[var(--text-primary)]">
        <section className="w-full max-w-md rounded-3xl border border-fg/10 bg-fg/[0.03] p-7 shadow-2xl sm:p-9">
          <a href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition hover:text-violet-400">
            <ArrowLeft size={16} /> Voltar ao catálogo
          </a>
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
            <LockKeyholeFallback />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-400">Validação obrigatória</p>
          <h1 className="mt-2 text-2xl font-bold">Código mensal da loja</h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Para administrar os produtos, informe o código mensal que você recebeu. A validação vale para o ciclo mensal vigente.
          </p>
          <form onSubmit={handleVerifyCode} className="mt-7 space-y-5">
            <label className="block text-sm text-fg/80">
              Código mensal
              <input
                className={inputClass}
                type="text"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                value={accessCode}
                onChange={(event) => setAccessCode(event.target.value.toUpperCase())}
                placeholder="Digite o código do mês"
                required
              />
            </label>
            {codeError && <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{codeError}</p>}
            <button type="submit" disabled={checkingCode || !accessCode.trim()} className="w-full rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60">
              {checkingCode ? "Validando código..." : "Validar código e acessar o painel"}
            </button>
            <button type="button" onClick={() => void handleLogout()} className="w-full rounded-xl border border-fg/10 px-5 py-3 text-sm font-semibold text-fg/80 transition hover:bg-fg/5">
              Sair da conta
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--page-bg)] px-4 py-8 text-[var(--text-primary)] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <a
              href="/"
              className="mb-5 inline-flex items-center gap-2 text-sm text-muted transition hover:text-violet-400"
            >
              <ArrowLeft size={16} />
              Voltar ao catálogo
            </a>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-400">
              Área restrita · {session.user.email}
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Administração<span className="text-violet-400">.</span>
            </h1>
            <p className="mt-2 text-sm text-muted">
              Gerencie os produtos da sua loja. As alterações são salvas no Supabase.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-fg/10 px-4 py-3 text-sm font-semibold text-fg/80 transition hover:bg-fg/5"
            >
              <LogOut size={17} />
              Sair
            </button>
            <button
              type="button"
              onClick={openNewProduct}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              <Plus size={18} />
              Adicionar produto
            </button>
          </div>
        </header>

        {pageError && (
          <div role="alert" className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {pageError}
          </div>
        )}

        <section className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-fg/10 bg-fg/[0.03] p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Total de produtos</span>
              <Package className="text-violet-400" size={22} />
            </div>
            <p className="mt-4 text-3xl font-bold">{products.length}</p>
            <p className="mt-1 text-xs text-subtle">Produtos no catálogo do Supabase</p>
          </div>
          <div className="rounded-2xl border border-fg/10 bg-fg/[0.03] p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Categorias</span>
              <Tags className="text-violet-400" size={22} />
            </div>
            <p className="mt-4 text-3xl font-bold">{categories.length}</p>
            <p className="mt-1 text-xs text-subtle">Categorias distintas no catálogo</p>
          </div>
        </section>

        {formOpen && (
          <section className="mb-8 rounded-2xl border border-violet-500/30 bg-fg/[0.03] p-5 sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">
                  {editingId ? "Editar produto" : "Novo produto"}
                </h2>
                <p className="mt-1 text-sm text-muted">Preencha as informações abaixo.</p>
              </div>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                aria-label="Fechar formulário"
                className="rounded-lg p-2 text-muted transition hover:bg-fg/10 hover:text-fg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="text-sm text-fg/80">
                  Nome do produto *
                  <input className={inputClass} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ex.: Headphone Wireless" required />
                </label>
                <label className="text-sm text-fg/80">
                  Categoria *
                  <input className={inputClass} list="admin-categories" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="Ex.: Eletrônicos" required />
                  <datalist id="admin-categories">
                    {categories.map((category) => <option key={category} value={category} />)}
                  </datalist>
                </label>
                <label className="text-sm text-fg/80">
                  Preço (R$) *
                  <input className={inputClass} type="number" min="0" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="199.90" required />
                </label>
                <label className="text-sm text-fg/80">
                  Preço anterior (R$)
                  <input className={inputClass} type="number" min="0" step="0.01" value={form.oldPrice} onChange={(event) => setForm({ ...form, oldPrice: event.target.value })} placeholder="Opcional" />
                </label>
                <label className="text-sm text-fg/80">
                  Avaliação (0 a 5)
                  <input className={inputClass} type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(event) => setForm({ ...form, rating: event.target.value })} />
                </label>
                <label className="text-sm text-fg/80">
                  Selo
                  <input className={inputClass} value={form.badge} onChange={(event) => setForm({ ...form, badge: event.target.value })} placeholder="Ex.: Novo, Destaque" />
                </label>
              </div>

              <label className="block text-sm text-fg/80">
                URL da imagem
                <div className="relative">
                  <ImagePlus size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
                  <input className={`${inputClass} pl-11`} type="url" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} placeholder="https://exemplo.com/imagem.jpg" />
                </div>
              </label>

              {form.image && (
                <div className="overflow-hidden rounded-xl border border-fg/10 bg-surface p-3">
                  <p className="mb-3 text-xs text-muted">Prévia da imagem</p>
                  <img src={form.image} alt="Prévia do produto" className="h-44 w-full rounded-lg object-contain" onError={(event) => { event.currentTarget.style.visibility = "hidden"; }} onLoad={(event) => { event.currentTarget.style.visibility = "visible"; }} />
                </div>
              )}

              {formError && <p role="alert" className="text-sm text-red-400">{formError}</p>}

              <div className="flex flex-wrap gap-3">
                <button type="submit" disabled={savingProduct} className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-60">
                  {savingProduct ? "Salvando..." : editingId ? "Salvar alterações" : "Cadastrar produto"}
                </button>
                <button type="button" onClick={() => setFormOpen(false)} disabled={savingProduct} className="rounded-xl border border-fg/10 px-5 py-3 text-sm font-semibold text-fg/80 transition hover:bg-fg/5">
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="overflow-hidden rounded-2xl border border-fg/10 bg-fg/[0.02]">
          <div className="flex flex-col gap-4 border-b border-fg/10 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Produtos cadastrados</h2>
              <p className="mt-1 text-sm text-subtle">{filteredProducts.length} resultado(s)</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar produto..." aria-label="Buscar produto" className="w-full rounded-xl border border-fg/10 bg-surface py-2.5 pl-10 pr-4 text-sm outline-none focus:border-violet-500 sm:w-56" />
              </div>
              <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} aria-label="Filtrar por categoria" className="rounded-xl border border-fg/10 bg-surface px-3 py-2.5 text-sm outline-none focus:border-violet-500">
                <option value="Todas">Todas as categorias</option>
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>
          </div>

          {loadingProducts ? (
            <p className="px-5 py-14 text-center text-sm text-muted">Carregando produtos...</p>
          ) : filteredProducts.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <Package size={32} className="mx-auto text-subtle" />
              <p className="mt-3 font-medium">Nenhum produto encontrado</p>
              <p className="mt-1 text-sm text-subtle">Experimente mudar a busca ou cadastrar um produto.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-fg/[0.03] text-xs uppercase tracking-wider text-subtle">
                  <tr>
                    <th className="px-5 py-4 font-medium">Produto</th>
                    <th className="px-5 py-4 font-medium">Categoria</th>
                    <th className="px-5 py-4 font-medium">Preço</th>
                    <th className="px-5 py-4 font-medium">Avaliação</th>
                    <th className="px-5 py-4 text-right font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-fg/5">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="transition hover:bg-fg/[0.02]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {product.image ? (
                            <img src={product.image} alt="" className="h-12 w-12 rounded-lg bg-fg/10 object-cover" />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-fg/10">
                              <ImagePlus size={18} className="text-subtle" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-fg">{product.name}</p>
                            <p className="mt-1 text-xs text-subtle">ID: {product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-muted">{product.category}</td>
                      <td className="px-5 py-4 font-medium text-fg">
                        {formatPrice(product.price)}
                        {product.oldPrice != null && <p className="mt-1 text-xs text-subtle line-through">{formatPrice(product.oldPrice)}</p>}
                      </td>
                      <td className="px-5 py-4 text-fg/80">★ {product.rating ?? "—"}</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => openEditProduct(product)} title="Editar produto" aria-label={`Editar ${product.name}`} className="rounded-lg border border-fg/10 p-2.5 text-fg/80 transition hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-violet-300">
                            <Pencil size={16} />
                          </button>
                          <button type="button" onClick={() => void handleDelete(product)} title="Excluir produto" aria-label={`Excluir ${product.name}`} className="rounded-lg border border-fg/10 p-2.5 text-fg/80 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function LockKeyholeFallback() {
  // Ícone simples em SVG para não depender de um ícone extra no import.
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="15" r="1" />
    </svg>
  );
}

export default Admin;
