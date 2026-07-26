# Aromas do Lar - Catálogo Digital

Site de catálogo digital elegante e funcional para loja de velas aromáticas e velas religiosas.

## Características

- Design minimalista e elegante
- Paleta de cores suave (branco, bege, tons neutros)
- Tipografia limpa e legível
- Navegação simples e intuitiva
- Totalmente responsivo
- Filtros por categoria de produtos
- Integração direta com WhatsApp

## Estrutura de Arquivos

- `index.html` / `produto.html` - Páginas do site
- `styles.css` - Estilos e design visual
- `script.js` - Funcionalidades JavaScript (carrega o catálogo via `/api/catalogo`)
- `api/` - Vercel Functions que leem/gravam no Postgres (Neon)
- `scripts/schema.sql` - Definição das tabelas do banco
- `scripts/seed.mjs` - Popula o banco com os produtos e textos iniciais
- `imagens/` - Fotos dos produtos
- `README.md` - Este arquivo

## Banco de Dados (Neon Postgres)

Produtos, categorias e os textos do site (WhatsApp, Instagram, hero, rodapé) agora
ficam no banco, não mais hardcoded em `script.js`. O site continua estático — só
foi adicionada uma pasta `api/` com Vercel Functions que leem do Postgres.

### Setup (uma vez só)

1. **Criar o banco**: no painel da Vercel, abra o projeto → aba *Storage* →
   *Marketplace* → *Neon* → criar. Isso já injeta a variável `DATABASE_URL`
   em Production/Preview/Development automaticamente.
2. **Criar as tabelas**: cole o conteúdo de [scripts/schema.sql](scripts/schema.sql)
   no SQL Editor do Neon (ou rode `psql "$DATABASE_URL" -f scripts/schema.sql`
   se tiver o `psql` instalado).
3. **Puxar as variáveis de ambiente para local**:
   ```bash
   npm install -g vercel   # se ainda não tiver o CLI
   vercel link             # conecta esta pasta ao projeto na Vercel
   vercel env pull .env.local
   ```
4. **Popular o banco com os produtos atuais**:
   ```bash
   npm install
   npm run seed
   ```
   Isso insere as categorias, os 21 produtos e os textos do site. Rodar de
   novo não duplica nada (usa `ON CONFLICT ... DO UPDATE`).
5. **Testar localmente**: `vercel dev` sobe o site + as funções de `api/`
   juntos (abrir `http://localhost:3000`).
6. **Deploy**: `git push` como sempre — a Vercel builda e usa a mesma
   `DATABASE_URL` de produção.

### Alterar Número do WhatsApp, Instagram e textos

Depois que o painel de admin estiver pronto, isso será feito por lá. Até
lá, pode editar direto na tabela `config` do Neon (chaves: `whatsapp`,
`instagram`, `hero_titulo`, `hero_texto`, `footer_texto`).

### Adicionar ou Editar Produtos

Mesma ideia: por enquanto, direto na tabela `produtos` do Neon (SQL Editor)
ou reeditando `scripts/seed.mjs` e rodando `npm run seed` de novo. O CRUD
pelo admin está no roadmap.

### Adicionar Imagens de Produtos Novos

Por enquanto, coloque o arquivo em `imagens/` e referencie o caminho
(`/imagens/arquivo.webp`) no campo `imagens` do produto. Upload direto pelo
admin (Vercel Blob) está no roadmap.

## Como Usar

Este projeto tem duas partes: o site (estático) e a API (`api/`, que fala
com o Postgres). Abrir `index.html` direto no navegador **não funciona mais
sozinho** — sem a API, o catálogo não carrega. Para rodar:

- **Local**: `vercel dev` (depois de seguir o setup do banco acima)
- **Produção**: `git push` para o repositório conectado à Vercel

## Requisitos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexão com internet (para carregar as fontes do Google Fonts e a API)
- Node.js 18+ e conta na Vercel (para rodar/publicar)

## Suporte

Para dúvidas ou suporte, entre em contato através do WhatsApp ou Instagram configurados no site.
