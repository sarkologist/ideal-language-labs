# Project Charter

Ideal Language Labs exists to test a philosophy of software by building prototype languages and systems.

The work starts from the claim that software should express intent rather than merely enact behaviour. Code should be closer to a precise statement of domain meaning than to a hand-written execution trace.

## Goal

Build small prototypes that test whether software can be organized around:

- domain descriptions before runtime behaviour
- [[Composability]] of specifications before implementation
- ordinary, explicit [[Interpreters And Compilers]]
- [[Erasure]] of proof, staging, and coordination scaffolding
- law-bearing abstractions rather than decorative wrappers
- regenerable implementation artefacts constrained by types, tests, laws, and examples

## Anti-Goals

- Do not build one final ideal language.
- Do not optimize for syntax beauty before redescription power.
- Do not hide implementation confusion behind abstraction names.
- Do not make runtime machinery police facts that could have been proved, specialised, or erased.
- Do not treat prototype code as sacred. The theory is allowed to improve and make earlier code obsolete.

## Research Style

The lab should prefer prototypes that are small enough to throw away, precise enough to evaluate, and honest enough to fail.

Each prototype should connect a concept such as [[Freeness]], [[Erasure]], or [[Agent Regeneration]] to a concrete design pressure. The question is not "is this elegant?" but "what did this make sayable, composable, or erasable?"

## Definition Of Progress

Progress means one of:

- a prototype makes a claim more precise
- an evaluation test exposes a weakness
- a design idea survives a target change
- a failed experiment removes a tempting but false path
- a concept becomes easier to implement, explain, or regenerate
