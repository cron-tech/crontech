# Landing Page Institucional (Cron Tech) Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, adequacy review, Verifier, discrimination sensor).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Spec**: `.specs/features/landing-page/spec.md`
**Design**: `.specs/features/landing-page/design.md`
**Context**: `.specs/features/landing-page/context.md`
**Status**: Draft

---

**Branch (uma única branch para toda a feature):** `feature/landing-page`, criada a partir de `develop` (o planejamento já foi mergeado em `develop`; `feature/sdd-planning` guardava só os artefatos de planejamento em `.specs/`). Git não é executado automaticamente (regra do `CLAUDE.md`) — o usuário cria a branch e roda os commits sugeridos manualmente, um por task.

**Execução:** sem sub-agentes nesta feature — tudo roda na sessão principal, uma fase por vez. Ao fim de cada fase: parar, listar os commits sugeridos de todas as tasks da fase, atualizar `## Handoff` em `.specs/STATE.md`, e aguardar OK do usuário antes de abrir a próxima fase.

---

## Test Coverage Matrix

> Gerado a partir do código existente + decisão explícita do usuário na fase Tasks (2026-09-27) - confirmar antes do Execute. Guidelines encontradas: nenhuma (`AGENTS.md` não define padrão de testes; `package.json` não tem nenhum test runner configurado ainda). Escopo de teste definido em conversa: **testes unitários/componente direcionados** para lógica real; seções puramente visuais/estáticas são verificadas manualmente (build + lint + checagem visual/Lighthouse), não com testes automatizados.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------- | --------------------- | ----------------- | ------------ |
| Lógica pura / helpers (`src/lib/*.ts`) | unit | Todos os branches; 1:1 com os ACs relacionados (`buildWhatsAppLink`, `shouldSkipIntro`) | `src/lib/**/*.test.ts` | `npx vitest run` |
| Componentes interativos no escopo decidido (`IntroOverlay`, `FaqSection`, `DifferentiatorsSection`) | unit/component (React Testing Library) | Happy path + o branch específico citado na decisão (skip vs. show; accordion um-aberto-por-vez; depoimentos vazio vs. preenchido) | `src/components/**/*.test.tsx` | `npx vitest run` |
| Seções/layout estáticos, conteúdo (`src/components/sections/**`, `src/components/layout/**` exceto os dois acima, `src/content/*.ts`, `src/components/ui/**`) | none | Verificação manual via "Independent Test" de cada story do spec + Lighthouse (T40) | — | build gate only |

## Gate Check Commands

> Gerado a partir do código existente - confirmar antes do Execute.

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Quick | Tasks com `Tests: none` em arquivo isolado (conteúdo, componente estático, primitive shadcn) | `npm run lint` |
| Full | Tasks com `Tests: unit` | `npm run lint && npx vitest run` |
| Build | Tasks que tocam `layout.tsx`/`page.tsx` (integração raiz) ou fecham fase/feature | `npm run lint && npm run build` |

---

## Execution Plan

Phases are ordered and run sequentially - each phase completes before the next begins, and tasks within a phase execute in order.

Cada diagrama abaixo mostra **todas** as dependências reais das tasks daquela fase, inclusive setas vindas de tasks de fases anteriores (dependência para trás é permitida; nenhuma task depende de uma task de fase futura).

### Phase 1: Fundação (tooling, tema, conteúdo compartilhado, utilitários)

```
T1, T2, T3, T4, T5, T6  (sem dependências)
T6 → T7
T1 → T7
T1 → T8
T4 → T9
```

### Phase 2: Intro de entrada (LP-01)

```
T5 → T10
T8 → T10
T10 → T11
T8 → T11
T11 → T12
```

### Phase 3: Navegação e Hero (LP-02)

```
T13, T16  (sem dependências)
T6 → T14
T12 → T14
T3 → T15
T14 → T15
T7 → T17
T16 → T17
T6 → T17
T13 → T18
```

### Phase 4: Seções de prova (LP-03)

```
T19 → T20
T21 → T22
T9 → T23
T16 → T23
T24 → T25
```

### Phase 5: Casos e O que entregamos (LP-04, LP-05)

```
T26 → T28
T27 → T28
T26 → T29
T7 → T29
T30 → T31
```

### Phase 6: FAQ, CTA final e Footer (LP-06)

```
T2 → T33
T32 → T33
T9 → T34
T7 → T34
T6 → T35
```

### Phase 7: Composição, motion e polish (LP-01 wrap-up, LP-07 wrap-up)

```
T11 → T36
T14 → T36
T15 → T36
T17 → T36
T18 → T36
T20 → T36
T22 → T36
T23 → T36
T25 → T36
T28 → T36
T29 → T36
T31 → T36
T33 → T36
T34 → T36
T35 → T36
T36 → T37
T36 → T38
T6 → T38
T36 → T39
T37 → T40
T38 → T40
T39 → T40
T12 → T40
```

---

## Task Breakdown

### T1: Instalar e configurar Vitest + React Testing Library ✅

**What**: Adiciona `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom` como devDependencies; cria `vitest.config.ts` (ambiente jsdom); adiciona script `"test": "vitest run"` em `package.json`; escreve um teste-fumaça trivial para provar que o pipeline roda.
**Where**: `vitest.config.ts`, `package.json`, `src/lib/smoke.test.ts`
**Depends on**: None
**Reuses**: N/A (infraestrutura nova)
**Requirement**: LP-07 (pré-requisito de qualidade técnica)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] `npx vitest run` executa e passa (1 teste-fumaça verde)
- [x] `npm run lint` continua passando
- [x] Script `test` presente em `package.json`

**Tests**: unit
**Gate**: full
**Commit**: `chore(testing): add vitest and react testing library setup`
**Status**: ✅ Complete (vitest@3.2.7, @vitejs/plugin-react@4.7.0 - pinned abaixo do latest para evitar conflito de peer deps com babel8/@types/node do vitest 5)

---

### T2: Adicionar primitive shadcn `accordion` ✅

**What**: Roda `npx shadcn add accordion` (preset Nova) para gerar o componente Accordion (Radix) em `src/components/ui`.
**Where**: `src/components/ui/accordion.tsx`
**Depends on**: None
**Reuses**: `components.json` (preset Nova já configurado)
**Requirement**: LP-06

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] `src/components/ui/accordion.tsx` existe e exporta `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`
- [x] `npm run build` compila sem erro

