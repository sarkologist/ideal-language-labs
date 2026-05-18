export type Id = string;
export type Level = string;

export interface Slot {
  readonly id: Id;
  readonly label?: string;
}

export interface Teacher {
  readonly id: Id;
  readonly levels: readonly Level[];
  readonly available: readonly Id[];
}

export interface Learner {
  readonly id: Id;
  readonly level: Level;
  readonly available: readonly Id[];
}

export interface Room {
  readonly id: Id;
  readonly available: readonly Id[];
}

export interface LessonRequest {
  readonly id: Id;
  readonly learnerId: Id;
}

export interface Assignment {
  readonly requestId: Id;
  readonly teacherId: Id;
  readonly roomId: Id;
  readonly slotId: Id;
}

export interface ScheduleSpec {
  readonly slots: readonly Slot[];
  readonly teachers: readonly Teacher[];
  readonly learners: readonly Learner[];
  readonly rooms: readonly Room[];
  readonly requests: readonly LessonRequest[];
}

export type ValidationIssueCode =
  | "missing-request"
  | "request-duplicated"
  | "unknown-request"
  | "unknown-teacher"
  | "unknown-learner"
  | "unknown-room"
  | "unknown-slot"
  | "teacher-unavailable"
  | "learner-unavailable"
  | "room-unavailable"
  | "teacher-level-mismatch"
  | "teacher-double-booked"
  | "learner-double-booked"
  | "room-double-booked";

export interface ValidationIssue {
  readonly code: ValidationIssueCode;
  readonly message: string;
  readonly assignmentIndex?: number;
  readonly conflictWithIndex?: number;
  readonly requestId?: Id;
  readonly teacherId?: Id;
  readonly learnerId?: Id;
  readonly roomId?: Id;
  readonly slotId?: Id;
}

export interface ValidationReport {
  readonly valid: boolean;
  readonly issues: readonly ValidationIssue[];
}

export interface SolveOptions {
  readonly limit?: number;
}

export interface ScheduleProgram {
  readonly spec: ScheduleSpec;
  validate(assignments: readonly Assignment[]): ValidationReport;
  solve(options?: SolveOptions): Assignment[][];
  generateValidator(): string;
}
