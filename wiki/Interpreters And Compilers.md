# Interpreters And Compilers

The compiler is not just a backend. It is the medium that translates specification to design to artefact.

In this lab, interpreters and compilers should be ordinary programming tools. A domain description should support multiple interpretations: execution, simulation, testing, analysis, documentation, migration, optimization, and code generation.

## Prototype Pressure

A prototype should make interpreters small and explicit enough that writing a new one feels like normal programming.

Ask:

- What is the source description?
- What semantic core does it elaborate into?
- Which interpreters consume that core?
- What changes when the target changes?
- What is specialised or erased?

## Failure Signs

- Changing a target requires editing source-level meaning.
- Compiler passes manipulate syntax without preserving semantics.
- Users need to fork infrastructure to add a meaningful interpretation.
- The interpreter is larger than the domain it interprets.

## Related

- [[Domain Logic]]
- [[Effects And State]]
- [[Erasure]]
- [[Prototype Loop]]
