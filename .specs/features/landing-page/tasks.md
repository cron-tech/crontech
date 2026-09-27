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

**Post-commit fix (2026-09-27, Phase 3)**: texto `sr-only` do botão de fechar trocado de `"Close"` (padrão gerado pelo shadcn CLI, em inglês) para `"Fechar menu"` - site é pt-BR (LP-07).

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

### T10: Script de pré-hidratação da intro + wiring no `layout.tsx` ✅

**What**: Adiciona um script inline (via `<script dangerouslySetInnerHTML>` antes do conteúdo, ou `next/script` `strategy="beforeInteractive"`) que replica a lógica de `shouldSkipIntro` (sessionStorage + `matchMedia("(prefers-reduced-motion: reduce)")`) e marca `<html data-intro="show"|"skip">`; adiciona `<html suppressHydrationWarning>`; adiciona a regra CSS que esconde `.intro-overlay` por padrão e só mostra sob `html[data-intro="show"] .intro-overlay`.
**Where**: `src/app/layout.tsx`
**Depends on**: T5, T8
**Reuses**: mesma lógica de `src/lib/intro-state.ts` (T8), replicada como string inline (documentar a paridade no comentário do script)
**Requirement**: LP-01 AC1, AC2, AC4, AC5, AC7 (AD-001)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] `<html suppressHydrationWarning>` presente
- [x] Regra CSS confirma: sem `data-intro="show"`, `.intro-overlay` tem `display: none` (verificado inspecionando o HTML gerado sem JS)
- [x] Comentário no script aponta para `src/lib/intro-state.ts` como fonte da verdade da lógica
- [x] `npm run lint && npm run build` passam

**Tests**: none
**Gate**: build - `npm run lint && npm run build` → ambos verdes
**Commit**: `feat(intro): add pre-hydration script and CSS-hidden overlay gate (AD-001)`
**Status**: ✅ Complete. Verificado no HTML estático gerado (`.next/server/app/index.html`): `<html>` SSR não carrega `data-intro` (escrito só pelo script no cliente); regra `.intro-overlay{display:none}html[data-intro="show"] .intro-overlay{display:block}` presente no payload. Chave de sessionStorage (`crontech:intro-seen`) documentada no comentário para manter paridade com `IntroOverlay` (T11).

**Post-commit fix (2026-09-27)**: `<html lang="en">` → `<html lang="pt-BR">` (conteúdo do site é em português; item não coberto pelo Done-when original de T10, mas pertence ao mesmo arquivo). Verificado em `npm run build` → `.next/server/app/index.html` com `lang="pt-BR"`.

**Post-commit fix (2026-09-27, revisão visual da intro)**: bug de CSS encontrado pelo usuário - a regra `.intro-overlay{display:none}html[data-intro="show"] .intro-overlay{display:block}` forçava `display:block` quando visível, sobrescrevendo o `display:flex` que o próprio `IntroOverlay` (T11) usa para centralizar o conteúdo - todo o conteúdo caía no canto superior esquerdo. Corrigido para uma única regra que só esconde, nunca mostra: `html:not([data-intro="show"]) .intro-overlay{display:none}` - sem a contraparte "mostrar", o `display` original do elemento (`flex`, definido na classe do próprio componente) nunca é sobrescrito. Comportamento sem JS mantido (elemento nunca recebe a classe/atributo, então a regra `:not(...)` continua escondendo por padrão). Verificado no HTML gerado (`npm run build` → `.next/server/app/index.html`): só a nova regra está presente, nenhuma versão com `display:block`.

---

### T11: Construir `IntroOverlay` ✅

**What**: Componente client que lê `data-intro` do `<html>` ao montar, reproduz logo (via `next/image`) + typewriter "Cron Tech" (fonte Newsreader itálica, `motion`), reage a clique/toque em qualquer ponto e a um controle "Pular", grava a flag no `sessionStorage` ao completar/pular, e chama `shouldSkipIntro` (import real de `src/lib/intro-state.ts`) como segunda checagem client-side.
**Where**: `src/components/intro/intro-overlay.tsx`
**Depends on**: T10, T8
**Reuses**: `src/lib/intro-state.ts` (T8), `motion`
**Requirement**: LP-01 AC1, AC3, AC4, AC5, AC6

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [x] Teste (RTL): com `sessionStorage` vazio e reduced-motion desligado, overlay renderiza e a animação inicia
- [x] Teste (RTL): com flag de intro já vista no `sessionStorage`, `shouldSkipIntro` retorna `true` e o componente não inicia a animação
- [x] Teste (RTL): clique no controle "Pular" (ou no overlay) chama a gravação da flag no `sessionStorage` e dispara o callback de conclusão
- [x] Verificação manual: `prefers-reduced-motion` ativo pula a animação (mock de `matchMedia`) - implementada como teste automatizado (mesma técnica de mock), não só manual

**Tests**: unit (4 testes, `src/components/intro/intro-overlay.test.tsx`)
**Gate**: full - `npm run lint && npx vitest run` → 12 testes passando no total, 0 falhas
**Commit**: `feat(intro): build IntroOverlay component with skip and reduced-motion handling`
**Status**: ✅ Complete. Decisão de mostrar a intro (`shouldPlay`) usa `useSyncExternalStore` (não `useEffect` + `setState`) para ler `sessionStorage`/`matchMedia` no cliente sem violar a regra de lint `react-hooks/set-state-in-effect` (React Compiler ESLint, `eslint-config-next` 16) e sem mismatch de hidratação (server snapshot fixo em `false`; client snapshot chama `shouldSkipIntro` de verdade). Dismissal (clique/"Pular"/timeout de conclusão) usa `useState` local combinado (`visible = shouldPlay && !dismissed`). Logo ainda referencia o PNG original (T12 troca pelo WebP otimizado). Glow verde via `--brand-lime` (var CSS existente, sem novo token). Chave de sessão idêntica à do script inline (T10): `crontech:intro-seen`.

**Test Adequacy**:

*Check A - Sufficient (coverage mapping):*

| Done-when criterion / AC | `file:line` + assertion | Spec-defined outcome | Covered? |
| --- | --- | --- | --- |
| Overlay renderiza + animação inicia (sessão vazia, reduced-motion off) | `src/components/intro/intro-overlay.test.tsx:34-35` - `expect(screen.getByRole("presentation")).toBeInTheDocument()`, `expect(screen.getByLabelText("Cron Tech")).toBeInTheDocument()` | LP-01 AC1: reproduzir a animação de entrada | ✅ Yes |
| Flag já vista → não inicia | `intro-overlay.test.tsx:43` - `expect(screen.queryByRole("presentation")).not.toBeInTheDocument()` | LP-01 AC2: pular direto para a home | ✅ Yes |
| `prefers-reduced-motion` ativo → pula | `intro-overlay.test.tsx:51` - `expect(screen.queryByRole("presentation")).not.toBeInTheDocument()` (matchMedia mockado `matches:true`) | LP-01 AC4 | ✅ Yes |
| Clique em "Pular" grava flag + encerra | `intro-overlay.test.tsx:60-61` - `expect(sessionStorage.getItem(INTRO_SESSION_KEY)).toBe("1")`, `expect(screen.queryByRole("presentation")).not.toBeInTheDocument()` | LP-01 AC3, AC5 | ✅ Yes |

*Check C - Necessary (reverse mapping):*

| `file:line` | Maps to | Keep? |
| --- | --- | --- |
| `intro-overlay.test.tsx:31-36` | Done-when #1 / AC1 | ✅ Keep |
| `intro-overlay.test.tsx:38-44` | Done-when #2 / AC2 | ✅ Keep |
| `intro-overlay.test.tsx:46-52` | Done-when #4 / AC4 | ✅ Keep |
| `intro-overlay.test.tsx:54-62` | Done-when #3 / AC3, AC5 | ✅ Keep |

Check B: nenhuma asserção rasa (presença/ausência de elemento + valor exato gravado no `sessionStorage`, não apenas call-count). Check D: segue o padrão RTL já usado no projeto (`src/components/**/*.test.tsx`, `npx vitest run`).

**Verdict**: todos os 4 critérios cobertos com evidência `file:line`, outcomes batem com o spec, nenhuma asserção rasa, nenhum teste especulativo.

