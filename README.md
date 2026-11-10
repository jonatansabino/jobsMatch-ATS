# JobMatch ATS

Aplicação SPA em português para organização de currículos e candidaturas. **Esta entrega implementa somente a Etapa 1: setup e design system.** Os recursos de negócio estão sinalizados como indisponíveis, sem dados fictícios, formulários simulados ou pontuações inventadas.

## Executar

Requer Node.js 22.12+ e npm. Node e Vite são ferramentas de desenvolvimento/build, sem servidor de aplicação em produção.

```bash
npm ci
npm run dev
```

Acesse o endereço exibido pelo Vite, normalmente `http://localhost:5173`.

```bash
npm run lint
npm run build
npm run test
npm run preview
```

`npm run test:watch` inicia os testes em modo interativo. `npm run format` formata o código-fonte. O build estático fica em `dist/`.

## Escopo entregue

- Vite, React e TypeScript com `strict` habilitado.
- Tailwind CSS 4 com tokens semânticos e a paleta solicitada.
- Componentes shadcn/ui: Button, Card, Badge, Sheet, DropdownMenu, Tooltip, Separator e Sonner. Componentes adicionais serão instalados conforme as próximas etapas.
- Rotas para Dashboard, Meus Currículos, Analisar Vaga, Histórico de Análises, Minhas Candidaturas, Modelos de Currículos e Configurações; fallback 404.
- Sidebar com indicação da rota ativa, header, breadcrumbs, atalhos de navegação e menu móvel em Sheet com fechamento ao navegar.
- Temas claro, escuro e automático, incluindo acompanhamento das mudanças do sistema. Zustand gerencia a preferência e persiste somente o tema em LocalStorage.
- Estados vazios, ações futuras desativadas com explicação visível e informações de privacidade.
- Navegação por teclado, link de salto, rótulos acessíveis, foco no conteúdo ao mudar de rota e respeito a movimento reduzido.
- Vitest e React Testing Library: rotas, navegação, indisponibilidade de ações futuras, persistência do tema, menu móvel e página 404.

## Organização e arquivos

Todos os arquivos abaixo foram criados nesta entrega, pois o diretório estava vazio.

```text
src/
  app/                         # app.tsx, navigation.ts, theme-provider.tsx,
                               # theme-options.ts, not-found-page.tsx, app.test.tsx
  components/
    layout/                    # app-layout.tsx, sidebar.tsx
    shared/                    # page-heading.tsx, feature-placeholder.tsx, theme-menu.tsx
    ui/                        # componentes shadcn/ui
  features/
    dashboard/dashboard-page.tsx
    resumes/resumes-page.tsx
    jobs/analyze-job-page.tsx
    history/history-page.tsx
    applications/applications-page.tsx
    templates/templates-page.tsx
    settings/settings-page.tsx
    ats/, editor/              # reservados, sem implementação
  hooks/use-theme.ts
  lib/
    utils.ts                   # composição de classes
    ats/, storage/, documents/, export/, utils/  # reservados
  data/, types/                # reservados para as próximas etapas
  styles/globals.css
  test/setup.ts
  main.tsx
public/favicon.svg
components.json                # configuração do shadcn/ui
vite.config.ts                 # Vite, Tailwind, alias e Vitest
eslint.config.js
tsconfig*.json
package.json, package-lock.json
index.html
.gitignore
README.md
docs/design/                   # referência visual e decisões de design
```

Componentes de UI são código local gerado pelo shadcn/ui sobre Radix UI. A integração de Sonner foi adaptada para o estado de tema do Zustand, evitando uma segunda biblioteca de temas. A versão TypeScript 5.9 foi escolhida por compatibilidade com typescript-eslint. O override de minimatch utiliza uma versão corrigida para a dependência transitiva das ferramentas de lint.

Não há back-end, autenticação, chamadas a IA ou recursos externos necessários à execução. Fontes usam a pilha local do sistema. Não há IndexedDB ou mockData nesta etapa. Dexie, React Hook Form, Zod, Recharts, date-fns e bibliotecas de documentos serão adicionados apenas nas etapas que os utilizarem.

Em hospedagem estática, configure o fallback de URLs para `index.html` para permitir acesso direto às rotas do BrowserRouter. A publicação não faz parte desta entrega local.

## Comandos utilizados no desenvolvimento

```bash
npm create vite@latest . -- --template react-ts
npm install react-router-dom zustand lucide-react sonner class-variance-authority clsx tailwind-merge radix-ui
npm install -D tailwindcss @tailwindcss/vite @types/node vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D typescript@~5.9.3 eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh prettier
npx shadcn@latest add button card badge sheet dropdown-menu tooltip separator sonner -y
npm run lint
npm run build
npm run test
```

O starter inicialmente instalou TypeScript 7 e oxlint; a configuração final substitui oxlint por ESLint e usa TypeScript 5.9. Imports/aliases dos componentes gerados foram ajustados para este projeto. As dependências desnecessárias `cn` e `next-themes`, adicionadas pelo gerador, foram removidas. `package-lock.json` registra a instalação final reproduzível.

## Validação desta entrega

- `npm run lint`: sem erros ou avisos.
- `npm run build`: compilação TypeScript e bundle de produção concluídos.
- `npm run test`: 11 testes aprovados.
- `npm audit`: sem vulnerabilidades após atualizar a dependência transitiva minimatch.
- Prévia local respondeu HTTP 200.
- Revisão visual em navegador real não realizada: o navegador de automação não está disponível nesta sessão. O layout utiliza breakpoints responsivos; confirme a aparência em desktop e celular ao abrir a prévia local.

## Próximo passo — somente após nova solicitação

Etapa 2: modelar entidades, implementar Dexie/IndexedDB com migrações e carregar o dashboard a partir de dados persistidos. Exemplos deverão ser carregados exclusivamente ao escolher “Explorar demonstração”, identificados e separados dos dados pessoais. A Etapa 2 não foi iniciada.
# jobsMatch-ATS
