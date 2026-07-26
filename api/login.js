import {
    senhaCorreta,
    criarSessao,
    cookieDeSessao,
    cookieDeLogout,
    limiteDeTentativasExcedido,
} from "./_auth.js";

// POST /api/login { senha } — autentica e devolve o cookie de sessão.
// DELETE /api/login — logout (limpa o cookie).
export default async function handler(req, res) {
    if (req.method === "DELETE") {
        res.setHeader("Set-Cookie", cookieDeLogout());
        res.status(200).json({ ok: true });
        return;
    }

    if (req.method !== "POST") {
        res.status(405).json({ erro: "Método não permitido" });
        return;
    }

    if (limiteDeTentativasExcedido(req)) {
        res.status(429).json({ erro: "Muitas tentativas. Tente novamente em alguns minutos." });
        return;
    }

    const { senha } = req.body || {};
    if (!senha || typeof senha !== "string") {
        res.status(400).json({ erro: "Informe a senha." });
        return;
    }

    let correta;
    try {
        correta = senhaCorreta(senha);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Login não configurado no servidor." });
        return;
    }

    if (!correta) {
        res.status(401).json({ erro: "Senha incorreta." });
        return;
    }

    res.setHeader("Set-Cookie", cookieDeSessao(criarSessao()));
    res.status(200).json({ ok: true });
}
