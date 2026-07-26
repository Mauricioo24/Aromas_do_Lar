import crypto from "node:crypto";

const NOME_COOKIE = "sessao_admin";
const DURACAO_SESSAO_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

function assinar(payload) {
    const segredo = process.env.SESSION_SECRET;
    if (!segredo) throw new Error("SESSION_SECRET não configurada.");
    return crypto.createHmac("sha256", segredo).update(payload).digest("hex");
}

export function criarSessao() {
    const payload = Buffer.from(JSON.stringify({ exp: Date.now() + DURACAO_SESSAO_MS })).toString(
        "base64url"
    );
    return `${payload}.${assinar(payload)}`;
}

export function cookieDeSessao(token) {
    const maxAge = Math.floor(DURACAO_SESSAO_MS / 1000);
    return `${NOME_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

export function cookieDeLogout() {
    return `${NOME_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

function lerCookie(req, nome) {
    const cabecalho = req.headers.cookie;
    if (!cabecalho) return null;
    for (const parte of cabecalho.split(";")) {
        const [chave, ...resto] = parte.trim().split("=");
        if (chave === nome) return resto.join("=");
    }
    return null;
}

// Valida o cookie de sessão: assinatura HMAC íntegra e ainda dentro da validade.
export function sessaoValida(req) {
    const token = lerCookie(req, NOME_COOKIE);
    if (!token) return false;

    const [payload, assinatura] = token.split(".");
    if (!payload || !assinatura) return false;

    let esperada;
    try {
        esperada = assinar(payload);
    } catch {
        return false;
    }

    const bufRecebido = Buffer.from(assinatura, "hex");
    const bufEsperado = Buffer.from(esperada, "hex");
    if (bufRecebido.length !== bufEsperado.length || !crypto.timingSafeEqual(bufRecebido, bufEsperado)) {
        return false;
    }

    try {
        const dados = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
        return typeof dados.exp === "number" && dados.exp > Date.now();
    } catch {
        return false;
    }
}

// Usar no início de toda rota administrativa protegida.
export function exigirAutenticacao(req, res) {
    if (!sessaoValida(req)) {
        res.status(401).json({ erro: "Não autenticado." });
        return false;
    }
    return true;
}

export function hashSenha(senha) {
    return crypto.createHash("sha256").update(senha, "utf8").digest("hex");
}

export function senhaCorreta(senha) {
    const hashEsperado = process.env.ADMIN_PASSWORD_HASH;
    if (!hashEsperado) throw new Error("ADMIN_PASSWORD_HASH não configurada.");

    const bufRecebido = Buffer.from(hashSenha(senha), "hex");
    const bufEsperado = Buffer.from(hashEsperado.trim(), "hex");
    return bufRecebido.length === bufEsperado.length && crypto.timingSafeEqual(bufRecebido, bufEsperado);
}

// Limite simples de tentativas por IP. Reseta a cada cold start da função —
// não substitui um WAF, mas dificulta força bruta automatizada básica.
const tentativasPorIp = new Map();
const JANELA_MS = 15 * 60 * 1000;
const LIMITE_TENTATIVAS = 10;

function ipDoRequest(req) {
    const encaminhado = req.headers["x-forwarded-for"];
    if (encaminhado) return encaminhado.split(",")[0].trim();
    return req.socket?.remoteAddress || "desconhecido";
}

export function limiteDeTentativasExcedido(req) {
    const ip = ipDoRequest(req);
    const agora = Date.now();
    const registro = tentativasPorIp.get(ip);

    if (!registro || agora - registro.inicio > JANELA_MS) {
        tentativasPorIp.set(ip, { contagem: 1, inicio: agora });
        return false;
    }

    registro.contagem += 1;
    return registro.contagem > LIMITE_TENTATIVAS;
}
