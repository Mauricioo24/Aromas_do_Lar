// Catálogo carregado da API (/api/catalogo), que por sua vez lê do Postgres (Neon).
// Preenchido por carregarCatalogo() antes de qualquer renderização.
let CATALOGO = { produtos: [], categorias: [], config: {} };

const WHATSAPP_PADRAO = "5511995618384";

async function carregarCatalogo() {
    const resposta = await fetch("/api/catalogo");
    if (!resposta.ok) {
        throw new Error(`Falha ao carregar catálogo (status ${resposta.status})`);
    }
    CATALOGO = await resposta.json();
    return CATALOGO;
}

// Função auxiliar para obter um produto pelo ID
function obterProdutoPorId(id) {
    return CATALOGO.produtos.find((produto) => produto.id === id);
}

// Função para abrir página de detalhes do produto
function abrirPaginaProduto(id) {
    window.location.href = `produto.html?id=${id}`;
}

// Função para obter nome amigável da categoria a partir do slug
function obterNomeCategoria(categoria) {
    const encontrada = CATALOGO.categorias.find((c) => c.slug === categoria);
    if (encontrada) return encontrada.nome;
    return categoria
        ? categoria.charAt(0).toUpperCase() + categoria.slice(1)
        : "";
}

function obterNumeroWhatsapp() {
    return CATALOGO.config.whatsapp || WHATSAPP_PADRAO;
}

// Limite de caracteres da descrição no card (o restante aparece na página do produto)
const LIMITE_DESCRICAO_CARD = 100;

// Trunca a descrição para exibir no card; texto completo fica na página de detalhes
function truncarDescricao(texto, maxCaracteres = LIMITE_DESCRICAO_CARD) {
    if (!texto || typeof texto !== "string") return "";
    const limpo = texto.replace(/\s+/g, " ").trim();
    if (limpo.length <= maxCaracteres) return texto;
    return limpo.slice(0, maxCaracteres).trim() + "…";
}

// Função para criar card de produto (lista do catálogo)
function criarCardProduto(produto) {
    const categoriaNome = obterNomeCategoria(produto.categoria);
    const mensagemWhatsApp = encodeURIComponent(
        `Olá! Gostaria de saber mais sobre a ${produto.nome} da Aromas do Lar.`
    );
    const linkWhatsApp = `https://wa.me/${obterNumeroWhatsapp()}?text=${mensagemWhatsApp}`;
    const imagemPrincipal = Array.isArray(produto.imagens)
        ? produto.imagens[0]
        : produto.imagem;
    const descricaoResumida = truncarDescricao(produto.descricao);

    return `
        <div class="produto-card" data-categoria="${produto.categoria}" onclick="abrirPaginaProduto(${produto.id})">
            <div class="produto-imagem">
                <img src="${imagemPrincipal}" alt="${produto.nome}" loading="lazy">
            </div>
            <div class="produto-info">
                <span class="produto-categoria">${categoriaNome}</span>
                <h3 class="produto-nome">${produto.nome}</h3>
                <p class="produto-descricao">${descricaoResumida}</p>
                <p class="produto-valor"><strong>${produto.valor}</strong></p>
                <a href="${linkWhatsApp}" class="btn-whatsapp" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">
                    Falar no WhatsApp
                </a>
            </div>
        </div>
    `;
}

// Função para renderizar produtos (página principal)
function renderizarProdutos(categoria = "todos") {
    const grid = document.getElementById("produtos-grid");
    if (!grid) return;

    let produtosFiltrados = CATALOGO.produtos;

    if (categoria !== "todos") {
        produtosFiltrados = CATALOGO.produtos.filter(
            (produto) => produto.categoria === categoria
        );
    }

    if (produtosFiltrados.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--cor-texto-suave);">
                <p style="font-size: 1.125rem;">Nenhum produto encontrado nesta categoria.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = produtosFiltrados
        .map((produto) => criarCardProduto(produto))
        .join("");
}

// Função para montar e inicializar os botões de filtro (página principal)
function inicializarFiltros() {
    const container = document.getElementById("categoria-filtros");
    if (!container) return;

    const botoes = [{ slug: "todos", nome: "Todos os Produtos" }, ...CATALOGO.categorias];

    container.innerHTML = botoes
        .map(
            (c, index) => `
                <button class="filtro-btn${index === 0 ? " active" : ""}" data-categoria="${c.slug}">${c.nome}</button>
            `
        )
        .join("");

    const filtros = container.querySelectorAll(".filtro-btn");
    filtros.forEach((filtro) => {
        filtro.addEventListener("click", function () {
            filtros.forEach((btn) => btn.classList.remove("active"));
            this.classList.add("active");
            renderizarProdutos(this.getAttribute("data-categoria"));
        });
    });
}