**Tests**: none
**Gate**: quick
**Commit**: `chore(ui): add shadcn accordion primitive`
**Status**: ✅ Complete

---

### T3: Adicionar primitive shadcn `sheet` ✅

**What**: Roda `npx shadcn add sheet` para gerar o componente Sheet (Radix Dialog) usado no menu mobile.
**Where**: `src/components/ui/sheet.tsx`
**Depends on**: None
**Reuses**: `components.json`
**Requirement**: LP-02

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] `src/components/ui/sheet.tsx` existe e exporta `Sheet`, `SheetTrigger`, `SheetContent`
- [x] `npm run lint` passa (build completo já verificado em T2 no mesmo estado de dependências; sheet.tsx segue o mesmo padrão gerado)

**Tests**: none
**Gate**: quick
**Commit**: `chore(ui): add shadcn sheet primitive`
**Status**: ✅ Complete

---

### T4: Reescrever tokens de cor com a paleta Cron Tech ✅

**What**: Substitui os valores neutros padrão do preset shadcn em `:root`/`.dark` por `--brand-dark` (`#183D2B`), `--brand-mid` (`#41A53E`), `--brand-lime` (`#88C729`), `--brand-cream` (`#FAF9E6`) e os derivados `--ink` (`#12261C`) e `--cream-muted` (`#F0EED9`); remapeia `--background`, `--foreground`, `--primary`, `--card` etc. para esses tokens (LP-07 AC1).
**Where**: `src/app/globals.css`
**Depends on**: None
**Reuses**: estrutura `@theme inline` e nomes de token já existentes em `globals.css`
**Requirement**: LP-07 AC1

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [x] Nenhum token de cor neutro (`oklch(... 0 0)`) do preset padrão sobrevive em `:root`/`.dark` para os tokens semânticos usados (background/foreground/primary/card/etc.) — `--chart-*` e `--sidebar-*` mantidos como estão (não usados nesta feature, fora de escopo)
- [x] Contraste calculado (fórmula WCAG relative luminance): creme (`#FAF9E6`) + ink (`#12261C`) ≈ 14,9:1; verde-médio (`#41A53E`) + ink ≈ 5,05:1 (ambos ≥ AA). Achado durante a implementação: o par original planejado em `design.md` (verde-médio + creme, ≈ 2,96:1) falhava AA — corrigido usando `--ink` como `--primary-foreground` em vez de `--brand-cream`, e `--ring` trocado de `--brand-mid` para `--ink` no tema claro (contraste de foco não-textual também abaixo de 3:1 com brand-mid)
- [x] `npm run lint && npm run build` passam

**Tests**: none
**Gate**: quick
**Commit**: `feat(theme): apply Cron Tech color tokens`
**Status**: ✅ Complete

---

### T5: Adicionar fonte Newsreader e trocar `--font-heading` (mantendo Geist no resto) ✅

**What**: Carrega **Newsreader** via `next/font/google` em `layout.tsx`, expõe como variável CSS (ex.: `--font-newsreader`) e remapeia só `--font-heading` (em `globals.css`) para ela; Geist Sans/Geist Mono continuam como estão hoje (AD-003).
**Where**: `src/app/layout.tsx`
**Depends on**: None
**Reuses**: padrão já usado para `Geist`/`Geist_Mono` no mesmo arquivo
**Requirement**: LP-07 AC2

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [x] `--font-heading` aponta para Newsreader; `--font-sans`/`--font-mono` continuam Geist
- [x] H1–H3 renderizam na Newsreader (verificado no CSS gerado: `h1,h2,h3{font-family:var(--font-newsreader)}`)
- [x] `npm run lint && npm run build` passam

**Tests**: none
**Gate**: build
**Commit**: `feat(typography): load Newsreader for headings (AD-003)`
**Status**: ✅ Complete. Bug pré-existente encontrado e corrigido no mesmo arquivo: `--font-sans: var(--font-sans)` era auto-referencial (nunca resolvia para Geist Sans de verdade); corrigido para `var(--font-geist-sans)` — necessário para o próprio Done-when desta task ("`--font-sans` continua Geist") ser verdadeiro. Verificado no CSS gerado: `.font-sans{font-family:var(--font-geist-sans)}`.

---

### T6: Criar `src/content/site.ts` ✅

**What**: Cria o módulo `SiteConfig` com `whatsappNumber: "5531984503647"`, `whatsappDisplay: "+55 31 98450-3647"`, `instagramUrl: "https://www.instagram.com/cron_tech/"`, `productionUrl` (placeholder `TODO`) e `navLinks` (âncoras das seções da home).
**Where**: `src/content/site.ts`
**Depends on**: None
**Reuses**: N/A
**Requirement**: LP-07 AC9, LP-06 AC5

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] `SiteConfig` exportado e tipado (interface conforme `design.md`)
- [x] `productionUrl` claramente marcado como `TODO` (comentário)
- [x] `npm run lint` passa

**Tests**: none
**Gate**: quick
**Commit**: `feat(content): add site config (whatsapp, instagram, nav links)`
**Status**: ✅ Complete. `navLinks` definidos (Serviços/Casos/Como funciona/FAQ) antecipando as âncoras que as seções das fases 3-6 vão criar.

---

### T7: Criar `src/lib/whatsapp.ts` (`buildWhatsAppLink`) ✅

**What**: Implementa `buildWhatsAppLink(message?: string): string`, que monta a URL `https://wa.me/<whatsappNumber>?text=<mensagem-encodada>` a partir de `site.ts`, com mensagem default quando `message` é omitido.
**Where**: `src/lib/whatsapp.ts`
**Depends on**: T6, T1
**Reuses**: `src/content/site.ts` (T6)
**Requirement**: LP-07 AC9, LP-02 AC4, LP-05 AC3, LP-06 AC3

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] `buildWhatsAppLink()` sem argumento retorna URL com mensagem default
- [x] `buildWhatsAppLink("texto")` retorna URL com o texto corretamente URL-encoded
- [x] Testes cobrem: sem mensagem, com mensagem simples, com mensagem contendo espaços/acentos/caracteres especiais

