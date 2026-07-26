import { sql } from "../_db.js";
import { exigirAutenticacao } from "../_auth.js";

// GET  /api/admin/config — devolve todas as chaves como objeto { chave: valor }
// PUT  /api/admin/config — recebe um objeto { chave: valor, ... } e faz upsert de cada uma
export default async function handler(req, res) {
    if (!exigirAutenticacao(req, res)) return;

    try {
        if (req.method === "GET") {
            const linhas = await sql`SELECT chave, valor FROM config`;
            res.status(200).json({ config: Object.fromEntries(linhas.map((r) => [r.chave, r.valor])) });
            return;
        }

        if (req.method === "PUT") {
            const entradas = Object.entries(req.body || {}).filter(([chave]) => typeof chave === "string" && chave);
            if (entradas.length === 0) {
                res.status(400).json({ erro: "Nenhuma configuração enviada." });
                return;
            }

            for (const [chave, valor] of entradas) {
                await sql`
                    INSERT INTO config (chave, valor) VALUES (${chave}, ${String(valor ?? "")})
                    ON CONFLICT (chave) DO UPDATE SET valor = EXCLUDED.valor
                `;
            }

            const linhas = await sql`SELECT chave, valor FROM config`;
            res.status(200).json({ config: Object.fromEntries(linhas.map((r) => [r.chave, r.valor])) });
            return;
        }

        res.status(405).json({ erro: "Método não permitido" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao processar configurações." });
    }
}
