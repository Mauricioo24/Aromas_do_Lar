import { sessaoValida } from "../_auth.js";

// GET /api/admin/sessao — usado pelo front para saber se a sessão ainda é válida
// (login.html redireciona se já autenticada; admin.html redireciona se não estiver).
export default async function handler(req, res) {
    res.status(200).json({ autenticado: sessaoValida(req) });
}
