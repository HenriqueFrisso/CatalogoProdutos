# Catálogo

Catálogo de produtos online (sem carrinho ou compra). Os produtos vêm do Supabase e são gerenciados por um painel administrativo.

## Funcionalidades

- Lista de produtos com filtro por categoria e busca (ignora maiúsculas e acentos)
- Modal com os detalhes do produto
- Favoritos salvos no navegador
- Tema claro e escuro
- Páginas Sobre e Contato
- Painel em `/admin` com login do Supabase para criar, editar e excluir produtos

## Tecnologias

React 19, TypeScript, Vite, Tailwind CSS 4, Motion, lucide-react e Supabase.

## Como rodar

```bash
npm install
npm run dev
```

Crie um `.env.local` na raiz do projeto:

```
VITE_SUPABASE_URL=https://<projeto>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<chave pública>
VITE_SUPABASE_CATALOGO_ID=<uuid do catálogo>
```

Na Vercel, cadastre as mesmas variáveis em *Settings → Environment Variables*.

## Scripts

- `npm run dev`: servidor de desenvolvimento
- `npm run build`: checagem de tipos e build de produção
- `npm run lint`: ESLint
- `npm run preview`: serve o build localmente
