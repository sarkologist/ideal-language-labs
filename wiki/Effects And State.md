# Effects And State

Effects let domain logic touch the world. State is an execution strategy, not the natural form of thought.

The lab should test ways to describe effectful programs without collapsing meaning into one runtime interpretation too early. Mutable state is acceptable when generated from a clearer model, but suspicious when authored as the primary domain expression.

## Prototype Pressure

A prototype should show whether effects can be represented as descriptions interpreted by handlers, compilers, or natural transformations.

Ask:

- Which part is pure domain transformation?
- Which part is effect description?
- Which handler chooses runtime behaviour?
- Which state can be generated from laws or transitions?
- Which resource facts can move earlier than runtime?

## Failure Signs

- Side effects obscure domain invariants.
- Shared mutable state forces unrelated code to coordinate.
- Failure handling is a runtime convention rather than a semantic choice.
- Resource management remains general even when it could be specialised.

## Related

- [[Domain Logic]]
- [[Interpreters And Compilers]]
- [[Erasure]]
- [[Orthogonality]]