**Tests**: unit (3 testes, `src/lib/whatsapp.test.ts`)
**Gate**: full - `npm run lint && npx vitest run` → 4 testes passando (1 fumaça + 3 novos), 0 falhas
**Commit**: `feat(lib): add buildWhatsAppLink helper with unit tests`
**Status**: ✅ Complete

**Test Adequacy**: Check A - as 3 assertions cobrem, respectivamente, os 3 bullets do Done-when (default message, mensagem simples com encoding exato, mensagem com espaços/acentos/especiais via round-trip decode). Check C - os 3 testes mapeiam 1:1 para os 3 critérios da task, nenhum extra.

---

### T8: Criar `src/lib/intro-state.ts` (`shouldSkipIntro`) ✅

**What**: Implementa a função pura `shouldSkipIntro({ hasSeenIntro, prefersReducedMotion }: { hasSeenIntro: boolean; prefersReducedMotion: boolean }): boolean`, que centraliza a decisão de pular a intro (AD-001) - reaproveitada tanto pelo script inline (T10, replicado como string) quanto pelo `IntroOverlay` (T11, importado de verdade).
**Where**: `src/lib/intro-state.ts`
**Depends on**: T1
**Reuses**: N/A
**Requirement**: LP-01 AC1, AC2, AC4

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] `shouldSkipIntro({ hasSeenIntro: true, prefersReducedMotion: false })` → `true`
- [x] `shouldSkipIntro({ hasSeenIntro: false, prefersReducedMotion: true })` → `true`
- [x] `shouldSkipIntro({ hasSeenIntro: false, prefersReducedMotion: false })` → `false`
- [x] `shouldSkipIntro({ hasSeenIntro: true, prefersReducedMotion: true })` → `true`
- [x] Todos os 4 branches cobertos por teste

**Tests**: unit (4 testes, `src/lib/intro-state.test.ts`)
**Gate**: full - `npm run lint && npx vitest run` → 8 testes passando no total, 0 falhas
**Commit**: `feat(lib): add shouldSkipIntro decision helper with unit tests`
**Status**: ✅ Complete

**Test Adequacy**: Check A - os 4 testes cobrem exatamente as 4 combinações booleanas do Done-when, cada um com o valor exato esperado. Check C - 4 testes, 4 critérios, mapeamento 1:1, nenhum extra.

---

### T9: Criar componente `DarkSection` ✅

**What**: Wrapper que sobrescreve `--background`/`--foreground`/`--card`/`--card-foreground` (e tokens relacionados) só dentro do próprio elemento, usando os verdes escuros da Cron Tech - reaproveitando o mecanismo de tokens do shadcn, escopado por seção (AD-002).
**Where**: `src/components/layout/dark-section.tsx`
**Depends on**: T4
**Reuses**: tokens definidos em T4
**Requirement**: LP-03 AC3, LP-06 AC3 (AD-002)

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [x] `<DarkSection>` aplica `className="dark bg-background text-foreground"` - sob `.dark`, `--background`/`--foreground` resolvem para `--brand-dark`/`--brand-cream` (T4), então qualquer conteúdo interno herda fundo escuro e texto claro automaticamente
- [x] Um `<Button>` (shadcn, `bg-primary text-primary-foreground`) dentro de `DarkSection` resolve para os mesmos `--primary`/`--primary-foreground` (brand-mid/ink) do tema claro - botão consistente com a marca em qualquer seção, contraste ~5:1 já verificado em T4
- [x] `npm run lint` e `npx tsc --noEmit` passam

**Tests**: none
**Gate**: quick
**Commit**: `feat(layout): add DarkSection scoped theme wrapper (AD-002)`
**Status**: ✅ Complete (ainda não usado em nenhuma página - será consumido a partir de T23)

---

### T10: Script de pré-hidratação da intro + wiring no `layout.tsx`

**What**: Adiciona um script inline (via `<script dangerouslySetInnerHTML>` antes do conteúdo, ou `next/script` `strategy="beforeInteractive"`) que replica a lógica de `shouldSkipIntro` (sessionStorage + `matchMedia("(prefers-reduced-motion: reduce)")`) e marca `<html data-intro="show"|"skip">`; adiciona `<html suppressHydrationWarning>`; adiciona a regra CSS que esconde `.intro-overlay` por padrão e só mostra sob `html[data-intro="show"] .intro-overlay`.
**Where**: `src/app/layout.tsx`
**Depends on**: T5, T8
**Reuses**: mesma lógica de `src/lib/intro-state.ts` (T8), replicada como string inline (documentar a paridade no comentário do script)
**Requirement**: LP-01 AC1, AC2, AC4, AC5, AC7 (AD-001)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] `<html suppressHydrationWarning>` presente
- [ ] Regra CSS confirma: sem `data-intro="show"`, `.intro-overlay` tem `display: none` (verificado inspecionando o HTML gerado sem JS)
- [ ] Comentário no script aponta para `src/lib/intro-state.ts` como fonte da verdade da lógica
- [ ] `npm run lint && npm run build` passam

**Tests**: none
**Gate**: build
**Commit**: `feat(intro): add pre-hydration script and CSS-hidden overlay gate (AD-001)`

---

### T11: Construir `IntroOverlay`

**What**: Componente client que lê `data-intro` do `<html>` ao montar, reproduz logo (via `next/image`) + typewriter "Cron Tech" (fonte Newsreader itálica, `motion`), reage a clique/toque em qualquer ponto e a um controle "Pular", grava a flag no `sessionStorage` ao completar/pular, e chama `shouldSkipIntro` (import real de `src/lib/intro-state.ts`) como segunda checagem client-side.
**Where**: `src/components/intro/intro-overlay.tsx`
**Depends on**: T10, T8
**Reuses**: `src/lib/intro-state.ts` (T8), `motion`
**Requirement**: LP-01 AC1, AC3, AC4, AC5, AC6

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [ ] Teste (RTL): com `sessionStorage` vazio e reduced-motion desligado, overlay renderiza e a animação inicia
- [ ] Teste (RTL): com flag de intro já vista no `sessionStorage`, `shouldSkipIntro` retorna `true` e o componente não inicia a animação
- [ ] Teste (RTL): clique no controle "Pular" (ou no overlay) chama a gravação da flag no `sessionStorage` e dispara o callback de conclusão
- [ ] Verificação manual: `prefers-reduced-motion` ativo pula a animação (mock de `matchMedia`)

