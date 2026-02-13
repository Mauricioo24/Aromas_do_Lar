// Dados dos Produtos
// Agora cada produto pode ter várias imagens (campo "imagens").
// A primeira imagem da lista será usada no catálogo.
const produtos = [
    {
        id: 1,
        nome: "Hidratante artesanal.",
        categoria: "corporal",
        descricao: "Aromas: Cereja e avelã, flor de cerejeira, vanilla.",
        valor: "R$ 8,00",
        imagens: [
            "/imagens/creme1.webp",
            "/imagens/creme1.webp",
        ]
    },
    {
        id: 2,
        nome: "Aromatizador de ambientes",
        categoria: "aromatizantes",
        descricao: "Vem com 5 varetas de madeira inclusas para usar. Contém: 100 ml Aromas disponíveis: Bamboo; Melancia; Flor de cerejeira; Cereja e avelã; Vanilla; Gardênia.",
        valor: "R$ 45,00",
        imagens: [
            "/imagens/aromas2.webp",
            "/imagens/aromas2.webp"
        ]
    },
    {
        id: 3,
        nome: "Água de lençóis 100ml",
        categoria: "aromatizantes",
        descricao: "Aromas: Cereja e avelã, bamboo, vanilla, chá branco, melancia.",
        valor: "R$ 30,00",
        imagens: [
            "/imagens/Aroma1.webp",
            "/imagens/Aroma1.webp"
        ]
    },
    {
        id: 4,
        nome: "Vela aromatizada ",
        categoria: "aromaticas",
        descricao: "Aromas: morango, cereja e avelã, flor de cerejeira, champanhe toast, cascas e folhas.",
        valor: "R$ 30,00",
        imagens: [
            "/imagens/aromatizada1.webp",
        ]
    },
    {
        id: 5,
        nome: "Vela em gel aromatizada ",
        categoria: "aromaticas",
        descricao: "Vela de parafina em gel, 170 ml. Aromas: Cereja e avelã, flor de cerejeira, champanhe toast, cascas e folhas.",
        valor: "R$ 45,00",
        imagens: [
            "/imagens/VelaC1.webp",
            "/imagens/VelaC1.webp"
        ]
    },
    {
        id: 6,
        nome: "Vela de gel Nossa Senhora",
        categoria: "religiosos",
        descricao: "Vela feita com parafina em gel, 170 ml. Imagem de Nossa Senhora Aparecida 🙏🏼",
        valor: "R$ 68,90",
        imagens: [
            "/imagens/velaNS.jpg",
            "/imagens/VelaNS2.jpg"
        ]
    },
    {
        id: 7,
        nome: "Vela oratória",
        categoria: "religiosos",
        descricao: "Vela oratória confeccionada com acabamento em pedras, trazendo a imagem de seu santo favorito como símbolo de fé, proteção e espiritualidade. Ideal para ambientes de oração, decoração ou para presentear.",
        valor: "R$ 119,90",
        imagens: [
            "/imagens/VelaNSpedra.webp",
        ]
    },
    {
        id: 8,
        nome: "Vela oratória com refil.",
        categoria: "religiosos",
        descricao: "Vela oratória refil confeccionada com acabamento em pedras, trazendo a imagem de seu santo favorito como símbolo de fé, proteção e espiritualidade. Ideal para ambientes de oração, decoração ou para presentear.",
        valor: "R$ 89,90",
        imagens: [
            "/imagens/VelaNSpedraRefil.webp",
        ]
    },
    {
        id: 9,
        nome: "Mini vela  oratória (A partir de 5 unidades)",
        categoria: "religiosos",
        descricao: "Vela devocional do Sagrado Coração de Jesus, para momentos de devoção e busca por paz interior.",
        valor: "R$ 14,00",
        imagens: [
            "/imagens/VelaNSpedraMini.webp",
        ]
    },
    {
        id: 10,
        nome: "Sagrada família de gesso decorada",
        categoria: "religiosos",
        descricao: "Vela especial dedicada à padroeira do Brasil, Nossa Senhora Aparecida, para momentos de fé e gratidão.",
        valor: "R$ 19,90",
        imagens: [
            "/imagens/sagradafamiliaSgesso.webp",
        ]
    },
    {
        id: 11,
        nome: "Vela em gel São Miguel Arcanjo",
        categoria: "religiosos",
        descricao: "Vela de parafina em gel com imagem de São Miguel Arcanjo. Ideal para momentos de oração e proteção espiritual.",
        valor: "R$ 71,90",
        imagens: [
            "/imagens/saoMiguel.webp",
        ]
    },
    {
        id: 12,
        nome: "Refil aromatizador / água de lençóis",
        categoria: "aromatizantes",
        descricao: "Refil para aromatizador de ambientes ou água de lençóis. Deixe sua casa e roupas com um aroma suave e aconchegante. 100 ml R$ 30,00 - 250 ml R$ 50,00 - 500 ml R$ 90,00 - 1000 ml R$ 180,00",
        valor: "R$ 30,00 - R$ 180,00",
        imagens: [
            "/imagens/aromaticasRefil.webp",
        ]
    },
    {
        id: 13,
        nome: "Vela Bubble",
        categoria: "aromaticas",
        descricao: "Vela decorativa em formato bubble, perfeita para ambientar e dar um toque especial ao seu lar e que pode ser personalizada com aroma que você desejar!.",
        valor: "R$ 12,00",
        imagens: [
            "/imagens/blubble.webp",
        ]
    },
    {
        id: 14,
        nome: "Vela latinha pequena",
        categoria: "aromaticas",
        descricao: "Vela aromática em latinha pequena, prática e charmosa. Ideal para presentear ou decorar ambientes e que pode ser personalizada da maneira que você quiser!. R$09,00 a unidade - R$08,00 a cima de 5 unidades",
        valor: "R$ 8,00",
        imagens: [
            "/imagens/velaLata.webp",
        ]
    },
    {
        id: 15,
        nome: "Vela girassol",
        categoria: "aromaticas",
        descricao: "Vela decorativa com tema girassol, trazendo luz e alegria para qualquer ambiente.",
        valor: "R$ 8,00",
        imagens: [
            "/imagens/velaGirassol.webp",
        ]
    },
    {
        id: 16,
        nome: "Aromatizador de carro",
        categoria: "aromatizantes",
        descricao: "Aromatizador para veículos. Mantenha o interior do carro com um cheiro agradável durante suas viagens. Aromas disponíveis: Trousso; Bamboo; Flor de cerejeira; Cereja e avelã; Vanilla.",
        valor: "R$ 15,00",
        imagens: [
            "/imagens/aromaCarro.webp",
        ]
    }
];

