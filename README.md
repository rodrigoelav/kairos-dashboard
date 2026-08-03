# 🚀 Kairós Motores - Dashboard de Projetos em Andamento

Um painel interativo de **Gestão à Vista** moderno com visual escuro *glassmorphic*, cartões organizados em grid, suporte a **fundos dinâmicos** (Vídeo, GIF animado ou Partículas Tech em Canvas) e **Modo Smart TV** integrado.

---

## 📸 Estrutura Visual

- **Grid de 3 Colunas** idêntico à imagem de referência da Kairós Motores.
- **Cartões Glassmorphic**: Ícones personalizados em vermelho neon, título, responsáveis entre parênteses e badge de status colorido no canto inferior direito (*Em andamento*, *Em análise*, *Parado*, *Concluído*).
- **10 Projetos Iniciais Carregados**:
  1. API Faturamento (Douglas e Pedro) - Em andamento
  2. E-Commerce Kairós (Rodrigo) - Em análise
  3. Peritagem Digital (Rodrigo e Douglas) - Em andamento
  4. Relatório Digital (Rodrigo e Douglas) - Em andamento
  5. Nova Inspeção de Qualidade (Guilherme) - Em andamento
  6. Capacidade Produtiva (Rodrigo) - Parado
  7. Produção de placas de iden. (Douglas e Juniel) - Em andamento
  8. Ambiente Financeiro do HUB PT (Douglas) - Em andamento
  9. Aprimoramento Ferrovia (Rodrigo e Juniel) - Em análise
  10. Start-Up nova unidade (Juniel) - Em andamento

---

## 🛠️ Como Executar Localmente

Como o projeto foi desenvolvido com tecnologias puras (HTML5, CSS3, Vanilla JS ES6):

1. Navegue até a pasta: `C:\Users\Rodri\Documents\kairos-dashboard`
2. Dê um **duplo clique no arquivo `index.html`**.
3. O painel abrirá instantaneamente em qualquer navegador (Chrome, Edge, Firefox, Brave) sem precisar instalar nenhum servidor ou programa adicional!

---

## 🌐 Como Integrar ao GitHub e Gerar o Link para a Smart TV (Passo a Passo)

### 1. Criar o Repositório no GitHub
1. Acesse [github.com/new](https://github.com/new)
2. Defina o nome do repositório como `kairos-dashboard`
3. Deixe marcado como **Público** e clique em **Create repository**.

### 2. Enviar os Arquivos pelo Terminal
No Prompt de Comando (cmd) ou Git Bash na pasta do projeto:

```bash
cd "C:\Users\Rodri\Documents\kairos-dashboard"
git init
git add .
git commit -m "Initial commit - Kairós Motores Dashboard"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/kairos-dashboard.git
git push -u origin main
```
*(Substitua `SEU-USUARIO` pelo seu nome de usuário no GitHub).*

---

### 3. Ativar o GitHub Pages (Hospedagem Gratuita em 1 Clique)
1. No seu repositório do GitHub, vá na aba **Settings** (Configurações).
2. No menu lateral esquerdo, clique em **Pages**.
3. Em **Build and deployment > Source**, selecione a branch `main` e a pasta `/ (root)`.
4. Clique em **Save**.
5. Aguarde cerca de 1 minuto. O GitHub exibirá o seu **Link Público**:
   👉 `https://seu-usuario.github.io/kairos-dashboard/`

---

## 📺 Como Exibir na Smart TV

1. No navegador da sua Smart TV, digite a URL adicionando `?mode=tv` no final:
   👉 `https://seu-usuario.github.io/kairos-dashboard/?mode=tv`
2. O painel abrirá **automaticamente no Modo Apresentação / Kiosk**, ocultando botões de edição e destacando apenas os projetos e a animação do fundo em tela cheia!
3. Para sair do modo TV se precisar editar algo na própria tela, basta clicar no botão flutuante no canto inferior direito **"Sair do Modo TV"**.

---

## ⚙️ Funcionalidades Principais

- ✏️ **Edição Completa**: Clique em qualquer cartão para editar título, responsáveis, status, ícone e notas.
- ⚡ **Troca de Status Rápida**: Clique direto sobre o badge colorido (*Em andamento*, *Em análise*, etc.) para alternar o status com 1 clique.
- 🎥 **Gerenciador de Fundo Dinâmico**: Escolha entre o Canvas de Engrenagens Tech (super leve), vídeo MP4 via URL/arquivo local ou GIF animado, com controle deslizante de escurecimento e desfoque.
- 💾 **Salvamento Automático & Backup**: Todos os dados são salvos no navegador. Use o menu `...` para exportar ou importar backups em formato JSON.
