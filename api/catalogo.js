import { sql } from "./_db.js";

// GET /api/catalogo — dados públicos do site (produtos ativos, categorias ativas, textos).
export default async function handler(req, res) {
    if (req.method !== "GET") {
        res.status(405).json({ erro: "Método não permitido" });
        return;
    }

    try {
        const [produtos, categorias, configRows] = await Promise.all([
            sql`
                SELECT id, nome, categoria, descricao, valor, imagens, destaque
                FROM produtos
                WHERE ativo = TRUE
                ORDER BY ordem ASC, id ASC
            `,
            sql`
                SELECT slug, nome
                FROM categorias
                WHERE ativo = TRUE
                ORDER BY ordem ASC
            `,
            sql`SELECT chave, valor FROM config`,
        ]);

        const config = Object.fromEntries(configRows.map((r) => [r.chave, r.valor]));

        res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
        res.status(200).json({ produtos, categorias, config });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Não foi possível carregar o catálogo." });
    }
}