// Número do WhatsApp (substitua pelo número real)
const whatsappNumber = "5511995618384";

// Função auxiliar para obter um produto pelo ID
function obterProdutoPorId(id) {
    return produtos.find((produto) => produto.id === id);
}

// Função para abrir página de detalhes do produto
function abrirPaginaProduto(id) {
    window.location.href = `produto.html?id=${id}`;
}

// Função para obter nome amigável da categoria
function obterNomeCategoria(categoria) {
    switch (categoria) {
        case "aromaticas":
            return "Vela Aromáticas";
        case "religiosos":
            return "Artigos Religiosos";
        case "kits":
            return "Kits Especiais";
        case "aromatizantes":
            return "Aromatizantes";
        case "corporal":
            return "Linha Corporal";
        default:
            // Deixa a primeira letra maiúscula como fallback
            return categoria
                ? categoria.charAt(0).toUpperCase() + categoria.slice(1)
                : "";
    }
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
    const linkWhatsApp = `https://wa.me/${whatsappNumber}?text=${mensagemWhatsApp}`;
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

    let produtosFiltrados = produtos;

    if (categoria !== "todos") {
        produtosFiltrados = produtos.filter(
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

// Função para inicializar filtros (página principal)
function inicializarFiltros() {
    const filtros = document.querySelectorAll(".filtro-btn");
    if (!filtros.length) return;

    filtros.forEach((filtro) => {
        filtro.addEventListener("click", function () {
            // Remove classe active de todos os botões
            filtros.forEach((btn) => btn.classList.remove("active"));

            // Adiciona classe active ao botão clicado
            this.classList.add("active");

            // Obtém a categoria do atributo data-categoria
            const categoria = this.getAttribute("data-categoria");

            // Renderiza os produtos filtrados
            renderizarProdutos(categoria);
        });
    });
}

// Função para scroll suave nos links de navegação (todas as páginas)
function inicializarNavegacao() {
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            const href = this.getAttribute("href");

            if (href && href.startsWith("#")) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Compensa a altura da navbar
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

    if (!id || isNaN(id)) {
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
        return;
    }

    const produto = obterProdutoPorId(id);

    if (!produto) {
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
        return;
    }

    const categoriaNome =
        produto.categoria === "aromaticas" ? "Vela Aromática" : "Vela Religiosa";

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
        const linkWhatsApp = `https://wa.me/${whatsappNumber}?text=${mensagemWhatsApp}`;
        whatsappEl.href = linkWhatsApp;
        whatsappEl.style.display = "flex";
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function () {
    // Página principal (lista de produtos)
    renderizarProdutos("todos");
    inicializarFiltros();
    inicializarAnimacaoCards();

    // Página de detalhes do produto
    renderizarDetalheProduto();

    // Navegação suave (todas as páginas)
    inicializarNavegacao();
});
