# Decision Log

Record decisions that change how the lab works or how the theory is interpreted.

## 2026-05-13: Use A Prototype Lab Model

Decision: Treat Ideal Language Labs as an iterative research lab, not a project to design one final ideal language.

Rationale: The brief argues that a fixed level is already suspicious. The lab should therefore use prototypes to test language-system ideas, refine the theory, and discard failed shapes.

Consequences:

- prototype results matter more than preserving early architecture
- wiki pages should connect concepts to evaluation pressure
- future code should be organized around experiments and interpreters

## 2026-05-13: Keep The Wiki In A Separate Git Repo

Decision: Track the wiki in its own nested repository under `wiki/`.

Rationale: The wiki is a living research notebook and operating system. Keeping it separate lets it evolve with its own history while the root project can later contain prototype code.

Consequences:

- the root repo ignores `/wiki/`
- wiki commits are made from inside `wiki/`
- the root repo should not track wiki internals
