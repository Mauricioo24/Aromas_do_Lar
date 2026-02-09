# Aromas do Lar - Catálogo Digital

Site de catálogo digital elegante e funcional para loja de velas aromáticas e velas religiosas.

## Características

- Design minimalista e elegante
- Paleta de cores suave (branco, bege, tons neutros)
- Tipografia limpa e legível
- Navegação simples e intuitiva
- Totalmente responsivo
- Filtros por categoria de produtos
- Integração direta com WhatsApp

## Estrutura de Arquivos

- `index.html` - Estrutura principal do site
- `styles.css` - Estilos e design visual
- `script.js` - Funcionalidades JavaScript
- `README.md` - Este arquivo

## Como Personalizar

### 1. Alterar Número do WhatsApp

No arquivo `script.js`, linha 2, altere o número:

```javascript
const whatsappNumber = "5511999999999"; // Substitua pelo seu número
```

### 2. Adicionar ou Editar Produtos

No arquivo `script.js`, dentro do array `produtos`, adicione ou edite produtos:

```javascript
{
    id: 11,
    nome: "Nome do Produto",
    categoria: "aromaticas", // ou "religiosas"
    descricao: "Descrição do produto",
    imagem: "URL_DA_IMAGEM"
}
```

### 3. Alterar Links de Contato

No arquivo `index.html`, seção de contato, altere os links:

- WhatsApp: linha com `href="https://wa.me/..."`
- Instagram: linha com `href="https://instagram.com/..."`

### 4. Personalizar Textos

Edite os textos diretamente no arquivo `index.html`:
- Título da loja (logo)
- Texto de apresentação na seção hero
- Textos de contato

### 5. Adicionar Imagens dos Produtos

Substitua as URLs placeholder pelas URLs reais das imagens dos produtos. Você pode:
- Hospedar as imagens em um serviço de hospedagem
- Usar um serviço como Imgur, Cloudinary ou similar
- Colocar as imagens em uma pasta `images/` e referenciar localmente

## Como Usar

1. Abra o arquivo `index.html` em um navegador web
2. Para publicar online, faça upload dos arquivos para um serviço de hospedagem
3. Certifique-se de que todos os arquivos estão na mesma pasta

## Requisitos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexão com internet (para carregar as fontes do Google Fonts)

## Suporte

Para dúvidas ou suporte, entre em contato através do WhatsApp ou Instagram configurados no site.
