// Popula o banco Neon com as categorias, produtos e textos que hoje estão
// hardcoded em script.js/index.html. Rode uma vez com: npm run seed
// Requer a variável de ambiente DATABASE_URL (puxe com `vercel env pull .env.local`).

import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

if (!process.env.DATABASE_URL) {
    const envPath = join(__dirname, "..", ".env.local");
    try {
        for (const linha of readFileSync(envPath, "utf8").split(/\r?\n/)) {
            const match = linha.match(/^([A-Z0-9_]+)=(.*)$/);
            if (match) process.env[match[1]] ??= match[2].replace(/^"|"$/g, "").trim();
        }
    } catch {
        // sem .env.local, segue sem ele (a env var pode já estar no ambiente)
    }
}

if (!process.env.DATABASE_URL) {
    console.error(
        "DATABASE_URL não definida. Rode `vercel env pull .env.local` primeiro, " +
            "ou exporte a variável manualmente."
    );
    process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

// Categorias na mesma ordem dos botões de filtro atuais, com "decorativos"
// adicionada (produto 18 usava essa categoria mas não tinha filtro no site).
const categorias = [
    { slug: "aromaticas", nome: "Velas Aromáticas", ordem: 1 },
    { slug: "religiosos", nome: "Artigos Religiosos", ordem: 2 },
    { slug: "kits", nome: "Kits Especiais", ordem: 3 },
    { slug: "aromatizantes", nome: "Aromatizantes", ordem: 4 },
    { slug: "corporal", nome: "Linha Corporal", ordem: 5 },
    { slug: "decorativos", nome: "Decorativos", ordem: 6 },
];

// Produtos atuais de script.js, com dois ajustes combinados com a dona da loja:
//  - id 18 (Bandeja decorativa): mantido em "decorativos", que agora vira um
//    filtro de verdade (antes o produto ficava invisível fora de "Todos").
//  - id 20 (Água de lençóis): estava em "religiosos" por engano, é um aromatizante.
const produtos = [
    { id: 1, nome: "Hidratante artesanal.", categoria: "corporal", descricao: "Aromas: Cereja e avelã, flor de cerejeira, vanilla.", valor: "R$ 8,00", imagens: ["/imagens/creme1.webp", "/imagens/creme1.webp"] },
    { id: 2, nome: "Aromatizador de ambientes", categoria: "aromatizantes", descricao: "Vem com 5 varetas de madeira inclusas para usar. Contém: 100 ml Aromas disponíveis: Bamboo; Melancia; Flor de cerejeira; Cereja e avelã; Vanilla; Gardênia.", valor: "R$ 45,00", imagens: ["/imagens/aromas2.webp", "/imagens/aromas2.webp"] },
    { id: 3, nome: "Água de lençóis 100ml", categoria: "aromatizantes", descricao: "Aromas: Cereja e avelã, bamboo, vanilla, chá branco, melancia.", valor: "R$ 30,00", imagens: ["/imagens/Aroma1.webp", "/imagens/Aroma1.webp"] },
    { id: 4, nome: "Vela aromatizada ", categoria: "aromaticas", descricao: "Aromas: morango, cereja e avelã, flor de cerejeira, champanhe toast, cascas e folhas.", valor: "R$ 30,00", imagens: ["/imagens/aromatizada1.webp"] },
    { id: 5, nome: "Vela em gel aromatizada ", categoria: "aromaticas", descricao: "Vela de parafina em gel, 170 ml. Aromas: Cereja e avelã, flor de cerejeira, champanhe toast, cascas e folhas.", valor: "R$ 45,00", imagens: ["/imagens/VelaC1.webp", "/imagens/VelaC1.webp"] },
    { id: 6, nome: "Vela de gel Nossa Senhora", categoria: "religiosos", descricao: "Vela feita com parafina em gel, 170 ml. Imagem de Nossa Senhora Aparecida 🙏🏼", valor: "R$ 68,90", imagens: ["/imagens/velaNS.jpg", "/imagens/VelaNS2.jpg"] },
    { id: 7, nome: "Vela oratória", categoria: "religiosos", descricao: "Vela oratória confeccionada com acabamento em pedras, trazendo a imagem de seu santo favorito como símbolo de fé, proteção e espiritualidade. Ideal para ambientes de oração, decoração ou para presentear.", valor: "R$ 119,90", imagens: ["/imagens/VelaNSpedra.webp", "/imagens/VelaOratoria4.webp", "/imagens/VelaOratoria5.webp"] },
    { id: 8, nome: "Vela oratória com refil.", categoria: "religiosos", descricao: "Vela oratória refil confeccionada com acabamento em pedras, trazendo a imagem de seu santo favorito como símbolo de fé, proteção e espiritualidade. Ideal para ambientes de oração, decoração ou para presentear.", valor: "R$ 89,90", imagens: ["/imagens/VelaRefil3.webp", "/imagens/VelaNSpedraRefil.webp"] },
    { id: 9, nome: "Mini vela  oratória (A partir de 5 unidades)", categoria: "religiosos", descricao: "Vela devocional do Sagrado Coração de Jesus, para momentos de devoção e busca por paz interior.", valor: "R$ 14,00", imagens: ["/imagens/VelaNSpedraMini.webp"] },
    { id: 10, nome: "Sagrada família de gesso decorada", categoria: "religiosos", descricao: "Vela especial dedicada à padroeira do Brasil, Nossa Senhora Aparecida, para momentos de fé e gratidão.", valor: "R$ 19,90 - 29,90", imagens: ["/imagens/sagradafamiliaSgesso.webp"] },
    { id: 11, nome: "Vela em gel São Miguel Arcanjo", categoria: "religiosos", descricao: "Vela de parafina em gel com imagem de São Miguel Arcanjo. Ideal para momentos de oração e proteção espiritual.", valor: "R$ 71,90", imagens: ["/imagens/saoMiguel.webp"] },
    { id: 12, nome: "Refil aromatizador / água de lençóis", categoria: "aromatizantes", descricao: "Refil para aromatizador de ambientes ou água de lençóis. Deixe sua casa e roupas com um aroma suave e aconchegante. 100 ml R$ 30,00 - 250 ml R$ 50,00 - 500 ml R$ 90,00 - 1000 ml R$ 180,00", valor: "R$ 30,00 - R$ 180,00", imagens: ["/imagens/aromaticasRefil.webp"] },
    { id: 13, nome: "Vela Bubble", categoria: "aromaticas", descricao: "Vela decorativa em formato bubble, perfeita para ambientar e dar um toque especial ao seu lar e que pode ser personalizada com aroma que você desejar!.", valor: "R$ 12,00", imagens: ["/imagens/blubble.webp"] },
    { id: 14, nome: "Vela latinha pequena", categoria: "aromaticas", descricao: "Vela aromática em latinha pequena, prática e charmosa. Ideal para presentear ou decorar ambientes e que pode ser personalizada da maneira que você quiser!. R$09,00 a unidade - R$08,00 a cima de 5 unidades", valor: "R$ 8,00", imagens: ["/imagens/velaLata.webp"] },
    { id: 15, nome: "Vela girassol", categoria: "aromaticas", descricao: "Vela decorativa com tema girassol, trazendo luz e alegria para qualquer ambiente.", valor: "R$ 8,00", imagens: ["/imagens/velaGirassol.webp"] },
    { id: 16, nome: "Aromatizador de carro", categoria: "aromatizantes", descricao: "Aromatizador para veículos. Mantenha o interior do carro com um cheiro agradável durante suas viagens. Aromas disponíveis: Trousso; Bamboo; Flor de cerejeira; Cereja e avelã; Vanilla.", valor: "R$ 15,00", imagens: ["/imagens/aromaCarro.webp"] },
    { id: 17, nome: "Kit Vela oratória + Bandeja decorativa", categoria: "kits", descricao: "Ambas confeccionadas com acabamento em pedras, a vela trazendo a imagem de seu santo favorito como símbolo de fé, proteção e espiritualidade.", valor: "R$ 169,80", imagens: ["/imagens/VelaOratoria.webp", "/imagens/VelaOratoria2.webp", "/imagens/VelaOratoria3.webp"] },
    { id: 18, nome: "Bandeja decorativa", categoria: "decorativos", descricao: "Bandeja decorativa artesanal em pedras naturais, com design elegante e minimalista. Perfeita para organizar perfumes, velas ou pequenos objetos, trazendo charme e sofisticação para qualquer ambiente.", valor: "R$ 59,90", imagens: ["/imagens/Bandeja.webp"] },
    { id: 19, nome: "Kit Aromatizador + Sabonete Líquido", categoria: "kits", descricao: "Kit Aromatizador + Sabonete Líquido.", valor: "R$ 90,00", imagens: ["/imagens/KitAromatizador.jpg"] },
    { id: 20, nome: "Água de lençóis", categoria: "aromatizantes", descricao: "Água de lençóis, aromatizada com o aroma que você desejar.", valor: "R$ 35,00", imagens: ["/imagens/AguaLencois.jpg"] },
    { id: 21, nome: "Mini vela de nossa senhora aparecida", categoria: "aromatizantes", descricao: "Perfeita para presentear. Disponível em vários aromas.", valor: "R$ 12,00", imagens: ["/imagens/velaNSmini.webp"] },
];

const config = {
    whatsapp: "5511995618384",
    instagram: "https://www.instagram.com/aromassdolar/",
    hero_titulo: "Bem-vindo à Aromas do Lar",
    hero_texto:
        "Somos uma loja de aromas criada para quem valoriza bem-estar, aconchego e significado nos pequenos detalhes. " +
        "Reunimos uma infinidade de produtos desenvolvidos com cuidado artesanal e materiais selecionados. " +
        "Acreditamos que fragrâncias, intenções e experiências devem ser únicas, por isso nosso propósito é transformar ambientes e momentos, levando calma, acolhimento e espiritualidade para o seu dia a dia.",
    footer_texto: "Produtos artesanais feitos com carinho e dedicação.",
};

async function verificarSchema() {
    const [{ existe }] = await sql`
        SELECT EXISTS (
            SELECT 1 FROM information_schema.tables WHERE table_name = 'produtos'
        ) AS existe
    `;
    if (!existe) {
        console.error(
            "Tabela 'produtos' não existe. Rode scripts/schema.sql primeiro " +
                "(psql \"$DATABASE_URL\" -f scripts/schema.sql, ou cole o conteúdo no SQL Editor do Neon)."
        );
        process.exit(1);
    }
}

async function main() {
    await verificarSchema();

    console.log("Inserindo categorias...");
    for (const c of categorias) {
        await sql`
            INSERT INTO categorias (slug, nome, ordem, ativo)
            VALUES (${c.slug}, ${c.nome}, ${c.ordem}, TRUE)
            ON CONFLICT (slug) DO UPDATE SET nome = EXCLUDED.nome, ordem = EXCLUDED.ordem
        `;
    }

    console.log("Inserindo produtos...");
    for (const [index, p] of produtos.entries()) {
        await sql`
            INSERT INTO produtos (id, nome, categoria, descricao, valor, imagens, ativo, destaque, ordem)
            VALUES (${p.id}, ${p.nome}, ${p.categoria}, ${p.descricao}, ${p.valor}, ${p.imagens}, TRUE, FALSE, ${index})
            ON CONFLICT (id) DO UPDATE SET
                nome = EXCLUDED.nome,
                categoria = EXCLUDED.categoria,
                descricao = EXCLUDED.descricao,
                valor = EXCLUDED.valor,
                imagens = EXCLUDED.imagens,
                ordem = EXCLUDED.ordem
        `;
    }

    // Garante que o próximo INSERT sem id explícito continue de 22 em diante
    await sql`SELECT setval(pg_get_serial_sequence('produtos', 'id'), (SELECT MAX(id) FROM produtos))`;

    console.log("Inserindo configurações...");
    for (const [chave, valor] of Object.entries(config)) {
        await sql`
            INSERT INTO config (chave, valor) VALUES (${chave}, ${valor})
            ON CONFLICT (chave) DO UPDATE SET valor = EXCLUDED.valor
        `;
    }

    console.log(`OK: ${categorias.length} categorias, ${produtos.length} produtos, ${Object.keys(config).length} configs.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
