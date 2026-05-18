# Prototype 0 Lesson Booking DSL

## Thesis

A lesson-booking domain description can feed validation, solving, and generated runtime validation while keeping execution strategy out of the source meaning.

## Context

This is the first prototype for the lab model. It starts with a small scheduling domain because availability, level fit, and double-booking constraints create real semantic pressure without requiring a parser, UI, calendar integration, or optimizer.

Related concepts:

- [[Domain Logic]]
- [[Interpreters And Compilers]]
- [[Erasure]]
- [[Composability]]
- [[Agent Regeneration]]

## Design Sketch

The source-level description is a TypeScript-embedded DSL through `defineSchedule(spec)`.

The semantic core contains:

- teachers, learners, rooms, slots, lesson requests, and assignments
- teacher, learner, and room availability
- learner levels and teacher level coverage
- complete-assignment and double-booking constraints

The same normalized description has three interpreters:

- direct validator for candidate assignments
- small enumerating solver for complete valid schedules
- generated standalone TypeScript-compatible validator source

The generated artefact should erase the DSL builder and source-level coordination machinery. It embeds only the data and runtime validation logic needed to check assignments.

## Prototype Boundary

In scope:

- a minimal TypeScript/Vitest project
- validation rules for availability, level fit, complete assignment, and double-booking
- a tiny brute-force solver for small examples
- generated validator equivalence tests

Out of scope:

- parser or custom syntax
- UI
- calendar integration
- timezones and date arithmetic
- recurring lessons
- optimization, fairness, or rota logic

## Evaluation Tests

Chosen tests:

- [[Evaluation Tests#Redescription Test]]
- [[Evaluation Tests#Target-Change Test]]
- [[Evaluation Tests#Erasure Test]]
- [[Evaluation Tests#Corner-Case Test]]

Acceptance criteria:

- direct validation catches each supported rule failure
- solver outputs only complete valid schedules
- generated validator returns the same validation report as direct validation on representative fixtures
- generated code does not reference `defineSchedule`, `ScheduleSpec`, direct validator functions, solver functions, or rule-level names
- a learner level change is expressed by changing source data, not by changing interpreter logic

## Results

Implemented on 2026-05-13.

The first version passed:

- `pnpm typecheck`
- `pnpm test` with 11 Vitest tests

The prototype supports the initial thesis for small pure constraints: one source description currently drives direct validation, solving, and generated validation. The generated validator is not a second hand-written program; it is derived from the same source meaning and tested against the direct interpreter.

Awkward parts:

- the generated validator still contains generic validation structure, so erasure is only proven against DSL/runtime scaffolding, not against every reusable helper shape
- the solver is intentionally brute force, which is acceptable for semantic pressure but not yet a performance experiment
- effects and state are not tested yet

## Theory Revision

Keep the claim for this narrow domain slice.

Refine it to: a small embedded DSL can make multi-interpreter workflow cheap for pure scheduling constraints, but the next prototype needs either target variation or effectful integration to test whether the separation survives outside pure validation.

## Follow-Up

- Add a second generated target or output shape to make the target-change test stronger.
- Add a redescription challenge set with controlled changes such as room capability, teacher certification expiry, or lesson duration.
- Add an effect-separation experiment for booking persistence, notification, or calendar export.
