import { neon } from "@neondatabase/serverless";

let sqlInstance;

// Reaproveita a conexão entre invocações da mesma função (warm start).
export function sql() {
    if (!sqlInstance) {
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL não configurada nas variáveis de ambiente.");
        }
        sqlInstance = neon(process.env.DATABASE_URL.trim());
    }
    return sqlInstance(...arguments);
}
