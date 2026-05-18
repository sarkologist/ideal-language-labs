import { describe, expect, it } from "vitest";
import { defineSchedule } from "../src/index.js";
import type { Assignment, ScheduleSpec, ValidationReport } from "../src/index.js";

describe("lesson-booking validator", () => {
  it("accepts a complete valid schedule", () => {
    const program = defineSchedule(baseSpec());

    expect(program.validate(validAssignments())).toEqual({
      valid: true,
      issues: [],
    });
  });

  it("reports teacher availability violations", () => {
    const spec = withTeacher(baseSpec(), "ada", { available: ["mon-09"] });
    const report = defineSchedule(spec).validate([
      { requestId: "req-ben", teacherId: "ada", roomId: "blue", slotId: "mon-10" },
      { requestId: "req-cy", teacherId: "grace", roomId: "green", slotId: "mon-09" },
    ]);

    expect(report.issues).toContainEqual(
      expect.objectContaining({
        code: "teacher-unavailable",
        assignmentIndex: 0,
        teacherId: "ada",
        slotId: "mon-10",
      }),
    );
  });

  it("reports learner availability violations", () => {
    const spec = withLearner(baseSpec(), "ben", { available: ["mon-09"] });
    const report = defineSchedule(spec).validate([
      { requestId: "req-ben", teacherId: "ada", roomId: "blue", slotId: "mon-10" },
      { requestId: "req-cy", teacherId: "grace", roomId: "green", slotId: "mon-09" },
    ]);

    expect(report.issues).toContainEqual(
      expect.objectContaining({
        code: "learner-unavailable",
        assignmentIndex: 0,
        learnerId: "ben",
        slotId: "mon-10",
      }),
    );
  });

  it("reports room availability violations", () => {
    const spec = withRoom(baseSpec(), "blue", { available: ["mon-09"] });
    const report = defineSchedule(spec).validate([
      { requestId: "req-ben", teacherId: "ada", roomId: "blue", slotId: "mon-10" },
      { requestId: "req-cy", teacherId: "grace", roomId: "green", slotId: "mon-09" },
    ]);

    expect(report.issues).toContainEqual(
      expect.objectContaining({
        code: "room-unavailable",
        assignmentIndex: 0,
        roomId: "blue",
        slotId: "mon-10",
      }),
    );
  });

  it("reports teacher and learner level mismatches", () => {
    const spec = withTeacher(baseSpec(), "ada", { levels: ["advanced"] });
    const report = defineSchedule(spec).validate([
      { requestId: "req-ben", teacherId: "ada", roomId: "blue", slotId: "mon-09" },
      { requestId: "req-cy", teacherId: "grace", roomId: "green", slotId: "mon-10" },
    ]);

    expect(report.issues).toContainEqual(
      expect.objectContaining({
        code: "teacher-level-mismatch",
        assignmentIndex: 0,
        teacherId: "ada",
        learnerId: "ben",
      }),
    );
  });

  it("reports teacher, learner, and room double-bookings", () => {
    const teacherReport = defineSchedule(baseSpec()).validate([
      { requestId: "req-ben", teacherId: "ada", roomId: "blue", slotId: "mon-09" },
      { requestId: "req-cy", teacherId: "ada", roomId: "green", slotId: "mon-09" },
    ]);
    expect(teacherReport.issues).toContainEqual(
      expect.objectContaining({
        code: "teacher-double-booked",
        assignmentIndex: 1,
        conflictWithIndex: 0,
        teacherId: "ada",
        slotId: "mon-09",
      }),
    );

    const learnerReport = defineSchedule(twoRequestsForSameLearnerSpec()).validate([
      { requestId: "req-ben-1", teacherId: "ada", roomId: "blue", slotId: "mon-09" },
      { requestId: "req-ben-2", teacherId: "grace", roomId: "green", slotId: "mon-09" },
    ]);
    expect(learnerReport.issues).toContainEqual(
      expect.objectContaining({
        code: "learner-double-booked",
        assignmentIndex: 1,
        conflictWithIndex: 0,
        learnerId: "ben",
        slotId: "mon-09",
      }),
    );

    const roomReport = defineSchedule(baseSpec()).validate([
      { requestId: "req-ben", teacherId: "ada", roomId: "blue", slotId: "mon-09" },
      { requestId: "req-cy", teacherId: "grace", roomId: "blue", slotId: "mon-09" },
    ]);
    expect(roomReport.issues).toContainEqual(
      expect.objectContaining({
        code: "room-double-booked",
        assignmentIndex: 1,
        conflictWithIndex: 0,
        roomId: "blue",
        slotId: "mon-09",
      }),
    );
  });

  it("requires each lesson request to be assigned exactly once", () => {
    const missingReport = defineSchedule(baseSpec()).validate([
      { requestId: "req-ben", teacherId: "ada", roomId: "blue", slotId: "mon-09" },
    ]);
    expect(missingReport.issues).toContainEqual(
      expect.objectContaining({
        code: "missing-request",
        requestId: "req-cy",
      }),
    );

    const duplicateReport = defineSchedule(baseSpec()).validate([
      { requestId: "req-ben", teacherId: "ada", roomId: "blue", slotId: "mon-09" },
      { requestId: "req-ben", teacherId: "grace", roomId: "green", slotId: "mon-10" },
      { requestId: "req-cy", teacherId: "grace", roomId: "blue", slotId: "mon-09" },
    ]);
    expect(duplicateReport.issues).toContainEqual(
      expect.objectContaining({
        code: "request-duplicated",
        assignmentIndex: 1,
        requestId: "req-ben",
      }),
    );
  });
});

