# Kairós Motores - Painel de Gestão de Projetos

Este é um Painel de Gestão (Dashboard) interativo, desenvolvido com design Glassmorphic, para gerenciar projetos da Kairós Motores.

## Funcionalidades
- **Interface Glassmorphic:** Design premium com fundo dinâmico de partículas e engrenagens.
- **Fundo Dinâmico:** Controles de desfoque e opacidade para melhorar a leitura.
- **Edição em Tempo Real:** Clique nos cartões para editar informações.
- **Armazenamento Local:** Dados salvos diretamente no seu navegador (`localStorage`).
- **Backup e Restauração:** Exporte seus projetos em JSON e importe quando necessário.
- **Modo TV (Apresentação):** Acesse a URL com `?mode=tv` para ocultar os controles e exibir em tela cheia na sua Smart TV.

## Como Publicar na Smart TV via GitHub Pages

Como o projeto já foi enviado para o seu GitHub, você pode hospedá-lo gratuitamente!

1. Acesse seu repositório no GitHub: [https://github.com/rodrigoelav/kairos-dashboard](https://github.com/rodrigoelav/kairos-dashboard)
2. Vá na aba **Settings** (Configurações).
3. No menu lateral esquerdo, clique em **Pages**.
4. Em **Build and deployment**, abaixo de **Source**, mantenha `Deploy from a branch`.
5. Em **Branch**, mude de `None` para `main` e deixe a pasta como `/ (root)`.
6. Clique no botão **Save**.
7. Aguarde alguns minutos (cerca de 1 a 2 minutos). O GitHub mostrará um link no topo da página do Pages, semelhante a: `https://rodrigoelav.github.io/kairos-dashboard/`

Para usar na Smart TV, basta adicionar `?mode=tv` ao final do link. Exemplo:
**`https://rodrigoelav.github.io/kairos-dashboard/?mode=tv`**
