# Auditoria e entrega — persistência e CRUD

## Escopo

Inspeção do projeto existente e implementação somente da Etapa 2 do pedido de evolução: persistência e CRUD de currículos. As URLs, a identidade visual, os componentes existentes e as outras páginas foram preservados. Não há back-end, login, banco remoto, geração de experiências, motor ATS ou dados demonstrativos nesta entrega.

## Estrutura encontrada

- `src/app`: rotas das sete páginas, página 404, configuração visual dos temas e testes da navegação.
- `src/components/layout`: sidebar e header responsivos, menu móvel em Sheet e breadcrumbs.
- `src/components/shared`: cabeçalho de página, estados futuros e menu de tema.
- `src/components/ui`: oito componentes shadcn/ui gerados localmente.
- `src/features`: dashboard, currículos, vagas, histórico, candidaturas, modelos e configurações; diretórios reservados para ATS/editor.
- `src/hooks/use-theme.ts`: única store Zustand, com persistência da aparência em LocalStorage.
- `src/lib/storage`, `src/data` e `src/types`: apenas diretórios reservados.
- Vite, React, TypeScript strict, Tailwind 4, React Router, Zustand, Radix/Lucide, Sonner, ESLint, Vitest e React Testing Library já configurados.
- Não havia mockData, IndexedDB, repositórios de dados ou serviços remotos.

## Classificação das funcionalidades

A classificação anterior descreve o estado dos arquivos antes desta implementação. “Apenas visual” significa que existia uma página com estado vazio e indicação explícita de indisponibilidade.

| Funcionalidade | Estado anterior | Resultado desta entrega |
| --- | --- | --- |
| Layout, sidebar, header, breadcrumbs, rotas e 404 | Implementada e funcional | Preservada; carregamento das páginas sob demanda |
| Menu móvel e navegação por teclado | Implementada e funcional | Preservada |
| Tema claro/escuro/automático e LocalStorage | Implementada e funcional | Preservada |
| Indicadores e análises recentes do dashboard | Apenas visual | Implementada parcialmente: total de currículos ativos vem do IndexedDB; indicadores ATS continuam indisponíveis |
| Página Meus Currículos | Apenas visual | Implementada e funcional para o escopo de CRUD |
| Criar, editar e renomear currículos | Não implementada | Implementada e funcional |
| Duplicar e selecionar principal | Não implementada | Implementada e funcional |
| Excluir e recuperar currículos | Não implementada | Implementada e funcional, com confirmação e lixeira reversível |
| Pesquisa e ordenação de currículos | Não implementada | Implementada e funcional |
| Persistência de currículos em IndexedDB | Não implementada | Implementada e funcional com Dexie, esquema v1 |
| Autosave e tratamento de conflitos/erros | Não implementada | Implementada e funcional |
| Histórico e restauração de versões de currículo | Não implementada | Implementada e funcional, separado do histórico ATS |
| Formulários por seção | Não implementada | Implementada e funcional para dados fornecidos pelo usuário |
| Editor com prévia, comparador e sugestões | Não implementada | Implementada parcialmente: formulário de edição; prévia, sugestões e comparação ficam para a Etapa 4 |
| Página Analisar Vaga | Apenas visual | Preservada como indisponível |
| Extração de requisitos, evidências e Match Score | Não implementada | Não implementada; próxima etapa |
| Página Histórico de Análises | Apenas visual | Preservada; não confundir com versões do currículo |
| Página Minhas Candidaturas | Apenas visual | Preservada; Kanban não implementado |
| Página Modelos de Currículos | Apenas visual | Preservada; seleção e modelos não implementados |
| Página Configurações | Implementada parcialmente | Tema funcional preservado; privacidade atualizada; backup global indisponível |
| Importação PDF/DOCX/TXT e exportações | Não implementada | Não implementada |
| Assistente guiado, checklist e cartas | Não implementada | Não implementada |
| Backup/restauração JSON global | Não implementada | Não implementada; restauração individual de versões e lixeira são recursos distintos |
| MockData e modo demonstração | Não implementada | Não implementada; nenhum exemplo é inserido automaticamente |
| Testes de regras ATS | Não implementada | Não implementada, pois o motor ATS permanece fora do escopo |
| Testes de navegação/tema | Implementada e funcional | Preservados e adaptados ao carregamento assíncrono |
| Testes de persistência/CRUD | Não implementada | Implementada e funcional |

## Persistência e integridade

O banco `jobmatch-ats` usa IndexedDB através de Dexie. O esquema inicial é versionado com `version(1)`. Não havia um esquema anterior que exigisse migração; futuras mudanças devem acrescentar uma versão e uma migração explícita, preservando os registros.

| Tabela | Dados |
| --- | --- |
| `resumes` | ID, nome, dados pessoais e seções, revisão, principal, datas de criação/alteração e marcador de lixeira |
| `resumeVersions` | Snapshot completo de nome e conteúdo, currículo associado, número, data e motivo |

