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

- **Feature**: landing-page (`.specs/features/landing-page/`) - **T1-T39 completas** (T40 fica ⚠️ deliberadamente, Performance será medida no deploy). Verifier independente rodou ao final da Phase 7 e retornou **PASS**. Usuário executou o checklist manual de T39 num navegador real: tudo OK, exceto 1 bug real no `FaqSection` no mobile (resposta cortada) - corrigido nesta sessão.
- **Completed**: Specify, Design, Tasks, Execute (T1-T39; T40 parcial, ver abaixo). `page.tsx`/`layout.tsx` compõem as 13 seções da referência (Navbar → Footer). Regras comerciais oficiais em `context.md` (seção "Regras comerciais") e na memória de projeto do usuário (`business_model_crontech.md`), aplicadas em toda a copy e auditadas pelo Verifier sem violação encontrada. Metadata/OG/Twitter/sitemap/robots/icon reais (T38). Reveal de scroll abaixo da dobra (T37), incluindo o fix de no-JS de uma sessão anterior. QA manual completo (T39): teclado, foco visível, responsividade (320-1440px), reduced-motion - todos confirmados pelo usuário, sem achados além do bug do accordion (corrigido). Lighthouse mobile via CLI (T40): Acessibilidade/Best Practices/SEO = 100, Performance = 73-77 (< 90 - causa raiz documentada em `tasks.md` T40, será medida de novo no deploy real, não perseguida às cegas nesta sessão). Elemento de LCP confirmado como o `<h1>` do Hero, não a intro (AD-001 satisfeito).
- **Bug encontrado no checklist e corrigido**: `src/components/ui/accordion.tsx` aplicava `h-(--radix-accordion-content-height)` como altura **fixa e permanente** no `<div>` interno do `AccordionContent` - essa variável é medida por Radix num instante pontual (abertura) e já era usada corretamente nas keyframes `accordion-down`/`accordion-up` (que animam a altura do elemento externo `AccordionPrimitive.Content`); aplicá-la também no `<div>` interno prendia seu tamanho a essa medição pontual, cortando o conteúdo se o layout mudasse depois (reproduzido no mobile, 1ª pergunta do FAQ). Fix: removida a classe do `<div>` interno - cresce naturalmente (`auto`); animação de abrir/fechar intocada (nunca dependia dela). Confirmado no CSS de produção gerado: a variável só aparece dentro de `@keyframes`, não mais como regra de altura estática. `faq.test.tsx` (2 testes) continua passando sem alteração. Afeta qualquer consumidor futuro de `Accordion`, não só o FAQ.
- **Verificação independente (Verifier sub-agent, 1 execução, sessão anterior)**: retornou PASS depois de 1 fix (mutante sobrevivente em `DifferentiatorsSection`). Não pegou o bug de no-JS do `Reveal` nem o bug de altura do accordion (ambos fora do escopo do que ele checou/não observáveis sem execução real em navegador) - ambos achados e corrigidos em sessões humanas de QA depois. 2 lições registradas em `.specs/lessons.json`/`.specs/LESSONS.md` (candidatas, machine-owned, não editar à mão): L-001 (afirmar ausência do wrapper, não só contagem de filhos) e L-002 (checar "funciona sem JS" contra todo componente que define visibilidade via estilo inline). Relatório: `.specs/features/landing-page/validation.md` (verdict `PASS`, não reaberto para o bug do accordion - é um achado de QA manual pós-verificação, registrado em `tasks.md`, não em `validation.md`).
- **In-progress**: nenhum arquivo em edição.
- **Next step**: feature pronta para revisão final/merge, do ponto de vista de conteúdo e QA manual. Decidir separadamente se/quando investir numa passada de performance (T40 Performance 73-77 → meta 90 exigiria code-splitting real de `motion`/Radix) - será medido de novo no ambiente de deploy real antes de qualquer decisão.
- **Blockers**: none
- **Uncommitted files** (saída de `git status --porcelain` rodada agora, antes de escrever esta seção - regra do `CLAUDE.md`, commits são sugeridos e o usuário executa manualmente):
  - `src/components/ui/accordion.tsx` (fix do bug de altura fixa no `AccordionContent`)
  - `.specs/features/landing-page/tasks.md` (T39 marcada completa com o resultado do checklist; T15/T23/T33/T36/T37 com as verificações manuais fechadas; fix notes em T2 e T33 sobre o bug do accordion)
  - Nenhuma sobreposição entre arquivos neste lote
  - Verificado: `npm run lint`, `npx tsc --noEmit`, `npx vitest run` (16/16, `faq.test.tsx` inalterado) e `npm run build` verdes; CSS de produção gerado confirma a variável `--radix-accordion-content-height` só nas keyframes, não mais como altura estática
- **Branch**: `feature/landing-page`
