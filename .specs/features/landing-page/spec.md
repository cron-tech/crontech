# Landing Page Institucional (Cron Tech) Specification

## Problem Statement

A Cron Tech ainda não tem presença web: não há como um lead entender a proposta de valor (OaaS — Outcome as a Service: a Cron Tech entrega o resultado pronto e cobra pelo trabalho entregue, não por licença de uso), ver os serviços oferecidos (sites/LPs, sistemas, Mini ERP, automações/RPA, agentes de IA) ou os cases reais, nem tem um caminho claro para iniciar contato. Isso trava a captação de novos clientes, que hoje depende de explicação manual em cada conversa.

## Goals

- [ ] Publicar uma landing page institucional em pt-BR que comunique claramente o modelo OaaS e os 5 serviços, medível por: página navegável de ponta a ponta (intro → todas as seções → footer) sem erros de console em produção.
- [ ] Dar ao visitante um caminho de contato único e funcional (WhatsApp) a partir de qualquer seção relevante (hero, cases, serviços, CTA final).
- [ ] Atingir Lighthouse ≥ 90 (mobile) em Performance, Acessibilidade, Best Practices e SEO.
- [ ] Manter o conteúdo editável fora do código de UI, em `src/content/*.ts`, para que preços/textos/cases futuros não exijam mexer em componentes.

## Out of Scope

Explicitamente excluído desta feature. Documentado para prevenir scope creep.

| Feature                                              | Reason                                                                                          |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Formulário de contato on-page (com backend/API route) | Usuário optou por WhatsApp como único mecanismo de contato (ver `context.md`)                    |
| Preços públicos (valores fixos ou faixas)              | Usuário optou pelo modelo "sob consulta" com CTA para WhatsApp                                   |
| Programa de indicação ("indique e ganhe")              | Usuário decidiu deixar para uma fase futura (Deferred Ideas em `context.md`)                     |
| Multi-idioma / i18n                                    | Site é pt-BR only conforme briefing                                                              |
| Blog / CMS headless / área logada / autenticação       | Não solicitado; fora do escopo de uma landing institucional                                      |
| Cases reais para Sistemas Web & Desktop, Mini ERP, Automações (RPA), Agentes de IA | Usuário instruiu não inventar cases; esses serviços recebem apenas descrição + exemplos de mercado |
| Otimização/reformulação de marca (nova logo, novo naming) | Fora do escopo; usa-se a logo existente em `public/brand/logo-crontech.png`, apenas otimizada tecnicamente |
| Seção "Conheça o Fundador"                              | Removida a pedido do usuário; nenhum dado ou nome de fundador é exibido na página nesta v1            |

---

## Assumptions & Open Questions

Toda ambiguidade foi resolvida ou registrada aqui — nada fica silenciosamente indefinido.

| Assumption / decision                                                        | Chosen default                                                                                          | Rationale                                                                                                                   | Confirmed? |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Número de WhatsApp para os links `wa.me`                                       | `5531984503647`, exibido como "+55 31 98450-3647" em texto; centralizado em `src/content/site.ts`          | Dado real fornecido pelo usuário                                                                                             | y          |
| Domínio de produção (canonical URL, `metadataBase`, Open Graph)                | Placeholder `https://crontech.com.br` marcado como `TODO` para confirmação                                | Necessário para metadata do Next.js funcionar sem erro; usuário optou por manter como TODO por ora                          | n          |
| Depoimentos (quotes de clientes)                                               | Renderização condicional: bloco só aparece `WHERE` houver ≥1 depoimento real em `src/content`; sem depoimento, o bloco não renderiza (sem placeholder) | Usuário decidiu não exibir placeholder visível; evita mostrar seção vazia/fake                                              | y          |
| Screenshots dos 3 cases reais (Performance Motion, Studio Aureum, EvolutionAI) | Arquivos reais em `public/cases/` (`performance-motion.png`, `studio-aureum.png`, `evolution.png`), exibidos via `next/image` | Usuário forneceu os arquivos                                                                    | y          |
| Ferramenta de analytics/tracking                                               | Nenhuma incluída na v1                                                                                     | Não solicitado pelo usuário; evita adicionar rastreamento sem requisito explícito                                          | y          |
| Escopo do Lighthouse ≥ 90                                                       | Aplica-se às 4 categorias (Performance, Acessibilidade, Best Practices, SEO), medidas em mobile            | Requisito não especificava categoria; interpretação padrão é todas as quatro                                                | y          |
| Comportamento do accordion de FAQ                                              | Um item aberto por vez (abrir um fecha os demais)                                                          | Padrão comum de UX para accordions, compatível com a referência visual; não especificado pelo usuário                       | y          |
| Copy geral (dor, pra quem é/não é, diferenciais, FAQ, timeline)                | Escrita pelo agente seguindo o tom da referência, adaptada à Cron Tech/OaaS                                | Autorizado pelo usuário ("Agent's Discretion" em `context.md`); não é dado sensível como preço, contato ou dados pessoais    | y          |
| Arquivo de referência `crontech-ref-home.webp` mostra marca "tradehive"        | Usado apenas como referência de linguagem visual (fundo escuro, glow verde, grid, itálico serifado), não de conteúdo/marca | O arquivo fornecido é um board de estilo de outro projeto; instrução do usuário já veda copiar texto/marca de referências    | y          |