**Tests**: unit
**Gate**: full
**Commit**: `feat(intro): build IntroOverlay component with skip and reduced-motion handling`

---

### T12: Otimizar asset da logo

**What**: Redimensiona/converte `public/brand/logo-crontech.png` (~1 MB) para um WebP (e/ou SVG, se uma fonte vetorial ficar disponível) em tamanhos apropriados para a intro (maior) e a navbar (menor); usa a logo otimizada via `next/image` dentro do `IntroOverlay`.
**Where**: `public/brand/logo-crontech.webp` (novo), `src/components/intro/intro-overlay.tsx` (uso)
**Depends on**: T11
**Reuses**: `next/image`
**Requirement**: LP-07 AC7

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Novo asset WebP ≤ 150 KB, com dimensões adequadas ao maior uso (intro)
- [ ] `IntroOverlay` usa `next/image` com `width`/`height` explícitos (sem `layout shift`)
- [ ] PNG original mantido no repo só se ainda referenciado em outro lugar; caso contrário, removido

**Tests**: none
**Gate**: quick
**Commit**: `perf(brand): optimize logo asset to WebP for intro`

---

### T13: Criar `src/content/techStack.ts`

**What**: Lista tipada da stack real do projeto (Next.js, TypeScript, React, Tailwind, shadcn/ui) para a `TechStrip`.
**Where**: `src/content/techStack.ts`
**Depends on**: None
**Reuses**: N/A
**Requirement**: LP-02 AC5

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Array tipado exportado com pelo menos 5 itens (nome + ícone/label)
- [ ] `npm run lint` passa

**Tests**: none
**Gate**: quick
**Commit**: `feat(content): add tech stack list`

---

### T14: Construir `Navbar`

**What**: Navbar em pill, sticky/fixa no topo, com leve blur, usando `navLinks` de `site.ts` e a logo otimizada (T12).
**Where**: `src/components/layout/navbar.tsx`
**Depends on**: T6, T12
**Reuses**: `Button` (shadcn), `src/content/site.ts`, logo otimizada
**Requirement**: LP-02 AC1

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [ ] Navbar renderiza pill, fixa no topo, com os links de `navLinks`
- [ ] Logo renderiza via `next/image`
- [ ] `npm run lint` passa

**Tests**: none
**Gate**: quick
**Commit**: `feat(nav): build pill navbar`

---

### T15: Construir `MobileMenu`

**What**: Menu mobile acessível usando shadcn `Sheet`, aberto por um botão hambúrguer na `Navbar`, navegável por teclado (`Esc` fecha, foco preso dentro do painel).
**Where**: `src/components/layout/mobile-menu.tsx`
**Depends on**: T3, T14
**Reuses**: `Sheet` (T3), `navLinks` de `site.ts`
**Requirement**: LP-02 AC2

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [ ] Abaixo de 768px, o menu colapsa para o botão hambúrguer + `Sheet`
- [ ] Verificação manual: `Tab`/`Shift+Tab` circulam dentro do painel aberto; `Esc` fecha
- [ ] `npm run lint` passa

**Tests**: none
**Gate**: quick
**Commit**: `feat(nav): add accessible mobile menu via shadcn sheet`

---

### T16: Construir `TerminalWindow`

**What**: Componente reutilizável de "janela de terminal" (chrome + linhas de conteúdo), com variante `animated` (digitação via `motion`, respeitando `prefers-reduced-motion` internamente) e variante estática.
**Where**: `src/components/ui/terminal-window.tsx`
**Depends on**: None
**Reuses**: `--font-mono` (Geist Mono), `motion`
**Requirement**: LP-02 AC3, LP-03 AC3

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [ ] `animated={false}` (ou reduced-motion ativo) renderiza o texto final direto, sem frames de animação
- [ ] `animated={true}` digita as linhas com `motion`, uma vez
- [ ] Raio de borda pequeno/zero (evoca chrome de terminal real, não o kit de card padrão)
- [ ] `npm run lint` passa

**Tests**: none
**Gate**: quick
**Commit**: `feat(ui): add reusable TerminalWindow component`

---

### T17: Construir `Hero`

**What**: Seção hero com headline (Newsreader) comunicando a proposta OaaS ("a Cron Tech entrega o resultado pronto e cobra pelo trabalho entregue, não por licença de uso"), `TerminalWindow` mini, e CTA principal via `buildWhatsAppLink()`.
**Where**: `src/components/sections/hero.tsx`
**Depends on**: T7, T16, T6
**Reuses**: `buildWhatsAppLink` (T7), `TerminalWindow` (T16), `Button`
**Requirement**: LP-02 AC3, AC4

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [ ] Headline usa a proposta de valor correta (sem a frase "você grava...")
- [ ] CTA principal abre `buildWhatsAppLink()` com mensagem de primeiro contato
- [ ] `npm run lint` passa

**Tests**: none
**Gate**: quick
**Commit**: `feat(hero): build hero section with terminal card and whatsapp CTA`

---

### T18: Construir `TechStrip`

**What**: Faixa de tecnologias logo após o hero, a partir de `techStack.ts`.
**Where**: `src/components/sections/tech-strip.tsx`
**Depends on**: T13
**Reuses**: `src/content/techStack.ts`
**Requirement**: LP-02 AC5

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [ ] Todos os itens de `techStack.ts` renderizam
- [ ] `npm run lint` passa

**Tests**: none
**Gate**: quick
**Commit**: `feat(sections): build tech strip section`

---

### T19: Criar `src/content/pain.ts`

**What**: 3 pontos de dor (título + descrição) que o modelo OaaS resolve.
**Where**: `src/content/pain.ts`
**Depends on**: None
**Reuses**: N/A
**Requirement**: LP-03 AC1

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Array tipado com exatamente 3 itens
- [ ] `npm run lint` passa

**Tests**: none
**Gate**: quick
**Commit**: `feat(content): add pain points content`

---

### T20: Construir `PainSection`

**What**: 3 cards de dor a partir de `pain.ts` - sem numeração (não é sequência), sem o kit de card padrão do shadcn.
**Where**: `src/components/sections/pain.tsx`
**Depends on**: T19
**Reuses**: `src/content/pain.ts`
**Requirement**: LP-03 AC1

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [ ] 3 cards renderizam, sem badges numerados
- [ ] `npm run lint` passa

