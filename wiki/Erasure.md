# Erasure

Erasure is the destruction of scaffolding once it has done its job.

Types, proofs, staging machinery, effect descriptions, interpreters, and coordination objects may be essential while expressing or compiling a program. They should not survive into the runtime artefact unless the domain itself requires runtime representation.

## Prototype Pressure

A prototype should name what exists only to help humans, agents, or compilers, then prove that this structure disappears from the generated artefact.

Ask:

- Which concepts exist at source time?
- Which concepts exist in the semantic core?
- Which concepts survive into the runtime?
- Why does each surviving concept need runtime representation?

## Failure Signs

- The runtime contains proof witnesses, wrappers, or object structures that no runtime consumer needs.
- "Abstraction" means adding a layer rather than removing assumptions.
- Optimization requires manual parallel code.
- The runtime grows to police abstractions that could have been static.

## Related

- [[Interpreters And Compilers]]
- [[Relations Over Objects]]
- [[Types Laws And Proofs]]
- [[Evaluation Tests]]
