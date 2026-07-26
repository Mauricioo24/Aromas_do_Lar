-- Aromas do Lar - schema do banco (Neon Postgres)
-- Rode este arquivo uma vez no editor SQL do Neon (ou via `psql $DATABASE_URL -f scripts/schema.sql`).

CREATE TABLE IF NOT EXISTS categorias (
    slug  TEXT PRIMARY KEY,
    nome  TEXT NOT NULL,
    ordem INT NOT NULL DEFAULT 0,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS produtos (
    id            SERIAL PRIMARY KEY,
    nome          TEXT NOT NULL,
    categoria     TEXT REFERENCES categorias(slug) ON UPDATE CASCADE ON DELETE SET NULL,
    descricao     TEXT NOT NULL DEFAULT '',
    valor         TEXT NOT NULL,
    imagens       TEXT[] NOT NULL DEFAULT '{}',
    ativo         BOOLEAN NOT NULL DEFAULT TRUE,
    destaque      BOOLEAN NOT NULL DEFAULT FALSE,
    ordem         INT NOT NULL DEFAULT 0,
    criado_em     TIMESTAMPTZ NOT NULL DEFAULT now(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria);
CREATE INDEX IF NOT EXISTS idx_produtos_ativo_ordem ON produtos(ativo, ordem);

CREATE TABLE IF NOT EXISTS config (
    chave TEXT PRIMARY KEY,
    valor TEXT NOT NULL
);

-- Mantém atualizado_em em dia a cada UPDATE em produtos
CREATE OR REPLACE FUNCTION set_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_produtos_atualizado_em ON produtos;
CREATE TRIGGER trg_produtos_atualizado_em
    BEFORE UPDATE ON produtos
    FOR EACH ROW
    EXECUTE FUNCTION set_atualizado_em();