**Tests**: none
**Gate**: quick
**Commit**: `feat(sections): build pain section`

---

### T21: Criar `src/content/audienceFit.ts`

**What**: Duas listas ("pra quem é" / "pra quem não é").
**Where**: `src/content/audienceFit.ts`
**Depends on**: None
**Reuses**: N/A
**Requirement**: LP-03 AC2

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] `fitFor` e `notFitFor` exportados, cada um com ≥3 itens
- [ ] `npm run lint` passa

**Tests**: none
**Gate**: quick
**Commit**: `feat(content): add audience fit content`

---

### T22: Construir `AudienceFitSection`

**What**: Dois blocos/colunas claramente distintos a partir de `audienceFit.ts`.
**Where**: `src/components/sections/audience-fit.tsx`
**Depends on**: T21
**Reuses**: `src/content/audienceFit.ts`
**Requirement**: LP-03 AC2

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [ ] As duas listas renderizam em blocos visualmente distintos
- [ ] `npm run lint` passa

**Tests**: none
**Gate**: quick
**Commit**: `feat(sections): build audience fit section`

---

### T23: Construir `DarkTerminalSection`

**What**: Bloco de fundo escuro (`DarkSection`) com `TerminalWindow` grande e animado demonstrando a entrega do resultado pronto pela Cron Tech (proposta OaaS correta, sem a frase removida).
**Where**: `src/components/sections/dark-terminal.tsx`
**Depends on**: T9, T16
**Reuses**: `DarkSection` (T9), `TerminalWindow` (T16)
**Requirement**: LP-03 AC3, AC5 (reduced-motion)

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [ ] Fundo usa `DarkSection` (tokens verdes escuros)
- [ ] Copy reflete a proposta OaaS correta
- [ ] Com reduced-motion, o terminal não anima (verificação manual)
- [ ] `npm run lint` passa

**Tests**: none
**Gate**: quick
**Commit**: `feat(sections): build dark terminal section`

---

### T24: Criar `src/content/testimonials.ts`

**What**: Array tipado de depoimentos, **vazio por padrão** (nenhum depoimento real disponível ainda).
**Where**: `src/content/testimonials.ts`
**Depends on**: None
**Reuses**: N/A
**Requirement**: LP-03 AC5, AC6

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] `Testimonial[]` exportado, tipado, array vazio (`[]`)
- [ ] Nenhum texto de depoimento inventado no arquivo
- [ ] `npm run lint` passa

**Tests**: none
**Gate**: quick
**Commit**: `feat(content): add testimonials content module (empty by default)`

---

### T25: Construir `DifferentiatorsSection`

**What**: Seção com ≥3 diferenciais; bloco de depoimentos renderiza **somente** `WHERE` `testimonials.ts` tiver ≥1 item (LP-03 AC5/AC6) - sem placeholder quando vazio.
**Where**: `src/components/sections/differentiators.tsx`
**Depends on**: T24
**Reuses**: `src/content/testimonials.ts`
**Requirement**: LP-03 AC4, AC5, AC6

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [ ] Teste (RTL): com `testimonials` vazio, o bloco de depoimentos não é renderizado (nenhum elemento correspondente no DOM)
- [ ] Teste (RTL): com `testimonials` contendo 1+ item, o bloco renderiza com o(s) quote(s)
- [ ] ≥3 diferenciais sempre renderizam, independente de depoimentos

**Tests**: unit
**Gate**: full
**Commit**: `feat(sections): build differentiators section with conditional testimonials`

---

### T26: Criar `src/content/services.ts`

**What**: 5 serviços (`id`, `name`, `description`, `timeframe`, `whatsappMessage`, `hasShowcaseCases`), sem nenhum valor monetário.
**Where**: `src/content/services.ts`
**Depends on**: None
**Reuses**: N/A
**Requirement**: LP-05 AC1, AC2, AC3; LP-04 AC4

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] 5 serviços presentes (Sites e Landing Pages, Sistemas Web & Desktop, Mini ERP, Automações (RPA), Agentes de IA)
- [ ] Só "Sites e Landing Pages" tem `hasShowcaseCases: true`
- [ ] Nenhum campo de preço no tipo ou nos dados
- [ ] `npm run lint` passa

**Tests**: none
**Gate**: quick
**Commit**: `feat(content): add services content`

---

### T27: Criar `src/content/cases.ts`

**What**: 3 cases reais (Performance Motion, Studio Aureum, EvolutionAI) com `demoUrl` real e `imageSrc`/`imageAlt` apontando para `public/cases/` (arquivos já fornecidos: `performance-motion.png`, `studio-aureum.png`, `evolution.png`).
**Where**: `src/content/cases.ts`
**Depends on**: None
**Reuses**: assets já existentes em `public/cases/`
**Requirement**: LP-04 AC1, AC3

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] 3 cases com `demoUrl` correto (`performance-motion.vercel.app`, `studioaureum.vercel.app`, `evolutionai-virid.vercel.app`)
- [ ] `imageSrc` aponta exatamente para os arquivos reais em `public/cases/`
- [ ] `npm run lint` passa

**Tests**: none
**Gate**: quick
**Commit**: `feat(content): add real case studies content`

---

### T28: Construir `CasesSection`

**What**: Renderiza os 3 cases reais (nome, descrição, screenshot via `next/image`, botão "Ver demo" com `target="_blank" rel="noopener noreferrer"`) e, para os 4 serviços sem case real, apenas descrição/exemplo ilustrativo (a partir de `services.ts`), sem nome de cliente nem CTA de demo.
**Where**: `src/components/sections/cases.tsx`
**Depends on**: T26, T27
**Reuses**: `src/content/cases.ts`, `src/content/services.ts`
**Requirement**: LP-04 AC1, AC2, AC3, AC4, AC5

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [ ] Os 3 "Ver demo" apontam para as URLs reais, `target="_blank"`, `rel="noopener noreferrer"`
- [ ] As 3 screenshots renderizam via `next/image` com `alt` descritivo
- [ ] Os outros 4 serviços mostram só descrição/exemplo, sem nome de cliente nem CTA de demo

**Tests**: none
**Gate**: quick
**Commit**: `feat(sections): build cases section with real demo links and screenshots`

---

### T29: Construir `ServicesSection`

