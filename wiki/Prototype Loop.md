# Prototype Loop

Every prototype should be treated as an experiment. The loop is:

claim -> design -> build -> evaluate -> refine

## 1. Claim

State the software idea being tested in one sentence.

Good claims are falsifiable:

- "A domain algebra plus three interpreters will make backend changes local."
- "Law-bearing interfaces will prevent meaningless composition earlier than tests."
- "Generated mutable state can preserve a declarative transition model without runtime scaffolding."

Weak claims are mostly taste:

- "This syntax feels nice."
- "This abstraction is cleaner."

## 2. Design

Choose the smallest language, system, or artefact that can test the claim.

Record:

- the source-level description
- the semantic core or intermediate representation
- the interpreters
- what should erase
- which [[Evaluation Tests]] apply

## 3. Build

Implement only enough to create pressure on the idea. A prototype may be a tiny language, an embedded DSL, a code generator, a type checker, an interpreter, or a workflow with agents constrained by types and tests.

Avoid turning the prototype into a product unless the experiment itself needs product pressure.

## 4. Evaluate

Run the prototype through the chosen [[Evaluation Tests]].

Ask:

- What changed when the domain idea changed?
- What changed when the target changed?
- What scaffolding remained at runtime?
- Which compositions failed early?
- Which failures were only caught by tests?
- Could an agent regenerate the implementation without losing meaning?

## 5. Refine

Record what the prototype taught.

Possible outcomes:

- keep the claim
- narrow the claim
- reject the claim
- split the claim into smaller claims
- promote a pattern into a reusable lab tool

The refinement should update [[Decision Log]], [[Open Questions]], or a concept page.
