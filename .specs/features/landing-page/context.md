# Landing Page Context

**Gathered:** 2026-09-27
**Spec:** `.specs/features/landing-page/spec.md`
**Status:** Ready for design

---

## Feature Boundary

Landing page institucional da Cron Tech em pt-BR, seguindo a estrutura visual da referência Chiarelli Labs (`docs/references/chiarelli-ref.png`) com conteúdo próprio, precedida por uma intro animada baseada em `docs/references/crontech-ref-home.webp`. Site estático em Next.js/Vercel, sem backend próprio, com CTA principal de contato via WhatsApp.

---

## Implementation Decisions

### Mecanismo de contato

- CTA principal e único mecanismo de contato: links `wa.me` (WhatsApp), sem formulário on-page e sem API route/backend.
- Todo botão "Fale com a gente" / "Solicitar orçamento" / CTA final abre o WhatsApp com mensagem pré-preenchida contextual (citando a seção/serviço de origem quando fizer sentido).
- `react-hook-form` + `zod` (já instalados) ficam disponíveis no projeto mas não são obrigatórios para este MVP — não há formulário para validar nesta feature.

### Exibição de preços

- Modelo "sob consulta": nenhum valor numérico público.
- Cada card de serviço em "O que entregamos" tem CTA "Solicitar orçamento" → abre WhatsApp com mensagem pré-preenchida mencionando o serviço específico.
- Prazos (ex.: "X a Y dias") podem ser exibidos como indicativo de processo, mas não como preço.

### Programa de indicação

- Fora do escopo da v1. Ver Deferred Ideas.

### Proposta de valor (copy)

- Removida a frase "você grava o problema / você grava, a Cron Tech entrega" — vinha da referência Chiarelli e não se aplica à Cron Tech.
- Proposta correta a usar em Problem Statement e no bloco de terminal escuro: "a Cron Tech entrega o resultado pronto e cobra pelo trabalho entregue, não por licença de uso."

### Fundador

- Seção "Conheça o Fundador" removida por completo do escopo da v1 (spec, ACs de LP-06, conteúdo). Nenhum nome ou dado de fundador é exibido na página. Registrada em Out of Scope no `spec.md`.

### WhatsApp e Instagram

- Número de WhatsApp real: `5531984503647` (usado nos links `wa.me`), exibido em texto como "+55 31 98450-3647".
- Instagram: `https://www.instagram.com/cron_tech/`, exibido no footer com ícone + link, nova aba, `rel="noopener noreferrer"` e `aria-label` descritivo.
- Ambos centralizados em `src/content/site.ts` como fonte única consumida por toda a página.

### Depoimentos

- Renderização condicional: o bloco de depoimentos só é exibido `WHERE` houver ao menos um depoimento real cadastrado em `src/content`. Sem depoimento real, o bloco não renderiza — nunca aparece com placeholder `TODO` visível.

### Intro e performance (SSR)

- A home (conteúdo real) é renderizada no servidor e está presente no HTML inicial. A intro é um overlay client-side sobreposto a essa home já no DOM, sem bloquear nem atrasar o LCP da home.
- Overlay oculto por padrão via CSS; só aparece quando `html[data-intro="show"]` — sem JavaScript, o overlay nunca aparece (a home é o único conteúdo visível).
- O script inline de pré-hidratação também checa `prefers-reduced-motion` e marca `skip` quando ativo (mesmo comportamento de quem já viu a intro na sessão).
- `<html suppressHydrationWarning>` no layout, para acomodar o atributo `data-intro` escrito pelo script antes da hidratação do React.

### Screenshots dos cases

- Arquivos reais fornecidos pelo usuário em `public/cases/`: `performance-motion.png`, `studio-aureum.png`, `evolution.png`, exibidos via `next/image`.

### Reveal de scroll (seções abaixo da dobra)

- Adicionado fade + translate curto (≤16px, ~0.4s), uma única vez por elemento, via `motion` `whileInView`, aplicado só a seções abaixo da dobra.
- Hero, navbar e qualquer conteúdo acima da dobra **não** animam por scroll (protege o LCP).
- Desligado inteiramente com `prefers-reduced-motion: reduce`.
- Isso ajusta o princípio de motion do `design.md` (antes: "nenhuma animação de entrada por scroll") — registrado como `AD-004` em `.specs/STATE.md`.

### Agent's Discretion

- Copy geral (títulos, textos de dor, "pra quem é/não é", diferenciais, FAQ, textos de transição) fica a critério do agente, seguindo o tom OaaS/técnico da referência, adaptado à Cron Tech — sem inventar depoimentos, cases ou dados de clientes reais.
- Estrutura de arquivos de conteúdo (`src/content/*.ts`), nomes de componentes e organização de pastas ficam a critério do agente na fase de Design.
- Comportamento visual de hover/interação dos cards, pills e badges segue o padrão observado na referência Chiarelli, adaptado à paleta Cron Tech.

### Declined / Undiscussed Gray Areas → Assumptions

Os itens abaixo não foram discutidos nesta rodada (dados puros, não decisões de produto) e foram registrados como Assumptions no `spec.md` com placeholder `TODO`, conforme autorizado pelo usuário no briefing original ("pergunte ou deixe um placeholder marcado com TODO"):

- Domínio de produção (para `metadataBase`, canonical URL e Open Graph) — mantido como `TODO` a pedido explícito do usuário
- Ferramenta de analytics (se alguma) — assumido "nenhuma na v1" por não ter sido solicitada

---

## Specific References

- Estrutura de seções, ritmo, tipografia (serifada editorial nos títulos, sans no corpo, mono nos blocos de terminal), cards/badges/pills e estados de hover: `docs/references/chiarelli-ref.png` (Chiarelli Labs) — replicar estrutura e linguagem visual, não copiar texto/marca.
- Intro de entrada (tela escura, glow verde, grid, acentos em serifada itálica, animação de logo + typewriter "Cron Tech"): `docs/references/crontech-ref-home.webp`. Nota: esse arquivo é um board de estilo (marca "tradehive" usada apenas como exemplo de composição/tipografia/glow) — a Cron Tech usa a mesma linguagem visual (fundo escuro, glow verde radial, grid sutil, itálico serifado), não o conteúdo ou a marca ali mostrados.

---

## Deferred Ideas

- Programa de indicação (seção "indique e ganhe") — fica para uma fase futura, fora do escopo deste PRD.
- Formulário de contato on-page com validação (react-hook-form + zod) e envio via API route/serviço externo — pode ser reavaliado depois se WhatsApp-only não for suficiente.