**Open questions:** none — todas resolvidas via `AskUserQuestion` (contato, preços, indicação) ou registradas como assumption acima.

---

## User Stories

### P1: Intro animada de entrada ⭐ MVP

**User Story**: Como visitante entrando no site pela primeira vez na sessão, quero uma intro de marca com a logo e "Cron Tech" digitado em efeito typewriter sobre um fundo escuro com glow verde, para sentir a identidade da marca antes de chegar à home.

**Why P1**: É o primeiro ponto de contato com a marca, definido explicitamente como parte central da experiência pelo briefing; sem ela a home carrega "crua".

**Acceptance Criteria**:

1. WHEN um visitante carrega o site pela primeira vez em uma sessão de navegador (sem flag de intro já vista no `sessionStorage`) THEN o sistema SHALL reproduzir a animação de entrada (reveal da logo + typewriter "Cron Tech" + transição para a home).
2. WHEN a flag de intro já vista existe no `sessionStorage` para a sessão atual THEN o sistema SHALL pular direto para a home, sem reproduzir a animação.
3. WHILE a animação de intro está em execução, WHEN o visitante clica/toca em qualquer ponto da tela de intro ou ativa um controle "Pular" THEN o sistema SHALL encerrar a animação imediatamente e transicionar para a home.
4. IF o visitante tem `prefers-reduced-motion: reduce` ativado no sistema/navegador THEN o sistema SHALL pular a animação e apresentar a home diretamente, sem efeitos de movimento decorativos.
5. The system SHALL gravar a flag de intro vista no `sessionStorage` antes de, ou imediatamente ao, completar ou pular a intro, de forma que um refresh de página dentro da mesma sessão não repita a animação.
6. The system SHALL renderizar a home de forma funcional mesmo com JavaScript desabilitado (a intro depende de JS; sem JS, a home SHALL ser exibida diretamente via progressive enhancement, sem tela de intro travada).
7. The system SHALL renderizar a home (conteúdo real) no servidor, presente no HTML inicial da resposta; a intro SHALL ser um overlay client-side sobreposto a essa home já presente no DOM, sem bloquear nem atrasar o carregamento/pintura do conteúdo da home por baixo.

**Independent Test**: Abrir o site em aba anônima → ver a intro rodar e transicionar sozinha; recarregar a página → intro não repete; ativar "reduzir movimento" no SO e recarregar em nova aba anônima → intro é pulada.

---

### P1: Navegação e Hero ⭐ MVP

**User Story**: Como visitante, quero uma navbar clara e um hero que explique o modelo OaaS em segundos, com um CTA de WhatsApp visível, para decidir rapidamente se a Cron Tech resolve meu problema.

**Why P1**: É a primeira impressão da home; sem hero e navegação funcionais não há como avaliar as demais seções.

**Acceptance Criteria**:

1. The system SHALL exibir uma navbar em formato pill, fixa/sticky no topo, com links para as âncoras das principais seções da home.
2. WHEN a viewport é mobile (< 768px) THEN o sistema SHALL colapsar a navegação em um menu acessível por toque (ex.: menu hambúrguer), navegável por teclado e leitor de tela.
3. The system SHALL exibir no hero um card de código/terminal (estático ou levemente animado) que reforce a proposta técnica/OaaS, seguindo a linguagem visual da referência Chiarelli.
4. WHEN o visitante clica no CTA principal do hero THEN o sistema SHALL abrir um link `wa.me` com mensagem pré-preenchida referente a um primeiro contato.
5. The system SHALL exibir uma faixa de tecnologias/stack logo após o hero, consistente com a stack real do projeto (Next.js, TypeScript, React, Tailwind etc.).

