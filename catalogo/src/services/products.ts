import { supabase } from "../lib/supabase";
import type { Product } from "../components/ProductCard";

interface ProductRow {
  id_produto: string;
  id_catalogo: string;
  nome: string;
  categoria: string;
  preco: number | string;
  preco_antigo: number | string | null;
  avaliacao: number | string | null;
  badge: string | null;
  imagem: string | null;
}

const catalogId = import.meta.env.VITE_SUPABASE_CATALOGO_ID as
  | string
  | undefined;

function requireCatalogId(): string {
  if (!catalogId) {
    throw new Error(
      "Configure VITE_SUPABASE_CATALOGO_ID no .env.local com o UUID do catálogo."
    );
  }
  return catalogId;
}

function fromRow(row: ProductRow): Product {
  return {
    id: row.id_produto,
    name: row.nome,
    category: row.categoria,
    price: Number(row.preco),
    oldPrice:
      row.preco_antigo == null ? undefined : Number(row.preco_antigo),
    rating: row.avaliacao == null ? undefined : Number(row.avaliacao),
    badge: row.badge ?? undefined,
    image: row.imagem ?? "",
  };
}

function toRow(product: Product, idCatalogo: string) {
  return {
    id_catalogo: idCatalogo,
    nome: product.name.trim(),
    categoria: product.category.trim(),
    preco: product.price,
    preco_antigo: product.oldPrice ?? null,
    avaliacao: product.rating ?? null,
    badge: product.badge ?? null,
    imagem: product.image || null,
  };
}

export async function getProducts(): Promise<Product[]> {
  const idCatalogo = requireCatalogId();

  const { data, error } = await supabase
    .from("produto")
    .select(
      "id_produto, id_catalogo, nome, categoria, preco, preco_antigo, avaliacao, badge, imagem"
    )
    .eq("id_catalogo", idCatalogo)
    .order("nome", { ascending: true });

  if (error) throw error;
  return ((data ?? []) as ProductRow[]).map(fromRow);
}

export async function saveProduct(product: Product): Promise<Product> {
  const idCatalogo = requireCatalogId();
  const payload = toRow(product, idCatalogo);

  // O banco usa UUID. Produtos carregados do Supabase já possuem UUID;
  // um produto novo sem UUID válido será inserido com ID gerado pelo banco.
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      product.id
    );

  const query = isUuid
    ? supabase
        .from("produto")
        .upsert(
          { ...payload, id_produto: product.id },
          { onConflict: "id_produto" }
        )
    : supabase.from("produto").insert(payload);

  const { data, error } = await query
    .select(
      "id_produto, id_catalogo, nome, categoria, preco, preco_antigo, avaliacao, badge, imagem"
    )
    .single();

  if (error) throw error;
  return fromRow(data as ProductRow);
}

export async function deleteProduct(id: string): Promise<void> {
  requireCatalogId();

  const { error } = await supabase
    .from("produto")
    .delete()
    .eq("id_produto", id)
    .eq("id_catalogo", catalogId!);

  if (error) throw error;
}
