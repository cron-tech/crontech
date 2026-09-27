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
- **Phase / Task**: Execute - Phase 1 (Fundação, T1-T9) e Phase 2 (Intro de entrada, T10-T12) completas, 12 de 40. Phase 1 já commitada pelo usuário (`4d32afa`..`f0bcb9c`, confirmado em `git log`). Phase 2 implementada nesta sessão, ainda não commitada. Aguardando OK do usuário para abrir a Phase 3 (Navegação e Hero).
- **Completed**: Specify, Design, Tasks (todos aprovados e validados). Execute: T1-T12 implementadas, gate verde em cada uma (ver `tasks.md` para o detalhe por task).
- **In-progress**: nenhum arquivo em edição
- **Next step**: com o OK do usuário, iniciar Phase 3 (T13: `src/content/techStack.ts`)
- **Blockers**: none
- **Uncommitted files** (nenhum commit git foi feito nesta sessão - regra do `CLAUDE.md`, commits são sugeridos e o usuário executa manualmente):
  - `src/app/layout.tsx` (T10 - script de pré-hidratação + CSS de gate da intro)
  - `src/components/intro/intro-overlay.tsx`, `src/components/intro/intro-overlay.test.tsx` (T11, com ajuste de T12 no `src` da imagem - ver nota de sobreposição abaixo)
  - `public/brand/logo-crontech.webp` (novo, T12), `public/brand/logo-crontech.png` (removido, T12)
  - `.specs/features/landing-page/tasks.md` (status T10-T12), `.specs/STATE.md`
  - **Sobreposição entre tasks**: `src/components/intro/intro-overlay.tsx` foi criado por T11 e depois só teve a linha `src` da imagem alterada por T12 (troca do PNG pelo WebP). Como a working tree só guarda o estado final do arquivo, recomenda-se um único commit para T11+T12 (ver sugestão de commits abaixo) em vez de tentar separar por task.
- **Branch**: `feature/landing-page` (branch atual; Phase 1 já commitada nela pelo usuário)
