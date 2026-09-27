# STATE

## Decisions

### AD-001
- **Decision**: A intro de entrada usa um script inline no `layout.tsx`, executado antes da hidratação, que lê o `sessionStorage` **e** `prefers-reduced-motion` e marca `<html data-intro="skip|show">`; a home continua sendo renderizada no servidor e presente no HTML independente desse valor. O overlay é oculto por padrão via CSS (só visível sob `html[data-intro="show"]`), então sem JavaScript ele nunca aparece. `<html>` usa `suppressHydrationWarning` para acomodar o atributo escrito pelo script antes da hidratação do React.
- **Reason**: Evita flash da intro em visitas repetidas ou com `prefers-reduced-motion` sem depender de `useEffect` (que só decide depois do primeiro paint) e sem bloquear o conteúdo real da home; o CSS-hidden-by-default é uma segunda camada de defesa que não depende do script ter executado com sucesso.
- **Trade-off**: Um script inline extra no `<head>`, fora do fluxo normal de componentes React; `suppressHydrationWarning` silencia um warning legítimo do React nesse ponto específico (aceito porque a causa é conhecida e intencional).
- **Scope**: Qualquer feature futura que precise gatear um overlay client-side pelo primeiro paint (não só a landing page).
- **Date**: 2026-09-27
- **Status**: active

### AD-002
- **Decision**: Seções de fundo escuro (terminal, CTA final) usam um wrapper `DarkSection` que sobrescreve os tokens `--background/--foreground/--card/...` só dentro do wrapper, reaproveitando o mesmo mecanismo de tokens que o preset shadcn usa para `.dark` — só que escopado por seção, não pelo tema do SO/usuário.
- **Reason**: Todo componente que já usa `bg-background`/`text-foreground` funciona sem mudança dentro da seção escura; evita duplicar um sistema de temas paralelo.
- **Trade-off**: Reaproveita a semântica de "dark mode" do shadcn para um conceito diferente (seção de conteúdo, não preferência do usuário) — exige documentação clara para não confundir com dark mode de verdade (que este projeto não usa).
- **Scope**: Qualquer seção de fundo escuro em qualquer página futura do site.
- **Date**: 2026-09-27
- **Status**: active

### AD-003
- **Decision**: Tipografia troca só os títulos (H1–H3, headlines) para Newsreader (serifada editorial); corpo e blocos de terminal/código continuam em Geist Sans / Geist Mono (já instalados no starter).
- **Reason**: Decisão do usuário — menor esforço/risco agora do que trocar as três fontes, ainda assim distintivo nos títulos (evita o Geist puro em toda a página).
- **Trade-off**: Menos distintivo do que a proposta original (Fraunces + Manrope + JetBrains Mono) em todo o sistema tipográfico.
- **Scope**: Toda a identidade tipográfica do site (qualquer página/feature futura segue essa mesma combinação, a menos que uma decisão supere esta).
- **Date**: 2026-09-27
- **Status**: active

### AD-004
- **Decision**: Seções **abaixo da dobra** recebem um reveal de scroll discreto (fade + translate ≤16px, ~0.4s, uma única vez por elemento, via `motion` `whileInView`). Hero, navbar e qualquer conteúdo acima da dobra não animam por scroll. Desligado inteiramente com `prefers-reduced-motion`.
- **Reason**: Ajuste do usuário ao princípio de motion original ("nenhuma animação de entrada por scroll"); mantém a intro/terminal como o único momento "orquestrado" e a área acima da dobra livre de qualquer atraso de LCP, mas adiciona um reveal utilitário no restante da página.
- **Trade-off**: Reintroduz motion por scroll (que o design original evitava deliberadamente para fugir do "fade-slide-up genérico"); mitigado por escopo restrito (só abaixo da dobra), duração curta e deslocamento pequeno.
- **Scope**: Toda seção abaixo da dobra em qualquer página futura do site que siga este sistema de design.
- **Date**: 2026-09-27
- **Status**: active

## Handoff

- **Feature**: landing-page (`.specs/features/landing-page/`)
- **Phase / Task**: Execute - Phases 1-4 completas e commitadas pelo usuário, incluindo o fix de regras comerciais (T1-T25 de 40). Nesta sessão: 3 ajustes finos pré-Phase 5 (subheadline do Hero, travessão em vez de hífen-pausa, correção deste Handoff) seguidos da Phase 5 completa (T26-T31) - tudo ainda não commitado (fix + 6 commits de feature sugeridos, ver relatório da sessão). **Sessão pausada aqui a pedido do usuário**: aguardando ele revisar visualmente Cases/Services/HowItWorks via `npm run dev` antes de abrir a Phase 6.
- **Completed**: Specify, Design, Tasks (todos aprovados e validados). Execute: T1-T31 implementadas, gate verde em cada uma (ver `tasks.md`). `page.tsx`/`layout.tsx` compõem Navbar, Hero, TechStrip, PainSection, AudienceFitSection, DarkTerminalSection, DifferentiatorsSection, CasesSection, ServicesSection, HowItWorksSection e IntroOverlay - com os `id`s de âncora `#casos`/`#servicos`/`#como-funciona` batendo com `navLinks` de `site.ts`. Faltam só FaqSection, FinalCtaSection e Footer (Phase 6). Regras comerciais oficiais em `.specs/features/landing-page/context.md` (seção "Regras comerciais") e na memória de projeto do usuário (`business_model_crontech.md`) - aplicadas desde a primeira escrita em toda a Phase 5.
- **In-progress**: nenhum arquivo em edição. **Não iniciar a Phase 6 sem confirmação explícita do usuário.**
- **Next step**: com o OK do usuário após a revisão visual, iniciar Phase 6 (T32: `src/content/faq.ts`)
- **Blockers**: none (bloqueio é de processo - aguardando review do usuário)
- **Pendências conhecidas para T39 (QA de acessibilidade)**: verificação manual em navegador de T15 (`Tab`/`Esc` no `MobileMenu`) e T23 (terminal grande não anima sob reduced-motion) - código já implementado e coberto por mecanismo (Radix `Dialog` / `useReducedMotion()`), só falta observação visual direta.
- **Uncommitted files** (saída de `git status --porcelain` rodada agora, antes de escrever esta seção - regra do `CLAUDE.md`, commits são sugeridos e o usuário executa manualmente):
  - **Fix fino pré-Phase 5** (ainda pendente de commit): `src/components/sections/hero.tsx`, `src/components/sections/differentiators.tsx`, `src/content/pain.ts` (hífen-pausa → travessão + subheadline menos ambígua)
  - **Phase 5 (T26-T31)**: `src/content/services.ts` (T26), `src/content/cases.ts` (T27), `src/components/sections/cases.tsx` (T28), `src/components/sections/services.tsx` (T29), `src/content/howItWorks.ts` (T30), `src/components/sections/how-it-works.tsx` (T31)
  - `src/app/page.tsx` (agora monta também Cases, Services, HowItWorks)
  - `.specs/features/landing-page/tasks.md` (status T26-T31, nota de processo em T36)
  - Nenhuma sobreposição entre arquivos na Phase 5 (cada task tem seus próprios arquivos)
  - Verificado: `npm run lint`, `npx tsc --noEmit`, `npx vitest run` (14/14, inalterados) e `npm run build` verdes; `npm run dev` + `curl` confirmaram o conteúdo e os 3 `id`s de âncora no HTML gerado
- **Branch**: `feature/landing-page`