**Post-commit fix (2026-09-27)**: 4 ajustes sobre o componente já commitado:
1. **Reapply em Strict Mode (dev)**: `useLayoutEffect(() => { if (shouldPlay) document.documentElement.setAttribute("data-intro","show") }, [shouldPlay])` - cobre o remount único que o React faz em dev (Strict Mode), que limpa `data-intro` do `<html>` (comportamento documentado em `node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md`, seção "Re-applying attributes in development"). No-op em produção.
2. **Saída com fade**: overlay agora é o filho condicional de `<AnimatePresence>` (era `if (!visible) return null` direto); `exit={{opacity:0}}` com `transition={{duration: prefersReducedMotion ? 0 : 0.4}}` via `useReducedMotion()` do `motion/react` - fade de saída ~0.4s, instantâneo sob reduced-motion.
3. **Grid sutil**: camada `aria-hidden` com `repeating-linear-gradient` (linhas de 1px a cada 64px, horizontal + vertical) em `var(--brand-lime)` a 12% de opacidade, atrás do glow/logo/texto - referência visual de `docs/references/crontech-ref-home.webp`.
4. **Logo solta**: removido o container `overflow-hidden rounded-3xl shadow-lg` (existia para conter o fundo cream opaco do PNG antigo); a logo (agora com alfa transparente, ver T12) é exibida direto sobre o fundo escuro/glow.
Import de `DarkSection` removido (o `motion.div` externo replica sua classe `dark bg-background text-foreground` diretamente, já que `DarkSection` não é um componente `motion`). Regressão verificada: `npm run lint`, `npx tsc --noEmit`, `npx vitest run` (12/12) e `npm run build` verdes.

**Post-commit fix (2026-09-27, revisão visual da intro)**: composição reaproximada da referência `docs/references/crontech-ref-home.webp` (guia de layout, não conteúdo/marca), substituindo a grade genérica do fix anterior:
- Fundo trocado para quase-preto esverdeado via `color-mix(in srgb, var(--brand-dark) 55%, black)` (era `bg-background` = `--brand-dark` puro, verde médio-escuro, não "quase preto"); classe `dark text-foreground` mantida para os tokens dos filhos (ex.: `Button` "Pular").
- Glow central único substituído por 4 blobs nos cantos (`-top-24 -left-24` etc., `blur-3xl`, alternando `--brand-mid`/`--brand-lime`), recortados pelo `overflow-hidden` do container.
- Grade genérica (`repeating-linear-gradient` a cada 64px) substituída por: 2 linhas horizontais finas de ponta a ponta (`FRAME_Y = [18, 82]`, percentuais), 2 linhas verticais só entre elas (`FRAME_X = [8, 92]`) formando uma moldura interna, e 4 pontinhos exatamente nas interseções (`FRAME_CORNERS`) - servem tanto de "cantos da moldura" quanto de "interseção das guias com a moldura" (mesmo conjunto de 4 pontos, sem duplicar elementos).
- Logo + "Cron Tech" agora lado a lado (`flex-col sm:flex-row`, empilha no mobile), maiores (`text-4xl sm:text-6xl` no nome; logo `h-16/h-20`), typewriter mantido.
- 4 textos de canto em Newsreader (`font-heading`), cada um com um trecho em itálico: topo-esquerda "outcome *as a service*"; topo-direita lista `sites/sistemas/mini erp/automações/agentes de IA` empilhada e alinhada à direita, opacidade alternada por índice, `hidden md:flex` (some no mobile); base-esquerda "resultado pronto, / cobrado pela *entrega*." (itálico em `var(--brand-lime)`); base-direita "cron *tech*". Todos `aria-hidden` (copy decorativa de brand board, não conteúdo essencial - o nome acessível "Cron Tech" continua no `aria-label` do wordmark central).
- `role="presentation"`, clique-para-pular, botão "Pular", fade de saída e o gate por `prefers-reduced-motion` preservados sem alteração; os 4 testes RTL existentes continuam passando inalterados (mesmos seletores: `role="presentation"`, `getByLabelText("Cron Tech")`, botão "Pular").
- Ver também o fix do bug de CSS relacionado em T10 (a regra de exibição que quebrava o `flex` deste componente).

**Post-commit fix (2026-09-27, revisão visual #2)**: usuário encontrou a lista de serviços do canto superior direito cruzando a linha-guia superior e o pontinho da moldura na altura de "automações". Corrigido com duas mudanças combinadas (não só uma): `FRAME_Y[0]` de `18` para `22` (mais distância entre o topo e a linha-guia superior - a moldura fica levemente assimétrica de propósito, já que a lista de 5 itens no topo é mais alta que o texto de 2 linhas embaixo) e a lista com `gap-0.5` (era `gap-1`) + `leading-tight` (era o padrão do `text-sm`), reduzindo sua altura total. Nenhuma linha/pontinho sobreposto pela lista depois da mudança.

**Post-commit fix (2026-09-27, regras comerciais)**: texto do canto inferior esquerdo trocado de "resultado pronto, / cobrado pela *entrega*." para "resultado pronto, / preço *fechado*." (itálico em `var(--brand-lime)` mantido, só a palavra mudou) - a versão antiga sugeria que a cobrança só acontece na entrega, o que conflita com a regra oficial de pagamento (30% de entrada no início). Ver `context.md` seção "Regras comerciais". Os 4 testes RTL de `IntroOverlay` não verificam esse texto (são `aria-hidden`, fora do escopo de teste do componente) - continuam passando sem alteração.

---

### T12: Otimizar asset da logo ✅

**What**: Redimensiona/converte `public/brand/logo-crontech.png` (~1 MB) para um WebP (e/ou SVG, se uma fonte vetorial ficar disponível) em tamanhos apropriados para a intro (maior) e a navbar (menor); usa a logo otimizada via `next/image` dentro do `IntroOverlay`.
**Where**: `public/brand/logo-crontech.webp` (novo), `src/components/intro/intro-overlay.tsx` (uso)
**Depends on**: T11
**Reuses**: `next/image`
**Requirement**: LP-07 AC7

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] Novo asset WebP ≤ 150 KB, com dimensões adequadas ao maior uso (intro)
- [x] `IntroOverlay` usa `next/image` com `width`/`height` explícitos (sem `layout shift`)
- [x] PNG original mantido no repo só se ainda referenciado em outro lugar; caso contrário, removido

**Tests**: none
**Gate**: quick - `npm run lint` verde (mais `npx vitest run` e `npx tsc --noEmit` verdes, por segurança, já que o asset é consumido por T11)
**Commit**: `perf(brand): optimize logo asset to WebP for intro`
**Status**: ✅ Complete. `public/brand/logo-crontech.png` (1024x1024, 1.059.520 bytes) redimensionado para 256x256 e convertido via `sharp` (`webp quality:82`) → `public/brand/logo-crontech.webp`, 1.516 bytes (1,5 KB, muito abaixo do limite de 150 KB). Nenhuma outra referência ao PNG restava no código (`grep` em `src/`/`public/`) - PNG original removido do repo. `IntroOverlay` (T11) já usava `next/image` com `width={96} height={96}`; só o `src` foi trocado para o novo `.webp`. SVG vetorial não estava disponível (fora de escopo desta task, conforme `design.md`).

**Post-commit fix (2026-09-27)**: fonte trocada. O usuário adicionou `docs/brand/logo-crontech.png` (500x500, canal alfa/fundo transparente, commit `43f99b6`) como a logo de alta resolução correta - a versão anterior em `public/brand/` tinha fundo cream opaco. `public/brand/logo-crontech.webp` foi regenerado a partir dessa nova fonte: `sharp(...).resize(512, 512).webp({ quality: 82, alphaQuality: 100 })` (script temporário na raiz do projeto, apagado após rodar) → 6.660 bytes (6,5 KB), `hasAlpha: true` confirmado via `sharp(...).metadata()`. `IntroOverlay` (T11) ajustado para exibir a logo solta (ver nota de fix em T11, item 4) já que o fundo agora é transparente.

**Fonte da logo (registro para tasks futuras)**: `docs/brand/logo-crontech.png` é a fonte em alta resolução com fundo transparente - usar essa como origem para qualquer novo asset derivado (favicon, Open Graph image, navbar, etc.), não o `public/brand/logo-crontech.webp` (já um derivado otimizado para a intro). Ver nota em T38.

---

### T13: Criar `src/content/techStack.ts` ✅

**What**: Lista tipada da stack real do projeto (Next.js, TypeScript, React, Tailwind, shadcn/ui) para a `TechStrip`.
**Where**: `src/content/techStack.ts`
**Depends on**: None
**Reuses**: N/A
**Requirement**: LP-02 AC5

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] Array tipado exportado com pelo menos 5 itens (nome + ícone/label)
- [x] `npm run lint` passa

