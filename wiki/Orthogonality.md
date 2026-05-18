# Orthogonality

Orthogonality means solved concerns stop requiring upkeep from unrelated code.

Modularity manages ownership, deployment, and incomplete understanding. Orthogonality is stricter: once a concern is truly handled, other parts of the system should not need to remember it.

## Prototype Pressure

A prototype should test whether abstractions remove dependency and change propagation rather than merely moving it behind a boundary.

Ask:

- Which concerns should be oblivious to each other?
- What information do consumers still need to remember?
- Which changes propagate too far?
- Is the module boundary about ownership or meaning?

## Failure Signs

- Consumers must remember irrelevant implementation facts.
- A solved concern leaks through naming, configuration, or call order.
- Module boundaries preserve confusion rather than eliminating it.
- Ownership boundaries are mistaken for semantic boundaries.

## Related

- [[Freeness]]
- [[Composability]]
- [[Effects And State]]
- [[Evaluation Tests]]