describe("lesson-booking solver", () => {
  it("enumerates complete valid schedules from the same source description", () => {
    const program = defineSchedule(baseSpec());
    const schedules = program.solve({ limit: 5 });

    expect(schedules.length).toBeGreaterThan(0);
    for (const schedule of schedules) {
      expect(schedule.map((assignment) => assignment.requestId).sort()).toEqual([
        "req-ben",
        "req-cy",
      ]);
      expect(program.validate(schedule)).toEqual({ valid: true, issues: [] });
    }
  });
});

describe("generated validator", () => {
  it("matches direct validation for representative schedules", async () => {
    const cases: Array<{ readonly spec: ScheduleSpec; readonly assignments: readonly Assignment[] }> =
      [
        { spec: baseSpec(), assignments: validAssignments() },
        {
          spec: withTeacher(baseSpec(), "ada", { available: ["mon-09"] }),
          assignments: [
            { requestId: "req-ben", teacherId: "ada", roomId: "blue", slotId: "mon-10" },
            { requestId: "req-cy", teacherId: "grace", roomId: "green", slotId: "mon-09" },
          ],
        },
        {
          spec: withLearner(baseSpec(), "ben", { available: ["mon-09"] }),
          assignments: [
            { requestId: "req-ben", teacherId: "ada", roomId: "blue", slotId: "mon-10" },
            { requestId: "req-cy", teacherId: "grace", roomId: "green", slotId: "mon-09" },
          ],
        },
        {
          spec: withRoom(baseSpec(), "blue", { available: ["mon-09"] }),
          assignments: [
            { requestId: "req-ben", teacherId: "ada", roomId: "blue", slotId: "mon-10" },
            { requestId: "req-cy", teacherId: "grace", roomId: "green", slotId: "mon-09" },
          ],
        },
        {
          spec: withTeacher(baseSpec(), "ada", { levels: ["advanced"] }),
          assignments: [
            { requestId: "req-ben", teacherId: "ada", roomId: "blue", slotId: "mon-09" },
            { requestId: "req-cy", teacherId: "grace", roomId: "green", slotId: "mon-10" },
          ],
        },
        {
          spec: baseSpec(),
          assignments: [
            { requestId: "req-ben", teacherId: "ada", roomId: "blue", slotId: "mon-09" },
            { requestId: "req-cy", teacherId: "ada", roomId: "green", slotId: "mon-09" },
          ],
        },
      ];

    for (const [index, testCase] of cases.entries()) {
      const program = defineSchedule(testCase.spec);
      const generated = await loadGeneratedValidator(program.generateValidator(), index);

      expect(generated.validateAssignments(testCase.assignments)).toEqual(
        program.validate(testCase.assignments),
      );
    }
  });

  it("erases DSL builders and rule-level machinery from generated code", () => {
    const source = defineSchedule(baseSpec()).generateValidator();

    expect(source).toContain("export function validateAssignments");
    expect(source).not.toMatch(/\bdefineSchedule\b/);
    expect(source).not.toMatch(/\bScheduleSpec\b/);
    expect(source).not.toMatch(/\bvalidateSchedule\b/);
    expect(source).not.toMatch(/\benumerateSchedules\b/);
    expect(source).not.toMatch(/\bRule\b/);
  });
});