**Independent Test**: Acessar a home direto (sem intro, via flag de sessão já setada), navegar pelos links da navbar, redimensionar para mobile e abrir o menu, clicar no CTA do hero e confirmar que abre o WhatsApp com o número placeholder/real.

---

### P1: Seções institucionais de prova (dor, público, diferenciais, terminal escuro) ⭐ MVP

**User Story**: Como visitante avaliando fornecedores, quero entender minha dor atual, se sou o público certo, e por que a Cron Tech é diferente (incluindo prova social), para reduzir minha incerteza antes de entrar em contato.

**Why P1**: É o corpo argumentativo da página — sem ele o site vira só um catálogo de serviços sem contexto de venda.

**Acceptance Criteria**:

1. The system SHALL exibir uma seção "dor" com 3 cards descrevendo problemas comuns que o modelo OaaS resolve.
2. The system SHALL exibir uma seção "pra quem é / não é" com duas listas claramente distintas (ex.: colunas ou blocos separados).
3. The system SHALL exibir um bloco de fundo escuro com um terminal animado demonstrando a entrega do resultado pronto pela Cron Tech (modelo OaaS: cobra-se pelo trabalho entregue, não por licença de uso), seguindo a paleta Verde Escuro/Verde Médio/Verde Lima.
4. The system SHALL exibir uma seção de diferenciais com pelo menos 3 pontos.
5. WHERE há pelo menos um depoimento real cadastrado em `src/content` THEN o sistema SHALL exibir um bloco de depoimentos (quotes) na seção de diferenciais.
6. WHERE não há nenhum depoimento real cadastrado em `src/content` THEN o sistema SHALL NOT renderizar o bloco de depoimentos (sem placeholder, sem texto "TODO" visível).
5. IF o visitante tem `prefers-reduced-motion: reduce` ativado THEN o sistema SHALL reduzir/desabilitar animações de scroll e do terminal nesta seção, mantendo o conteúdo estático legível.

**Independent Test**: Rolar a home do topo até o final desta seção e verificar visualmente as 4 sub-seções; ativar reduced-motion e confirmar que o terminal escuro não anima, mas o conteúdo continua legível; com `src/content` sem nenhum depoimento cadastrado, confirmar que o bloco de depoimentos não é renderizado (não aparece vazio nem com placeholder).

---

### P1: Casos (portfólio) ⭐ MVP

**User Story**: Como visitante interessado em Sites/Landing Pages, quero ver projetos reais com link para demo, para validar a qualidade do trabalho antes de contratar.

**Why P1**: Prova social concreta é o principal fator de conversão para esse tipo de serviço.

**Acceptance Criteria**:

1. The system SHALL exibir os 3 cases reais de Sites/Landing Pages (Performance Motion, Studio Aureum, EvolutionAI) com nome do projeto, descrição curta e botão "Ver demo".
2. WHEN o visitante clica em "Ver demo" THEN o sistema SHALL abrir a URL real do case (`https://performance-motion.vercel.app/`, `https://studioaureum.vercel.app/`, `https://evolutionai-virid.vercel.app/`) em uma nova aba, com `rel="noopener noreferrer"`.
3. The system SHALL exibir, para cada case real, a captura de tela correspondente em `public/cases/` via `next/image`, com `alt` descritivo do projeto.
4. The system SHALL exibir, para Sistemas Web & Desktop, Mini ERP, Automações (RPA) e Agentes de IA, apenas descrições e exemplos ilustrativos de soluções comuns de mercado (ex.: conciliação financeira, agente de prospecção, integração com ERP, WhatsApp), sem nome de cliente e sem botão "Ver demo".
5. The system SHALL NOT exibir nomes de clientes, logotipos de clientes ou métricas fabricadas para os serviços sem case real.

**Independent Test**: Clicar nos 3 "Ver demo" reais e confirmar que abrem as URLs corretas em nova aba; conferir que as 3 screenshots carregam via `next/image` (não `<img>` cru); conferir que os outros 4 serviços mostram só descrição/exemplo, sem CTA de demo.

---

### P1: O que entregamos + Como funciona ⭐ MVP

**User Story**: Como visitante pronto para avaliar um serviço específico, quero ver os 5 serviços com prazos indicativos e o passo a passo de como o trabalho acontece, para saber o que esperar antes de chamar no WhatsApp.

