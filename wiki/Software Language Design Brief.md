# Software Language Design Brief

Reference: imported from the software language design brief. Treat this as a source brief for orientation and cross-checking, not as a standalone implementation plan.

This is a distilled implementation brief for an agent trying to build the ideal programming language implied by these notes. It is not a neutral survey of language design. It is a translation of the [[software]] philosophy into design constraints, anti-goals, and evaluation tests.

The first challenge to the premise: the ideal programming language is probably not a single fixed-level language. A fixed level is already a symptom of failure. The aim is a language system where abstractions can move between levels through interpretation, specialisation, and erasure, so that the programmer should not have to choose between "high-level expression" and "low-level control" as opposing goods.

## Core Thesis

Software should express intent, not merely enact behaviour. Bad code [[programming is miming, not writing|mimes]] [[domain logic]] through implementation patterns and asks the reader to infer the idea from a behavioural performance.

The ideal language should make the domain idea directly sayable, then compile, specialise, and erase the auxiliary structure needed to say it. Source code should be closer to a precise statement of intent than to a hand-written execution trace.

[[complexity]] is mostly dependency and change propagation caused by accidental [[degrees of freedom]]. Bad code is often overfitted implementation-space: it does the current job too specifically, so changes in requirements force unrelated changes in code.

[[abstraction]] is not hiding, wrapping, noun-making, or generalising. Proper abstraction is [[freeness]]: dropping irrelevant assumptions so the relevant relations remain free to [[composability|compose]].

Only specifications compose. Implementations should be re-derived. The language should let the programmer compose specifications, laws, constraints, and domain descriptions, then derive executable implementations through explicit interpreters and compilers.

The [[compiler]] is not just a backend. It is the missing medium of software. A compiler translates specification to design to artefact, and a compiler is a specialised [[interpretation|interpreter]]. Interpreters should be ordinary programming tools, not priestly infrastructure.

The runtime is where un-erased confusion remains. Proper abstraction has no runtime representation unless the domain itself requires runtime representation. "Zero-cost abstraction" should be treated as redundant: if it is truly an abstraction, the representational scaffolding should disappear.

## Vocabulary For The Implementing Agent

- [[freeness]]: the target should not restrict the source's meaningful degrees of freedom. Source code may contain more structure than a specification, but it should contain no spurious relations that do not exist in the specification.
- [[composability]]: descriptions should factor through other descriptions. Reuse is not just subroutine calls; reuse is also re-description before erasure.
- [[orthogonality]]: solved concerns should stop requiring upkeep. [[modularity contra orthogonality|Modularity]] is a fallback for ownership and maintenance; orthogonality is the higher ideal.
- [[domain logic]]: the business or problem logic that should be preserved across interpretations. It should be separated from [[computational effect|computational effects]] and target-specific execution decisions.
- [[erasure]]: the destruction of proof, coordination, type, staging, or interpretation machinery once it has done its job.
- [[objects vs relationships|relations over objects]]: objecthood is often only a coordination handle. The language should preserve relationships first and introduce objects only where they help coordination, boundaries, persistence, or compilation.
- [[static typing|typing]]: a coarse-graining of degrees of freedom. Types cut down possible interpretations, especially for future readers, tools, and coding agents.
- [[meaning as relationships]]: semantics lives in preserved relationships and legal transformations, not in isolated names or runtime nouns.

## What The Language Should Make Easy

The language should make it easy to state what is meant, state which transformations preserve meaning, and defer how the meaning is executed until a later interpretation stage.

It should support first-class domain descriptions. A user should be able to write a small language, algebra, combinator system, state machine, rule set, or table of laws without dropping into low-level control flow.

It should support explicit interpreters. A domain description should have multiple possible interpretations: production execution, testing, simulation, optimisation, analysis, documentation, migration, and code generation.

It should support staged compilation and partial evaluation. High-level constructs, type classes, objects, higher-order functions, proof witnesses, and effect descriptions may exist during generation, but should not burden the generated artefact when they are not semantically needed at runtime.