describe("redescription pressure", () => {
  it("moves a learner between levels by changing source meaning, not interpreters", () => {
    const beginnerProgram = defineSchedule(levelSensitiveSpec("beginner"));
    expect(
      beginnerProgram.validate([
        { requestId: "req-ben", teacherId: "beginner-teacher", roomId: "blue", slotId: "mon-09" },
      ]),
    ).toEqual({ valid: true, issues: [] });

    const advancedProgram = defineSchedule(levelSensitiveSpec("advanced"));
    expect(
      advancedProgram.validate([
        { requestId: "req-ben", teacherId: "beginner-teacher", roomId: "blue", slotId: "mon-09" },
      ]).issues,
    ).toContainEqual(
      expect.objectContaining({
        code: "teacher-level-mismatch",
        teacherId: "beginner-teacher",
        learnerId: "ben",
      }),
    );
    expect(
      advancedProgram.validate([
        { requestId: "req-ben", teacherId: "advanced-teacher", roomId: "blue", slotId: "mon-09" },
      ]),
    ).toEqual({ valid: true, issues: [] });
  });
});

function baseSpec(): ScheduleSpec {
  return {
    slots: [{ id: "mon-09" }, { id: "mon-10" }],
    teachers: [
      { id: "ada", levels: ["beginner", "advanced"], available: ["mon-09", "mon-10"] },
      { id: "grace", levels: ["beginner", "advanced"], available: ["mon-09", "mon-10"] },
    ],
    learners: [
      { id: "ben", level: "beginner", available: ["mon-09", "mon-10"] },
      { id: "cy", level: "advanced", available: ["mon-09", "mon-10"] },
    ],
    rooms: [
      { id: "blue", available: ["mon-09", "mon-10"] },
      { id: "green", available: ["mon-09", "mon-10"] },
    ],
    requests: [
      { id: "req-ben", learnerId: "ben" },
      { id: "req-cy", learnerId: "cy" },
    ],
  };
}

function twoRequestsForSameLearnerSpec(): ScheduleSpec {
  return {
    ...baseSpec(),
    requests: [
      { id: "req-ben-1", learnerId: "ben" },
      { id: "req-ben-2", learnerId: "ben" },
    ],
  };
}

function levelSensitiveSpec(level: "beginner" | "advanced"): ScheduleSpec {
  return {
    slots: [{ id: "mon-09" }],
    teachers: [
      { id: "beginner-teacher", levels: ["beginner"], available: ["mon-09"] },
      { id: "advanced-teacher", levels: ["advanced"], available: ["mon-09"] },
    ],
    learners: [{ id: "ben", level, available: ["mon-09"] }],
    rooms: [{ id: "blue", available: ["mon-09"] }],
    requests: [{ id: "req-ben", learnerId: "ben" }],
  };
}

function validAssignments(): Assignment[] {
  return [
    { requestId: "req-ben", teacherId: "ada", roomId: "blue", slotId: "mon-09" },
    { requestId: "req-cy", teacherId: "grace", roomId: "green", slotId: "mon-10" },
  ];
}

function withTeacher(
  spec: ScheduleSpec,
  teacherId: string,
  patch: Partial<ScheduleSpec["teachers"][number]>,
): ScheduleSpec {
  return {
    ...spec,
    teachers: spec.teachers.map((teacher) =>
      teacher.id === teacherId ? { ...teacher, ...patch } : teacher,
    ),
  };
}

function withLearner(
  spec: ScheduleSpec,
  learnerId: string,
  patch: Partial<ScheduleSpec["learners"][number]>,
): ScheduleSpec {
  return {
    ...spec,
    learners: spec.learners.map((learner) =>
      learner.id === learnerId ? { ...learner, ...patch } : learner,
    ),
  };
}

function withRoom(
  spec: ScheduleSpec,
  roomId: string,
  patch: Partial<ScheduleSpec["rooms"][number]>,
): ScheduleSpec {
  return {
    ...spec,
    rooms: spec.rooms.map((room) => (room.id === roomId ? { ...room, ...patch } : room)),
  };
}

async function loadGeneratedValidator(
  source: string,
  suffix: number,
): Promise<{ validateAssignments(assignments: readonly Assignment[]): ValidationReport }> {
  const moduleUrl = `data:text/javascript;charset=utf-8,${encodeURIComponent(source)}#${suffix}`;
  return (await import(moduleUrl)) as {
    validateAssignments(assignments: readonly Assignment[]): ValidationReport;
  };
}
