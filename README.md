# DevPortfolio

DevPortfolio é uma plataforma web moderna desenvolvida para que programadores possam gerenciar e exibir seus projetos, portfólio e perfil profissional. O sistema oferece autenticação segura, integração com a API do GitHub, upload de imagem de perfil, painel de controle completo com projetos pessoais e da comunidade — tudo com um layout escuro, responsivo e profissional.

---

## Funcionalidades

### Autenticação
- Cadastro e login de usuários com token JWT.
- Proteção de rotas sensíveis.

### Perfil do Usuário
- Visualização e edição de nome e e-mail.
- Upload, visualização e remoção de avatar (imagem de perfil).

### Dashboard
- Seção "Meus Projetos": CRUD completo dos projetos do usuário autenticado.
- Seção "Projetos da Comunidade": exibição de projetos cadastrados por todos os usuários.

### Portfólio Integrado ao GitHub
- Integração com API pública do GitHub.
- Requisições para repositórios, linguagens mais usadas e commits recentes.
- Gráficos modernos com dados reais e atualizados.

### Design
- Layout escuro com estilo moderno.
- Interface responsiva com Sidebar e Header fixos.
- Estilo visual com gradientes, microinterações e efeitos glassmorphism.

### Upload de Imagens
- Upload com preview de avatar e imagens de projetos.
- Validação e tratamento no backend com Multer.

### API RESTful
- Backend construído com Node.js e Express.
- Rotas protegidas e estruturadas.
- Conexão com banco de dados MySQL.

---

## Tecnologias Utilizadas

### Frontend
- React 19
- Vite
- React Router
- Axios
- Chart.js
- TailwindCSS (ou CSS customizado)

### Backend
- Node.js
- Express
- MySQL
- JWT
- Bcrypt
- Multer

### Outros
- ESLint
- dotenv
- CORS

---

## Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/devportfolio.git
cd devportfolio
```

### 2. Backend
```bash
cd backend
cp .env.example .env     # Configure as variáveis de ambiente
npm install
npm start
```

Configure o arquivo `.env` com:
- As credenciais do seu banco de dados MySQL.
- A variável `JWT_SECRET`.
- A porta (`PORT`) desejada.

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível por padrão em: `http://localhost:5173`.

---

## Banco de Dados

Use o arquivo `database.sql` na raiz do projeto para criar as tabelas necessárias no MySQL.

### Principais tabelas:
- `usuarios` (id, username, email, password, avatar, created_at)
- `projetos` (id, usuario_id, titulo, descricao, imagem, link, created_at)

---

## Variáveis de Ambiente

No backend, o arquivo `.env` deve conter:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=nome_do_banco
JWT_SECRET=sua_chave_secreta
PORT=5000
```

---

## Uploads

- As imagens de avatar e de projetos são salvas na pasta `/backend/uploads`.
- O backend serve arquivos estáticos dessa pasta através da rota `/uploads`.

---

## Rotas Principais

### Backend
- `POST /api/auth/register` — Cadastro de usuário
- `POST /api/auth/login` — Login de usuário
- `GET /api/user/me` — Dados do usuário autenticado
- `PUT /api/user/me/avatar` — Upload ou atualização do avatar
- `DELETE /api/user/me/avatar` — Remover avatar
- `GET /api/projetos` — Listar todos os projetos (comunidade)
- `POST /api/projetos` — Criar novo projeto
- `PUT /api/projetos/:id` — Atualizar projeto
- `DELETE /api/projetos/:id` — Remover projeto

### Frontend
- `/login` — Tela de login
- `/register` — Tela de cadastro
- `/` — Dashboard principal
- `/portfolio` — Portfólio com integração ao GitHub
- `/profile` — Perfil do usuário

---

## Integração com a API do GitHub

A aplicação consome a API pública do GitHub para:
- Buscar dados de repositórios do usuário.
- Exibir linguagens mais usadas (com gráficos).
- Mostrar commits e repositórios fixados.

A integração proporciona uma visualização dinâmica e personalizada do GitHub diretamente no portfólio do usuário.

---

## Como Usar

1. Cadastre-se ou faça login.
2. Acesse o perfil e edite seu nome, e-mail e avatar.
3. Adicione e gerencie projetos no dashboard.
4. Veja estatísticas e informações do seu GitHub na aba "Portfólio".
5. Explore projetos da comunidade.

---

## Segurança

- Senhas são armazenadas de forma segura usando hash com Bcrypt.
- Todas as rotas privadas são protegidas com autenticação JWT.
- Imagens são validadas e armazenadas com nomes únicos.

---

## Screenshots

Adicione aqui capturas de tela do seu projeto para demonstrar o visual da aplicação.

---

## Licença

Este projeto é open-source e está disponível para fins educacionais e uso pessoal.

---

## Contribuição

Pull requests são bem-vindos! Fique à vontade para sugerir melhorias ou reportar problemas na aba de Issues.

---

DevPortfolio — Seu portfólio, sua identidade, seu código.