It should support specialisation as a normal act. When the compilation target changes, the interpreter should change, not the source program.

It should support law-bearing abstractions. A type class, interface, module signature, or capability should not merely list methods. It should state laws, introduction rules, elimination rules, and the intended algebra.

It should make illegal interpretations uncomposable. The target is stronger than "make illegal states unrepresentable": make things which cannot be interpreted consistently fail to compose in the first place.

It should make semantic drift visible. If duplicated generated code comes from the same specification, duplication is not the enemy. The enemy is untracked divergence in meaning.

It should support programs that manipulate programs before erasure. The language should allow re-description, transformation, optimisation, and fusion at meaningful intermediate stages rather than forcing all reuse through opaque runtime calls.

It should let users expose combinatorial APIs instead of ad hoc features. Features should be first-class compositions, not a pile of toggles.

It should make interpreters small enough and pleasant enough that writing one is standard fare. Much software malaise comes from being bad at writing compilers and interpreters.

## Architecture Sketch

The language system should have a stack like:

- intent
- domain specification
- semantic core
- staged interpreters
- specialised source or IR
- executable artefact

The surface language should be syntax over semantics, not syntax over runtime behaviour. [[grammar]] is a linearisation of an AST, but the AST should itself elaborate into a semantic tree whose conceptual boundaries are explicit.

The semantic core should be small, typed, and relation-preserving. It should prefer introduction and elimination rules over nominal taxonomy. "There are no types. Only introduction and elimination rules" should be taken as a design warning against decorative type labels.

The effect system should separate [[domain logic]] from [[computational effect]]. Algebraic effects, effect handlers, free-monad-like descriptions, or equivalent machinery should let users describe effectful programs without collapsing meaning into one runtime interpretation too early.

State should be treated as an execution strategy, not as the natural form of thought. [[mutation|Shared state is contagious]], but state itself is not evil. The compiler should translate higher-level descriptions into procedural semantics where that is the right target.

The module system should distinguish source and artefact. Compiled artefacts should be modular because ownership and deployment are real. Source code should strive for orthogonality because solved concerns should be oblivious to their surroundings.

The compiler should be extensible by ordinary users. The language should make intermediate representations inspectable and transformable without forcing users into macro systems that manipulate only the presentation of semantics.

The backend should optimise by respecting specified semantics, not by guessing intent from behaviour. Performance is what can be gained by not over-specifying.

The runtime should be small and suspicious. Runtime checks are acceptable when the relevant fact cannot yet be proved, specialised, or erased, but the runtime should not act as abstraction police for concepts that could have been made static.

## Types, Laws, And Proof-Like Structure

Types are not bureaucracy. They are executable constraints on interpretation. To dislike types is often to dislike expressing one's thinking about code in terms of programs.

A new type should correspond to a new algebra, not merely a new wrapper. No newtypes without a corresponding algebra.

Interfaces should be law-bearing. Haskell type classes with laws are closer to the target than ordinary API contracts, but the language should make the laws part of the programmable object rather than folklore.

The language should make common proof-like structure cheap: invariants, preconditions, postconditions, equational laws, refinement constraints, resource bounds, totality, and termination where practical.

Proofs should erase. A compiler is where you are done reasoning and want to destroy proved properties from the runtime.

Do not aim for universal formal verification of arbitrary old software. Aim for making the right programs worth proving in the first place. Most of the work is in stating the theorem.

Tests remain useful, especially as semantic anchors for agents and humans, but tests should not compensate for a language that cannot express the idea. Tests are a fallback when meaning has not been made structural enough.

## Syntax

Syntax sugar should delineate conceptual boundaries. Semantics sugar is preferable to syntax sugar.

Syntax should be congruent with semantics. If two expressions look parallel, their meanings should compose in parallel. If an expression creates a conceptual boundary, the syntax should make that boundary visible.

