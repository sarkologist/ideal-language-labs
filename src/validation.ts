import type {
  Assignment,
  Learner,
  LessonRequest,
  Room,
  ScheduleSpec,
  Slot,
  Teacher,
  ValidationIssue,
  ValidationReport,
} from "./types.js";

const BUSY_KEY_SEPARATOR = "\x1f";

export function validateSchedule(
  spec: ScheduleSpec,
  assignments: readonly Assignment[],
): ValidationReport {
  const slots = mapById(spec.slots);
  const teachers = mapById(spec.teachers);
  const learners = mapById(spec.learners);
  const rooms = mapById(spec.rooms);
  const requests = mapById(spec.requests);
  const issues: ValidationIssue[] = [];
  const requestAssignments = new Map<string, number[]>();
  const teacherBusy = new Map<string, number>();
  const learnerBusy = new Map<string, number>();
  const roomBusy = new Map<string, number>();

  assignments.forEach((assignment, index) => {
    const request = requests.get(assignment.requestId);
    if (request === undefined) {
      issues.push({
        code: "unknown-request",
        message: `Assignment ${index} references unknown request "${assignment.requestId}".`,
        assignmentIndex: index,
        requestId: assignment.requestId,
      });
    } else {
      const indexes = requestAssignments.get(request.id) ?? [];
      indexes.push(index);
      requestAssignments.set(request.id, indexes);
    }

    const teacher = teachers.get(assignment.teacherId);
    if (teacher === undefined) {
      issues.push({
        code: "unknown-teacher",
        message: `Assignment ${index} references unknown teacher "${assignment.teacherId}".`,
        assignmentIndex: index,
        teacherId: assignment.teacherId,
      });
    }

    const room = rooms.get(assignment.roomId);
    if (room === undefined) {
      issues.push({
        code: "unknown-room",
        message: `Assignment ${index} references unknown room "${assignment.roomId}".`,
        assignmentIndex: index,
        roomId: assignment.roomId,
      });
    }

    const slot = slots.get(assignment.slotId);
    if (slot === undefined) {
      issues.push({
        code: "unknown-slot",
        message: `Assignment ${index} references unknown slot "${assignment.slotId}".`,
        assignmentIndex: index,
        slotId: assignment.slotId,
      });
    }

    const learner = request === undefined ? undefined : learners.get(request.learnerId);
    if (request !== undefined && learner === undefined) {
      issues.push({
        code: "unknown-learner",
        message: `Request "${request.id}" references unknown learner "${request.learnerId}".`,
        assignmentIndex: index,
        requestId: request.id,
        learnerId: request.learnerId,
      });
    }

    if (teacher !== undefined && slot !== undefined && !teacher.available.includes(slot.id)) {
      issues.push({
        code: "teacher-unavailable",
        message: `Teacher "${teacher.id}" is unavailable in slot "${slot.id}".`,
        assignmentIndex: index,
        teacherId: teacher.id,
        slotId: slot.id,
      });
    }

    if (learner !== undefined && slot !== undefined && !learner.available.includes(slot.id)) {
      issues.push({
        code: "learner-unavailable",
        message: `Learner "${learner.id}" is unavailable in slot "${slot.id}".`,
        assignmentIndex: index,
        learnerId: learner.id,
        slotId: slot.id,
      });
    }

    if (room !== undefined && slot !== undefined && !room.available.includes(slot.id)) {
      issues.push({
        code: "room-unavailable",
        message: `Room "${room.id}" is unavailable in slot "${slot.id}".`,
        assignmentIndex: index,
        roomId: room.id,
        slotId: slot.id,
      });
    }

    if (
      teacher !== undefined &&
      learner !== undefined &&
      !teacher.levels.includes(learner.level)
    ) {
      issues.push({
        code: "teacher-level-mismatch",
        message: `Teacher "${teacher.id}" cannot teach learner "${learner.id}" at level "${learner.level}".`,
        assignmentIndex: index,
        teacherId: teacher.id,
        learnerId: learner.id,
      });
    }

    if (teacher !== undefined && slot !== undefined) {
      recordBusyIssue(issues, teacherBusy, teacher.id, slot.id, index, "teacher", {
        teacherId: teacher.id,
        slotId: slot.id,
      });
    }

    if (learner !== undefined && slot !== undefined) {
      recordBusyIssue(issues, learnerBusy, learner.id, slot.id, index, "learner", {
        learnerId: learner.id,
        slotId: slot.id,
      });
    }

    if (room !== undefined && slot !== undefined) {
      recordBusyIssue(issues, roomBusy, room.id, slot.id, index, "room", {
        roomId: room.id,
        slotId: slot.id,
      });
    }
  });

  for (const request of spec.requests) {
    const indexes = requestAssignments.get(request.id) ?? [];
    if (indexes.length === 0) {
      issues.push({
        code: "missing-request",
        message: `Request "${request.id}" is not assigned.`,
        requestId: request.id,
      });
    }

    for (const assignmentIndex of indexes.slice(1)) {
      issues.push({
        code: "request-duplicated",
        message: `Request "${request.id}" is assigned more than once.`,
        assignmentIndex,
        requestId: request.id,
      });
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

function mapById<T extends Slot | Teacher | Learner | Room | LessonRequest>(
  items: readonly T[],
): Map<string, T> {
  return new Map(items.map((item) => [item.id, item]));
}

function recordBusyIssue(
  issues: ValidationIssue[],
  busy: Map<string, number>,
  entityId: string,
  slotId: string,
  assignmentIndex: number,
  kind: "teacher" | "learner" | "room",
  ids: Pick<ValidationIssue, "teacherId" | "learnerId" | "roomId" | "slotId">,
): void {
  const key = `${entityId}${BUSY_KEY_SEPARATOR}${slotId}`;
  const conflictWithIndex = busy.get(key);
  if (conflictWithIndex === undefined) {
    busy.set(key, assignmentIndex);
    return;
  }

  if (kind === "teacher") {
    issues.push({
      code: "teacher-double-booked",
      message: `Teacher "${entityId}" is double-booked in slot "${slotId}".`,
      assignmentIndex,
      conflictWithIndex,
      ...ids,
    });
    return;
  }

  if (kind === "learner") {
    issues.push({
      code: "learner-double-booked",
      message: `Learner "${entityId}" is double-booked in slot "${slotId}".`,
      assignmentIndex,
      conflictWithIndex,
      ...ids,
    });
    return;
  }

  issues.push({
    code: "room-double-booked",
    message: `Room "${entityId}" is double-booked in slot "${slotId}".`,
    assignmentIndex,
    conflictWithIndex,
    ...ids,
  });
}
