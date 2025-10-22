# Portfólio de Reformas & Imóveis — MVP Estático

Projeto estático (HTML/CSS/JS) para apresentar projetos de reforma e listar imóveis à venda.
Feito como um MVP profissional, pronto para deploy em **Netlify / Vercel / GitHub Pages**.

## Estrutura
- `index.html` — página principal (Home, Projetos, Imóveis, Contato)
- `styles.css` — estilos (mobile-first)
- `app.js` — lógica front-end (carrega `data/imoveis.json`, filtros, modal, lightbox)
- `data/imoveis.json` — dados de exemplo (imóveis e projetos)
- `README.md` — este arquivo

## Como usar localmente
1. Baixe e extraia o ZIP.
2. Abra `index.html` diretamente no navegador (funciona localmente) **ou** rode um servidor estático para melhores resultados:
   - Python 3: `python -m http.server 8000` e abra `http://localhost:8000`
3. Edite `data/imoveis.json` para adicionar/remover imóveis e projetos.
4. Substitua os links do WhatsApp (`5516999999999`) pelo número real no formato DDI+DDD+numero.

## Integração de formulário
O formulário padrão aponta para Formspree — substitua `action` no form por seu endpoint (Formspree, EmailJS ou seu backend).

## Próximos passos para profissionalizar
- Substituir `data/imoveis.json` por um CMS (Sanity/Netlify CMS) para edição sem deploy.
- Adicionar páginas estáticas por imóvel (SEO) ou migrar para Next.js para geração de páginas dinamicamente.
- Otimizar imagens (WebP/AVIF), adicionar sitemap.xml e Schema.org JSON-LD.
- Configurar domínio e HTTPS no provedor de hospedagem.

## Licença
Este projeto é fornecido como exemplo e pode ser usado/alterado livremente.