The language should minimise conceptual punning. A construct should not mean one thing to the compiler, another to the runtime, another to the framework, and another to the human reader unless these interpretations are explicitly related.

The surface should support notation-like combinators. Combinators are often preferable to heavy DSLs because they let understanding reset at multiple levels, like mathematical notation. But DSLs are justified when they precisely state domain constraints and leave computational semantics to interpreters.

The syntax should not overfit the current backend. If changing the target forces source rewrites, the language has confused source-level meaning with target-level accident.

## Effects, State, And Execution

Pure code is the default model for domain transformations because function composition composes transformations.

Effects adorn domain logic so programs can touch the world. Effects should respect pure transformations and should be interpreted through explicit handlers or natural transformations.

Side effects are less disciplined computational effects. The question is not merely whether something is observable, but whether it is relevant to the domain's freeness.

Mutable state should usually be generated, not authored. The programmer should describe the state transition system or invariant structure; the compiler should derive efficient procedural behaviour.

Resource management should move earlier when possible. If resource usage can be determined before execution, it should not require a general runtime mechanism.

Failure should occur as early as the relevant information permits. A compiler is partly a machine for crashing as soon as possible.

## Objects, Modules, And Ownership

Object-orientation is suspicious when it starts from nouns. OOP biases thought toward objects when the real structure often lives in relations.

Objects are acceptable as coordination handles at boundaries: APIs, persistence, UI, schemas, protocol edges, documentation, and human-agent shared handles.

Objects should retreat from the runtime interior when they have done their coordination work. The best object may be a compile-time object that gets erased.

Encapsulation manages visibility. It is not abstraction. Hiding confusion does not remove the dependency structure caused by confusion.

Modules are for ownership, deployment, and incomplete understanding. They rot because the world keeps pressing on them. Orthogonal abstractions should not rot because they have stopped caring about irrelevant context.

The language should make ownership explicit where ownership is necessary, but should not confuse ownership with meaning.

## Libraries, Frameworks, And Language Workbenches

A library cooperates. A framework swallows. A programming language is dangerously framework-like, so the language must be unusually careful not to capture the user's creativity in its own ontology.

Compilers should erase everything. Libraries should expose everything. Nothing in between is the warning sign: if a library hides too much, it becomes a bad framework; if a compiler leaves too much, it becomes a runtime burden.

The language should be a language workbench more than a sealed language. Users should be able to build small semantic layers, interpreters, and compilation passes without needing to fork the compiler.

Extensibility must preserve semantics. Macro systems that rewrite syntax without respecting semantic structure are too weak and too dangerous.

## Coding Agents

In the era of coding agents, natural language becomes a serious source language, but it is not a semantics-preserving compiler.

The ideal language should treat prompts, specifications, examples, tests, schemas, types, and code as parts of one semantic system. The agent should elaborate within rails, not hallucinate implementation-space structure.

The language should make intent regenerable. Good software is code that can be regenerated without losing its meaning.

Types and tests should also constrain agents. A type system narrows what an agent can plausibly mean by a change. Tests are semantic anchors for a stochastic compiler.

Agent-written code should push objecthood toward coordination boundaries and erase more objecthood internally. If the immediate reader of much code is increasingly a tool, runtime nouns become less necessary as social handles.

## Anti-Goals

- Do not build a language whose main abstraction mechanism is hiding.
- Do not build a language where the core reuse mechanism is an opaque subroutine call.
- Do not build a language that forces domain logic, effects, and target-specific execution decisions into the same code.
- Do not build a language where changing backend, storage, runtime, UI, or deployment target requires perturbing source-level meaning.
- Do not build a language where syntax sugar creates new puns rather than marking conceptual boundaries.
- Do not build a language where feature growth means adding ad hoc features rather than exposing new compositional primitives.
- Do not build a language whose type system is mostly nominal decoration.
- Do not build a language that preserves compile-time scaffolding at runtime unless the domain requires it.
- Do not build a language where APIs expose behaviour instead of semantics.
- Do not build a language that treats "readability" as a substitute for expression of semantics.
- Do not build a language that needs a large runtime to police abstractions that should have been erased.
- Do not build a language where "best practices" compensate for the inability to say what is meant.

