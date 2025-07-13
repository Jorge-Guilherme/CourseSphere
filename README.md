# CourseSphere - Gestão Colaborativa de Cursos

Uma plataforma moderna e intuitiva para gestão colaborativa de cursos e aulas, desenvolvida com React, TypeScript e seguindo os princípios do Atomic Design.

## Sobre o Projeto

O CourseSphere é uma plataforma completa para gestão de cursos que permite aos usuários criar, gerenciar e colaborar em cursos e aulas. Desenvolvido com foco em experiência do usuário, performance e escalabilidade.

### Características Principais

- **Interface Moderna**: Design responsivo com tema escuro
- **Gestão Colaborativa**: Múltiplos instrutores por curso
- **Sistema de Permissões**: Controle granular de acesso
- **API Externa**: Integração com randomuser.me para sugestões
- **Validações Avançadas**: Formulários com validação em tempo real
- **Feedback Visual**: Toasts e notificações informativas

## Funcionalidades

### Autenticação e Usuários

- ✅ Login com validação de credenciais
- ✅ Sistema de sessão persistente
- ✅ Proteção de rotas
- ✅ Logout seguro

### Gestão de Cursos

- ✅ Criação de cursos com validação
- ✅ Visualização de cursos no dashboard
- ✅ Filtros por data e busca por nome
- ✅ Status de cursos (Em breve, Em andamento, Finalizado)
- ✅ Contagem de aulas por curso

### Gestão de Instrutores

- ✅ Visualização de instrutores atuais
- ✅ Adição de instrutores existentes
- ✅ Sugestões via API externa (randomuser.me)
- ✅ Remoção de instrutores (exceto criador)
- ✅ Feedback visual de sucesso/erro

### Gestão de Aulas

- ✅ CRUD completo de aulas
- ✅ Paginação nas listas
- ✅ Filtros por status (Rascunho, Publicada, Arquivada)
- ✅ Busca por título
- ✅ Validação de URLs de vídeo
- ✅ Controle de permissões por aula

### Interface e UX

- ✅ Design responsivo (mobile-first)
- ✅ Tema escuro moderno
- ✅ Animações suaves
- ✅ Loading states
- ✅ Tratamento de erros
- ✅ Tela de acesso negado
- ✅ Página 404 customizada

## Tecnologias

### Frontend

- **React 18.2.0** - Biblioteca JavaScript para interfaces
- **TypeScript 5.0** - Tipagem estática
- **Vite 5.4** - Build tool e dev server
- **React Router 6** - Roteamento
- **TanStack Query** - Gerenciamento de estado e cache

### Styling

- **Tailwind CSS 3.3** - Framework CSS utilitário
- **Shadcn/ui** - Componentes UI
- **Lucide React** - Ícones
- **San Francisco** - Fonte do sistema Apple

### Backend (Mock)

- **JSON Server** - API REST mock
- **RandomUser.me** - API externa para sugestões

### Desenvolvimento

- **ESLint** - Linting
- **Prettier** - Formatação de código
- **PostCSS** - Processamento CSS

## Arquitetura

### Atomic Design

O projeto segue a metodologia Atomic Design para organização de componentes:

```
src/components/
├── atoms/          # Componentes básicos (Button, Input, Label)
├── molecules/      # Combinações simples (Card, Form, Alert)
├── organisms/      # Componentes complexos (Sidebar, Table)
└── templates/      # Layouts (futuro)
```

### Estrutura de Features

```
src/features/
├── auth/           # Autenticação
├── courses/        # Gestão de cursos
└── lessons/        # Gestão de aulas
```

### Shared Resources

```
src/shared/
├── components/     # Componentes compartilhados
├── contexts/       # Contextos React
├── hooks/          # Custom hooks
├── lib/           # Utilitários e APIs
└── types/         # Tipos TypeScript
```

## Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Passos

1. **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/coursesphere.git
cd coursesphere
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure o banco de dados mock**

```bash
# Em um terminal separado
npx json-server --watch db.json --port 3001
```

4. **Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

5. **Acesse a aplicação**

```
http://localhost:8081
```

## Uso

### Credenciais de Teste

```
Email: admin@coursesphere.com
Senha: admin123
```

### Fluxo Principal

1. **Login**: Acesse com as credenciais acima
2. **Dashboard**: Visualize seus cursos
3. **Criar Curso**: Clique em "Novo Curso"
4. **Gerenciar Instrutores**: Adicione colaboradores
5. **Criar Aulas**: Adicione conteúdo ao curso
6. **Editar/Remover**: Gerencie cursos e aulas

### Funcionalidades Avançadas

- **Busca e Filtros**: Use os filtros no dashboard
- **API Externa**: Teste a sugestão de instrutores
- **Validações**: Experimente submeter formulários inválidos
- **Responsividade**: Teste em diferentes tamanhos de tela

## API

### Endpoints Locais (JSON Server)

```
GET    /courses          # Listar cursos
POST   /courses          # Criar curso
PUT    /courses/:id      # Atualizar curso
DELETE /courses/:id      # Deletar curso

GET    /lessons          # Listar aulas
POST   /lessons          # Criar aula
PUT    /lessons/:id      # Atualizar aula
DELETE /lessons/:id      # Deletar aula

GET    /users            # Listar usuários
POST   /users            # Criar usuário
```

### API Externa

```
GET https://randomuser.me/api/?nat=br  # Sugestões de instrutores
```

## Estrutura do Projeto

```
coursesphere/
├── public/                 # Arquivos estáticos
├── src/
│   ├── components/         # Componentes Atomic Design
│   │   ├── atoms/         # Componentes básicos
│   │   ├── molecules/     # Combinações simples
│   │   ├── organisms/     # Componentes complexos
│   │   └── templates/     # Layouts
│   ├── features/          # Funcionalidades
│   │   ├── auth/          # Autenticação
│   │   ├── courses/       # Gestão de cursos
│   │   └── lessons/       # Gestão de aulas
│   ├── shared/            # Recursos compartilhados
│   │   ├── components/    # Componentes globais
│   │   ├── contexts/      # Contextos React
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/          # Utilitários
│   │   └── types/        # Tipos TypeScript
│   ├── pages/            # Páginas especiais
│   ├── App.tsx           # Componente principal
│   ├── main.tsx          # Entry point
│   └── index.css         # Estilos globais
├── db.json               # Banco de dados mock
├── package.json          # Dependências
├── tailwind.config.ts    # Configuração Tailwind
├── vite.config.ts        # Configuração Vite
└── README.md             # Este arquivo
```

## Design System

### Cores

- **Primary**: `#22c55e` (Verde vibrante)
- **Background**: `#0f1419` (Azul muito escuro)
- **Foreground**: `#f8fafc` (Branco acinzentado)
- **Card**: `#1a1f2e` (Azul escuro)
- **Border**: `#2d3748` (Azul acinzentado)
- **Destructive**: `#ef4444` (Vermelho)

### Tipografia

- **Fonte**: San Francisco (SF Pro Display)
- **Pesos**: 300, 400, 500, 600, 700, 800
- **Fallback**: -apple-system, BlinkMacSystemFont, Segoe UI

### Componentes

- **Botões**: Variantes primary, secondary, outline, ghost
- **Cards**: Com gradientes e sombras
- **Formulários**: Validação em tempo real
- **Toasts**: Feedback visual
- **Loading**: Estados de carregamento

### Padrões de Código

- Use TypeScript para tipagem
- Siga o Atomic Design
- Mantenha componentes pequenos e focados
- Use Tailwind CSS para estilos
- Documente funções complexas

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
