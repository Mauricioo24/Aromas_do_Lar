import { sql } from "../_db.js";
import { exigirAutenticacao } from "../_auth.js";

function slugificar(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

// /api/admin/categorias             GET (lista todas) | POST (cria)
// /api/admin/categorias?slug=xyz    PUT (atualiza) | DELETE (remove, se sem produtos)
export default async function handler(req, res) {
    if (!exigirAutenticacao(req, res)) return;

    try {
        switch (req.method) {
            case "GET": {
                const categorias = await sql`SELECT * FROM categorias ORDER BY ordem ASC`;
                res.status(200).json({ categorias });
                return;
            }

            case "POST": {
                const nome = typeof req.body?.nome === "string" ? req.body.nome.trim() : "";
                if (!nome) {
                    res.status(400).json({ erro: "Nome é obrigatório." });
                    return;
                }
                const slug = slugificar(nome);
                if (!slug) {
                    res.status(400).json({ erro: "Nome inválido para gerar categoria." });
                    return;
                }

                const [{ max_ordem }] = await sql`
                    SELECT COALESCE(MAX(ordem), -1) AS max_ordem FROM categorias
                `;
                const [nova] = await sql`
                    INSERT INTO categorias (slug, nome, ordem, ativo)
                    VALUES (${slug}, ${nome}, ${max_ordem + 1}, TRUE)
                    ON CONFLICT (slug) DO NOTHING
                    RETURNING *
                `;
                if (!nova) {
                    res.status(409).json({ erro: "Já existe uma categoria com esse nome." });
                    return;
                }
                res.status(201).json({ categoria: nova });
                return;
            }

            case "PUT": {
                const slug = req.query.slug;
                if (!slug) {
                    res.status(400).json({ erro: "Parâmetro slug é obrigatório." });
                    return;
                }
                const nome = typeof req.body?.nome === "string" ? req.body.nome.trim() : "";
                if (!nome) {
                    res.status(400).json({ erro: "Nome é obrigatório." });
                    return;
                }
                const ativo = req.body?.ativo ?? true;

                const [atualizada] = await sql`
                    UPDATE categorias SET
                        nome = ${nome},
                        ativo = ${ativo},
                        ordem = COALESCE(${req.body?.ordem ?? null}, ordem)
                    WHERE slug = ${slug}
                    RETURNING *
                `;
                if (!atualizada) {
                    res.status(404).json({ erro: "Categoria não encontrada." });
                    return;
                }
                res.status(200).json({ categoria: atualizada });
                return;
            }

            case "DELETE": {
                const slug = req.query.slug;
                if (!slug) {
                    res.status(400).json({ erro: "Parâmetro slug é obrigatório." });
                    return;
                }

                const [{ count }] = await sql`
                    SELECT count(*) FROM produtos WHERE categoria = ${slug}
                `;
                if (Number(count) > 0) {
                    res.status(409).json({
                        erro: `Existem ${count} produto(s) usando esta categoria. Mova-os antes de excluir.`,
                    });
                    return;
                }

                const [removida] = await sql`DELETE FROM categorias WHERE slug = ${slug} RETURNING slug`;
                if (!removida) {
                    res.status(404).json({ erro: "Categoria não encontrada." });
                    return;
                }
                res.status(200).json({ ok: true });
                return;
            }

            default:
                res.status(405).json({ erro: "Método não permitido" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao processar categorias." });
    }
}
