# Domain Logic

Domain logic is the meaning that should survive across interpretations.

It is not the same as control flow, storage layout, UI shape, protocol details, or deployment mechanics. Those may be necessary artefacts, but they should not be confused with the domain idea.

## Prototype Pressure

A prototype should separate the domain description from computational effect and target-specific execution choices.

Ask:

- What must remain true across all interpreters?
- Which facts belong to the domain?
- Which facts belong to execution strategy?
- What changes when the backend changes?

## Failure Signs

- Business rules are embedded in framework callbacks.
- A storage migration changes source-level meaning.
- Tests are the only place where domain invariants are stated.
- The implementation can no longer be regenerated from the semantic materials.

## Related

- [[Effects And State]]
- [[Interpreters And Compilers]]
- [[Agent Regeneration]]
- [[Freeness]]
