# Prototype Tracks

Prototype tracks are recurring experiment families. They are not product roadmaps. Each track exists to stress a theory of software.

## Tiny Domain Algebra

Build a small algebra for a domain with real semantics: units, permissions, forms, workflows, state machines, financial rules, scheduling, or document transformations.

Pressure:

- Can the domain idea be stated without choosing execution strategy?
- Can laws be attached to the algebra?
- Can multiple interpreters share the same source?

Related: [[Domain Logic]], [[Types Laws And Proofs]]

## Three-Interpreter Workflow

Take one domain description and interpret it at least three ways:

- execute
- simulate or test
- generate specialised code

Pressure:

- Does target change remain local?
- Does the generated artefact erase interpretation scaffolding?

Related: [[Interpreters And Compilers]], [[Erasure]]

## Effect Separation

Describe effectful work without collapsing domain meaning into one runtime interpretation.

Pressure:

- Can effects be handled by explicit interpreters?
- Can pure domain transformations remain visible?
- Can resource, failure, and state decisions move earlier when information allows?

Related: [[Effects And State]], [[Domain Logic]]

## Law-Bearing Interfaces

Prototype interfaces, type classes, modules, or capabilities that include laws as programmable material.

Pressure:

- Can illegal interpretations fail before runtime?
- Can laws guide optimization, generation, or testing?
- Does the abstraction have a real algebra?

Related: [[Types Laws And Proofs]], [[Composability]]

## Relations Before Objects

Represent a domain primarily through relations, transformations, and constraints. Introduce objects only as coordination handles at boundaries.

Pressure:

- Which objects are semantic?
- Which objects exist only for ownership, UI, persistence, API shape, or compilation?
- Can compile-time objects erase?

Related: [[Relations Over Objects]], [[Erasure]]

## Agent-Constrained Regeneration

Treat prompts, specs, examples, tests, types, and generated code as one semantic system.

Pressure:

- Can an agent regenerate implementation from source meaning?
- Which constraints prevent hallucinated implementation-space structure?
- Which parts of the implementation are untracked meaning?

Related: [[Agent Regeneration]]

## Redescription Challenge Set

Maintain a small suite of prototype tasks where the domain changes in controlled ways.

Pressure:

- Do small conceptual changes stay small in source?
- Does generated code diverge only through derivation?
- Which abstractions survive repeated redescription?

Related: [[Freeness]], [[Composability]], [[Evaluation Tests]]
