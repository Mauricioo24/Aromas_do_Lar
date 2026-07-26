// Gera o valor para a variável de ambiente ADMIN_PASSWORD_HASH.
// Uso: node scripts/gerar-hash-senha.mjs "minha-senha-aqui"

import { createHash } from "node:crypto";

const senha = process.argv[2];

if (!senha) {
    console.error('Uso: node scripts/gerar-hash-senha.mjs "sua-senha-aqui"');
    process.exit(1);
}

console.log(createHash("sha256").update(senha, "utf8").digest("hex"));
