# L&L Meu Mundo Cristão | site de apresentação

Site da loja do Lucas Lopes (Instagram @l.meumundocristao): gravatas, camisas e acessórios,
com pedido pelo WhatsApp (19) 99118-0486 e envio para todo o Brasil.

## Estrutura

```
MeuMundoCristao/
├── index.html        # home: abertura, hero, linhas, destaques, qualidade, looks, como comprar
├── catalogo.html     # catálogo com busca, filtros e lista de pedido pelo WhatsApp
├── css/style.css     # visual (cores da marca no topo, em :root)
├── js/intro.js       # abertura: gravata vermelha se amarrando (1x por visita; ?intro força)
├── js/gravatas.js    # LISTA DE PRODUTOS (mexa só aqui para incluir ou trocar gravatas)
├── js/main.js        # menu, animações ao rolar, destaques e anatomia da gravata
├── js/catalogo.js    # busca, filtros, janela do produto, lista e mensagem do WhatsApp
└── assets/img/       # produtos/<id>-1.jpg, -2.jpg... e looks/ (fotos do Instagram, 900x1200)
```

Fotos originais baixadas do Instagram: `../_fotos-originais/MeuMundoCristao/`.

## Catálogo

- Produtos na lista PRODUTOS de js/gravatas.js; `fotos` é quantas fotos o produto tem
- Quando a foto mostra várias gravatas, `variantes` faz o cliente escolher a cor
- Busca sem acento, filtro por linha e por cor, ordenação; tudo fica no endereço
  (ex.: catalogo.html?cat=xadrez&cor=azul). `?p=<id>` abre direto a janela do produto
- A lista fica salva no navegador (`mmc-lista`) e vai pronta pelo WhatsApp

## Como abrir

Abra o `index.html` no navegador. Não precisa instalar nada.
Para ver a abertura de novo: `index.html?intro`.

## Pendências (marcadas com TODO no código)

- Lucas: confirmar nomes, linha (Luxo/Premium/Xadrez) e estoque de cada gravata
- Lucas: quais camisas e acessórios entram no catálogo (hoje vão para o WhatsApp)
- Logo oficial em arquivo (hoje é uma versão desenhada do "LL")
- Autorização de uso de imagem das pessoas nas fotos de looks
- Razão social e CNPJ para o rodapé; política de privacidade e termos antes de publicar
- Domínio e imagem de compartilhamento (og.jpg 1200x630)