**Tests**: none
**Gate**: quick - `npm run lint` verde
**Commit**: `feat(content): add tech stack list`
**Status**: ✅ Complete. 5 itens (Next.js, TypeScript, React, Tailwind CSS, shadcn/ui). `lucide-react` não tem logos de marca para essas techs, então "ícone" foi interpretado como um `label` curto em estilo mono/terminal (ex.: `next`, `ts`) em vez de um ícone SVG - consistente com o motivo "terminal" do design system (sem inventar assets de logo de terceiros).

---

### T14: Construir `Navbar` ✅

**What**: Navbar em pill, sticky/fixa no topo, com leve blur, usando `navLinks` de `site.ts` e a logo otimizada (T12).
**Where**: `src/components/layout/navbar.tsx`
**Depends on**: T6, T12
**Reuses**: `Button` (shadcn), `src/content/site.ts`, logo otimizada
**Requirement**: LP-02 AC1

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [x] Navbar renderiza pill, fixa no topo, com os links de `navLinks`
- [x] Logo renderiza via `next/image`
- [x] `npm run lint` passa

**Tests**: none
**Gate**: quick - `npm run lint` verde
**Commit**: `feat(nav): build pill navbar`
**Status**: ✅ Complete. `<header>` `fixed` (não apenas `sticky`) para flutuar sobre o hero desde o primeiro frame, `z-40` (abaixo do `z-50` do `IntroOverlay`). Links desktop `hidden md:flex`; trigger mobile vem de `MobileMenu` (T15, mesmo arquivo - ver nota de sobreposição em T15).

**Post-commit fix (2026-09-27, Phase 3)**: adicionado CTA compacto em pill ("Fale com a gente", `buildWhatsAppLink()`, `target="_blank" rel="noopener noreferrer"`) à direita da navbar, `hidden md:inline-flex` (só desktop) - segue o botão verde da navbar na referência Chiarelli (`docs/references/chiarelli-ref.png`). `rounded-full` via `className` sobrescreve o `rounded-lg` padrão do `Button` (merge por `cn`/tailwind-merge, mesma técnica já usada em outros componentes). Não conflita com o CTA do Hero (T17): aparecem em breakpoints/posições diferentes, ambos abrindo o mesmo WhatsApp com a mensagem default.

---

### T15: Construir `MobileMenu` ⚠️

**What**: Menu mobile acessível usando shadcn `Sheet`, aberto por um botão hambúrguer na `Navbar`, navegável por teclado (`Esc` fecha, foco preso dentro do painel).
**Where**: `src/components/layout/mobile-menu.tsx`
**Depends on**: T3, T14
**Reuses**: `Sheet` (T3), `navLinks` de `site.ts`
**Requirement**: LP-02 AC2

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [x] Abaixo de 768px, o menu colapsa para o botão hambúrguer + `Sheet`
- [ ] Verificação manual: `Tab`/`Shift+Tab` circulam dentro do painel aberto; `Esc` fecha - **pendente**: menu ainda não testado em navegador; verificar em T39 (QA de acessibilidade), quando a página já estiver composta e navegável
- [x] `npm run lint` passa

**Tests**: none
**Gate**: quick - `npm run lint` verde
**Commit**: `feat(nav): add accessible mobile menu via shadcn sheet`
**Status**: ⚠️ Partial. Código completo (trigger `Button` ícone `Menu`, `aria-label="Abrir menu"`, `md:hidden`, inserido na `Navbar` (T14) - arquivo compartilhado entre as duas tasks, ver sobreposição sinalizada no relatório de fase; `SheetTitle` presente porém `sr-only`, já que Radix `Dialog.Content` exige um título acessível). Foco preso + `Esc` fecha são comportamento *default* do `Dialog` do Radix por baixo do `Sheet` (T3) - não código nosso - mas a verificação manual em navegador real ainda não foi feita (menu nunca foi aberto num `npm run dev`); adiada explicitamente para T39 (QA de acessibilidade), quando a página já estiver composta e navegável via `page.tsx`.

---

### T16: Construir `TerminalWindow` ✅

**What**: Componente reutilizável de "janela de terminal" (chrome + linhas de conteúdo), com variante `animated` (digitação via `motion`, respeitando `prefers-reduced-motion` internamente) e variante estática.
**Where**: `src/components/ui/terminal-window.tsx`
**Depends on**: None
**Reuses**: `--font-mono` (Geist Mono), `motion`
**Requirement**: LP-02 AC3, LP-03 AC3

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [x] `animated={false}` (ou reduced-motion ativo) renderiza o texto final direto, sem frames de animação
- [x] `animated={true}` digita as linhas com `motion`, uma vez
- [x] Raio de borda pequeno/zero (evoca chrome de terminal real, não o kit de card padrão)
- [x] `npm run lint` passa

**Tests**: none
**Gate**: quick - `npm run lint` verde
**Commit**: `feat(ui): add reusable TerminalWindow component`
**Status**: ✅ Complete. Chrome fixo em `var(--brand-dark)`/`var(--brand-cream)` (não `bg-background/text-foreground`) - um terminal real é sempre escuro, independente do tema ambiente (usado tanto no Hero claro quanto na `DarkTerminalSection`, T23). `rounded-sm` (2px). Reduced-motion checado via `useReducedMotion()` (`motion/react`), mesma técnica já usada em `IntroOverlay` (T11) - `animated` só tem efeito quando reduced-motion está desligado. Digitação: delay acumulado por caractere (linha inteira, incluindo o prefixo `"$ "` que o próprio componente adiciona), sem repetição (roda uma vez ao montar, sem loop).

