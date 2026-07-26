// Painel administrativo — login.html e admin.html.

async function api(caminho, opcoes = {}) {
    const resposta = await fetch(caminho, {
        ...opcoes,
        headers: { "Content-Type": "application/json", ...(opcoes.headers || {}) },
    });
    let dados = {};
    try {
        dados = await resposta.json();
    } catch {
        // corpo vazio (ex: logout), segue sem dados
    }
    if (!resposta.ok) {
        throw new Error(dados.erro || `Erro ${resposta.status}`);
    }
    return dados;
}

function escapeHtml(texto) {
    const div = document.createElement("div");
    div.textContent = texto ?? "";
    return div.innerHTML;
}

function mostrarAviso(mensagem, tipo = "erro") {
    const el = document.getElementById("admin-aviso");
    if (!el) return;
    el.textContent = mensagem;
    el.className = `admin-aviso admin-aviso-${tipo}`;
    el.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (tipo === "sucesso") {
        setTimeout(() => {
            el.hidden = true;
        }, 4000);
    }
}

// ============================================================
// Login (login.html)
// ============================================================
function inicializarLogin() {
    const form = document.getElementById("form-login");
    if (!form) return;

    api("/api/admin/sessao")
        .then((r) => {
            if (r.autenticado) window.location.href = "admin.html";
        })
        .catch(() => {});

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const senha = document.getElementById("senha").value;
        const erroEl = document.getElementById("login-erro");
        erroEl.hidden = true;

        try {
            await api("/api/login", { method: "POST", body: JSON.stringify({ senha }) });
            window.location.href = "admin.html";
        } catch (err) {
            erroEl.textContent = err.message;
            erroEl.hidden = false;
        }
    });
}

// ============================================================
// Admin (admin.html)
// ============================================================
const ESTADO = { produtos: [], categorias: [], config: {} };

