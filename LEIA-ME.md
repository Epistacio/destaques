# Mini site de redes sociais

Página central com **um destaque do momento** (trocável) e **todos os perfis nas redes**.
HTML, CSS e JS puros: sem instalação e sem build. Para ver, abra `index.html` no navegador
(dois cliques). Para publicar, envie a pasta inteira para qualquer hospedagem estática.

## Onde editar

| O que mudar | Arquivo | Observação |
|---|---|---|
| **Tema do momento** (título, texto, imagem, botão, etiqueta, período) | `dados/tema.js` | Basta editar este arquivo para trocar o destaque |
| **Redes sociais** (nome, @perfil, link, ícone, ordem) | `dados/redes.js` | Um bloco `{ }` por rede |
| **Nome do projeto, logo, contato e rodapé** | `dados/site.js` | Campos vazios (`""`) somem da página |
| Cores e fontes | `css/estilo.css` (bloco `:root` no topo) | Só se a identidade mudar |

Não é preciso mexer em `index.html`, `js/app.js` ou `js/icones.js`.

## Como trocar o tema (passo a passo)

1. Salve a nova imagem em `img/` (de preferência 1200 × 900 px, JPG ou WebP).
2. Em `dados/tema.js`, troque `imagem` pelo nome do arquivo (ex.: `"img/campanha-x.jpg"`) e
   escreva o `imagemAlt` descrevendo a foto.
3. Atualize `titulo`, `tituloDestaque` (opcional, aparece em verde-limão), `descricao`,
   `botaoTexto` e `botaoLink`.
4. `etiqueta` e `periodo` são opcionais: use `""` para esconder.
5. Salve o arquivo e recarregue a página.

## Situação atual

Preenchido com o tema "Programa Residência Agropecuária", as redes oficiais e os dados
institucionais do SENAR Tocantins. Em aberto: e-mail geral (`contato.email` vazio, de propósito)
e WhatsApp (fora por enquanto). Para arte de feed 1080×1350, use `imagemFormato: "retrato"`.

Links que ainda contêm `SEU_`, `SUBSTITUIR` ou `exemplo.com` aparecem com a marca **"exemplo"**
na página, para facilitar a revisão antes de publicar.

Ícones disponíveis para `icone`: `instagram`, `facebook`, `youtube`, `linkedin`, `tiktok`, `x`,
`whatsapp`, `flickr`, `spotify`, `site`, `email`.

## Notas técnicas

- Os dados ficam em `.js`, não em `.json`, para o site funcionar abrindo o arquivo direto
  (o navegador bloqueia leitura de JSON local).
- Links externos abrem em nova aba com `rel="noopener noreferrer"`; só são aceitos `http(s)`,
  `mailto:` e `tel:`.
- Fontes Sora e Barlow vêm do Google Fonts; sem internet, a página usa as fontes do sistema.
- Respeita "reduzir movimento" do sistema (`prefers-reduced-motion`).