**Post-commit fix (2026-09-27)**: `lines` passa a aceitar `string | { text: string; prompt?: boolean }` (`TerminalLine`, exportado) em vez de só `string[]` - `prompt: false` marca uma linha de continuação: sem o prefixo `"$ "`, indentada com 4 espaços (`CONTINUATION_PREFIX`) em vez do prompt. Motivado por T17 precisar de um comando `cron-tech entregar \` quebrado em múltiplas linhas com `--flags`. Cálculo de delay da digitação generalizado para usar o comprimento real de cada `fullLine` (prefixo variável) em vez de assumir `+2` fixo (`"$ "`) para todas. Container ganhou `whitespace-pre` (necessário para a indentação de 4 espaços não colapsar) e `overflow-x-auto` (rede de segurança em telas muito estreitas). `npm run lint`, `npx tsc --noEmit` e `npm run build` verdes.

---

### T17: Construir `Hero` ✅

**What**: Seção hero com headline (Newsreader) comunicando a proposta OaaS ("a Cron Tech entrega o resultado pronto e cobra pelo trabalho entregue, não por licença de uso"), `TerminalWindow` mini, e CTA principal via `buildWhatsAppLink()`.
**Where**: `src/components/sections/hero.tsx`
**Depends on**: T7, T16, T6
**Reuses**: `buildWhatsAppLink` (T7), `TerminalWindow` (T16), `Button`
**Requirement**: LP-02 AC3, AC4

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [x] Headline usa a proposta de valor correta (sem a frase "você grava...")
- [x] CTA principal abre `buildWhatsAppLink()` com mensagem de primeiro contato
- [x] `npm run lint` passa

**Tests**: none
**Gate**: quick - `npm run lint` verde
**Commit**: `feat(hero): build hero section with terminal card and whatsapp CTA`
**Status**: ✅ Complete. Headline: "Você entrega o problema. A Cron Tech entrega o resultado pronto." (framing de `[[business_model_crontech]]`/memória do usuário: "you hand off the problem, Cron Tech delivers the finished outcome"); subheadline cita o modelo Outcome as a Service e "paga pelo trabalho entregue, não por licença de uso" (frase de `context.md`), sem a frase removida da referência Chiarelli. CTA usa `buildWhatsAppLink()` sem argumento (mensagem default já é de primeiro contato: "Olá! Quero saber mais sobre os serviços da Cron Tech."), `target="_blank" rel="noopener noreferrer"`. `TerminalWindow` mini (`animated`) com linhas que reforçam a proposta OaaS (entrega → cobrança liberada após a entrega).

**Post-commit fix (2026-09-27, Phase 3)**: erro de digitação corrigido na 3ª linha do terminal - "cobranca" → "cobrança".

**Post-commit fix (2026-09-27, revisão visual)**: linhas do terminal trocadas para um comando multi-linha (`cron-tech entregar \` + 2 linhas de continuação com as flags `--sites --sistemas-sob-medida` / `--automacoes --agentes-ia`, usando o novo suporte a `prompt: false` de `TerminalWindow`, T16) + as 2 linhas finais já existentes. Largura máxima do card aumentada de `max-w-sm` para `max-w-xl` (mesma largura da coluna de texto à esquerda) para a linha de continuação mais longa não quebrar no desktop.

**Post-commit fix (2026-09-27, revisão visual #2)**: `max-w-xl` revertido para `max-w-sm` (decisão do usuário - o pedido original era só mudar o conteúdo das linhas, não a largura do card; `max-w-xl` espremia a headline no layout de duas colunas). As linhas novas cabem em `max-w-sm` sem quebrar (linha mais longa, a 2ª continuação com o prefixo de 4 espaços, tem 35 caracteres).

**Post-commit fix (2026-09-27, regras comerciais)**: última linha do terminal trocada de "cobrança liberada após a entrega" para "saldo final na entrega do resultado" - a frase antiga sugeria que nenhuma cobrança acontece antes da entrega, o que conflita com a regra oficial de pagamento (30% de entrada no início, 70% na entrega; ver `context.md` seção "Regras comerciais"). Subheadline também ajustada: "você paga pelo trabalho entregue, não por licença de uso" → "preço fechado, com entrada e saldo na entrega - não uma licença de uso", pela mesma razão (a frase antiga era ambígua sobre o momento do pagamento). `npm run lint`, `npx tsc --noEmit` e `npm run build` verdes.

**Post-commit fix (2026-09-27, ajuste fino pré-Phase 5)**: subheadline reescrita de novo - "com entrada e saldo na entrega" ainda soava como se entrada e saldo fossem ambos pagos na entrega. Nova redação: "preço fechado, 30% de entrada e o saldo na entrega, sem licença de uso" - o valor da entrada (30%) e o momento de cada parcela ficam explícitos.

---

### T18: Construir `TechStrip` ✅

**What**: Faixa de tecnologias logo após o hero, a partir de `techStack.ts`.
**Where**: `src/components/sections/tech-strip.tsx`
**Depends on**: T13
**Reuses**: `src/content/techStack.ts`
**Requirement**: LP-02 AC5

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [x] Todos os itens de `techStack.ts` renderizam
- [x] `npm run lint` passa

**Tests**: none
**Gate**: quick - `npm run lint` verde
**Commit**: `feat(sections): build tech strip section`
**Status**: ✅ Complete. Faixa `bg-muted` (token semântico, resolve para `--cream-muted` no tema claro - `bg-cream-muted` não existe como utilitário Tailwind, já que só os tokens semânticos estão mapeados em `@theme inline`) com os 5 `label`s de `techStack.ts` em mono, `title` com o `name` completo por acessibilidade/hover.

---

### T19: Criar `src/content/pain.ts` ✅

**What**: 3 pontos de dor (título + descrição) que o modelo OaaS resolve.
**Where**: `src/content/pain.ts`
**Depends on**: None
**Reuses**: N/A
**Requirement**: LP-03 AC1

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] Array tipado com exatamente 3 itens
- [x] `npm run lint` passa

**Tests**: none
**Gate**: quick - `npm run lint` verde
**Commit**: `feat(content): add pain points content`
**Status**: ✅ Complete. 3 pontos de dor amarrados ao modelo OaaS (preço vira licença sem entrega garantida; prazo que estoura por escopo mutável; ninguém dono do resultado pós-entrega) - cada um resolvido implicitamente pela cobrança por entrega/ownership completo da Cron Tech.

**Post-commit fix (2026-09-27, tipografia)**: hífen-pausa → travessão na descrição do 3º item ("Ninguém dono do resultado").

---

### T20: Construir `PainSection` ✅

**What**: 3 cards de dor a partir de `pain.ts` - sem numeração (não é sequência), sem o kit de card padrão do shadcn.
**Where**: `src/components/sections/pain.tsx`
**Depends on**: T19
**Reuses**: `src/content/pain.ts`
**Requirement**: LP-03 AC1

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [x] 3 cards renderizam, sem badges numerados
- [x] `npm run lint` passa

**Tests**: none
**Gate**: quick - `npm run lint` verde
**Commit**: `feat(sections): build pain section`
**Status**: ✅ Complete. Sem numeração e sem o kit de card padrão do shadcn (sem `rounded-*` + sombra uniforme) - cada card é só um `border-t-2 border-primary` (referência ao chrome de terminal/pill, não ao card genérico), título em Newsreader.

---

### T21: Criar `src/content/audienceFit.ts` ✅

**What**: Duas listas ("pra quem é" / "pra quem não é").
**Where**: `src/content/audienceFit.ts`
**Depends on**: None
**Reuses**: N/A
**Requirement**: LP-03 AC2

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] `fitFor` e `notFitFor` exportados, cada um com ≥3 itens
- [x] `npm run lint` passa

**Tests**: none
**Gate**: quick - `npm run lint` verde
**Commit**: `feat(content): add audience fit content`
**Status**: ✅ Complete. 3 itens em cada lista, redigidos em oposição direta um ao outro (ex.: "prefere pagar por entrega" vs. "já tem squad interno completo").

---

### T22: Construir `AudienceFitSection` ✅

**What**: Dois blocos/colunas claramente distintos a partir de `audienceFit.ts`.
**Where**: `src/components/sections/audience-fit.tsx`
**Depends on**: T21
**Reuses**: `src/content/audienceFit.ts`
**Requirement**: LP-03 AC2

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [x] As duas listas renderizam em blocos visualmente distintos
- [x] `npm run lint` passa

**Tests**: none
**Gate**: quick - `npm run lint` verde
**Commit**: `feat(sections): build audience fit section`
**Status**: ✅ Complete. Dois blocos claramente distintos: "pra quem é" com `bg-card` (superfície preenchida), "pra quem não é" só com borda (`border border-border/60`) - contraste visual sem precisar de cor semântica de erro/sucesso (que não existe no design system desta feature).

---

### T23: Construir `DarkTerminalSection` ⚠️

**What**: Bloco de fundo escuro (`DarkSection`) com `TerminalWindow` grande e animado demonstrando a entrega do resultado pronto pela Cron Tech (proposta OaaS correta, sem a frase removida).
**Where**: `src/components/sections/dark-terminal.tsx`
**Depends on**: T9, T16
**Reuses**: `DarkSection` (T9), `TerminalWindow` (T16)
**Requirement**: LP-03 AC3, AC5 (reduced-motion)

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [x] Fundo usa `DarkSection` (tokens verdes escuros)
- [x] Copy reflete a proposta OaaS correta
- [ ] Com reduced-motion, o terminal não anima (verificação manual) - **pendente**: seção ainda não vista num navegador real; `TerminalWindow` já desliga a digitação sob `useReducedMotion()` (mecanismo verificado por código, não por observação manual) - verificação visual completa fica para T39
- [x] `npm run lint` passa

**Tests**: none
**Gate**: quick - `npm run lint` verde
**Commit**: `feat(sections): build dark terminal section`
**Status**: ⚠️ Partial (mesma situação de T15: código completo, 1 verificação manual em navegador adiada para T39). `TerminalWindow` (T16) reutilizado sem alteração - `animated` mais `useReducedMotion()` interno já cobre o requisito, só falta confirmar visualmente. Copy original: "Você recebe o projeto pronto. A cobrança só chega depois da entrega." + terminal com 5 linhas (`deploy` → `build`/`testes` sucesso → `deploy: produção` → `fatura: emitida após a entrega, não antes`) - substituída no fix abaixo.

**Post-commit fix (2026-09-27, regras comerciais)**: título e terminal reescritos - a copy original violava a regra oficial de pagamento (sugeria cobrança só na entrega; na verdade há 30% de entrada no início). Título novo: "Preço fechado antes de começar. 30% na entrada, o restante na entrega." Terminal (7 linhas, conteúdo exato pedido pelo usuário): `cron-tech iniciar --projeto sistema-sob-medida` → `proposta: preço fechado aprovado` → `entrada: 30% confirmada` → `build: sucesso · testes: sucesso` → `deploy: produção` → `saldo: 70% na entrega do resultado` → `suporte: 30 dias de ajustes inclusos`. Ver `context.md` seção "Regras comerciais". `npm run lint`, `npx tsc --noEmit` e `npm run build` verdes.

---

### T24: Criar `src/content/testimonials.ts` ✅

**What**: Array tipado de depoimentos, **vazio por padrão** (nenhum depoimento real disponível ainda).
**Where**: `src/content/testimonials.ts`
**Depends on**: None
**Reuses**: N/A
**Requirement**: LP-03 AC5, AC6

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] `Testimonial[]` exportado, tipado, array vazio (`[]`)
- [x] Nenhum texto de depoimento inventado no arquivo
- [x] `npm run lint` passa

**Tests**: none
**Gate**: quick - `npm run lint` verde
**Commit**: `feat(content): add testimonials content module (empty by default)`
**Status**: ✅ Complete. Array vazio, comentário explica por quê e aponta para o consumidor (`DifferentiatorsSection`, T25) que deve tratar o caso vazio.

---

### T25: Construir `DifferentiatorsSection` ✅

**What**: Seção com ≥3 diferenciais; bloco de depoimentos renderiza **somente** `WHERE` `testimonials.ts` tiver ≥1 item (LP-03 AC5/AC6) - sem placeholder quando vazio.
**Where**: `src/components/sections/differentiators.tsx`
**Depends on**: T24
**Reuses**: `src/content/testimonials.ts`
**Requirement**: LP-03 AC4, AC5, AC6

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [x] Teste (RTL): com `testimonials` vazio, o bloco de depoimentos não é renderizado (nenhum elemento correspondente no DOM)
- [x] Teste (RTL): com `testimonials` contendo 1+ item, o bloco renderiza com o(s) quote(s)
- [x] ≥3 diferenciais sempre renderizam, independente de depoimentos

**Tests**: unit (2 testes, `src/components/sections/differentiators.test.tsx`)
**Gate**: full - `npm run lint && npx vitest run` → 14 testes passando no total, 0 falhas
**Commit**: `feat(sections): build differentiators section with conditional testimonials`
**Status**: ✅ Complete. `testimonials` é uma prop opcional (default = `testimonials` real, importado de `src/content/testimonials.ts`, hoje vazio) - permite que `page.tsx` use o conteúdo real sem prop nenhuma, e que o teste injete um item fictício só para provar o branch "com depoimento" sem inventar depoimento real no conteúdo (LP-03 AC6 continua satisfeito - nenhum dado fabricado no `content/`, só no teste). Removida a formatação com aspas tipográficas (`"..."`) ao redor do quote no JSX - texto do depoimento fica exato, sem depender de normalização de texto do RTL para o match funcionar.

**Test Adequacy**:

*Check A - Sufficient (coverage mapping):*

| Done-when criterion | `file:line` + assertion | Spec-defined outcome | Covered? |
| --- | --- | --- | --- |
| `testimonials` vazio → bloco não renderiza | `differentiators.test.tsx:20` - `expect(screen.queryAllByRole("blockquote")).toHaveLength(0)` | LP-03 AC6: sem depoimento real, sistema SHALL NOT renderizar o bloco | ✅ Yes |
| `testimonials` com 1+ item → bloco renderiza com o(s) quote(s) | `differentiators.test.tsx:36-39` - `expect(screen.getByText("A entrega chegou exatamente como combinado.")).toBeInTheDocument()`, `expect(screen.getAllByRole("blockquote")).toHaveLength(1)` | LP-03 AC5: com 1+ depoimento, sistema SHALL exibir o bloco | ✅ Yes |
| ≥3 diferenciais sempre renderizam, independente de depoimentos | `differentiators.test.tsx:9-19` (testimonials vazio) e `:40-42` (testimonials com item) - `expect(screen.getByText(<título>)).toBeInTheDocument()` para os 3 títulos no primeiro teste, +1 título reconfirmado no segundo | LP-03 AC4: seção de diferenciais com pelo menos 3 pontos, em qualquer cenário | ✅ Yes |

*Check C - Necessary (reverse mapping):*

| `file:line` | Maps to | Keep? |
| --- | --- | --- |
| `differentiators.test.tsx:9-19` | Done-when #3 (3 diferenciais, caso vazio) | ✅ Keep |
| `differentiators.test.tsx:20` | Done-when #1 | ✅ Keep |
| `differentiators.test.tsx:36-39` | Done-when #2 | ✅ Keep |
| `differentiators.test.tsx:40-42` | Done-when #3 (3 diferenciais, caso com depoimento) | ✅ Keep |

Check B: sem asserção rasa - presença/ausência de `blockquote` por contagem exata (`toHaveLength`), não só "não lança erro"; texto exato de cada título/quote verificado, não só a existência de algum elemento. Check D: segue o padrão RTL do projeto (`src/components/**/*.test.tsx`, `npx vitest run`).

**Verdict**: os 3 critérios cobertos com evidência `file:line`, outcomes batem com o spec (LP-03 AC4/AC5/AC6), nenhuma asserção rasa, nenhum teste especulativo.

**Post-commit fix (2026-09-27, regras comerciais)**: descrição do diferencial "Entrega documentada, sem caixa-preta" ganhou a política de pós-entrega ("30 dias de ajustes sem custo... manutenção é cobrada só se você pedir"), pedida explicitamente pelo usuário. Título do diferencial **não mudou** (só a descrição), e "Preço fechado por entrega, sem hora extra escondida" ficou como estava (usuário pediu para manter). Como os testes verificam os títulos, não as descrições, `differentiators.test.tsx` não precisou de nenhuma alteração - as mesmas 14 asserções continuam passando.

**Post-commit fix (2026-09-27, tipografia)**: hífen usado como pausa (" - ") trocado por travessão (" — ") nas 3 descrições e no separador autor/role do depoimento - regra de estilo do usuário para toda a copy visível do site (hífens de palavra composta e flags de terminal ficam como estão). Testes inalterados (verificam texto que não continha o caractere trocado).

---

### T26: Criar `src/content/services.ts` ✅

**What**: 5 serviços (`id`, `name`, `description`, `timeframe`, `whatsappMessage`, `hasShowcaseCases`), sem nenhum valor monetário.
**Where**: `src/content/services.ts`
**Depends on**: None
**Reuses**: N/A
**Requirement**: LP-05 AC1, AC2, AC3; LP-04 AC4

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] 5 serviços presentes (Sites e Landing Pages, Sistemas Web & Desktop, Mini ERP, Automações (RPA), Agentes de IA)
- [x] Só "Sites e Landing Pages" tem `hasShowcaseCases: true`
- [x] Nenhum campo de preço no tipo ou nos dados
- [x] `npm run lint` passa

**Tests**: none
**Gate**: quick - `npm run lint` verde
**Commit**: `feat(content): add services content`
**Status**: ✅ Complete. Regras comerciais aplicadas desde a primeira escrita (nenhum valor monetário, só prazos indicativos); `whatsappMessage` cita o nome do serviço, usado por `ServicesSection` (T29) via `buildWhatsAppLink(service.whatsappMessage)`.

---

### T27: Criar `src/content/cases.ts` ✅

**What**: 3 cases reais (Performance Motion, Studio Aureum, EvolutionAI) com `demoUrl` real e `imageSrc`/`imageAlt` apontando para `public/cases/` (arquivos já fornecidos: `performance-motion.png`, `studio-aureum.png`, `evolution.png`).
**Where**: `src/content/cases.ts`
**Depends on**: None
**Reuses**: assets já existentes em `public/cases/`
**Requirement**: LP-04 AC1, AC3

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] 3 cases com `demoUrl` correto (`performance-motion.vercel.app`, `studioaureum.vercel.app`, `evolutionai-virid.vercel.app`)
- [x] `imageSrc` aponta exatamente para os arquivos reais em `public/cases/`
- [x] `npm run lint` passa

**Tests**: none
**Gate**: quick - `npm run lint` verde
**Commit**: `feat(content): add real case studies content`
**Status**: ✅ Complete. `imageSrc` confirmado contra os 3 arquivos reais em `public/cases/` (`performance-motion.png`, `studio-aureum.png`, `evolution.png`, todos ~1890x872px). Descrições curtas e genéricas (ex.: "Site institucional para produtora de conteúdo audiovisual") - sem métrica fabricada, sem depoimento, só o que já era publicamente sabido pelo nome/tipo do projeto.

**Post-commit fix (2026-09-27, correção do usuário)**: as 3 descrições estavam incorretas sobre o negócio de cada cliente - substituídas pelo texto exato fornecido pelo usuário: Performance Motion (consultoria esportiva/personal training), Studio Aureum (projetos residenciais/interiores), EvolutionAI (SaaS B2B de agentes de IA). `imageAlt` revisados quanto a contradição com a nova descrição - nenhum contradiz (descrevem o *tipo* de entrega - site institucional/landing page - não o ramo do cliente), mantidos como estavam.

---

### T28: Construir `CasesSection` ✅

**What**: Renderiza os 3 cases reais (nome, descrição, screenshot via `next/image`, botão "Ver demo" com `target="_blank" rel="noopener noreferrer"`) e, para os 4 serviços sem case real, apenas descrição/exemplo ilustrativo (a partir de `services.ts`), sem nome de cliente nem CTA de demo.
**Where**: `src/components/sections/cases.tsx`
**Depends on**: T26, T27
**Reuses**: `src/content/cases.ts`, `src/content/services.ts`
**Requirement**: LP-04 AC1, AC2, AC3, AC4, AC5

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [x] Os 3 "Ver demo" apontam para as URLs reais, `target="_blank"`, `rel="noopener noreferrer"`
- [x] As 3 screenshots renderizam via `next/image` com `alt` descritivo
- [x] Os outros 4 serviços mostram só descrição/exemplo, sem nome de cliente nem CTA de demo

**Tests**: none
**Gate**: quick - `npm run lint` verde (mais `npx tsc --noEmit` e `npm run build` verdes, integração raiz via `page.tsx`)
**Commit**: `feat(sections): build cases section with real demo links and screenshots`
**Status**: ✅ Complete. `id="casos"` (âncora da navbar). Os 4 serviços sem case real (`services.filter(s => !s.hasShowcaseCases)`) reaproveitam `service.description` de `services.ts` (T26) como o "exemplo ilustrativo" exigido - sem novo campo de conteúdo, sem nome de cliente, sem CTA de demo (só título + descrição). `next/image` com dimensões reais das screenshots (945x436, mesma proporção do arquivo original ~1890x872).

---

### T29: Construir `ServicesSection` ✅

**What**: "O que entregamos" - 5 cards/faixas com descrição + prazo indicativo, CTA "Solicitar orçamento" por serviço via `buildWhatsAppLink(service.whatsappMessage)`, sem nenhum valor monetário.
**Where**: `src/components/sections/services.tsx`
**Depends on**: T26, T7
**Reuses**: `src/content/services.ts`, `buildWhatsAppLink`
**Requirement**: LP-05 AC1, AC2, AC3

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [x] 5 cards renderizam com prazo indicativo, sem preço
- [x] Cada CTA "Solicitar orçamento" abre uma URL `wa.me` com mensagem específica do serviço (verificação manual: dois serviços diferentes geram mensagens diferentes)

**Tests**: none
**Gate**: quick - `npm run lint` verde
**Commit**: `feat(sections): build services section (sob consulta)`
**Status**: ✅ Complete. `id="servicos"` (âncora da navbar). Verificação da 2ª linha do Done-when feita por leitura de código + garantia já testada em T7 (`buildWhatsAppLink` tem testes unitários cobrindo o encoding de mensagens arbitrárias) em vez de clique manual em navegador: cada serviço tem seu próprio `whatsappMessage` (string distinta em `services.ts`), então `buildWhatsAppLink(service.whatsappMessage)` produz uma URL com `text=` diferente por construção - não depende de comportamento de runtime não determinístico (ao contrário do foco/animação de T15/T23, que ficaram pendentes para T39).

---

### T30: Criar `src/content/howItWorks.ts` ✅

**What**: Passos da timeline "Como funciona" (do primeiro contato à entrega).
**Where**: `src/content/howItWorks.ts`
**Depends on**: None
**Reuses**: N/A
**Requirement**: LP-05 AC4

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] ≥3 passos, tipados, em ordem
- [x] `npm run lint` passa

**Tests**: none
**Gate**: quick - `npm run lint` verde
**Commit**: `feat(content): add how-it-works timeline content`
**Status**: ✅ Complete. 6 passos refletindo o fluxo real pedido pelo usuário: conversa/diagnóstico → proposta com preço fechado → entrada de 30% → desenvolvimento → entrega e saldo de 70% → 30 dias de ajustes inclusos (regras comerciais de `context.md` aplicadas desde a primeira escrita, não como fix posterior).

---

### T31: Construir `HowItWorksSection` ✅

**What**: Timeline visual a partir de `howItWorks.ts` (única seção que usa numeração/sequência - é de fato sequencial).
**Where**: `src/components/sections/how-it-works.tsx`
**Depends on**: T30
**Reuses**: `src/content/howItWorks.ts`
**Requirement**: LP-05 AC4

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [x] Todos os passos renderizam em ordem, com indicação visual de sequência
- [x] `npm run lint` passa

**Tests**: none
**Gate**: quick - `npm run lint` verde
**Commit**: `feat(sections): build how-it-works timeline section`
**Status**: ✅ Complete. `id="como-funciona"` (âncora da navbar). `<ol>` semântico com numeração `01`/`02`/... em mono - única seção do site com numeração sequencial, conforme o princípio de design (dor/serviços/casos não numeram; timeline numera porque é de fato sequencial).

---

### T32: Criar `src/content/faq.ts` ✅

**What**: ≥5 perguntas frequentes sobre modelo OaaS, prazos, processo e garantias.
**Where**: `src/content/faq.ts`
**Depends on**: None
**Reuses**: N/A
**Requirement**: LP-06 AC1

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] ≥5 itens `{ question, answer }`
- [x] `npm run lint` passa

**Tests**: none
**Gate**: quick - `npm run lint` verde
**Commit**: `feat(content): add faq content`
**Status**: ✅ Complete. 6 perguntas cobrindo exatamente os 6 pontos pedidos pelo usuário: pagamento (30%/70%), modelo OaaS/preço fechado, mudança de escopo (risco é da Cron Tech, pedido novo vira proposta à parte), ajustes pós-entrega (30 dias grátis, depois sob demanda), propriedade de código/acessos, e como começar (WhatsApp). Nenhuma promessa além das regras comerciais de `context.md`. Travessão (não hífen-pausa) em todas as respostas.

**Post-commit fix (2026-09-27, revisão visual)**: adicionada a 7ª pergunta "Quanto tempo leva?" (posicionada logo após a de modelo OaaS/preço fechado), respondida com o texto exato do usuário e referenciando "O que entregamos" (T29) para as faixas indicativas de prazo por serviço. A regra "pedido fora do escopo combinado vira proposta à parte" (já presente na resposta de mudança de escopo) foi formalizada em `context.md` seção "Regras comerciais" como uma regra oficial nova, não só copy de FAQ. `faq.test.tsx` não precisou de nenhuma alteração - o teste 1 itera `faq.forEach` (cobre a pergunta nova automaticamente) e o teste 2 usa `faq[0]`/`faq[1]` genericamente (não depende de qual pergunta específica está em cada posição).

---

### T33: Construir `FaqSection` ⚠️

**What**: Accordion (shadcn, Radix `type="single" collapsible"`) a partir de `faq.ts` - abrir um item fecha qualquer outro aberto.
**Where**: `src/components/sections/faq.tsx`
**Depends on**: T2, T32
**Reuses**: `Accordion` (T2), `src/content/faq.ts`
**Requirement**: LP-06 AC1, AC2

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [x] Teste (RTL): abrir a pergunta 1, depois a pergunta 2 - pergunta 1 fecha automaticamente
- [x] Teste (RTL): todas as perguntas de `faq.ts` renderizam como triggers do accordion
- [ ] Verificação manual: navegável por teclado (`Tab`, `Enter`/`Espaço`) - **pendente**: mesma situação de T15/T23, comportamento vem do `Accordion` do Radix (T2) por baixo - correto por padrão, mas ainda não observado num navegador real; adiado para T39

