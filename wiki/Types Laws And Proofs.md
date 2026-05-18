# Types Laws And Proofs

Types are constraints on interpretation. Laws explain what an abstraction preserves.

The lab should treat interfaces, modules, type classes, and capabilities as law-bearing structures, not method lists. A new type should correspond to a new algebra, not merely a new wrapper.

## Prototype Pressure

A prototype should make proof-like structure cheap enough to use: invariants, preconditions, postconditions, equational laws, refinement constraints, resource bounds, totality, and termination where practical.

Ask:

- What are the introduction rules?
- What are the elimination rules?
- What laws must interpreters respect?
- Which laws guide tests or generation?
- Which proofs erase?

## Failure Signs

- An interface lists methods but no algebra.
- A new type adds ceremony without new meaning.
- Tests compensate for invariants that could have been structural.
- Laws live only in comments and cannot guide tools.

## Related

- [[Composability]]
- [[Erasure]]
- [[Freeness]]
- [[Agent Regeneration]]
