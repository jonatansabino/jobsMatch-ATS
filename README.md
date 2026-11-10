# JobMatch ATS

SPA em português, inteiramente front-end, com layout responsivo e **persistência/CRUD de currículos**. Mantém React, TypeScript strict, Tailwind CSS e shadcn/ui. Não há back-end, autenticação, banco remoto ou serviços de IA.

## Executar

Requer Node.js 22.12+ e npm, usados apenas como ferramentas de desenvolvimento/build.

```bash
npm ci
npm run dev
```

Abra o endereço exibido pelo Vite, normalmente `http://localhost:5173`.

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run preview
```

O build estático fica em `dist/`. `npm run test:watch` executa os testes interativamente; `npm run format` formata o código-fonte. Em hospedagem estática, configure fallback para `index.html` para permitir abrir URLs de rotas diretamente.

## Funcionalidades disponíveis

- Sidebar, header, breadcrumbs, menu móvel, sete páginas e 404.
- Tema claro, escuro e automático, com preferência em LocalStorage via Zustand.
- Cadastro, edição e renomeação de currículos, com React Hook Form e Zod.
- Dados pessoais, resumo, experiências, formação, habilidades, certificações, idiomas e projetos. Listas permitem adicionar, remover com confirmação e reordenar itens.
- Busca, ordenação, duplicação e currículo principal.
- Autosave após 800 ms de pausa, salvamento manual, estados de erro e proteção de navegação com alterações pendentes.
- IndexedDB via Dexie, com transações atômicas e detecção de conflitos entre abas.
- Histórico de versões imutáveis, consulta dos dados de cada versão e restauração que preserva o histórico.
- Exclusão reversível mediante confirmação e recuperação na lixeira.
- Total de currículos ativos no dashboard, atualizado a partir do banco local.

O cadastro começa vazio; nenhum exemplo, habilidade ou experiência é inserido automaticamente. Preencha apenas informações verdadeiras. O primeiro currículo é principal. Para editar, use **Meus Currículos → Novo currículo** ou **Editar currículo**. Ações secundárias, como duplicação e seleção do principal, ficam no menu de cada cartão. Use **Versões** para consultar e restaurar registros anteriores.

## Dados e privacidade

O banco IndexedDB `jobmatch-ats`, esquema v1, contém `resumes` e `resumeVersions`. Mudanças de conteúdo e suas versões são gravadas juntas, ou ambas revertidas em caso de erro. A lixeira mantém os dados e o histórico; esta entrega não implementa exclusão permanente.

Dados persistem após recarregar a página no mesmo navegador/origem. Limpar os dados do site, trocar navegador/origem ou usar uma sessão privada pode impedir sua recuperação. Aguarde **Salvo neste navegador** antes de atualizar a página. Se o navegador bloquear a escrita ou atingir a cota, os campos permanecem no formulário para correção/tentativa ou cópia para novo currículo. Conflitos entre abas não sobrescrevem a versão salva silenciosamente.

Apenas o tema usa LocalStorage. Nenhum dado é enviado para serviços externos. Fontes usam a pilha local do sistema. Não há mockData carregado nesta entrega. Backup/restauração JSON global e importação de documentos ainda não estão disponíveis.

## Organização

```text
src/
  app/                   # rotas, tema e testes de navegação
  components/
    layout/              # layout existente, preservado
    shared/              # cabeçalhos, confirmações e estados vazios
    ui/                  # componentes shadcn/ui locais
  features/
    resumes/             # CRUD, formulários, autosave, versões e testes
    dashboard/           # total real de currículos; demais indicadores futuros
    settings/            # tema e informações de privacidade
    jobs/, history/, applications/, templates/  # páginas futuras preservadas
    ats/, editor/        # reservados
  hooks/                 # use-theme e consultas reativas de currículos
  lib/storage/           # Dexie, repositório transacional, erros e testes
  types/resume.ts        # contratos e schemas Zod
  styles/globals.css     # design system existente
  test/setup.ts          # JSDOM, Testing Library e fake-indexeddb
```

As páginas carregam sob demanda. O React Router utiliza data router para proteger a navegação com alterações pendentes, mantendo as URLs existentes. A fonte de dados é o IndexedDB; não há uma segunda store de currículos em LocalStorage/Zustand. Novos controles usam o design system existente e componentes shadcn/ui.

A [auditoria](docs/AUDIT.md) registra a classificação de todas as funcionalidades, decisões técnicas, arquivos adicionados/modificados e próximos passos. A [referência visual](docs/design/README.md) original foi preservada.

## Testes

Os testes de persistência usam fake-indexeddb e exercitam o repositório Dexie real: reabertura de banco, CRUD, concorrência do principal, conflitos, versões, restauração e rollback quando uma gravação falha. Os testes de interface cobrem autosave, validação, erros, lixeira, histórico, pesquisa, ordenação, navegação e tema.

Não há testes de análise ATS nesta entrega porque o motor permanece não implementado e fora do escopo autorizado. A revisão visual em navegador real continua recomendada; os testes de interface executam em JSDOM.

## Fora do escopo desta entrega

Análise ATS, prévia e comparação de currículos, otimização, importação PDF/DOCX/TXT, exportações, Kanban, cartas, demonstração e backup global. As páginas futuras permanecem com seus avisos de indisponibilidade.

Próxima etapa recomendada: motor ATS client-side, mediante nova solicitação. Não houve avanço automático.