// Aplica os textos configuráveis (hero, contato, rodapé) vindos da API
function aplicarConfiguracoes() {
    const { config } = CATALOGO;
    if (!config) return;

    const heroTitulo = document.getElementById("hero-titulo");
    if (heroTitulo && config.hero_titulo) heroTitulo.textContent = config.hero_titulo;

    const heroTexto = document.getElementById("hero-texto");
    if (heroTexto && config.hero_texto) heroTexto.textContent = config.hero_texto;

    const footerTexto = document.getElementById("footer-texto");
    if (footerTexto && config.footer_texto) footerTexto.textContent = config.footer_texto;

    const mensagemGeral = encodeURIComponent(
        "Olá! Gostaria de saber mais sobre os produtos da Aromas do Lar."
    );
    const linkGeral = `https://wa.me/${obterNumeroWhatsapp()}?text=${mensagemGeral}`;

    ["link-whatsapp-contato", "link-whatsapp-nav", "link-whatsapp-hero"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.href = linkGeral;
    });

    const linkInstagram = document.getElementById("link-instagram");
    if (linkInstagram && config.instagram) linkInstagram.href = config.instagram;
}

// Cabeçalho: menu mobile, sombra ao rolar e link ativo (todas as páginas)
function inicializarHeader() {
    const navbar = document.getElementById("navbar");
    const toggle = document.getElementById("nav-toggle");
    const menu = document.getElementById("nav-menu");

    function fecharMenu() {
        if (!menu || !toggle) return;
        menu.classList.remove("nav-aberto");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menu");
    }

    if (toggle && menu) {
        toggle.addEventListener("click", () => {
            const aberto = menu.classList.toggle("nav-aberto");
            toggle.setAttribute("aria-expanded", String(aberto));
            toggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
        });

        // Fecha ao clicar em um item, ao apertar Esc ou ao voltar para desktop
        menu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", fecharMenu);
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") fecharMenu();
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 768) fecharMenu();
        });
    }

    if (navbar) {
        const atualizarSombra = () => {
            navbar.classList.toggle("navbar-scrolled", window.scrollY > 8);
        };
        atualizarSombra();
        window.addEventListener("scroll", atualizarSombra, { passive: true });
    }

    // Destaca no menu a seção visível na tela
    const secoes = Array.from(document.querySelectorAll("section[id]"));
    const links = Array.from(document.querySelectorAll(".nav-link[href*='#']"));

    if (secoes.length && links.length && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    links.forEach((link) => {
                        const alvo = (link.getAttribute("href") || "").split("#")[1];
                        link.classList.toggle("active", alvo === entry.target.id);
                    });
                });
            },
            { rootMargin: "-45% 0px -50% 0px" }
        );

        secoes.forEach((secao) => observer.observe(secao));
    }
}

// Função para scroll suave nos links de navegação (todas as páginas)
function inicializarNavegacao() {
    const navLinks = document.querySelectorAll(".nav-link, .hero-scroll");

    navLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            const href = this.getAttribute("href");

            if (href && href.startsWith("#")) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const navbar = document.getElementById("navbar");
                    const alturaNavbar = navbar ? navbar.offsetHeight : 76;
                    const offsetTop = targetElement.offsetTop - alturaNavbar - 8;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: "smooth",
                    });
                }
            }
        });
    });
}

// Função para inicializar animação dos cards (página principal)
function inicializarAnimacaoCards() {
    const grid = document.getElementById("produtos-grid");
    if (!grid) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
            }
        });
    }, observerOptions);

    setTimeout(() => {
        const cards = document.querySelectorAll(".produto-card");
        cards.forEach((card) => {
            card.style.opacity = "0";
            card.style.transition = "opacity 0.5s ease";
            observer.observe(card);
        });
    }, 100);
}

