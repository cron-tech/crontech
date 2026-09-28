# LESSONS - auto-maintained by scripts/lessons.py

> Machine-owned. Do NOT hand-edit. Changes are overwritten on the next `lessons.py` write.
> Canonical state lives in `.specs/lessons.json`. Edit lessons only via the script.
> promote_threshold=2 distinct features · window_days=45 · quarantine_threshold=2

## Confirmed (load these at Specify/Design)

Corroborated across multiple features. Safe to apply as guidance.

_none_

## Candidates (under observation - do NOT load as guidance yet)

Seen once or not yet corroborated. Tracked, not trusted.

### L-001 - When testing a conditional-render block, assert the wrapper/container element itself is absent in the empty case (e.g. via a stable test id), not just that specific child elements have zero count - a zero-count assertion cannot tell an absent wrapper from an empty one.
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `component-tests` · harmful: 0
- features: landing-page
- evidence: src/components/sections/differentiators.test.tsx:9-20 (mutant: differentiators.tsx:47 length>0 -> length>=0) (component-tests)
- last seen: 2026-09-28T00:28:36Z

### L-002 - When checking that a home works with JS disabled, inspect every component that sets visibility via inline styles (e.g. animation libraries applying opacity/transform inline), not just the component the AC's prose happens to name.
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `no-js-visibility` · harmful: 0
- features: landing-page
- evidence: LP-01 AC6 (no-js-visibility)
- last seen: 2026-09-28T00:54:41Z

## Quarantined (failed when applied - ignore)

A confirmed lesson that recurred alongside failure. Kept for the maintainer to review.

_none_
