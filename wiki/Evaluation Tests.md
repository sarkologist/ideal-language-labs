# Evaluation Tests

Evaluation tests are the lab's pressure gauges. A prototype does not need to pass every test, but it should name which tests it is trying to satisfy.

## Redescription Test

When the domain idea changes slightly, the source-level change should be proportional to the conceptual change.

Failure sign: a small meaning change causes sprawling implementation edits.

## Target-Change Test

Changing the compilation target should require changing an interpreter or backend, not the domain program.

Failure sign: source-level meaning is entangled with target details.

## Erasure Test

Semantic scaffolding, proof witnesses, coordination objects, and staging machinery should vanish from the runtime unless the domain requires them.

Failure sign: runtime artefacts preserve concepts that only existed to help the compiler, human, or agent.

Related: [[Erasure]]

## Composition Test

Independently meaningful specifications should compose before implementation. The implementation should then be re-derived.

Failure sign: reuse happens only through opaque runtime calls.

Related: [[Composability]]

## Lawfulness Test

Every abstraction should have laws or an algebra.

Failure sign: a wrapper, interface, or object name adds no meaningful introduction rules, elimination rules, or preserved transformations.

Related: [[Types Laws And Proofs]]

## Corner-Case Test

Special cases should fall into place through the abstraction.

Failure sign: each edge case requires bespoke handling unrelated to the central model.

## Agent-Regeneration Test

An agent should be able to regenerate implementation code from the specification, tests, types, and laws without losing meaning.

Failure sign: the implementation contains unstated meaning that cannot be recovered from the semantic materials.

Related: [[Agent Regeneration]]

## Freeness Test

Source-level degrees of freedom should correspond to meaningful domain degrees of freedom.

Failure sign: the source can express nonsense that the domain cannot interpret.

Related: [[Freeness]]

## Obliviousness Test

A solved concern should not require attention from unrelated code.

Failure sign: consumers must remember irrelevant details.

Related: [[Orthogonality]]

## Performance Test

Optimization should come from respecting less over-specified semantics, not from hand-maintaining a second low-level program.

Failure sign: performance requires duplicating the program in a lower-level style and keeping both versions aligned by discipline.
