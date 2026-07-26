import { sql } from "../_db.js";
import { exigirAutenticacao } from "../_auth.js";

function normalizarProduto(corpo = {}) {
    return {
        nome: typeof corpo.nome === "string" ? corpo.nome.trim() : "",
        categoria: corpo.categoria || null,
        descricao: typeof corpo.descricao === "string" ? corpo.descricao : "",
        valor: typeof corpo.valor === "string" ? corpo.valor.trim() : "",
        imagens: Array.isArray(corpo.imagens) ? corpo.imagens.filter(Boolean) : [],
        ativo: corpo.ativo ?? true,
        destaque: corpo.destaque ?? false,
    };
}

// /api/admin/produtos           GET (lista todos, ativos e inativos) | POST (cria)
// /api/admin/produtos?id=123    PUT (atualiza) | DELETE (remove)
export default async function handler(req, res) {
    if (!exigirAutenticacao(req, res)) return;

    try {
        switch (req.method) {
            case "GET": {
                const produtos = await sql`
                    SELECT * FROM produtos ORDER BY ordem ASC, id ASC
                `;
                res.status(200).json({ produtos });
                return;
            }

            case "POST": {
                const p = normalizarProduto(req.body);
                if (!p.nome || !p.valor) {
                    res.status(400).json({ erro: "Nome e valor são obrigatórios." });
                    return;
                }

                const [{ max_ordem }] = await sql`
                    SELECT COALESCE(MAX(ordem), -1) AS max_ordem FROM produtos
                `;
                const [novo] = await sql`
                    INSERT INTO produtos (nome, categoria, descricao, valor, imagens, ativo, destaque, ordem)
                    VALUES (${p.nome}, ${p.categoria}, ${p.descricao}, ${p.valor}, ${p.imagens}, ${p.ativo}, ${p.destaque}, ${max_ordem + 1})
                    RETURNING *
                `;
                res.status(201).json({ produto: novo });
                return;
            }

            case "PUT": {
                const id = parseInt(req.query.id, 10);
                if (!id) {
                    res.status(400).json({ erro: "Parâmetro id é obrigatório." });
                    return;
                }

                const p = normalizarProduto(req.body);
                if (!p.nome || !p.valor) {
                    res.status(400).json({ erro: "Nome e valor são obrigatórios." });
                    return;
                }

                const [atualizado] = await sql`
                    UPDATE produtos SET
                        nome = ${p.nome},
                        categoria = ${p.categoria},
                        descricao = ${p.descricao},
                        valor = ${p.valor},
                        imagens = ${p.imagens},
                        ativo = ${p.ativo},
                        destaque = ${p.destaque},
                        ordem = COALESCE(${req.body?.ordem ?? null}, ordem)
                    WHERE id = ${id}
                    RETURNING *
                `;
                if (!atualizado) {
                    res.status(404).json({ erro: "Produto não encontrado." });
                    return;
                }
                res.status(200).json({ produto: atualizado });
                return;
            }

            case "DELETE": {
                const id = parseInt(req.query.id, 10);
                if (!id) {
                    res.status(400).json({ erro: "Parâmetro id é obrigatório." });
                    return;
                }
                const [removido] = await sql`DELETE FROM produtos WHERE id = ${id} RETURNING id`;
                if (!removido) {
                    res.status(404).json({ erro: "Produto não encontrado." });
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
        res.status(500).json({ erro: "Erro ao processar produtos." });
    }
}
