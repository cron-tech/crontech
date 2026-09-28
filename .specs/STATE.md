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

- **Feature**: landing-page (`.specs/features/landing-page/`) - **conteúdo e verificação completos** (T1-T38 commitados pelo usuário; T40 rodado mas com 1 categoria abaixo da meta, documentado; T39 deliberadamente não iniciada). Verifier independente rodou ao final da Phase 7 (autorizado pelo usuário) e retornou **PASS** depois de 1 fix pontual, aplicado e re-verificado nesta mesma sessão.
- **Completed**: Specify, Design, Tasks, Execute (T1-T40, ver detalhe/exceções abaixo). `page.tsx`/`layout.tsx` compõem as 13 seções da referência (Navbar → Footer). Regras comerciais oficiais em `context.md` (seção "Regras comerciais") e na memória de projeto do usuário (`business_model_crontech.md`) - aplicadas em toda a copy, auditadas pelo Verifier sem violação encontrada. Metadata/OG/Twitter/sitemap/robots/icon reais (T38). Reveal de scroll abaixo da dobra (T37). Lighthouse mobile rodado via CLI (T40): Acessibilidade/Best Practices/SEO = 100, Performance = 73-77 (< 90 - causa raiz documentada em `tasks.md` T40, não corrigida nesta sessão, ver "Next step"). Elemento de LCP confirmado como o `<h1>` do Hero, não a intro (AD-001 satisfeito).
- **Verificação independente (Verifier sub-agent, autorizado pelo usuário)**: rodou uma vez; achou 1 gap real (teste de `DifferentiatorsSection` não distinguia "wrapper vazio" de "wrapper ausente" - mutante sobrevivente no sensor de discriminação); nenhuma violação de copy comercial encontrada em toda a árvore. O fix (adicionar `data-testid` + 1 asserção) foi aplicado e a mutação foi reaplicada numa scratch isolada (`git worktree`, nunca `git stash`) pelo implementador para confirmar que agora é detectada - árvore real confirmada inalterada antes/depois. Relatório completo: `.specs/features/landing-page/validation.md` (verdict `PASS`, `python "C:\Users\jmartinsc\.claude\skills\tlc-spec-driven\scripts\validate_state.py" landing-page` → exit 0). Lição registrada em `.specs/LESSONS.md`/`.specs/lessons.json` (candidata, 1 feature): "ao testar um bloco condicional, afirme a ausência do wrapper, não só a contagem dos filhos."
- **In-progress**: nenhum arquivo em edição. **Não iniciar nada novo sem o usuário revisar o `qa-checklist.md` primeiro** (é o próximo passo dele, não uma tarefa pendente minha).
- **Next step**: usuário roda `.specs/features/landing-page/qa-checklist.md` num navegador real e reporta o que falhar (isso fecha T39 e as pendências manuais de T15/T23/T33/T36/T37 já registradas). Separadamente, decidir se/quando investir numa passada de performance (T40 Performance 73-77 → meta 90 exigiria code-splitting real de `motion`/Radix - não tentado às cegas nesta sessão, ver nota em T40 no `tasks.md`).
- **Blockers**: none
- **Uncommitted files** (saída de `git status --porcelain` rodada agora, antes de escrever esta seção - regra do `CLAUDE.md`, commits são sugeridos e o usuário executa manualmente):
  - `src/components/sections/differentiators.tsx`, `src/components/sections/differentiators.test.tsx` (fix do gap achado pelo Verifier - `data-testid="testimonials-block"` + asserção de ausência)
  - `.specs/features/landing-page/tasks.md` (fix note em T25 registrando o achado do Verifier)
  - `.specs/features/landing-page/validation.md` (novo - relatório do Verifier, atualizado para refletir o fix)
  - `.specs/LESSONS.md`, `.specs/lessons.json` (novos - gerados pelo `lessons.py` do Verifier, machine-owned, não editar à mão)
  - Nenhuma sobreposição entre arquivos neste lote
  - Verificado: `npm run lint`, `npx tsc --noEmit`, `npx vitest run` (16/16) e `npm run build` verdes; `validate_state.py landing-page` → exit 0
- **Branch**: `feature/landing-page`