**What**: "O que entregamos" - 5 cards/faixas com descrição + prazo indicativo, CTA "Solicitar orçamento" por serviço via `buildWhatsAppLink(service.whatsappMessage)`, sem nenhum valor monetário.
**Where**: `src/components/sections/services.tsx`
**Depends on**: T26, T7
**Reuses**: `src/content/services.ts`, `buildWhatsAppLink`
**Requirement**: LP-05 AC1, AC2, AC3

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [ ] 5 cards renderizam com prazo indicativo, sem preço
- [ ] Cada CTA "Solicitar orçamento" abre uma URL `wa.me` com mensagem específica do serviço (verificação manual: dois serviços diferentes geram mensagens diferentes)

**Tests**: none
**Gate**: quick
**Commit**: `feat(sections): build services section (sob consulta)`

---

### T30: Criar `src/content/howItWorks.ts`

**What**: Passos da timeline "Como funciona" (do primeiro contato à entrega).
**Where**: `src/content/howItWorks.ts`
**Depends on**: None
**Reuses**: N/A
**Requirement**: LP-05 AC4

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] ≥3 passos, tipados, em ordem
- [ ] `npm run lint` passa

**Tests**: none
**Gate**: quick
**Commit**: `feat(content): add how-it-works timeline content`

---

### T31: Construir `HowItWorksSection`

**What**: Timeline visual a partir de `howItWorks.ts` (única seção que usa numeração/sequência - é de fato sequencial).
**Where**: `src/components/sections/how-it-works.tsx`
**Depends on**: T30
**Reuses**: `src/content/howItWorks.ts`
**Requirement**: LP-05 AC4

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [ ] Todos os passos renderizam em ordem, com indicação visual de sequência
- [ ] `npm run lint` passa

**Tests**: none
**Gate**: quick
**Commit**: `feat(sections): build how-it-works timeline section`

---

### T32: Criar `src/content/faq.ts`

**What**: ≥5 perguntas frequentes sobre modelo OaaS, prazos, processo e garantias.
**Where**: `src/content/faq.ts`
**Depends on**: None
**Reuses**: N/A
**Requirement**: LP-06 AC1

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] ≥5 itens `{ question, answer }`
- [ ] `npm run lint` passa

**Tests**: none
**Gate**: quick
**Commit**: `feat(content): add faq content`

---

### T33: Construir `FaqSection`

**What**: Accordion (shadcn, Radix `type="single" collapsible"`) a partir de `faq.ts` - abrir um item fecha qualquer outro aberto.
**Where**: `src/components/sections/faq.tsx`
**Depends on**: T2, T32
**Reuses**: `Accordion` (T2), `src/content/faq.ts`
**Requirement**: LP-06 AC1, AC2

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [ ] Teste (RTL): abrir a pergunta 1, depois a pergunta 2 - pergunta 1 fecha automaticamente
- [ ] Teste (RTL): todas as perguntas de `faq.ts` renderizam como triggers do accordion
- [ ] Verificação manual: navegável por teclado (`Tab`, `Enter`/`Espaço`)

**Tests**: unit
**Gate**: full
**Commit**: `feat(sections): build faq accordion section`

---

### T34: Construir `FinalCtaSection`

**What**: Bloco de fundo escuro (`DarkSection`) com CTA de WhatsApp proeminente via `buildWhatsAppLink()`.
**Where**: `src/components/sections/final-cta.tsx`
**Depends on**: T9, T7
**Reuses**: `DarkSection` (T9), `buildWhatsAppLink` (T7)
**Requirement**: LP-06 AC3

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [ ] CTA final abre `buildWhatsAppLink()` corretamente
- [ ] Fundo usa `DarkSection`
- [ ] `npm run lint` passa

**Tests**: none
**Gate**: quick
**Commit**: `feat(sections): build final CTA section`

---

### T35: Construir `Footer`

**What**: Footer com links de navegação, link do Instagram (`site.ts`, ícone `lucide-react`, `target="_blank"`, `rel="noopener noreferrer"`, `aria-label`) e ano corrente calculado dinamicamente (`new Date().getFullYear()`).
**Where**: `src/components/layout/footer.tsx`
**Depends on**: T6
**Reuses**: `src/content/site.ts`, `lucide-react`
**Requirement**: LP-06 AC4, AC5

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [ ] Link do Instagram presente com ícone, nova aba, `rel="noopener noreferrer"`, `aria-label`
- [ ] Ano no footer é `new Date().getFullYear()`, não um número fixo
- [ ] `npm run lint` passa

**Tests**: none
**Gate**: quick
**Commit**: `feat(footer): build footer with instagram link and dynamic year`

---

### T36: Compor `page.tsx` e montar `IntroOverlay` no `layout`

**What**: `page.tsx` (Server Component) importa e ordena todas as seções (Navbar, Hero, TechStrip, Pain, AudienceFit, DarkTerminal, Differentiators, Cases, Services, HowItWorks, Faq, FinalCta, Footer); `IntroOverlay` é montado uma vez no `layout.tsx`, sobreposto à home.
**Where**: `src/app/page.tsx`
**Depends on**: T11, T14, T15, T17, T18, T20, T22, T23, T25, T28, T29, T31, T33, T34, T35
**Reuses**: todos os componentes de seção construídos nas fases 2-6
**Requirement**: LP-01 AC7, LP-02 a LP-06 (composição), LP-07 AC10

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [ ] Todas as seções renderizam na ordem da referência, sem erro de console
- [ ] Home renderiza corretamente com JavaScript desabilitado (verificação manual: DevTools → desabilitar JS → recarregar)
- [ ] `npm run lint && npm run build` passam

**Tests**: none
**Gate**: build
**Commit**: `feat(page): compose landing page sections and mount intro overlay`

---

### T37: Reveal de scroll abaixo da dobra (AD-004)

**What**: Cria um wrapper `Reveal` (client, `motion` `whileInView`, fade + translate ≤16px, ~0.4s, uma vez, desligado em reduced-motion) e aplica em todas as seções abaixo da dobra em `page.tsx` (Pain, AudienceFit, DarkTerminal, Differentiators, Cases, Services, HowItWorks, Faq, FinalCta, Footer). Hero/Navbar/TechStrip **não** recebem o wrapper.
**Where**: `src/components/ui/reveal.tsx`, `src/app/page.tsx` (wiring)
**Depends on**: T36
**Reuses**: `motion`
**Requirement**: AD-004 (ver `.specs/STATE.md`)

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [ ] Verificação manual: rolar a página revela cada seção abaixo da dobra uma única vez (não repete ao rolar de novo)
- [ ] Verificação manual: com reduced-motion ativo, todas as seções aparecem direto, sem transição
- [ ] Hero/Navbar/TechStrip confirmadamente sem o wrapper (sem atraso de LCP)
- [ ] `npm run lint && npm run build` passam

