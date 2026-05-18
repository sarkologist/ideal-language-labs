# Freeness

Freeness means dropping irrelevant assumptions so the relevant relations remain free to compose.

In this lab, source-level freedom is not "anything goes." The source should be free exactly where the domain has meaningful degrees of freedom, and constrained where the domain has no interpretation for a choice.

## Prototype Pressure

A prototype should demonstrate freeness by making semantic redescription cheap.

Ask:

- What assumptions does the source force too early?
- Which choices are meaningful in the domain?
- Which choices exist only because of the current backend, storage model, or runtime?

## Failure Signs

- The source can express nonsense the domain cannot interpret.
- Backend details appear in domain descriptions.
- A small semantic change causes unrelated source changes.
- Extension requires adding toggles instead of composing primitives.

## Related

- [[Composability]]
- [[Domain Logic]]
- [[Evaluation Tests]]
- [[Orthogonality]]