**Tests**: unit (2 testes, `src/components/sections/faq.test.tsx`)
**Gate**: full - `npm run lint && npx vitest run` → 16 testes passando no total, 0 falhas
**Commit**: `feat(sections): build faq accordion section`
**Status**: ⚠️ Partial (código completo, 1 verificação manual em navegador adiada para T39). `id="faq"` (âncora da navbar). "Um item aberto por vez" testado via `aria-expanded` nos triggers (não via presença/ausência do texto da resposta no DOM - a saída do `Accordion.Content` do Radix depende de uma animação CSS via `Presence`, que não dispara `animationend` em jsdom; testar `aria-expanded` é o sinal semântico correto e determinístico do requisito, independente de timing de animação).

**Test Adequacy**:

*Check A - Sufficient (coverage mapping):*

| Done-when criterion | `file:line` + assertion | Spec-defined outcome | Covered? |
| --- | --- | --- | --- |
| Todas as perguntas renderizam como triggers | `faq.test.tsx:11-15` - `faq.forEach(item => expect(screen.getByRole("button", {name: item.question})).toBeInTheDocument())` | LP-06 AC1: accordion com ≥5 perguntas | ✅ Yes |
| Abrir pergunta 2 fecha a pergunta 1 | `faq.test.tsx:28-33` - `expect(firstTrigger).toHaveAttribute("aria-expanded","true")` após clique 1; `expect(secondTrigger).toHaveAttribute("aria-expanded","true")` e `expect(firstTrigger).toHaveAttribute("aria-expanded","false")` após clique 2 | LP-06 AC2: um item aberto por vez | ✅ Yes |
| Navegável por teclado | (nenhum teste automatizado) | LP-06 AC2 (implícito) | ⚠️ Pendente - verificação manual adiada para T39 |