**Why P1**: É onde a decisão de contato acontece — a seção precisa ser clara sobre escopo e processo sem expor preços (decisão já tomada).

**Acceptance Criteria**:

1. The system SHALL exibir os 5 serviços (Sites e Landing Pages, Sistemas Web & Desktop, Mini ERP, Automações (RPA), Agentes de IA) em cards/faixas, cada um com descrição e prazo indicativo (ex.: "X a Y dias úteis").
2. The system SHALL NOT exibir nenhum valor monetário fixo ou faixa de preço nos cards de serviço.
3. WHEN o visitante clica no CTA "Solicitar orçamento" de um card de serviço THEN o sistema SHALL abrir um link `wa.me` com mensagem pré-preenchida citando o nome daquele serviço específico.
4. The system SHALL exibir uma timeline "Como funciona" com as etapas do processo (do primeiro contato à entrega), consistente com o modelo OaaS.

**Independent Test**: Clicar no CTA "Solicitar orçamento" de dois serviços diferentes e confirmar que a mensagem pré-preenchida do WhatsApp muda conforme o serviço; conferir visualmente que nenhum preço aparece na seção.

---

### P1: FAQ, CTA final e Footer ⭐ MVP

**User Story**: Como visitante quase convencido, quero tirar dúvidas comuns e ter um último CTA claro, para fechar a decisão de contato.

**Why P1**: Fecha o funil de confiança e conversão da página.

**Acceptance Criteria**:

1. The system SHALL exibir uma seção de FAQ em formato accordion, com pelo menos 5 perguntas frequentes sobre o modelo OaaS, prazos, processo e garantias.
2. WHEN o visitante expande uma pergunta do FAQ THEN o sistema SHALL recolher qualquer outra pergunta previamente aberta (um item aberto por vez).
3. The system SHALL exibir uma seção de CTA final em bloco escuro com um botão de WhatsApp proeminente.
4. The system SHALL exibir um footer com links de navegação, redes/contato disponíveis e ano corrente calculado dinamicamente (não hardcoded).
5. The system SHALL exibir no footer um link para o Instagram da Cron Tech (`https://www.instagram.com/cron_tech/`) com ícone, abrindo em nova aba (`target="_blank"`) com `rel="noopener noreferrer"` e `aria-label` descritivo.

**Independent Test**: Expandir 3 perguntas do FAQ em sequência e confirmar que só uma fica aberta por vez; clicar no CTA final e confirmar abertura do WhatsApp; conferir que o ano no footer é o ano atual e que o link do Instagram abre em nova aba apontando para `instagram.com/cron_tech`.

---

### P1: Identidade visual, conteúdo estruturado e qualidade técnica ⭐ MVP

**User Story**: Como responsável técnico pelo site, quero que a paleta, tipografia, conteúdo e requisitos não funcionais estejam corretos desde o início, para que o site seja rápido, acessível, editável e bem posicionado no SEO.

**Why P1**: São requisitos transversais que, se ausentes, comprometem todas as demais stories mesmo que cada seção "pareça" pronta.

**Acceptance Criteria**:

1. The system SHALL definir os tokens de cor Verde Escuro (`#183D2B`), Verde Médio (`#41A53E`), Verde Lima (`#88C729`) e Creme (`#FAF9E6`) no tema Tailwind/shadcn, substituindo a paleta neutra padrão do preset Nova.
2. The system SHALL usar uma fonte serifada editorial nos títulos, uma fonte sans no corpo e uma fonte mono nos blocos de terminal/código, carregadas via `next/font`.
3. The system SHALL armazenar todo conteúdo editável (serviços, cases, depoimentos, FAQ, dados de contato/redes, textos de seção) em módulos tipados sob `src/content/*.ts`, consumidos pelos componentes de UI (não hardcoded inline nos componentes).
4. The system SHALL ser mobile-first e renderizar sem scroll horizontal e sem sobreposição de conteúdo em larguras a partir de 320px.
5. The system SHALL atender WCAG AA: navegação completa por teclado (Tab/Shift+Tab/Enter/Espaço/Esc), indicadores de foco visíveis em todo elemento interativo, e contraste de texto conforme AA para as combinações de cor definidas nos tokens.
6. The system SHALL expor metadata única por rota (title, description), Open Graph e Twitter Card com imagem de preview, `sitemap.xml` e `robots.txt`, via Next.js Metadata API.
7. The system SHALL servir a logo da marca como asset otimizado (WebP/SVG, tamanhos apropriados para intro e navbar), substituindo o PNG atual de ~1 MB.
8. The system SHALL atingir Lighthouse ≥ 90 (mobile) nas categorias Performance, Acessibilidade, Best Practices e SEO.
9. The system SHALL centralizar o número de WhatsApp (`5531984503647`, exibido como "+55 31 98450-3647" em texto) e a URL do Instagram (`https://www.instagram.com/cron_tech/`) em `src/content/site.ts`, como fonte única consumida por todos os links `wa.me` e pelo link do Instagram na página.
10. The system SHALL garantir que o elemento de LCP (Largest Contentful Paint) medido em produção seja parte do conteúdo da home renderizada no servidor, não da tela de intro — a intro, por ser overlay client-side, SHALL NOT ser o elemento de LCP da página.

