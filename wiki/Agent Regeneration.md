# Agent Regeneration

Agent regeneration is the test that implementation meaning can be recovered from semantic materials.

Natural language can act like a source language in the era of coding agents, but it is not automatically a semantics-preserving compiler. Agents need rails: specifications, examples, tests, types, laws, schemas, and interpreters.

## Prototype Pressure

A prototype should test whether an agent can regenerate implementation code without losing domain meaning.

Ask:

- What materials constrain the agent?
- Which implementation details are derivable?
- Which details are unstated but necessary?
- Do generated artefacts diverge semantically or only mechanically?
- Can tests and types act as semantic anchors?

## Failure Signs

- The implementation contains meaning absent from the spec, laws, types, or tests.
- Agents reproduce surface patterns but miss domain constraints.
- Regeneration changes behaviour because the source meaning was under-specified.
- Runtime nouns remain only as social handles for human readers.

## Related

- [[Domain Logic]]
- [[Types Laws And Proofs]]
- [[Relations Over Objects]]
- [[Evaluation Tests]]