## Evaluation Tests

Redescription test: when the domain idea changes slightly, the source-level change should be proportional to the conceptual change. A small semantic redescription should not cause a sprawling implementation redescription.

Target-change test: changing the compilation target should require changing an interpreter or backend, not the source program.

Erasure test: semantic scaffolding, proof witnesses, coordination objects, and staging machinery should vanish from the runtime unless they are semantically required there.

Composition test: independently meaningful specifications should compose before implementation. The implementation should then be re-derived.

Lawfulness test: every abstraction should have laws or an algebra. If no laws can be stated, suspect a mere wrapper, convention, or object name.

Corner-case test: special cases should fall into place through the abstraction. If every corner case needs bespoke handling, the abstraction is leaking or the model is wrong.

Agent-regeneration test: an agent should be able to regenerate implementation code from the specification, tests, types, and laws without losing meaning.

Freeness test: source-level degrees of freedom should correspond to meaningful domain degrees of freedom. If the source can express nonsense the domain cannot interpret, the language is too free in the wrong place.

Obliviousness test: a solved concern should not require attention from unrelated code. If consumers must remember irrelevant details, the abstraction has failed.

Performance test: optimisation should come from respecting less over-specified semantics, not from hand-maintaining a second low-level program.

## Product Shape

A plausible first implementation is not a full industrial language. It is a small typed core plus a pleasant way to define domain algebras, handlers, interpreters, laws, and staged compilation passes.

The first prototype should prove the workflow:

1. Define a tiny domain algebra.
2. Write laws for the algebra.
3. Compose a domain program without choosing a runtime interpretation too early.
4. Interpret the same program in at least three ways: execute, test/simulate, and generate specialised code.
5. Erase the high-level scaffolding from the generated artefact.
6. Change the backend without changing the domain program.

The first killer feature should be not syntax beauty but redescription power: the user changes meaning once and the derived implementation follows.

## Source Trail

Core notes: [[software]], [[abstraction]], [[freeness]], [[composability]], [[modularity contra orthogonality]], [[compiler]], [[interpretation]], [[domain logic]], [[free monad]], [[pure code]], [[computational effect]], [[mutation]], [[side effects]], [[static typing]], [[software in the era of coding agents]], [[programming is miming, not writing]], [[expressive code]], [[objects vs relationships]], [[meaning as relationships]], [[interfaces (and APIs)]], [[grammar]], [[source code]], [[software complexity]].

Imported fragments: [[from nvalt/Only specifications compose. Implementations cannot, and should not. Rather you first compose the specifications, then re-derive the implementation.]], [[from nvalt/overspecification, solution- interpreters]], [[from nvalt/Barbell strategy_ Separate the thing into specification and implementation, avoid the muddled middle.]], [[from nvalt/When the compilation target changes, the interpreter should change, not the source code!]], [[from nvalt/Compilers should erase everything. Libraries should expose everything. Nothing in between!]], [[from nvalt/proper abstraction has no runtime representation]], [[from nvalt/the runtime should be erased]], [[from nvalt/there is no compile time or runtime]], [[from nvalt/combinators vs DSLs, compilers vs libraries]], [[from nvalt/no newtypes without a corresponding algebra]], [[from nvalt/There are no types. Only introduction and elimination rules.]], [[from nvalt/to dislike types means to dislike expressing your thinking about code in terms of programs]], [[from nvalt/instead of implementing features, expose a combinatorial API]], [[from nvalt/Features-as-code.]], [[from nvalt/all bad code is overly specialised interpreters]], [[from nvalt/i am thinking, it is not about high and low level languages being better or worse, but the very idea that a language has a fixed level itself is the problem]].