**Tests**: none
**Gate**: build
**Commit**: `feat(motion): add below-the-fold scroll reveal (AD-004)`

---

### T38: Metadata e SEO

**What**: `generateMetadata`/`metadata` por rota (title/description reais da Cron Tech), Open Graph + Twitter Card com imagem de preview, `sitemap.xml`, `robots.txt`, `metadataBase` usando `site.ts.productionUrl` (placeholder `TODO`).
**Where**: `src/app/layout.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`
**Depends on**: T36, T6
**Reuses**: `src/content/site.ts`
**Requirement**: LP-07 AC6

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] `<title>` não é mais "Create Next App"; description real presente
- [ ] Open Graph e Twitter Card presentes (verificável via view-source ou debugger social)
- [ ] `sitemap.xml` e `robots.txt` acessíveis em dev (`next dev`)
- [ ] `npm run lint && npm run build` passam

**Tests**: none
**Gate**: build
**Commit**: `feat(seo): add real metadata, open graph, sitemap and robots`

---

### T39: QA de acessibilidade, teclado e responsividade

**What**: Passagem manual por toda a home verificando: navegação completa por teclado (navbar, menu mobile, accordion, todo CTA), foco visível em todo elemento interativo, sem scroll horizontal/sobreposição a partir de 320px; corrige o que for encontrado.
**Where**: variável (correções pontuais nos componentes de seção/layout conforme achados; sem novo arquivo dedicado)
**Depends on**: T36
**Reuses**: N/A
**Requirement**: LP-02 AC2, LP-07 AC4, AC5

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Checklist manual completo: `Tab`/`Shift+Tab`/`Enter`/`Espaço`/`Esc` alcançam e ativam todo CTA de WhatsApp, todo item de FAQ e o menu mobile, em ordem lógica
- [ ] Nenhum scroll horizontal em 320px, 375px, 768px, 1024px, 1440px (DevTools responsive mode)
- [ ] Indicador de foco visível em todo elemento interativo testado
- [ ] `npm run lint && npm run build` passam

**Tests**: none
**Gate**: build
**Commit**: `fix(a11y): keyboard navigation, focus states, and responsive fixes`

---

### T40: Lighthouse mobile ≥ 90 (Performance, Acessibilidade, Best Practices, SEO)

**What**: Roda `next build && next start` (ou preview deploy), executa Lighthouse mobile na home publicada, corrige qualquer categoria abaixo de 90 - com atenção especial a: LCP não é a intro (AD-001/AC LP-07 AC10) e peso da logo otimizada (T12).
**Where**: variável (correções pontuais conforme achados do relatório Lighthouse)
**Depends on**: T37, T38, T39, T12
**Reuses**: N/A
**Requirement**: LP-07 AC8, AC10

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Lighthouse mobile ≥ 90 em Performance, Acessibilidade, Best Practices e SEO (print/registro do relatório anexado ao PR)
- [ ] Elemento de LCP reportado pertence ao conteúdo da home (não à intro)
- [ ] `npm run lint && npm run build` passam

**Tests**: none
**Gate**: build
**Commit**: `perf: final Lighthouse pass and fixes for the landing page`

---

## Phase Execution Map

Phases run in sequence: **Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7.** The full dependency graph (every arrow, including cross-phase ones) is drawn once, per phase, in the **Execution Plan** section above - see there for the diagrams. Tasks execute in ascending numeric order (T1→T40) within that phase ordering, which already respects every `Depends on` edge.

Execution is strictly sequential - there is no intra-phase parallelism. A single agent (or batch worker) works one task at a time, in order (numeric order T1→T40, respecting the dependencies above).

**How execution works for this feature (user override, 2026-09-27):** no sub-agent delegation - all 40 tasks run inline in the main session, one phase at a time. At the end of each phase, stop, list every task's suggested commit from that phase, update `.specs/STATE.md` `## Handoff`, and wait for the user's OK before opening the next phase.

---

## Task Granularity Check

| Task | Scope | Status |
| ---- | ----- | ------ |
| T1 | 1 config change (test runner) | ✅ Granular |
| T2 | 1 CLI-generated file | ✅ Granular |
| T3 | 1 CLI-generated file | ✅ Granular |
| T4 | 1 file (tokens) | ✅ Granular |
| T5 | 1 file (font wiring) | ✅ Granular |
| T6 | 1 file (content module) | ✅ Granular |
| T7 | 1 file (helper) + co-located tests | ✅ Granular |
| T8 | 1 file (helper) + co-located tests | ✅ Granular |
| T9 | 1 component | ✅ Granular |
| T10 | 1 file (layout wiring) | ✅ Granular |
| T11 | 1 component + co-located tests | ✅ Granular |
| T12 | 1 asset + 1 usage site | ✅ Granular |
| T13 | 1 file (content module) | ✅ Granular |
| T14 | 1 component | ✅ Granular |
| T15 | 1 component | ✅ Granular |
| T16 | 1 component | ✅ Granular |
| T17 | 1 component | ✅ Granular |
| T18 | 1 component | ✅ Granular |
| T19 | 1 file (content module) | ✅ Granular |
| T20 | 1 component | ✅ Granular |
| T21 | 1 file (content module) | ✅ Granular |
| T22 | 1 component | ✅ Granular |
| T23 | 1 component | ✅ Granular |
| T24 | 1 file (content module) | ✅ Granular |
| T25 | 1 component + co-located tests | ✅ Granular |
| T26 | 1 file (content module) | ✅ Granular |
| T27 | 1 file (content module) | ✅ Granular |
| T28 | 1 component | ✅ Granular |
| T29 | 1 component | ✅ Granular |
| T30 | 1 file (content module) | ✅ Granular |
| T31 | 1 component | ✅ Granular |
| T32 | 1 file (content module) | ✅ Granular |
| T33 | 1 component + co-located tests | ✅ Granular |
| T34 | 1 component | ✅ Granular |
| T35 | 1 component | ✅ Granular |
| T36 | 1 file (page composition) | ✅ Granular |
| T37 | 1 component + 1 wiring site | ✅ Granular |
| T38 | 1 concern (metadata), 3 files | ⚠️ OK if cohesive (metadata/OG/sitemap/robots are one concern, generated together) |
| T39 | Cross-cutting QA pass, no new files | ⚠️ OK - verification task, not a code-layer task (see Coverage Expectation: "none") |
| T40 | Cross-cutting QA pass, no new files | ⚠️ OK - verification task, not a code-layer task (see Coverage Expectation: "none") |

