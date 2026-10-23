
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ImagePlus,
  Package,
  Pencil,
  Plus,
  Search,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import type { Product } from "../components/ProductCard";

interface AdminProps {
  products: Product[];
  onSave: (product: Product) => void;
  onDelete: (id: string) => void;
}

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
  "mt-2 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500";

const formatPrice = (price: number) =>
  price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

function Admin({ products, onSave, onDelete }: AdminProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState("");

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
        categoryFilter === "Todas" ||
        product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  function openNewProduct() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setFormOpen(true);
  }

  function openEditProduct(product: Product) {
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
    setError("");
    setFormOpen(true);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const price = Number(form.price.replace(",", "."));
    const oldPrice =
      form.oldPrice.trim() === ""
        ? undefined
        : Number(form.oldPrice.replace(",", "."));
    const rating = Number(form.rating.replace(",", "."));

    if (!form.name.trim() || !form.category.trim()) {
      setError("Preencha o nome e a categoria do produto.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setError("Informe um preço válido.");
      return;
    }

    if (
      oldPrice !== undefined &&
      (!Number.isFinite(oldPrice) || oldPrice < 0)
    ) {
      setError("Informe um preço anterior válido ou deixe o campo vazio.");
      return;
    }

    if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
      setError("A avaliação deve estar entre 0 e 5.");
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

    onSave(product);
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function handleDelete(product: Product) {
    const confirmed = window.confirm(
      `Deseja realmente excluir "${product.name}"?`
    );

    if (confirmed) {
      onDelete(product.id);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--page-bg)] px-4 py-8 text-[var(--text-primary)] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <a
              href="/"
              className="mb-5 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-violet-400"
            >
              <ArrowLeft size={16} />
              Voltar ao catálogo
            </a>

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-400">
              Área restrita
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Administração<span className="text-violet-400">.</span>
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Gerencie os produtos do seu catálogo.
            </p>
          </div>

          <button
            type="button"
            onClick={openNewProduct}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
          >
            <Plus size={18} />
            Adicionar produto
          </button>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Total de produtos</span>
              <Package className="text-violet-400" size={22} />
            </div>
            <p className="mt-4 text-3xl font-bold">{products.length}</p>
            <p className="mt-1 text-xs text-zinc-500">
              Produtos cadastrados no navegador
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Categorias</span>
              <Tags className="text-violet-400" size={22} />
            </div>
            <p className="mt-4 text-3xl font-bold">{categories.length}</p>
            <p className="mt-1 text-xs text-zinc-500">
              Categorias distintas no catálogo
            </p>
          </div>
        </section>

        {formOpen && (
          <section className="mb-8 rounded-2xl border border-violet-500/30 bg-white/[0.03] p-5 sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">
                  {editingId ? "Editar produto" : "Novo produto"}
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Preencha as informações abaixo.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setFormOpen(false)}
                aria-label="Fechar formulário"
                className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="text-sm text-zinc-300">
                  Nome do produto *
                  <input
                    className={inputClass}
                    value={form.name}
                    onChange={(event) =>
                      setForm({ ...form, name: event.target.value })
                    }
                    placeholder="Ex.: Headphone Wireless"
                    required
                  />
                </label>

                <label className="text-sm text-zinc-300">
                  Categoria *
                  <input
                    className={inputClass}
                    list="admin-categories"
                    value={form.category}
                    onChange={(event) =>
                      setForm({ ...form, category: event.target.value })
                    }
                    placeholder="Ex.: Eletrônicos"
                    required
                  />
                  <datalist id="admin-categories">
                    {categories.map((category) => (
                      <option key={category} value={category} />
                    ))}
                  </datalist>
                </label>

                <label className="text-sm text-zinc-300">
                  Preço (R$) *
                  <input
                    className={inputClass}
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(event) =>
                      setForm({ ...form, price: event.target.value })
                    }
                    placeholder="199,90"
                    required
                  />
                </label>

                <label className="text-sm text-zinc-300">
                  Preço anterior (R$)
                  <input
                    className={inputClass}
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.oldPrice}
                    onChange={(event) =>
                      setForm({ ...form, oldPrice: event.target.value })
                    }
                    placeholder="Opcional"
                  />
                </label>

                <label className="text-sm text-zinc-300">
                  Avaliação (0 a 5)
                  <input
                    className={inputClass}
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={form.rating}
                    onChange={(event) =>
                      setForm({ ...form, rating: event.target.value })
                    }
                  />
                </label>

                <label className="text-sm text-zinc-300">
                  Selo
                  <input
                    className={inputClass}
                    value={form.badge}
                    onChange={(event) =>
                      setForm({ ...form, badge: event.target.value })
                    }
                    placeholder="Ex.: Novo, Destaque"
                  />
                </label>
              </div>

              <label className="block text-sm text-zinc-300">
                URL da imagem
                <div className="relative">
                  <ImagePlus
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                  <input
                    className={`${inputClass} pl-11`}
                    type="url"
                    value={form.image}
                    onChange={(event) =>
                      setForm({ ...form, image: event.target.value })
                    }
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
              </label>

              {form.image && (
                <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900 p-3">
                  <p className="mb-3 text-xs text-zinc-400">Prévia da imagem</p>
                  <img
                    src={form.image}
                    alt="Prévia do produto"
                    className="h-44 w-full rounded-lg object-contain"
                    onError={(event) => {
                      event.currentTarget.style.visibility = "hidden";
                    }}
                    onLoad={(event) => {
                      event.currentTarget.style.visibility = "visible";
                    }}
                  />
                </div>
              )}

              {error && (
                <p role="alert" className="text-sm text-red-400">
                  {error}
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
                >
                  {editingId ? "Salvar alterações" : "Cadastrar produto"}
                </button>

                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/5"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
          <div className="flex flex-col gap-4 border-b border-white/10 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Produtos cadastrados</h2>
              <p className="mt-1 text-sm text-zinc-500">
                {filteredProducts.length} resultado(s)
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar produto..."
                  aria-label="Buscar produto"
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-violet-500 sm:w-56"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                aria-label="Filtrar por categoria"
                className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm outline-none focus:border-violet-500"
              >
                <option value="Todas">Todas as categorias</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <Package size={32} className="mx-auto text-zinc-600" />
              <p className="mt-3 font-medium">Nenhum produto encontrado</p>
              <p className="mt-1 text-sm text-zinc-500">
                Experimente mudar a busca ou cadastrar um produto.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-zinc-500">
                  <tr>
                    <th className="px-5 py-4 font-medium">Produto</th>
                    <th className="px-5 py-4 font-medium">Categoria</th>
                    <th className="px-5 py-4 font-medium">Preço</th>
                    <th className="px-5 py-4 font-medium">Avaliação</th>
                    <th className="px-5 py-4 text-right font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="transition hover:bg-white/[0.02]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt=""
                              className="h-12 w-12 rounded-lg bg-zinc-800 object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-800">
                              <ImagePlus size={18} className="text-zinc-500" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-white">
                              {product.name}
                            </p>
                            <p className="mt-1 text-xs text-zinc-500">
                              ID: {product.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-zinc-400">
                        {product.category}
                      </td>
                      <td className="px-5 py-4 font-medium text-white">
                        {formatPrice(product.price)}
                        {product.oldPrice != null && (
                          <p className="mt-1 text-xs text-zinc-500 line-through">
                            {formatPrice(product.oldPrice)}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-zinc-300">
                        ★ {product.rating ?? "—"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditProduct(product)}
                            title="Editar produto"
                            aria-label={`Editar ${product.name}`}
                            className="rounded-lg border border-white/10 p-2.5 text-zinc-300 transition hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-violet-300"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(product)}
                            title="Excluir produto"
                            aria-label={`Excluir ${product.name}`}
                            className="rounded-lg border border-white/10 p-2.5 text-zinc-300 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
                          >
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

        <p className="mt-5 text-xs leading-5 text-zinc-500">
          As alterações desta versão ficam salvas no armazenamento local deste
          navegador. Elas não são compartilhadas com outros dispositivos.
        </p>
      </div>
    </main>
  );
}

export default Admin;
