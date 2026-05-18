# Open Questions

Open questions should become prototype pressure, not permanent fog.

## Language Shape

- What is the smallest typed semantic core that can support the first useful experiments?
- How much syntax is needed before syntax starts hiding the semantics?
- Should early prototypes be embedded in an existing host language or use a tiny standalone parser?

## Interpretation

- What makes an interpreter pleasant enough that ordinary users would write one?
- Which intermediate representations should be inspectable by default?
- When does a compiler pass become a domain interpreter rather than compiler infrastructure?

Related: [[Interpreters And Compilers]]

## Types And Laws

- How should laws be represented so they can guide tests, generation, optimization, and documentation?
- Which proof-like structures are cheap enough for the first prototypes?
- What is the minimum law-bearing interface that is more than API folklore?

Related: [[Types Laws And Proofs]]

## Effects And State

- Which effect model best separates [[Domain Logic]] from runtime interpretation in small prototypes?
- When should mutable state be generated from a transition model?
- Which resource facts can move earlier than runtime?

Related: [[Effects And State]]

## Agent Regeneration

- What semantic materials are enough for an agent to regenerate implementation code?
- Which tests are semantic anchors and which are only regression nets?
- How should the lab detect untracked meaning inside generated code?

Related: [[Agent Regeneration]]

## Prototype Selection

- Which first domain is small but semantically rich enough to test the workflow?
- Which experiment best demonstrates redescription power?
- What failure would most quickly disprove the current thesis?