async function inicializarAdmin() {
    if (!document.getElementById("aba-produtos")) return;

    try {
        const sessao = await api("/api/admin/sessao");
        if (!sessao.autenticado) {
            window.location.href = "login.html";
            return;
        }
    } catch {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("btn-sair").addEventListener("click", async () => {
        await api("/api/login", { method: "DELETE" }).catch(() => {});
        window.location.href = "login.html";
    });

    inicializarAbas();
    inicializarModal();
    document.getElementById("btn-novo-produto").addEventListener("click", () => abrirFormularioProduto());
    document.getElementById("btn-nova-categoria").addEventListener("click", () => abrirFormularioCategoria());
    document.getElementById("form-config").addEventListener("submit", salvarConfig);

    await carregarCategorias();
    await carregarProdutos();
    await carregarConfig();
}

function inicializarAbas() {
    const botoes = document.querySelectorAll(".admin-tab");
    botoes.forEach((botao) => {
        botao.addEventListener("click", () => {
            botoes.forEach((b) => b.classList.remove("active"));
            botao.classList.add("active");
            document.querySelectorAll(".admin-aba").forEach((secao) => {
                secao.hidden = true;
            });
            document.getElementById(`aba-${botao.dataset.aba}`).hidden = false;
        });
    });
}

function inicializarModal() {
    document.getElementById("modal-fechar").addEventListener("click", fecharModal);
    document.getElementById("modal-fundo").addEventListener("click", fecharModal);
}

function abrirModal(html) {
    document.getElementById("modal-corpo").innerHTML = html;
    document.getElementById("modal").hidden = false;
}

function fecharModal() {
    document.getElementById("modal").hidden = true;
    document.getElementById("modal-corpo").innerHTML = "";
}

// ---------- Produtos ----------
async function carregarProdutos() {
    try {
        const { produtos } = await api("/api/admin/produtos");
        ESTADO.produtos = produtos;
        renderizarProdutos();
    } catch (err) {
        mostrarAviso(`Não foi possível carregar produtos: ${err.message}`);
    }
}

function obterNomeCategoria(slug) {
    const categoria = ESTADO.categorias.find((c) => c.slug === slug);
    return categoria ? categoria.nome : "(sem categoria)";
}

function renderizarProdutos() {
    const container = document.getElementById("lista-produtos");
    if (ESTADO.produtos.length === 0) {
        container.innerHTML = '<p class="admin-vazio">Nenhum produto cadastrado ainda.</p>';
        return;
    }

    container.innerHTML = ESTADO.produtos
        .map((p, index) => {
            const imagem = Array.isArray(p.imagens) && p.imagens[0] ? p.imagens[0] : "";
            return `
                <div class="admin-item ${p.ativo ? "" : "inativo"}" data-id="${p.id}">
                    ${
                        imagem
                            ? `<img class="admin-item-thumb" src="${escapeHtml(imagem)}" alt="">`
                            : '<div class="admin-item-thumb"></div>'
                    }
                    <div class="admin-item-info">
                        <div class="admin-item-nome">
                            ${escapeHtml(p.nome)}
                            ${!p.ativo ? '<span class="badge badge-inativo">oculto</span>' : ""}
                            ${p.destaque ? '<span class="badge badge-destaque">destaque</span>' : ""}
                        </div>
                        <div class="admin-item-meta">${escapeHtml(obterNomeCategoria(p.categoria))} · ${escapeHtml(p.valor)}</div>
                    </div>
                    <div class="admin-item-ordem">
                        <button class="btn-icone" data-acao="subir" ${index === 0 ? "disabled" : ""} title="Mover para cima">↑</button>
                        <button class="btn-icone" data-acao="descer" ${index === ESTADO.produtos.length - 1 ? "disabled" : ""} title="Mover para baixo">↓</button>
                    </div>
                    <div class="admin-item-acoes">
                        <button class="btn-icone" data-acao="ocultar" title="${p.ativo ? "Ocultar do site" : "Mostrar no site"}">${p.ativo ? "👁" : "🚫"}</button>
                        <button class="btn-secundario" data-acao="editar">Editar</button>
                        <button class="btn-perigo" data-acao="excluir">Excluir</button>
                    </div>
                </div>
            `;
        })
        .join("");

    container.querySelectorAll(".admin-item").forEach((item) => {
        const id = parseInt(item.dataset.id, 10);
        item.querySelectorAll("[data-acao]").forEach((botao) => {
            botao.addEventListener("click", () => {
                const acoes = {
                    editar: () => abrirFormularioProduto(id),
                    excluir: () => excluirProduto(id),
                    ocultar: () => alternarAtivoProduto(id),
                    subir: () => moverProduto(id, -1),
                    descer: () => moverProduto(id, 1),
                };
                acoes[botao.dataset.acao]?.();
            });
        });
    });
}

function opcoesCategoria(selecionada) {
    return ESTADO.categorias
        .map((c) => `<option value="${c.slug}" ${c.slug === selecionada ? "selected" : ""}>${escapeHtml(c.nome)}</option>`)
        .join("");
}

function linhaImagem(valor) {
    return `
        <div class="admin-form-imagem-linha">
            <input type="text" value="${escapeHtml(valor)}" placeholder="/imagens/produto.webp">
            <button type="button" class="btn-icone" data-remover-imagem title="Remover">×</button>
        </div>
    `;
}

function vincularRemoverImagem() {
    document.querySelectorAll("[data-remover-imagem]").forEach((botao) => {
        botao.onclick = () => {
            const linhas = document.querySelectorAll(".admin-form-imagem-linha");
            if (linhas.length > 1) {
                botao.closest(".admin-form-imagem-linha").remove();
            } else {
                botao.previousElementSibling.value = "";
            }
        };
    });
}

function abrirFormularioProduto(id) {
    const produto = id ? ESTADO.produtos.find((p) => p.id === id) : null;
    const imagens = produto?.imagens?.length ? produto.imagens : [""];

    abrirModal(`
        <h3>${produto ? "Editar produto" : "Novo produto"}</h3>
        <form id="form-produto" class="admin-form">
            <p class="admin-form-erro" id="form-produto-erro" hidden></p>

            <label for="p-nome">Nome</label>
            <input type="text" id="p-nome" required value="${escapeHtml(produto?.nome)}">

            <label for="p-categoria">Categoria</label>
            <select id="p-categoria">
                <option value="">(sem categoria)</option>
                ${opcoesCategoria(produto?.categoria)}
            </select>

            <label for="p-valor">Valor (texto livre, ex: "R$ 30,00")</label>
            <input type="text" id="p-valor" required value="${escapeHtml(produto?.valor)}">

            <label for="p-descricao">Descrição</label>
            <textarea id="p-descricao" rows="4">${escapeHtml(produto?.descricao)}</textarea>

            <label>Imagens (caminho em /imagens ou URL completa)</label>
            <div class="admin-form-imagens" id="p-imagens">
                ${imagens.map((img) => linhaImagem(img)).join("")}
            </div>
            <button type="button" class="btn-secundario" id="btn-add-imagem">+ Adicionar imagem</button>

            <div class="admin-form-checkboxes">
                <label><input type="checkbox" id="p-ativo" ${produto?.ativo !== false ? "checked" : ""}> Visível no site</label>
                <label><input type="checkbox" id="p-destaque" ${produto?.destaque ? "checked" : ""}> Destaque</label>
            </div>

            <button type="submit" class="btn-primary">Salvar</button>
        </form>
    `);

    document.getElementById("btn-add-imagem").addEventListener("click", () => {
        document.getElementById("p-imagens").insertAdjacentHTML("beforeend", linhaImagem(""));
        vincularRemoverImagem();
    });
    vincularRemoverImagem();

    document.getElementById("form-produto").addEventListener("submit", async (e) => {
        e.preventDefault();
        const corpo = {
            nome: document.getElementById("p-nome").value.trim(),
            categoria: document.getElementById("p-categoria").value || null,
            valor: document.getElementById("p-valor").value.trim(),
            descricao: document.getElementById("p-descricao").value,
            imagens: [...document.querySelectorAll("#p-imagens input")].map((i) => i.value.trim()).filter(Boolean),
            ativo: document.getElementById("p-ativo").checked,
            destaque: document.getElementById("p-destaque").checked,
        };

        try {
            if (produto) {
                await api(`/api/admin/produtos?id=${produto.id}`, { method: "PUT", body: JSON.stringify(corpo) });
            } else {
                await api("/api/admin/produtos", { method: "POST", body: JSON.stringify(corpo) });
            }
            fecharModal();
            mostrarAviso("Produto salvo com sucesso.", "sucesso");
            await carregarProdutos();
        } catch (err) {
            const erroEl = document.getElementById("form-produto-erro");
            erroEl.textContent = err.message;
            erroEl.hidden = false;
        }
    });
}

async function excluirProduto(id) {
    const produto = ESTADO.produtos.find((p) => p.id === id);
    if (!confirm(`Excluir "${produto?.nome}"? Essa ação não pode ser desfeita.`)) return;
    try {
        await api(`/api/admin/produtos?id=${id}`, { method: "DELETE" });
        mostrarAviso("Produto excluído.", "sucesso");
        await carregarProdutos();
    } catch (err) {
        mostrarAviso(`Não foi possível excluir: ${err.message}`);
    }
}

async function alternarAtivoProduto(id) {
    const produto = ESTADO.produtos.find((p) => p.id === id);
    if (!produto) return;
    try {
        await api(`/api/admin/produtos?id=${id}`, {
            method: "PUT",
            body: JSON.stringify({ ...produto, ativo: !produto.ativo }),
        });
        await carregarProdutos();
    } catch (err) {
        mostrarAviso(`Não foi possível atualizar: ${err.message}`);
    }
}

async function moverProduto(id, direcao) {
    const lista = ESTADO.produtos;
    const index = lista.findIndex((p) => p.id === id);
    const alvo = lista[index + direcao];
    if (!alvo) return;
    const atual = lista[index];

    try {
        await Promise.all([
            api(`/api/admin/produtos?id=${atual.id}`, { method: "PUT", body: JSON.stringify({ ...atual, ordem: alvo.ordem }) }),
            api(`/api/admin/produtos?id=${alvo.id}`, { method: "PUT", body: JSON.stringify({ ...alvo, ordem: atual.ordem }) }),
        ]);
        await carregarProdutos();
    } catch (err) {
        mostrarAviso(`Não foi possível reordenar: ${err.message}`);
    }
}

// ---------- Categorias ----------
async function carregarCategorias() {
    try {
        const { categorias } = await api("/api/admin/categorias");
        ESTADO.categorias = categorias;
        renderizarCategorias();
        if (ESTADO.produtos.length) renderizarProdutos();
    } catch (err) {
        mostrarAviso(`Não foi possível carregar categorias: ${err.message}`);
    }
}

function renderizarCategorias() {
    const container = document.getElementById("lista-categorias");
    if (ESTADO.categorias.length === 0) {
        container.innerHTML = '<p class="admin-vazio">Nenhuma categoria cadastrada.</p>';
        return;
    }

    container.innerHTML = ESTADO.categorias
        .map(
            (c, index) => `
                <div class="admin-item ${c.ativo ? "" : "inativo"}" data-slug="${c.slug}">
                    <div class="admin-item-info">
                        <div class="admin-item-nome">
                            ${escapeHtml(c.nome)}
                            ${!c.ativo ? '<span class="badge badge-inativo">oculta</span>' : ""}
                        </div>
                        <div class="admin-item-meta">slug: ${escapeHtml(c.slug)}</div>
                    </div>
                    <div class="admin-item-ordem">
                        <button class="btn-icone" data-acao="subir" ${index === 0 ? "disabled" : ""} title="Mover para cima">↑</button>
                        <button class="btn-icone" data-acao="descer" ${index === ESTADO.categorias.length - 1 ? "disabled" : ""} title="Mover para baixo">↓</button>
                    </div>
                    <div class="admin-item-acoes">
                        <button class="btn-icone" data-acao="ocultar" title="${c.ativo ? "Ocultar" : "Mostrar"}">${c.ativo ? "👁" : "🚫"}</button>
                        <button class="btn-secundario" data-acao="editar">Editar</button>
                        <button class="btn-perigo" data-acao="excluir">Excluir</button>
                    </div>
                </div>
            `
        )
        .join("");

    container.querySelectorAll(".admin-item").forEach((item) => {
        const slug = item.dataset.slug;
        item.querySelectorAll("[data-acao]").forEach((botao) => {
            botao.addEventListener("click", () => {
                const acoes = {
                    editar: () => abrirFormularioCategoria(slug),
                    excluir: () => excluirCategoria(slug),
                    ocultar: () => alternarAtivoCategoria(slug),
                    subir: () => moverCategoria(slug, -1),
                    descer: () => moverCategoria(slug, 1),
                };
                acoes[botao.dataset.acao]?.();
            });
        });
    });
}

function abrirFormularioCategoria(slug) {
    const categoria = slug ? ESTADO.categorias.find((c) => c.slug === slug) : null;

    abrirModal(`
        <h3>${categoria ? "Editar categoria" : "Nova categoria"}</h3>
        <form id="form-categoria" class="admin-form">
            <p class="admin-form-erro" id="form-categoria-erro" hidden></p>
            <label for="c-nome">Nome</label>
            <input type="text" id="c-nome" required value="${escapeHtml(categoria?.nome)}">
            ${categoria ? `<p class="admin-item-meta">slug: ${escapeHtml(categoria.slug)} (não muda ao renomear)</p>` : ""}
            <div class="admin-form-checkboxes">
                <label><input type="checkbox" id="c-ativo" ${categoria?.ativo !== false ? "checked" : ""}> Visível no site</label>
            </div>
            <button type="submit" class="btn-primary">Salvar</button>
        </form>
    `);

    document.getElementById("form-categoria").addEventListener("submit", async (e) => {
        e.preventDefault();
        const corpo = {
            nome: document.getElementById("c-nome").value.trim(),
            ativo: document.getElementById("c-ativo").checked,
        };
        try {
            if (categoria) {
                await api(`/api/admin/categorias?slug=${encodeURIComponent(categoria.slug)}`, {
                    method: "PUT",
                    body: JSON.stringify(corpo),
                });
            } else {
                await api("/api/admin/categorias", { method: "POST", body: JSON.stringify(corpo) });
            }
            fecharModal();
            mostrarAviso("Categoria salva com sucesso.", "sucesso");
            await carregarCategorias();
        } catch (err) {
            const erroEl = document.getElementById("form-categoria-erro");
            erroEl.textContent = err.message;
            erroEl.hidden = false;
        }
    });
}

async function excluirCategoria(slug) {
    const categoria = ESTADO.categorias.find((c) => c.slug === slug);
    if (!confirm(`Excluir a categoria "${categoria?.nome}"?`)) return;
    try {
        await api(`/api/admin/categorias?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
        mostrarAviso("Categoria excluída.", "sucesso");
        await carregarCategorias();
    } catch (err) {
        mostrarAviso(`Não foi possível excluir: ${err.message}`);
    }
}

async function alternarAtivoCategoria(slug) {
    const categoria = ESTADO.categorias.find((c) => c.slug === slug);
    if (!categoria) return;
    try {
        await api(`/api/admin/categorias?slug=${encodeURIComponent(slug)}`, {
            method: "PUT",
            body: JSON.stringify({ nome: categoria.nome, ativo: !categoria.ativo }),
        });
        await carregarCategorias();
    } catch (err) {
        mostrarAviso(`Não foi possível atualizar: ${err.message}`);
    }
}

async function moverCategoria(slug, direcao) {
    const lista = ESTADO.categorias;
    const index = lista.findIndex((c) => c.slug === slug);
    const alvo = lista[index + direcao];
    if (!alvo) return;
    const atual = lista[index];

    try {
        await Promise.all([
            api(`/api/admin/categorias?slug=${encodeURIComponent(atual.slug)}`, {
                method: "PUT",
                body: JSON.stringify({ nome: atual.nome, ativo: atual.ativo, ordem: alvo.ordem }),
            }),
            api(`/api/admin/categorias?slug=${encodeURIComponent(alvo.slug)}`, {
                method: "PUT",
                body: JSON.stringify({ nome: alvo.nome, ativo: alvo.ativo, ordem: atual.ordem }),
            }),
        ]);
        await carregarCategorias();
    } catch (err) {
        mostrarAviso(`Não foi possível reordenar: ${err.message}`);
    }
}

// ---------- Configurações ----------
async function carregarConfig() {
    try {
        const { config } = await api("/api/admin/config");
        ESTADO.config = config;
        document.getElementById("cfg-whatsapp").value = config.whatsapp || "";
        document.getElementById("cfg-instagram").value = config.instagram || "";
        document.getElementById("cfg-hero-titulo").value = config.hero_titulo || "";
        document.getElementById("cfg-hero-texto").value = config.hero_texto || "";
        document.getElementById("cfg-footer-texto").value = config.footer_texto || "";
    } catch (err) {
        mostrarAviso(`Não foi possível carregar configurações: ${err.message}`);
    }
}

async function salvarConfig(e) {
    e.preventDefault();
    const corpo = {
        whatsapp: document.getElementById("cfg-whatsapp").value.trim(),
        instagram: document.getElementById("cfg-instagram").value.trim(),
        hero_titulo: document.getElementById("cfg-hero-titulo").value.trim(),
        hero_texto: document.getElementById("cfg-hero-texto").value.trim(),
        footer_texto: document.getElementById("cfg-footer-texto").value.trim(),
    };
    try {
        await api("/api/admin/config", { method: "PUT", body: JSON.stringify(corpo) });
        mostrarAviso("Configurações salvas com sucesso.", "sucesso");
    } catch (err) {
        mostrarAviso(`Não foi possível salvar: ${err.message}`);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    inicializarLogin();
    inicializarAdmin();
});
