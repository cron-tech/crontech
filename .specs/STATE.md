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
- **Phase / Task**: Execute - Phases 1-5 completas e commitadas pelo usuário (T1-T31 de 40), incluindo o fix de regras comerciais. Nesta sessão: fix pontual em `cases.ts` (descrições dos 3 clientes estavam erradas - corrigido com o texto exato do usuário) seguido da Phase 6 completa (T32-T35: FAQ, CTA final, Footer) - tudo ainda não commitado. **Sessão pausada aqui a pedido do usuário**: aguardando ele revisar visualmente FAQ/CTA final/Footer via `npm run dev`.
- **Completed**: Specify, Design, Tasks (todos aprovados e validados). Execute: T1-T35 implementadas, gate verde em cada uma (ver `tasks.md`). `page.tsx`/`layout.tsx` compõem as 13 seções da referência (Navbar → Footer) - feature funcionalmente completa em conteúdo; faltam só T36-T40 (revisão final de composição, reveal de scroll, SEO, QA de acessibilidade, Lighthouse). Regras comerciais oficiais em `context.md` (seção "Regras comerciais") e na memória de projeto do usuário (`business_model_crontech.md`), aplicadas desde a primeira escrita na Phase 6.
- **In-progress**: nenhum arquivo em edição. **Não iniciar a Phase 7 (T36-T40) sem confirmação explícita do usuário.**
- **Next step**: com o OK do usuário após a revisão visual, iniciar a Phase 7 (T36: revisão final da composição em `page.tsx` - ver nota de processo na própria T36 em `tasks.md`, o wiring incremental já foi feito fase a fase)
- **Blockers**: none (bloqueio é de processo - aguardando review do usuário)
- **Pendências conhecidas para T39 (QA de acessibilidade)**: verificação manual em navegador de T15 (`Tab`/`Esc` no `MobileMenu`), T23 (terminal grande não anima sob reduced-motion) e T33 (`Tab`/`Enter`/`Espaço` no `FaqSection`) - código já implementado e coberto por mecanismo (Radix `Dialog`/`Accordion`, `useReducedMotion()`), só falta observação visual direta.
- **Uncommitted files** (saída de `git status --porcelain` rodada agora, antes de escrever esta seção - regra do `CLAUDE.md`, commits são sugeridos e o usuário executa manualmente):
  - **Fix pontual** (ainda pendente de commit): `src/content/cases.ts` (descrições dos 3 clientes corrigidas)
  - **Phase 6 (T32-T35)**: `src/content/faq.ts` (T32); `src/components/sections/faq.tsx` + `faq.test.tsx` (T33); `src/components/sections/final-cta.tsx` (T34); `src/components/layout/footer.tsx` (T35)
  - `src/app/page.tsx` (agora monta também Faq, FinalCta, Footer)
  - `.specs/features/landing-page/tasks.md` (status T32-T35, nota de processo em T36)
  - Nenhuma sobreposição entre arquivos na Phase 6 (cada task tem seus próprios arquivos)
  - Verificado: `npm run lint`, `npx tsc --noEmit`, `npx vitest run` (16/16) e `npm run build` verdes; `npm run dev` + `curl` confirmaram o conteúdo e o `id="faq"` no HTML gerado
- **Branch**: `feature/landing-page`