**Independent Test**: Rodar Lighthouse mobile na home publicada e conferir as 4 notas ≥ 90; inspecionar o DOM/tema e confirmar uso dos tokens de cor definidos; editar um valor em `src/content/*.ts` (ex.: um texto de FAQ) e confirmar que reflete na UI sem tocar em componentes; alterar o número/URL em `src/content/site.ts` e confirmar que todos os CTAs de WhatsApp e o link do Instagram refletem a mudança.

---

## Edge Cases

- IF o domínio de produção em `src/content/site.ts` ainda é o placeholder `TODO` THEN o sistema SHALL ainda gerar metadata/Open Graph válidos sintaticamente (sem quebrar a build), usando esse placeholder até o domínio real ser definido.
- WHEN o array de depoimentos em `src/content` está vazio THEN o sistema SHALL renderizar a seção de diferenciais normalmente, apenas sem o bloco de depoimentos, sem espaço em branco visualmente quebrado.
- WHEN o visitante acessa a home diretamente por uma âncora de seção (ex.: `/#casos`) sem passar pela intro THEN o sistema SHALL rolar até a seção correta sem reproduzir a intro por cima.
- WHEN o nome de um projeto/case ou texto de card é mais longo que o esperado THEN o layout SHALL quebrar linha graciosamente, sem overflow horizontal ou corte de texto sem indicação visual.
- IF um link de case real (`wa.me` ou demo) falhar ao abrir (ex.: pop-up bloqueado) THEN o sistema SHALL ainda fornecer o `href` navegável (o link funciona como navegação normal, não depende só de `window.open`).
- WHEN o visitante usa apenas teclado THEN o sistema SHALL permitir alcançar e ativar todo CTA de WhatsApp, todo item de FAQ e o menu mobile, na ordem lógica de leitura.

---

## Requirement Traceability

| Requirement ID | Story                                             | Phase  | Status  |
| --------------- | -------------------------------------------------- | ------ | ------- |
| LP-01            | P1: Intro animada de entrada                        | Design | Pending |
| LP-02            | P1: Navegação e Hero                                | Design | Pending |
| LP-03            | P1: Seções institucionais de prova                  | Design | Pending |
| LP-04            | P1: Casos (portfólio)                               | Design | Pending |
| LP-05            | P1: O que entregamos + Como funciona                | Design | Pending |
| LP-06            | P1: FAQ, CTA final e Footer                          | Design | Pending |
| LP-07            | P1: Identidade visual, conteúdo estruturado e qualidade técnica | Design | Pending |

**ID format:** `LP-[NUMBER]` (Landing Page)

**Status values:** Pending → In Design → In Tasks → Implementing → Verified

**Coverage:** 7 total, 0 mapped to tasks, 7 unmapped ⚠️ (esperado nesta fase — mapeamento acontece em Design/Tasks)

---

## Success Criteria

- [ ] Todas as 7 stories P1 implementadas e navegáveis em produção (Vercel), sem erros de console.
- [ ] Lighthouse mobile ≥ 90 em Performance, Acessibilidade, Best Practices e SEO na home publicada.
- [ ] Todo CTA de contato (hero, serviços, CTA final) abre um link `wa.me` funcional com o número real `5531984503647`, centralizado em `src/content/site.ts`.
- [ ] Nenhum case, depoimento, preço ou dado de cliente fabricado presente no conteúdo publicado.
- [ ] Intro roda uma vez por sessão, é pulável, e respeita `prefers-reduced-motion` — verificável manualmente em 3 cenários (primeira visita, refresh, reduced-motion).
- [ ] Conteúdo de serviços/cases/FAQ/contato editável via `src/content/*.ts` sem alterar componentes.
