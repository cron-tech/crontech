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
- **Phase / Task**: Design aprovado pelo usuário; aguardando decisão sobre fase Tasks (formal vs. inline em Execute)
- **Completed**: Specify (spec.md + context.md, revisados e validados), Design (design.md)
- **In-progress**: nenhum arquivo em edição
- **Next step**: rodar a fase Tasks (quebrar em tasks atômicas) ou, se o escopo permitir, ir direto para Execute com a checklist inline de `implement.md`
- **Blockers**: none
- **Uncommitted files**: `.specs/features/landing-page/spec.md`, `.specs/features/landing-page/context.md`, `.specs/features/landing-page/design.md`, `.specs/STATE.md` (nenhum commit foi feito ainda — projeto segue a regra de não executar git; branch/commit message serão sugeridos ao usuário)
- **Branch**: feature/sdd-planning
