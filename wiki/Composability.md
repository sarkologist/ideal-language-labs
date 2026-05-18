# Composability

Composability means descriptions can factor through other descriptions before implementation.

The lab starts from the claim that only specifications compose cleanly. Implementations can be reused, but they often carry accidental decisions that should have been re-derived from meaning.

## Prototype Pressure

A prototype should show that separately meaningful specifications can combine before choosing an execution strategy.

Ask:

- What composes: functions, laws, interpreters, domain descriptions, generated artefacts, or runtime objects?
- Does composition happen before or after implementation?
- Can the implementation be re-derived after composition?

## Failure Signs

- Reuse is only an opaque subroutine call.
- Composition requires knowing irrelevant implementation details.
- Adding a case breaks unrelated consumers.
- Generated code duplicates meaning without a shared specification.

## Related

- [[Freeness]]
- [[Interpreters And Compilers]]
- [[Types Laws And Proofs]]
- [[Evaluation Tests]]