---

## Diagram-Definition Cross-Check

| Task | Depends On (task body) | Diagram Shows | Status |
| ---- | ----------------------- | -------------- | ------ |
| T1 | None | (no arrow) | ✅ Match |
| T2 | None | (no arrow) | ✅ Match |
| T3 | None | (no arrow) | ✅ Match |
| T4 | None | (no arrow) | ✅ Match |
| T5 | None | (no arrow) | ✅ Match |
| T6 | None | (no arrow) | ✅ Match |
| T7 | T6, T1 | T6→T7, T1→T7 | ✅ Match |
| T8 | T1 | T1→T8 | ✅ Match |
| T9 | T4 | T4→T9 | ✅ Match |
| T10 | T5, T8 (cross-phase) | (no intra-phase arrow needed; T5/T8 are Phase 1) | ✅ Match |
| T11 | T10, T8 (cross-phase) | T10→T11 (intra); T8 cross-phase not drawn | ✅ Match |
| T12 | T11 | T11→T12 | ✅ Match |
| T13 | None | (no arrow) | ✅ Match |
| T14 | T6, T12 (cross-phase) | (no intra-phase arrow needed) | ✅ Match |
| T15 | T3 (cross-phase), T14 | T14→T15 (intra); T3 cross-phase not drawn | ✅ Match |
| T16 | None | (no arrow) | ✅ Match |
| T17 | T7, T16, T6 (cross-phase for T7/T6) | T16→T17 (intra) | ✅ Match |
| T18 | T13 | T13→T18 | ✅ Match |
| T19 | None | (no arrow) | ✅ Match |
| T20 | T19 | T19→T20 | ✅ Match |
| T21 | None | (no arrow) | ✅ Match |
| T22 | T21 | T21→T22 | ✅ Match |
| T23 | T9, T16 (cross-phase) | (no intra-phase arrow needed) | ✅ Match |
| T24 | None | (no arrow) | ✅ Match |
| T25 | T24 | T24→T25 | ✅ Match |
| T26 | None | (no arrow) | ✅ Match |
| T27 | None | (no arrow) | ✅ Match |
| T28 | T26, T27 | T26→T28, T27→T28 | ✅ Match |
| T29 | T26, T7 (cross-phase) | T26→T29 (intra) | ✅ Match |
| T30 | None | (no arrow) | ✅ Match |
| T31 | T30 | T30→T31 | ✅ Match |
| T32 | None | (no arrow) | ✅ Match |
| T33 | T2 (cross-phase), T32 | T32→T33 (intra) | ✅ Match |
| T34 | T9, T7 (cross-phase) | (no intra-phase arrow needed) | ✅ Match |
| T35 | T6 (cross-phase) | (no intra-phase arrow needed) | ✅ Match |
| T36 | T11,T14,T15,T17,T18,T20,T22,T23,T25,T28,T29,T31,T33,T34,T35 (all cross-phase) | (no intra-phase arrow needed) | ✅ Match |
| T37 | T36 | T36→T37 | ✅ Match |
| T38 | T36, T6 (cross-phase) | T36→T38 (intra) | ✅ Match |
| T39 | T36 | T36→T39 | ✅ Match |
| T40 | T37, T38, T39, T12 (cross-phase) | T37→T40, T38→T40, T39→T40 (intra) | ✅ Match |

**Rules confirmed:** no task depends on a task in a later phase (all cross-phase deps point backward); every intra-phase `Depends on` has a matching diagram arrow and vice-versa.

---

## Test Co-location Validation

| Task | Code Layer Created/Modified | Matrix Requires | Task Says | Status |
| ---- | ----------------------------- | ----------------- | ----------- | ------ |
| T1 | Test infra (config) | none (infra, no domain logic) | unit (smoke test proving pipeline) | ✅ OK (exceeds requirement, not a violation) |
| T7 | `src/lib/whatsapp.ts` (pure logic) | unit | unit | ✅ OK |
| T8 | `src/lib/intro-state.ts` (pure logic) | unit | unit | ✅ OK |
| T11 | `IntroOverlay` (interactive component, named in test scope) | unit/component | unit | ✅ OK |
| T25 | `DifferentiatorsSection` (interactive component, named in test scope) | unit/component | unit | ✅ OK |
| T33 | `FaqSection` (interactive component, named in test scope) | unit/component | unit | ✅ OK |
| T2, T3 | shadcn CLI-generated primitives | none (vendor code) | none | ✅ OK |
| T4, T5, T6, T9, T10, T12–T24 (excl. T20 wait none), T26, T27, T28–T32, T34–T39 | Static/presentational sections, layout, content data | none | none | ✅ OK |

**Rules confirmed:** every task creating a layer with a required test type (`unit`) declares `Tests: unit` and includes the tests in the same task (no deferral). All `Tests: none` tasks map to layers the matrix marks `none`.

---

## Tools Confirmation

Por task, os MCPs/skills aplicados seguem a instrução original do usuário ("use a skill `frontend-design`... na execução de UI"): tarefas que constroem ou estilizam UI/visual (tema, tipografia, `DarkSection`, `IntroOverlay`, `TerminalWindow`, navbar/menu, todas as seções de conteúdo, composição da página, reveal de scroll) usam `Skill: frontend-design`; tarefas de infraestrutura, lógica pura, dados de conteúdo e QA técnica usam `Skill: NONE`. Nenhum MCP do projeto se aplica a este trabalho local (sem chamadas externas) - `MCP: NONE` em todas as tasks. Sinalize se algum MCP (ex.: `context7` para consultar docs de alguma lib específica durante a implementação) deveria ser adicionado em alguma task.