- Criação, edição e restauração gravam currículo e snapshot na mesma transação. Uma falha na versão também reverte a edição.
- Salvamentos sem mudança de conteúdo não geram versões extras. Alterar o principal não modifica o histórico textual.
- O primeiro currículo ativo é principal; operações sobre o principal mantêm no máximo um principal ativo. Excluir o principal escolhe outro ativo quando houver.
- Duplicação copia apenas dados existentes, com novo ID e histórico independente.
- Exclusão é lógica e exige confirmação. Todos os snapshots continuam recuperáveis pela lixeira; não há exclusão permanente.
- Salvamentos verificam a revisão esperada. Outra aba não é sobrescrita silenciosamente; o formulário preserva seus campos e oferece salvar como novo currículo.
- `useLiveQuery` mantém listas e total do dashboard sincronizados com o IndexedDB, sem cópia persistente concorrente no Zustand.
- Zustand continua responsável somente pelo tema. Não há arrays estáticos como fonte de registros.

## Formulários e autosave

React Hook Form + Zod validam o nome obrigatório e campos opcionais, incluindo e-mail, tamanho e meses válidos. Currículos podem ser rascunhos: nenhum dado profissional é preenchido ou inferido automaticamente.

As seções incluem dados pessoais, resumo, experiências, formação, habilidades, certificações, idiomas e projetos. Listas permitem adicionar, remover mediante confirmação e reordenar. A remoção de itens não apaga snapshots já salvos.

O autosave ocorre 800 ms após uma pausa. As gravações são serializadas e o estado indica alterações pendentes, salvamento, sucesso ou erro. Há salvamento manual e salvamento antes de fechar. Dados inválidos ou falhas não fecham o formulário. O usuário pode corrigir e tentar novamente, salvar campos válidos como outro currículo ou confirmar o descarte de alterações pendentes.

O React Router foi mantido, utilizando sua configuração de data router para bloquear a saída SPA com alterações pendentes. Navegação salva dados válidos antes de prosseguir; campos inválidos mantêm o formulário aberto. O evento `beforeunload` solicita proteção do navegador enquanto há alterações pendentes.

## Arquivos adicionados

- `src/types/resume.ts`
- `src/lib/storage/database.ts`, `resume-repository.ts`, `errors.ts`, `resume-repository.test.ts`
- `src/hooks/use-resumes.ts`
- `src/features/resumes/create-resume-dialog.tsx`, `resume-card.tsx`, `resume-editor-dialog.tsx`, `resume-fields.tsx`, `resume-form-sections.tsx`, `resume-snapshot.tsx`, `resume-versions-dialog.tsx`, `use-resume-autosave.ts`, `utils.ts`, `resumes-page.test.tsx`
- `src/components/shared/confirm-action.tsx`
- `src/components/ui/alert-dialog.tsx`, `dialog.tsx`, `input.tsx`, `label.tsx`, `skeleton.tsx`, `textarea.tsx`
- `docs/AUDIT.md`

## Arquivos existentes modificados

- `src/features/resumes/resumes-page.tsx`: substitui somente o placeholder de currículos pelo CRUD.
- `src/features/dashboard/dashboard-page.tsx`: total real de currículos e textos de disponibilidade.
- `src/features/settings/settings-page.tsx`: informações corretas sobre persistência, lixeira e recursos futuros.
- `src/components/layout/sidebar.tsx`, `app-layout.tsx`: textos atualizados e fallback de carregamento no conteúdo, mantendo o layout.
- `src/app/app.tsx`: carregamento das páginas sob demanda, preservando rotas.
- `src/main.tsx`: data router necessário à proteção de navegação.
- `src/app/app.test.tsx`, `src/test/setup.ts`: adaptação dos testes e IndexedDB de teste.
- `package.json`, `package-lock.json`: dependências necessárias e comando de verificação TypeScript.
- `README.md`, `docs/design/README.md`: documentação atualizada.

## Validação e limites

Resultados finais: `npm run lint` sem erros/avisos, `npm run typecheck` aprovado, `npm run test` com 35 testes aprovados em 3 arquivos, `npm run build` concluído sem avisos e `npm audit` sem vulnerabilidades.

Testes com Vitest, React Testing Library e fake-indexeddb verificam operações reais do repositório sobre a implementação IndexedDB de teste, incluindo reabertura de uma nova instância. Não são mocks em memória substituindo o CRUD da aplicação.

São cobertos: ausência de seed, criação, persistência ao reabrir, edição, imutabilidade de versões, ausência de versões redundantes, duplicação, principal concorrente, exclusão/restauração, conflitos entre abas, isolamento de históricos, rollback de transações, validação, autosave, erros e recuperação da interface, pesquisa/ordenação, navegação e temas.

A verificação automatizada em JSDOM não substitui uma revisão visual em navegadores reais. Dados locais são específicos do navegador/origem e podem ser perdidos ao limpar os dados do site; backup global ainda está fora do escopo.

## Próximas etapas recomendadas

1. Motor ATS em funções puras, com testes de normalização, equivalências explícitas, requisitos, pesos e evidências.
2. Editor com prévia/comparação e sugestões que dependam da confirmação factual do usuário.
3. Importação e exportação de documentos no navegador.
4. Histórico ATS, Kanban, cartas locais e backup/restauração JSON global.

Nenhuma dessas etapas foi iniciada automaticamente.
