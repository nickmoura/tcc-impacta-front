# TCC Impacta — Frontend

Este repositório contém o frontend do projeto "TCC Impacta", uma aplicação React criada com Vite e TypeScript.

Descrição do projeto

Este é um sistema de gestão de clínicas médicas com funcionalidades para:
 - Agendamento de consultas
 - Gestão de pacientes
 - Suporte a multitenancy (várias clínicas/operadores)
 - Módulo financeiro (faturas, pagamentos, cobranças)

 **Resumo técnico:**
 - Frontend em React + TypeScript
 - Build com Vite
 - Estilização com Tailwind CSS
 - Requisições HTTP via Axios
 - Lint com ESLint

 Tecnologias principais
 - React 19
 - TypeScript
 - Vite
 - Tailwind CSS
 - Axios
 - ESLint

 Pré-requisitos
 - Node.js v20 ou superior
 - npm ou pnpm

 Instalação
 1. Instale dependências:

 ```bash
 npm install
 ```

 2. Execute em modo de desenvolvimento:

 ```bash
 npm run dev
 ```

 Scripts úteis
 - `dev`: inicia o servidor de desenvolvimento (Vite)
 - `build`: compila TypeScript (`tsc -b`) e cria a build do Vite
 - `preview`: pré-visualiza a build criada
 - `lint`: executa o ESLint no projeto

 Exemplo de uso de scripts:

 ```bash
 npm run dev
 npm run build
 npm run preview
 npm run lint
 ```

Estrutura principal do projeto
- `src/`: código-fonte da aplicação
- `public/`: ativos estáticos
- `index.html`: entrada da aplicação
- `vite.config.ts`: configuração do Vite
- `tsconfig.*.json`: configurações do TypeScript

Boas práticas e notas
- Ajuste variáveis de ambiente e URLs de API conforme o ambiente (arquivo `.env` se necessário).
- Execute `npm run lint` antes de abrir PRs para manter a consistência de código.


Contribuição
- Faça um fork do repositório
- Crie uma branch com a sua feature/fix
- Abra um Pull Request descrevendo as mudanças

Repositório e suporte
- Repositório: https://github.com/nickmoura/tcc-impacta-front

Licença
- ISC (conforme `package.json`)

Se quiser, posso adicionar instruções específicas de deploy ou exemplo de .env.
