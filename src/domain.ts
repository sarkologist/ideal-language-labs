import { generateValidatorSource } from "./generator.js";
import { enumerateSchedules } from "./solver.js";
import type {
  Learner,
  LessonRequest,
  Room,
  Assignment,
  ScheduleProgram,
  ScheduleSpec,
  SolveOptions,
  Slot,
  Teacher,
} from "./types.js";
import { validateSchedule } from "./validation.js";

export function defineSchedule(spec: ScheduleSpec): ScheduleProgram {
  const normalized = normalizeScheduleSpec(spec);

  return Object.freeze({
    spec: normalized,
    validate(assignments: readonly Assignment[]) {
      return validateSchedule(normalized, assignments);
    },
    solve(options?: SolveOptions) {
      return enumerateSchedules(normalized, options);
    },
    generateValidator() {
      return generateValidatorSource(normalized);
    },
  });
}

export function normalizeScheduleSpec(spec: ScheduleSpec): ScheduleSpec {
  assertUniqueIds("slot", spec.slots);
  assertUniqueIds("teacher", spec.teachers);
  assertUniqueIds("learner", spec.learners);
  assertUniqueIds("room", spec.rooms);
  assertUniqueIds("request", spec.requests);

  const slotIds = new Set(spec.slots.map((slot) => slot.id));
  const learnerIds = new Set(spec.learners.map((learner) => learner.id));

  const slots = spec.slots.map(cloneSlot);
  const teachers = spec.teachers.map((teacher) => {
    assertKnownIds(`teacher "${teacher.id}" availability`, teacher.available, slotIds, "slot");
    assertUniqueValues(`teacher "${teacher.id}" levels`, teacher.levels);
    assertUniqueValues(`teacher "${teacher.id}" availability`, teacher.available);
    return cloneTeacher(teacher);
  });
  const learners = spec.learners.map((learner) => {
    assertKnownIds(`learner "${learner.id}" availability`, learner.available, slotIds, "slot");
    return cloneLearner(learner);
  });
  const rooms = spec.rooms.map((room) => {
    assertKnownIds(`room "${room.id}" availability`, room.available, slotIds, "slot");
    assertUniqueValues(`room "${room.id}" availability`, room.available);
    return cloneRoom(room);
  });
  const requests = spec.requests.map((request) => {
    if (!learnerIds.has(request.learnerId)) {
      throw new Error(`request "${request.id}" references unknown learner "${request.learnerId}"`);
    }
    return cloneRequest(request);
  });

  return { slots, teachers, learners, rooms, requests };
}

function cloneSlot(slot: Slot): Slot {
  return slot.label === undefined ? { id: slot.id } : { id: slot.id, label: slot.label };
}

function cloneTeacher(teacher: Teacher): Teacher {
  return {
    id: teacher.id,
    levels: [...teacher.levels],
    available: [...teacher.available],
  };
}

function cloneLearner(learner: Learner): Learner {
  return {
    id: learner.id,
    level: learner.level,
    available: [...learner.available],
  };
}

function cloneRoom(room: Room): Room {
  return {
    id: room.id,
    available: [...room.available],
  };
}

function cloneRequest(request: LessonRequest): LessonRequest {
  return {
    id: request.id,
    learnerId: request.learnerId,
  };
}

function assertUniqueIds(kind: string, items: readonly { readonly id: string }[]): void {
  assertUniqueValues(`${kind} ids`, items.map((item) => item.id));
}

function assertUniqueValues(label: string, values: readonly string[]): void {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      throw new Error(`${label} contains duplicate value "${value}"`);
    }
    seen.add(value);
  }
}

function assertKnownIds(
  label: string,
  values: readonly string[],
  knownIds: ReadonlySet<string>,
  knownKind: string,
): void {
  for (const value of values) {
    if (!knownIds.has(value)) {
      throw new Error(`${label} references unknown ${knownKind} "${value}"`);
    }
  }
}
