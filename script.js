// Dados dos Produtos
const produtos = [
    {
        id: 1,
        nome: "Vela Aromática Lavanda",
        categoria: "aromaticas",
        descricao: "Vela artesanal com fragrância suave de lavanda, perfeita para criar um ambiente relaxante e tranquilo em qualquer espaço.",
        imagem: "https://via.placeholder.com/400x400/E8E4DD/6B6B6B?text=Vela+Lavanda"
    },
    {
        id: 2,
        nome: "Vela Aromática Baunilha",
        categoria: "aromaticas",
        descricao: "Aroma doce e acolhedor de baunilha que transforma sua casa em um refúgio aconchegante. Ideal para momentos de descanso.",
        imagem: "https://via.placeholder.com/400x400/E8E4DD/6B6B6B?text=Vela+Baunilha"
    },
    {
        id: 3,
        nome: "Vela Aromática Eucalipto",
        categoria: "aromaticas",
        descricao: "Fragrância refrescante de eucalipto que purifica o ar e proporciona sensação de bem-estar e renovação.",
        imagem: "https://via.placeholder.com/400x400/E8E4DD/6B6B6B?text=Vela+Eucalipto"
    },
    {
        id: 4,
        nome: "Vela Aromática Canela",
        categoria: "aromaticas",
        descricao: "Aroma quente e especiado de canela que traz aconchego e energia positiva ao ambiente.",
        imagem: "https://via.placeholder.com/400x400/E8E4DD/6B6B6B?text=Vela+Canela"
    },
    {
        id: 5,
        nome: "Vela Aromática Jasmim",
        categoria: "aromaticas",
        descricao: "Fragrância delicada e floral de jasmim, perfeita para criar um ambiente elegante e sereno.",
        imagem: "https://via.placeholder.com/400x400/E8E4DD/6B6B6B?text=Vela+Jasmim"
    },
    {
        id: 6,
        nome: "Vela Religiosa Nossa Senhora",
        categoria: "religiosas",
        descricao: "Vela devocional dedicada a Nossa Senhora, feita com cuidado especial para momentos de oração e reflexão espiritual.",
        imagem: "https://via.placeholder.com/400x400/E8E4DD/6B6B6B?text=Vela+Nossa+Senhora"
    },
    {
        id: 7,
        nome: "Vela Religiosa São Jorge",
        categoria: "religiosas",
        descricao: "Vela consagrada a São Jorge, símbolo de proteção e força. Ideal para pedidos de amparo e coragem.",
        imagem: "https://via.placeholder.com/400x400/E8E4DD/6B6B6B?text=Vela+São+Jorge"
    },
    {
        id: 8,
        nome: "Vela Religiosa Anjo da Guarda",
        categoria: "religiosas",
        descricao: "Vela dedicada ao seu Anjo da Guarda, para momentos de proteção espiritual e conexão com o divino.",
        imagem: "https://via.placeholder.com/400x400/E8E4DD/6B6B6B?text=Vela+Anjo+da+Guarda"
    },
    {
        id: 9,
        nome: "Vela Religiosa Sagrado Coração",
        categoria: "religiosas",
        descricao: "Vela devocional do Sagrado Coração de Jesus, para momentos de devoção e busca por paz interior.",
        imagem: "https://via.placeholder.com/400x400/E8E4DD/6B6B6B?text=Vela+Sagrado+Coração"
    },
    {
        id: 10,
        nome: "Vela Religiosa Nossa Senhora Aparecida",
        categoria: "religiosas",
        descricao: "Vela especial dedicada à padroeira do Brasil, Nossa Senhora Aparecida, para momentos de fé e gratidão.",
        imagem: "https://via.placeholder.com/400x400/E8E4DD/6B6B6B?text=Vela+Aparecida"
    }
];

// Número do WhatsApp (substitua pelo número real)
const whatsappNumber = "5511995618384";

// Função para criar card de produto
function criarCardProduto(produto) {
    const categoriaNome = produto.categoria === "aromaticas" ? "Vela Aromática" : "Vela Religiosa";
    const mensagemWhatsApp = encodeURIComponent(
        `Olá! Gostaria de saber mais sobre a ${produto.nome} da Aromas do Lar.`
    );
    const linkWhatsApp = `https://wa.me/${whatsappNumber}?text=${mensagemWhatsApp}`;

    return `
        <div class="produto-card" data-categoria="${produto.categoria}">
            <div class="produto-imagem">
                <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">
            </div>
            <div class="produto-info">
                <span class="produto-categoria">${categoriaNome}</span>
                <h3 class="produto-nome">${produto.nome}</h3>
                <p class="produto-descricao">${produto.descricao}</p>
                <a href="${linkWhatsApp}" class="btn-whatsapp" target="_blank" rel="noopener noreferrer">
                    Falar no WhatsApp
                </a>
            </div>
        </div>
    `;
}

// Função para renderizar produtos
function renderizarProdutos(categoria = "todos") {
    const grid = document.getElementById("produtos-grid");
    
    let produtosFiltrados = produtos;
    
    if (categoria !== "todos") {
        produtosFiltrados = produtos.filter(produto => produto.categoria === categoria);
    }
    
    if (produtosFiltrados.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--cor-texto-suave);">
                <p style="font-size: 1.125rem;">Nenhum produto encontrado nesta categoria.</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = produtosFiltrados.map(produto => criarCardProduto(produto)).join("");
}

// Função para inicializar filtros
function inicializarFiltros() {
    const filtros = document.querySelectorAll(".filtro-btn");
    
    filtros.forEach(filtro => {
        filtro.addEventListener("click", function() {
            // Remove classe active de todos os botões
            filtros.forEach(btn => btn.classList.remove("active"));
            
            // Adiciona classe active ao botão clicado
            this.classList.add("active");
            
            // Obtém a categoria do atributo data-categoria
            const categoria = this.getAttribute("data-categoria");
            
            // Renderiza os produtos filtrados
            renderizarProdutos(categoria);
        });
    });
}

// Função para scroll suave nos links de navegação
function inicializarNavegacao() {
    const navLinks = document.querySelectorAll(".nav-link");
    
    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            const href = this.getAttribute("href");
            
            if (href.startsWith("#")) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Compensa a altura da navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: "smooth"
                    });
                }
            }
        });
    });
}

// Inicialização quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function() {
    // Renderiza todos os produtos inicialmente
    renderizarProdutos("todos");
    
    // Inicializa os filtros
    inicializarFiltros();
    
    // Inicializa a navegação suave
    inicializarNavegacao();
    
    // Adiciona efeito de fade-in aos cards quando aparecem na tela
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
            }
        });
    }, observerOptions);
    
    // Observa os cards de produto
    setTimeout(() => {
        const cards = document.querySelectorAll(".produto-card");
        cards.forEach(card => {
            card.style.opacity = "0";
            card.style.transition = "opacity 0.5s ease";
            observer.observe(card);
        });
    }, 100);
});