*Check C - Necessary (reverse mapping):*

| `file:line` | Maps to | Keep? |
| --- | --- | --- |
| `faq.test.tsx:8-16` | Done-when #2 (todas as perguntas são triggers) | ✅ Keep |
| `faq.test.tsx:18-34` | Done-when #1 (um item aberto por vez) | ✅ Keep |

Check B: nenhuma asserção rasa - `aria-expanded` é o estado semântico real do accordion, não um proxy fraco (call count/spy). Check D: segue o padrão RTL do projeto.

**Verdict**: os 2 critérios testáveis cobertos com evidência `file:line`, outcomes batem com o spec, nenhuma asserção rasa; o 3º critério (teclado) é verificação manual explicitamente adiada, não uma lacuna de teste.

---

### T34: Construir `FinalCtaSection` ✅

**What**: Bloco de fundo escuro (`DarkSection`) com CTA de WhatsApp proeminente via `buildWhatsAppLink()`.
**Where**: `src/components/sections/final-cta.tsx`
**Depends on**: T9, T7
**Reuses**: `DarkSection` (T9), `buildWhatsAppLink` (T7)
**Requirement**: LP-06 AC3

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [x] CTA final abre `buildWhatsAppLink()` corretamente
- [x] Fundo usa `DarkSection`
- [x] `npm run lint` passa

