# QA Checklist manual — Landing Page Cron Tech (T39)

Gerado em 2026-09-27. Rodar com `npm run dev` (ou `npm run build && npm run start`) e um navegador de verdade — nada aqui pode ser confirmado por código ou `curl`. Marque cada item conforme testar; qualquer falha vira uma fix task na próxima sessão.

---

## 1. Teclado — navegação completa

Use só `Tab` / `Shift+Tab` / `Enter` / `Espaço` / `Esc`, sem mouse.

- [ ] **Navbar (desktop)**: `Tab` alcança logo → links (Serviços/Casos/Como funciona/FAQ) → CTA "Fale com a gente", em ordem lógica da esquerda pra direita.
- [ ] **Menu mobile** (< 768px, ou DevTools responsive): `Tab` alcança o botão hambúrguer; `Enter`/`Espaço` abre o `Sheet`; foco entra automaticamente dentro do painel; `Tab`/`Shift+Tab` circulam **só** entre os itens do painel (não escapam pro resto da página); `Esc` fecha e devolve o foco ao botão hambúrguer. *(Pendência registrada em T15.)*
- [ ] **Todo CTA de WhatsApp** é alcançável via `Tab` e ativável via `Enter`: Hero, Navbar (desktop), cada card de "O que entregamos" (5 CTAs "Solicitar orçamento" — confirme que **pelo menos 2 abrem mensagens diferentes**, ver T29), CTA final, ícone de WhatsApp no footer.
- [ ] **FAQ**: `Tab` alcança cada pergunta como um trigger; `Enter`/`Espaço` abre/fecha; abrir uma pergunta com o teclado fecha a anteriormente aberta (mesmo comportamento já testado via clique). *(Pendência registrada em T33.)*
- [ ] **Footer**: `Tab` alcança os links de navegação, os 2 ícones sociais (Instagram, WhatsApp) e não deixa nenhum elemento focável escondido/pulado.
- [ ] Em todo elemento acima, o **indicador de foco é visível** (contorno/anel, não só um sutil muda-de-cor).

## 2. Responsividade — sem scroll horizontal

Testar em DevTools responsive mode (ou redimensionando a janela) nestas larguras: **320px, 375px, 768px, 1024px, 1440px**.

- [ ] Nenhuma delas produz scroll horizontal em nenhuma seção (F12 → toggle device toolbar → checar a barra de rolagem horizontal não aparece).
- [ ] Nenhum texto/elemento corta ou sobrepõe outro em nenhuma dessas larguras (atenção especial: intro — canto superior direito com a lista de serviços; Footer — 3 blocos empilhando; Hero — terminal + headline lado a lado colapsando para coluna).

## 3. Reduced motion

Ativar "reduzir movimento" no SO (Windows: Configurações → Acessibilidade → Efeitos visuais; macOS: Acessibilidade → Media). Recarregar a página em aba anônima nova a cada teste.

- [ ] **Intro**: pula direto pra home, sem rodar a animação (já coberto por teste automatizado, mas confirme visualmente uma vez).
- [ ] **Terminal do Hero**: texto aparece direto, sem digitação.
- [ ] **Terminal grande da `DarkTerminalSection`**: texto aparece direto, sem digitação — **esta é a pendência registrada em T23**, ainda não observada em navegador.
- [ ] **Reveal de scroll** (Pain, AudienceFit, DarkTerminal, Differentiators, Cases, Services, HowItWorks, Faq, FinalCta, Footer): todas aparecem direto ao rolar, sem fade/translate. *(Pendência registrada em T37.)*

## 4. Reveal de scroll (motion normal, sem reduced-motion)

- [ ] Rolar a página do topo ao fim: cada seção abaixo da dobra (a partir de Pain) revela com fade + leve subida, **uma única vez**.
- [ ] Rolar de volta pro topo e descer de novo: a mesma seção **não** re-anima (já revelada permanece visível, sem repetir o efeito).
- [ ] Hero, Navbar e TechStrip **não** têm nenhum efeito de reveal ao rolar (aparecem imediatamente no carregamento). *(Pendência registrada em T37.)*

## 5. Console do navegador

- [ ] Abrir DevTools → Console, recarregar a home: **nenhum erro** (avisos amarelos do React em dev mode, se houver, anotar separadamente — não são necessariamente bloqueantes, mas registre o texto exato). *(Pendência registrada em T36.)*

## 6. Conferência visual geral

- [ ] As 13 seções aparecem na ordem: Navbar → Hero → TechStrip → Pain → AudienceFit → DarkTerminal → Differentiators → Cases → Services → HowItWorks → FAQ → CTA final → Footer.
- [ ] Nenhum texto de placeholder, TODO visível, ou lorem ipsum em nenhuma seção.

---

## Como reportar o resultado

Para cada item marcado como falho, descreva: (1) qual seção/elemento, (2) o que era esperado vs. o que aconteceu, (3) largura/navegador/SO se for algo específico de viewport. Isso vira uma fix task na próxima sessão — nada aqui é corrigido automaticamente até você confirmar o que falhou.