// Função para renderizar página de detalhes do produto
function renderizarDetalheProduto() {
    const detalheContainer = document.getElementById("produto-detalhe");
    if (!detalheContainer) return;

    const params = new URLSearchParams(window.location.search);
    const idParam = params.get("id");
    const id = idParam ? parseInt(idParam, 10) : NaN;

    const nomeEl = document.getElementById("produto-detalhe-nome");
    const categoriaEl = document.getElementById("produto-detalhe-categoria");
    const descricaoEl = document.getElementById("produto-detalhe-descricao");
    const imagemEl = document.getElementById("produto-detalhe-imagem-principal");
    const valorEl = document.getElementById("produto-detalhe-valor");
    const whatsappEl = document.getElementById("produto-detalhe-whatsapp");
    const miniaturasContainer = document.getElementById("carrossel-miniaturas");
    const botaoAnterior = document.getElementById("carrossel-anterior");
    const botaoProximo = document.getElementById("carrossel-proximo");

    function mostrarNaoEncontrado() {
        if (nomeEl) nomeEl.textContent = "Produto não encontrado";
        if (descricaoEl)
            descricaoEl.textContent =
                "Não foi possível localizar as informações deste produto.";
        if (imagemEl) {
            imagemEl.src =
                "https://via.placeholder.com/600x600/E8E4DD/6B6B6B?text=Produto+não+encontrado";
            imagemEl.alt = "Produto não encontrado";
        }
        if (whatsappEl) whatsappEl.style.display = "none";
    }

    if (!id || isNaN(id)) {
        mostrarNaoEncontrado();
        return;
    }

    const produto = obterProdutoPorId(id);

    if (!produto) {
        mostrarNaoEncontrado();
        return;
    }

    const categoriaNome = obterNomeCategoria(produto.categoria);

    if (nomeEl) nomeEl.textContent = produto.nome;
    if (categoriaEl) categoriaEl.textContent = categoriaNome;
    if (descricaoEl) descricaoEl.textContent = produto.descricao;
    if (valorEl) valorEl.textContent = produto.valor;
    const imagens = Array.isArray(produto.imagens)
        ? produto.imagens
        : [produto.imagem];
    let indiceAtual = 0;

    function atualizarImagemPrincipal() {
        if (!imagemEl) return;
        imagemEl.src = imagens[indiceAtual];
        imagemEl.alt = produto.nome;

        if (miniaturasContainer) {
            const todasMiniaturas = miniaturasContainer.querySelectorAll(
                ".carrossel-miniatura"
            );
            todasMiniaturas.forEach((mini, index) => {
                mini.classList.toggle("carrossel-miniatura-ativa", index === indiceAtual);
            });
        }
    }

    if (miniaturasContainer) {
        miniaturasContainer.innerHTML = "";
        imagens.forEach((src, index) => {
            const mini = document.createElement("button");
            mini.type = "button";
            mini.className = "carrossel-miniatura";
            mini.innerHTML = `<img src="${src}" alt="${produto.nome} - imagem ${index + 1}">`;
            mini.addEventListener("click", () => {
                indiceAtual = index;
                atualizarImagemPrincipal();
            });
            miniaturasContainer.appendChild(mini);
        });
    }

    if (botaoAnterior && imagens.length > 1) {
        botaoAnterior.onclick = () => {
            indiceAtual = (indiceAtual - 1 + imagens.length) % imagens.length;
            atualizarImagemPrincipal();
        };
    }

    if (botaoProximo && imagens.length > 1) {
        botaoProximo.onclick = () => {
            indiceAtual = (indiceAtual + 1) % imagens.length;
            atualizarImagemPrincipal();
        };
    }

    atualizarImagemPrincipal();

    if (whatsappEl) {
        const mensagemWhatsApp = encodeURIComponent(
            `Olá! Gostaria de saber mais sobre a ${produto.nome} da Aromas do Lar.`
        );
        const linkWhatsApp = `https://wa.me/${obterNumeroWhatsapp()}?text=${mensagemWhatsApp}`;
        whatsappEl.href = linkWhatsApp;
        whatsappEl.style.display = "flex";
    }
}

// Mostra um aviso simples quando o catálogo não pôde ser carregado
function mostrarErroCarregamento(erro) {
    console.error(erro);
    const grid = document.getElementById("produtos-grid");
    if (grid) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--cor-texto-suave);">
                <p style="font-size: 1.125rem;">Não foi possível carregar o catálogo agora. Tente novamente em instantes.</p>
            </div>
        `;
    }
    const nomeEl = document.getElementById("produto-detalhe-nome");
    if (nomeEl) nomeEl.textContent = "Não foi possível carregar este produto";
}

// Inicialização quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", async function () {
    // Cabeçalho e navegação funcionam mesmo se o catálogo falhar (todas as páginas)
    inicializarHeader();
    inicializarNavegacao();

    try {
        await carregarCatalogo();
    } catch (erro) {
        mostrarErroCarregamento(erro);
        return;
    }

    aplicarConfiguracoes();

    // Página principal (lista de produtos)
    inicializarFiltros();
    renderizarProdutos("todos");
    inicializarAnimacaoCards();

    // Página de detalhes do produto
    renderizarDetalheProduto();
});
