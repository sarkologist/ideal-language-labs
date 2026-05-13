# Ideal Language Labs

Ideal Language Labs is a prototype-driven research project for testing ideas about software language design.

The goal is not to build one ideal programming language once and for all. The goal is to build small languages, systems, interpreters, and compilation experiments that put claims about software under pressure. Each prototype should teach us something concrete about intent, domain logic, effects, typing, erasure, composition, and agent-assisted regeneration.

The project wiki lives in a separate git repository at `wiki/`.

## Working Method

1. Start with a claim about software.
2. Build the smallest prototype that can make the claim succeed or fail.
3. Evaluate it against explicit tests.
4. Record what changed in the theory.
5. Use the next prototype to sharpen the idea.

The project should stay suspicious of fixed levels, hidden implementation machinery, and abstractions that survive at runtime after their semantic work is done.
