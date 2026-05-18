# Ideal Language Labs

This wiki is the operating system for Ideal Language Labs: a place to turn ideas about software into small prototype languages and systems, then use the results to refine the ideas.

The project is not trying to design one final ideal language. It is trying to learn which language mechanisms make software more direct, composable, erasable, and regenerable.

## Start Here

- [[Project Charter]]
- [[Prototype Loop]]
- [[Evaluation Tests]]
- [[Prototype Tracks]]
- [[Experiment Template]]
- [[Decision Log]]
- [[Open Questions]]

## References

- [[Software Language Design Brief]]

## Current Experiments

- [[Prototype 0 Lesson Booking DSL]]

## Core Concepts

- [[Freeness]]
- [[Composability]]
- [[Erasure]]
- [[Interpreters And Compilers]]
- [[Domain Logic]]
- [[Effects And State]]
- [[Types Laws And Proofs]]
- [[Relations Over Objects]]
- [[Orthogonality]]
- [[Agent Regeneration]]

## Current Thesis

Software should express intent before execution strategy. A useful language system should let domain descriptions, laws, effects, and interpreters compose before committing to a runtime artefact.

The central experiment is whether prototypes can make the following workflow feel normal:

1. State a domain algebra or specification.
2. State the laws that preserve meaning.
3. Interpret the same description as execution, simulation, tests, analysis, documentation, migration, or generated code.
4. Specialise and erase scaffolding before runtime.
5. Change a backend or target by changing an interpreter, not the source-level meaning.

## Lab Rule

Every prototype should answer a question. If a prototype does not change, sharpen, or falsify a claim, it is just implementation drift.