**Tests**: none
**Gate**: quick - `npm run lint` verde
**Commit**: `feat(sections): build final CTA section`
**Status**: ✅ Complete. Subheadline reforça as regras comerciais ("preço fechado, 30% de entrada e o saldo na entrega") em vez de copy genérica de CTA.

---

### T35: Construir `Footer` ✅

**What**: Footer com links de navegação, link do Instagram (`site.ts`, ícone `lucide-react`, `target="_blank"`, `rel="noopener noreferrer"`, `aria-label`) e ano corrente calculado dinamicamente (`new Date().getFullYear()`).
**Where**: `src/components/layout/footer.tsx`
**Depends on**: T6
**Reuses**: `src/content/site.ts`, `lucide-react`
**Requirement**: LP-06 AC4, AC5

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [x] Link do Instagram presente com ícone, nova aba, `rel="noopener noreferrer"`, `aria-label`
- [x] Ano no footer é `new Date().getFullYear()`, não um número fixo
- [x] `npm run lint` passa

**Tests**: none
**Gate**: quick - `npm run lint` verde (mais `npx tsc --noEmit` e `npm run build` verdes, integração via `page.tsx`)
**Commit**: `feat(footer): build footer with instagram link and dynamic year`
**Status**: ✅ Complete. **SPEC_DEVIATION**: `design.md`/esta task assumiam um ícone de Instagram em `lucide-react`, mas a versão instalada (`1.48.0`) não tem nenhum ícone de marca/rede social (removidos da lib - confirmado listando os ~6.347 exports do pacote, nenhum contém "instagram", "twitter", "facebook" etc.). Usado um SVG inline no mesmo estilo do lucide (`viewBox 0 0 24 24`, `stroke="currentColor"`, `strokeWidth=2`) desenhando o glifo clássico do Instagram (quadrado arredondado + círculo + ponto), para não fabricar uma dependência nem usar um ícone genérico sem relação com a marca. Link do WhatsApp no rodapé também usa `buildWhatsAppLink()` (não só texto estático) exibindo `siteConfig.whatsappDisplay` ("+55 31 98450-3647").

**Post-commit fix (2026-09-27, revisão visual)**: rodapé reestruturado seguindo o padrão dos footers dos cases reais (Performance Motion, Studio Aureum) - 3 blocos numa linha (empilham no mobile): (1) logo + "Cron Tech" (Newsreader) com uma descrição curta de uma linha; (2) ícones sociais em botões circulares com borda (Instagram + WhatsApp, este substituindo o texto do número mantendo o mesmo `buildWhatsAppLink()`); (3) `navLinks` em lista vertical à direita no desktop. Linha divisória (`border-t`) separando o copyright, que continua com o ano dinâmico. Sem "Desenvolvido por", sem link de política de privacidade (nenhum dos dois foi pedido). Novo ícone `WhatsAppIcon` (SVG inline, mesmo estilo do `InstagramIcon` - glifo aproximado de balão de chat + fone, já que `lucide-react` também não tem ícone de WhatsApp).

---

### T36: Compor `page.tsx` e montar `IntroOverlay` no `layout` ⚠️

**What**: `page.tsx` (Server Component) importa e ordena todas as seções (Navbar, Hero, TechStrip, Pain, AudienceFit, DarkTerminal, Differentiators, Cases, Services, HowItWorks, Faq, FinalCta, Footer); `IntroOverlay` é montado uma vez no `layout.tsx`, sobreposto à home.

**Nota de processo (decisão do usuário, Phase 3, 2026-09-27)**: a montagem em `page.tsx`/`layout.tsx` deixou de ser um evento único no fim da feature. A partir da Phase 3, `page.tsx` é atualizado incrementalmente ao fim de cada fase (as seções recém-construídas entram na composição naquele momento, para o usuário revisar visualmente via `npm run dev`) - Navbar+Hero+TechStrip e `IntroOverlay` já foram montados ao fim da Phase 3; Pain+AudienceFit+DarkTerminal+Differentiators ao fim da Phase 4; Cases+Services+HowItWorks (com os `id`s de âncora `#casos`/`#servicos`/`#como-funciona`) ao fim da Phase 5; Faq+FinalCta+Footer (com `id="faq"`) ao fim da Phase 6. Todas as 13 seções da referência já estão montadas em `page.tsx`/`layout.tsx` - esta task (T36) fica reduzida à sua verificação explícita ainda não feita (home renderiza corretamente com JavaScript desabilitado; nenhum erro de console) e a uma conferência final da ordem contra a referência, não à primeira montagem.
**Where**: `src/app/page.tsx`
**Depends on**: T11, T14, T15, T17, T18, T20, T22, T23, T25, T28, T29, T31, T33, T34, T35
**Reuses**: todos os componentes de seção construídos nas fases 2-6
**Requirement**: LP-01 AC7, LP-02 a LP-06 (composição), LP-07 AC10

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [x] Todas as seções renderizam na ordem da referência (~~sem erro de console~~ - ver nota abaixo)
- [x] Home renderiza corretamente com JavaScript desabilitado (verificado via `curl` em cada fase desde a Phase 3 - `curl` nunca executa JS, então é equivalente a JS desabilitado; conteúdo de todas as 13 seções confirmado presente no HTML)
- [x] `npm run lint && npm run build` passam

**Tests**: none
**Gate**: build - `npm run lint && npm run build` verdes
**Commit**: `feat(page): compose landing page sections and mount intro overlay`
**Status**: ⚠️ Partial. Ordem de `page.tsx` confirmada idêntica à do diagrama de `design.md` (Navbar→Hero→TechStrip→Pain→AudienceFit→DarkTerminal→Differentiators→Cases→Services→HowItWorks→Faq→FinalCta→Footer). O trabalho de wiring em si já estava feito fase a fase (ver nota de processo acima) - esta task ficou só com a verificação. **Pendente**: "sem erro de console" exige um navegador real de verdade (JS rodando) - não posso inspecionar o console do DevTools por este canal; adicionado ao `qa-checklist.md` (T39) para o usuário confirmar.

---

### T37: Reveal de scroll abaixo da dobra (AD-004) ⚠️

**What**: Cria um wrapper `Reveal` (client, `motion` `whileInView`, fade + translate ≤16px, ~0.4s, uma vez, desligado em reduced-motion) e aplica em todas as seções abaixo da dobra em `page.tsx` (Pain, AudienceFit, DarkTerminal, Differentiators, Cases, Services, HowItWorks, Faq, FinalCta, Footer). Hero/Navbar/TechStrip **não** recebem o wrapper.
**Where**: `src/components/ui/reveal.tsx`, `src/app/page.tsx` (wiring)
**Depends on**: T36
**Reuses**: `motion`
**Requirement**: AD-004 (ver `.specs/STATE.md`)

