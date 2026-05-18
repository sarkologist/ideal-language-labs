import type { Assignment, Learner, Room, ScheduleSpec, SolveOptions, Teacher } from "./types.js";
import { validateSchedule } from "./validation.js";

const BUSY_KEY_SEPARATOR = "\x1f";

export function enumerateSchedules(spec: ScheduleSpec, options: SolveOptions = {}): Assignment[][] {
  const limit = options.limit ?? Number.POSITIVE_INFINITY;
  if (limit <= 0) {
    return [];
  }

  const learners = mapById(spec.learners);
  const choicesByRequest = spec.requests.map((request) => {
    const learner = learners.get(request.learnerId);
    if (learner === undefined) {
      return [];
    }

    const choices: Assignment[] = [];
    for (const slot of spec.slots) {
      for (const teacher of spec.teachers) {
        if (!canTeachInSlot(teacher, learner, slot.id)) {
          continue;
        }

        for (const room of spec.rooms) {
          if (!learner.available.includes(slot.id) || !room.available.includes(slot.id)) {
            continue;
          }

          choices.push({
            requestId: request.id,
            teacherId: teacher.id,
            roomId: room.id,
            slotId: slot.id,
          });
        }
      }
    }

    return choices;
  });

  if (choicesByRequest.some((choices) => choices.length === 0)) {
    return [];
  }

  const results: Assignment[][] = [];
  const current: Assignment[] = [];
  const teacherBusy = new Set<string>();
  const learnerBusy = new Set<string>();
  const roomBusy = new Set<string>();

  function backtrack(requestIndex: number): void {
    if (results.length >= limit) {
      return;
    }

    if (requestIndex === spec.requests.length) {
      if (validateSchedule(spec, current).valid) {
        results.push(current.map((assignment) => ({ ...assignment })));
      }
      return;
    }

    const request = spec.requests[requestIndex];
    if (request === undefined) {
      return;
    }

    const learner = learners.get(request.learnerId);
    if (learner === undefined) {
      return;
    }

    const choices = choicesByRequest[requestIndex] ?? [];
    for (const choice of choices) {
      const teacherKey = busyKey(choice.teacherId, choice.slotId);
      const learnerKey = busyKey(learner.id, choice.slotId);
      const roomKey = busyKey(choice.roomId, choice.slotId);

      if (
        teacherBusy.has(teacherKey) ||
        learnerBusy.has(learnerKey) ||
        roomBusy.has(roomKey)
      ) {
        continue;
      }

      teacherBusy.add(teacherKey);
      learnerBusy.add(learnerKey);
      roomBusy.add(roomKey);
      current.push(choice);

      backtrack(requestIndex + 1);

      current.pop();
      teacherBusy.delete(teacherKey);
      learnerBusy.delete(learnerKey);
      roomBusy.delete(roomKey);

      if (results.length >= limit) {
        return;
      }
    }
  }

  backtrack(0);
  return results;
}

function canTeachInSlot(teacher: Teacher, learner: Learner, slotId: string): boolean {
  return teacher.levels.includes(learner.level) && teacher.available.includes(slotId);
}

function mapById<T extends Learner | Room>(items: readonly T[]): Map<string, T> {
  return new Map(items.map((item) => [item.id, item]));
}

function busyKey(entityId: string, slotId: string): string {
  return `${entityId}${BUSY_KEY_SEPARATOR}${slotId}`;
}
