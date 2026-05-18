import type { ScheduleSpec } from "./types.js";

interface GeneratedValidatorData {
  readonly slots: readonly string[];
  readonly requestLearners: Readonly<Record<string, string>>;
  readonly learnerLevels: Readonly<Record<string, string>>;
  readonly teacherLevels: Readonly<Record<string, readonly string[]>>;
  readonly teacherAvailability: Readonly<Record<string, readonly string[]>>;
  readonly learnerAvailability: Readonly<Record<string, readonly string[]>>;
  readonly roomAvailability: Readonly<Record<string, readonly string[]>>;
}

export function generateValidatorSource(spec: ScheduleSpec): string {
  const data: GeneratedValidatorData = {
    slots: spec.slots.map((slot) => slot.id),
    requestLearners: Object.fromEntries(
      spec.requests.map((request) => [request.id, request.learnerId]),
    ),
    learnerLevels: Object.fromEntries(
      spec.learners.map((learner) => [learner.id, learner.level]),
    ),
    teacherLevels: Object.fromEntries(
      spec.teachers.map((teacher) => [teacher.id, [...teacher.levels]]),
    ),
    teacherAvailability: Object.fromEntries(
      spec.teachers.map((teacher) => [teacher.id, [...teacher.available]]),
    ),
    learnerAvailability: Object.fromEntries(
      spec.learners.map((learner) => [learner.id, [...learner.available]]),
    ),
    roomAvailability: Object.fromEntries(spec.rooms.map((room) => [room.id, [...room.available]])),
  };

  return `// Specialized lesson-booking validator. Generated from semantic data; no DSL runtime required.
const data = ${JSON.stringify(data, null, 2)};
const slots = new Set(data.slots);
const teacherAvailability = setsById(data.teacherAvailability);
const learnerAvailability = setsById(data.learnerAvailability);
const roomAvailability = setsById(data.roomAvailability);

export function validateAssignments(assignments) {
  const issues = [];
  const requestAssignments = new Map();
  const teacherBusy = new Map();
  const learnerBusy = new Map();
  const roomBusy = new Map();

  assignments.forEach((assignment, index) => {
    const requestKnown = hasOwn(data.requestLearners, assignment.requestId);
    let learnerId;
    if (!requestKnown) {
      issues.push({
        code: "unknown-request",
        message: \`Assignment \${index} references unknown request "\${assignment.requestId}".\`,
        assignmentIndex: index,
        requestId: assignment.requestId,
      });
    } else {
      learnerId = data.requestLearners[assignment.requestId];
      const indexes = requestAssignments.get(assignment.requestId) ?? [];
      indexes.push(index);
      requestAssignments.set(assignment.requestId, indexes);
    }

    const teacherKnown = hasOwn(data.teacherLevels, assignment.teacherId);
    if (!teacherKnown) {
      issues.push({
        code: "unknown-teacher",
        message: \`Assignment \${index} references unknown teacher "\${assignment.teacherId}".\`,
        assignmentIndex: index,
        teacherId: assignment.teacherId,
      });
    }

    const roomKnown = hasOwn(data.roomAvailability, assignment.roomId);
    if (!roomKnown) {
      issues.push({
        code: "unknown-room",
        message: \`Assignment \${index} references unknown room "\${assignment.roomId}".\`,
        assignmentIndex: index,
        roomId: assignment.roomId,
      });
    }

    const slotKnown = slots.has(assignment.slotId);
    if (!slotKnown) {
      issues.push({
        code: "unknown-slot",
        message: \`Assignment \${index} references unknown slot "\${assignment.slotId}".\`,
        assignmentIndex: index,
        slotId: assignment.slotId,
      });
    }

    const learnerKnown = learnerId !== undefined && hasOwn(data.learnerLevels, learnerId);
    if (requestKnown && !learnerKnown) {
      issues.push({
        code: "unknown-learner",
        message: \`Request "\${assignment.requestId}" references unknown learner "\${learnerId}".\`,
        assignmentIndex: index,
        requestId: assignment.requestId,
        learnerId,
      });
    }

    if (teacherKnown && slotKnown && !teacherAvailability[assignment.teacherId].has(assignment.slotId)) {
      issues.push({
        code: "teacher-unavailable",
        message: \`Teacher "\${assignment.teacherId}" is unavailable in slot "\${assignment.slotId}".\`,
        assignmentIndex: index,
        teacherId: assignment.teacherId,
        slotId: assignment.slotId,
      });
    }

    if (learnerKnown && slotKnown && !learnerAvailability[learnerId].has(assignment.slotId)) {
      issues.push({
        code: "learner-unavailable",
        message: \`Learner "\${learnerId}" is unavailable in slot "\${assignment.slotId}".\`,
        assignmentIndex: index,
        learnerId,
        slotId: assignment.slotId,
      });
    }

    if (roomKnown && slotKnown && !roomAvailability[assignment.roomId].has(assignment.slotId)) {
      issues.push({
        code: "room-unavailable",
        message: \`Room "\${assignment.roomId}" is unavailable in slot "\${assignment.slotId}".\`,
        assignmentIndex: index,
        roomId: assignment.roomId,
        slotId: assignment.slotId,
      });
    }

    if (
      teacherKnown &&
      learnerKnown &&
      !data.teacherLevels[assignment.teacherId].includes(data.learnerLevels[learnerId])
    ) {
      issues.push({
        code: "teacher-level-mismatch",
        message: \`Teacher "\${assignment.teacherId}" cannot teach learner "\${learnerId}" at level "\${data.learnerLevels[learnerId]}".\`,
        assignmentIndex: index,
        teacherId: assignment.teacherId,
        learnerId,
      });
    }

    if (teacherKnown && slotKnown) {
      recordBusyIssue(issues, teacherBusy, assignment.teacherId, assignment.slotId, index, "teacher", {
        teacherId: assignment.teacherId,
        slotId: assignment.slotId,
      });
    }

    if (learnerKnown && slotKnown) {
      recordBusyIssue(issues, learnerBusy, learnerId, assignment.slotId, index, "learner", {
        learnerId,
        slotId: assignment.slotId,
      });
    }

    if (roomKnown && slotKnown) {
      recordBusyIssue(issues, roomBusy, assignment.roomId, assignment.slotId, index, "room", {
        roomId: assignment.roomId,
        slotId: assignment.slotId,
      });
    }
  });

  for (const requestId of Object.keys(data.requestLearners)) {
    const indexes = requestAssignments.get(requestId) ?? [];
    if (indexes.length === 0) {
      issues.push({
        code: "missing-request",
        message: \`Request "\${requestId}" is not assigned.\`,
        requestId,
      });
    }

    for (const assignmentIndex of indexes.slice(1)) {
      issues.push({
        code: "request-duplicated",
        message: \`Request "\${requestId}" is assigned more than once.\`,
        assignmentIndex,
        requestId,
      });
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

function setsById(record) {
  return Object.fromEntries(Object.entries(record).map(([id, values]) => [id, new Set(values)]));
}

function hasOwn(record, key) {
  return Object.prototype.hasOwnProperty.call(record, key);
}

function recordBusyIssue(issues, busy, entityId, slotId, assignmentIndex, kind, ids) {
  const key = \`\${entityId}\\x1f\${slotId}\`;
  const conflictWithIndex = busy.get(key);
  if (conflictWithIndex === undefined) {
    busy.set(key, assignmentIndex);
    return;
  }

  if (kind === "teacher") {
    issues.push({
      code: "teacher-double-booked",
      message: \`Teacher "\${entityId}" is double-booked in slot "\${slotId}".\`,
      assignmentIndex,
      conflictWithIndex,
      ...ids,
    });
    return;
  }

  if (kind === "learner") {
    issues.push({
      code: "learner-double-booked",
      message: \`Learner "\${entityId}" is double-booked in slot "\${slotId}".\`,
      assignmentIndex,
      conflictWithIndex,
      ...ids,
    });
    return;
  }

  issues.push({
    code: "room-double-booked",
    message: \`Room "\${entityId}" is double-booked in slot "\${slotId}".\`,
    assignmentIndex,
    conflictWithIndex,
    ...ids,
  });
}
`;
}