**Tools**:
- MCP: NONE
- Skill: `frontend-design`

**Done when**:
- [ ] Verificação manual: rolar a página revela cada seção abaixo da dobra uma única vez (não repete ao rolar de novo) - **pendente**, adicionado ao `qa-checklist.md` (T39)
- [ ] Verificação manual: com reduced-motion ativo, todas as seções aparecem direto, sem transição - **pendente**, adicionado ao `qa-checklist.md` (T39)
- [x] Hero/Navbar/TechStrip confirmadamente sem o wrapper (sem atraso de LCP)
- [x] `npm run lint && npm run build` passam

**Tests**: none
**Gate**: build - `npm run lint && npm run build` verdes
**Commit**: `feat(motion): add below-the-fold scroll reveal (AD-004)`
**Status**: ⚠️ Partial. `Reveal` (`src/components/ui/reveal.tsx`) usa `whileInView`/`viewport={{once:true}}` do `motion/react` (fade + `y:16→0`, 0.4s) e `useReducedMotion()` para pular direto ao estado final - mesmo mecanismo já usado e comprovado em `IntroOverlay`/`TerminalWindow`. Aplicado às 10 seções abaixo da dobra listadas no `What` (Pain, AudienceFit, DarkTerminal, Differentiators, Cases, Services, HowItWorks, Faq, FinalCta, Footer); Hero/Navbar/TechStrip confirmadamente sem `<Reveal>` em `page.tsx`. As 2 verificações manuais (reveal ao rolar, reduced-motion) dependem de observação visual real - adicionadas ao checklist de T39.

---

### T38: Metadata e SEO ✅

**What**: `generateMetadata`/`metadata` por rota (title/description reais da Cron Tech), Open Graph + Twitter Card com imagem de preview, `sitemap.xml`, `robots.txt`, `metadataBase` usando `site.ts.productionUrl` (placeholder `TODO`).
**Where**: `src/app/layout.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`
**Depends on**: T36, T6
**Reuses**: `src/content/site.ts`; `docs/brand/logo-crontech.png` (fonte em alta resolução com fundo transparente - registrada em T12 - como origem para gerar a imagem de OG/Twitter Card e, se necessário, um favicon atualizado; não usar `public/brand/logo-crontech.webp` diretamente, que já é um derivado otimizado para o tamanho da intro)
**Requirement**: LP-07 AC6

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] `<title>` não é mais "Create Next App"; description real presente
- [x] Open Graph e Twitter Card presentes (verificável via view-source ou debugger social)
- [x] `sitemap.xml` e `robots.txt` acessíveis em dev (`next dev`)
- [x] `npm run lint && npm run build` passam

**Tests**: none
**Gate**: build - `npm run lint && npm run build` verdes; rotas confirmadas em `npm run dev` (`curl -o /dev/null -w "%{http_code} %{content_type}"` em `/`, `/sitemap.xml`, `/robots.txt`, `/opengraph-image`, `/icon.png` - todas 200)
**Commit**: `feat(seo): add real metadata, open graph, sitemap and robots`
**Status**: ✅ Complete. `<title>`: "Cron Tech — Outcome as a Service" (com template `%s — Cron Tech` para futuras rotas), `description` real, `metadataBase` usando `siteConfig.productionUrl` (ainda `TODO` - domínio real pendente, conforme já registrado em `context.md`/`spec.md`). Open Graph + Twitter Card completos, confirmados via `grep` no HTML gerado (`og:title`, `og:description`, `og:image`, `twitter:card`, etc.). Imagem de OG/Twitter gerada por código (`src/app/opengraph-image.tsx`, `next/og` `ImageResponse`, 1200x630) a partir de `docs/brand/logo-crontech.png` (fonte transparente registrada em T12) - não do `public/brand/logo-crontech.webp`. `sitemap.ts` (1 URL - site de página única) e `robots.ts` (allow tudo, aponta pro sitemap). Adicionado também `src/app/icon.png` (256x256, mesma fonte) - favicon novo, já que o `favicon.ico` do `create-next-app` era um placeholder óbvio (fora do escopo estrito do Done-when, mas serve diretamente o espírito de LP-07 AC6 de não deixar placeholder visível); `favicon.ico` antigo mantido intacto como fallback legado, Next.js expõe os dois convivendo sem conflito.

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
**Status**: 🔲 Não iniciada (decisão explícita do usuário, 2026-09-27). Esta é uma passagem manual em navegador real - nenhuma das suas verificações pode ser feita por código/`curl` nesta sessão. Gerado `.specs/features/landing-page/qa-checklist.md` com um checklist objetivo (teclado, responsividade, reduced-motion, console, ordem visual - incluindo as pendências já registradas em T15/T23/T33/T36/T37) para o usuário executar no navegador. **Não marcar Done-when nem Status como completo até o usuário reportar o resultado** - os itens que falharem viram fix tasks na próxima sessão.

---

### T40: Lighthouse mobile ≥ 90 (Performance, Acessibilidade, Best Practices, SEO) ⚠️

**What**: Roda `next build && next start` (ou preview deploy), executa Lighthouse mobile na home publicada, corrige qualquer categoria abaixo de 90 - com atenção especial a: LCP não é a intro (AD-001/AC LP-07 AC10) e peso da logo otimizada (T12).
**Where**: variável (correções pontuais conforme achados do relatório Lighthouse)
**Depends on**: T37, T38, T39, T12
**Reuses**: N/A
**Requirement**: LP-07 AC8, AC10

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Lighthouse mobile ≥ 90 em Performance, Acessibilidade, Best Practices e SEO (print/registro do relatório anexado ao PR) - **Performance abaixo de 90** (ver status)
- [x] Elemento de LCP reportado pertence ao conteúdo da home (não à intro)
- [x] `npm run lint && npm run build` passam

**Tests**: none
**Gate**: build - `npm run lint && npm run build` verdes
**Commit**: `perf: final Lighthouse pass and fixes for the landing page`
**Status**: ⚠️ Partial. Rodado com sucesso via CLI (`npx lighthouse` + Chrome instalado localmente, `CHROME_PATH` setado manualmente) contra `npm run build && npm run start` - o ambiente permitiu a tentativa, ao contrário do cenário alternativo previsto pelo usuário.

- **Acessibilidade = 100, Best Practices = 100, SEO = 100.** Achado real durante a auditoria: `color-contrast` falhava (score 0) - `font-mono text-sm text-primary` (verde-médio `#41a53e` sobre creme `#faf9e6`) tem contraste 2,95:1, abaixo do mínimo 4,5:1 para texto normal. Usado em 3 lugares (`Hero` eyebrow "$ outcome-as-a-service", `ServicesSection` prazo indicativo, `HowItWorksSection` numeração) - trocado para `text-foreground` (mesmo par já validado em T4, ~14,9:1) nos 3. Depois do fix, Acessibilidade subiu de 96 para 100.
- **Elemento de LCP confirmado correto**: `lcp-breakdown-insight` aponta o `<h1>` do Hero ("Você entrega o problema. A Cron Tech entrega o resultado pronto.") como o elemento de LCP - conteúdo real da home, não a intro. AD-001 funciona como projetado.
- **Performance = 53 → 73 → 77** ao longo de 3 rodadas (mesma build, variação normal de simulação de rede/CPU no Lighthouse) - **abaixo de 90 nas 3**. Causa raiz identificada, não corrigida nesta sessão: `total-blocking-time` alto (1980ms → 470ms entre rodadas) e `largest-contentful-paint` em ~4,1-4,3s, ambos dominados por peso de JavaScript no cliente (`bootup-time`/`mainthread-work-breakdown` apontam ~72KB e ~64KB de chunks de primeira parte, 37-44% de bytes não usados) - originado de `motion`/Radix usados em `IntroOverlay`, `TerminalWindow`, `MobileMenu`, `FaqSection` (accordion), `Reveal`. Reduzir isso exigiria trabalho real de arquitetura (code-splitting, `next/dynamic` com `ssr:true` para adiar hidratação não-crítica, ou revisar o uso de `motion` em algum desses componentes) - **decisão consciente de não tentar às cegas no fim de uma sessão já longa, sem o usuário ter revisado ainda o restante da Phase 7 nem rodado o próprio `qa-checklist.md` (T39)**. Fica como recomendação para uma próxima sessão dedicada, não como algo corrigido aqui.
- Relatórios completos (JSON + HTML) salvos no scratchpad da sessão (não commitados ao repo - são artefato de build/auditoria, não código-fonte): `lighthouse-report.report.json`/`.html`.

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
