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
- `login.html` / `admin.html` - Painel administrativo
- `admin.js` / `admin.css` - Lógica e estilo do painel administrativo
- `api/` - Vercel Functions (catálogo público em `api/catalogo.js`,
  autenticação em `api/login.js`/`api/_auth.js`, CRUD em `api/admin/`)
- `scripts/schema.sql` - Definição das tabelas do banco
- `scripts/seed.mjs` - Popula o banco com os produtos e textos iniciais
- `scripts/gerar-hash-senha.mjs` - Gera o hash para `ADMIN_PASSWORD_HASH`
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

### Adicionar Imagens de Produtos Novos

Por enquanto, coloque o arquivo em `imagens/` e referencie o caminho
(`/imagens/arquivo.webp`) no campo de imagens do produto, pelo admin (abaixo).
Upload direto de arquivo pelo admin (Vercel Blob) está no roadmap.

## Painel Administrativo

Acesse `/login.html` (ex: `https://seu-site.vercel.app/login.html`) para
gerenciar produtos, categorias e os textos do site (WhatsApp, Instagram,
hero, rodapé) sem mexer em código ou no banco diretamente.

### Setup (uma vez só)

1. **Escolha uma senha e gere o hash** (o admin não guarda a senha em texto
   puro, só o hash SHA-256 dela):
   ```bash
   node scripts/gerar-hash-senha.mjs "sua-senha-aqui"
   ```
2. **Configure as variáveis de ambiente** no painel da Vercel (Settings →
   Environment Variables), em Production, Preview e Development:
   - `ADMIN_PASSWORD_HASH` — o hash gerado no passo 1
   - `SESSION_SECRET` — uma string aleatória longa, só para assinar o cookie
     de sessão (pode gerar uma com `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
3. **Puxe as variáveis para local** (se for testar com `vercel dev`):
   ```bash
   vercel env pull .env.local
   ```

### Uso

- Login em `/login.html`, senha do passo 1. A sessão dura 7 dias (cookie
  `HttpOnly`, assinado, não fica acessível via JavaScript).
- **Produtos**: criar, editar, ocultar/mostrar no site (sem excluir),
  reordenar (setas ↑↓) e excluir.
- **Categorias**: criar, editar, ocultar, reordenar. Não é possível excluir
  uma categoria que ainda tem produtos — mova-os primeiro.
- **Configurações**: WhatsApp, Instagram e os textos do início/rodapé do
  site, refletindo no `index.html` na próxima visita (cache de até 60s).
- **Sair** desconecta a sessão.

Segurança: há um limite simples de tentativas de login por IP (10 a cada 15
minutos). Ele reseta a cada "cold start" da função serverless — não é uma
proteção robusta contra força bruta, mas dificulta tentativas automatizadas
básicas. Para algo mais forte no futuro, considere um serviço dedicado
(ex: Vercel WAF/Firewall).

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
