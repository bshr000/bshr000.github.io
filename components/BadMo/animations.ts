export const BADMO_SPRITE = {
  columns: 8,
  rows: 11,
  cellWidth: 192,
  cellHeight: 208,
} as const;

export type BadMoSpriteState =
  | "idle"
  | "running-right"
  | "running-left"
  | "waving"
  | "jumping"
  | "failed"
  | "waiting"
  | "running"
  | "review"
  | "look-row-9"
  | "look-row-10";

export type BadMoActionId =
  | "idle"
  | "wave"
  | "jump"
  | "sway"
  | "ponder"
  | "review";

export type BadMoMood =
  | "curious"
  | "focused"
  | "relaxed"
  | "reflective"
  | "friendly";

export interface SpriteAnimation {
  row: number;
  frames: number;
  fps: number;
  loop: boolean;
}

export interface BadMoAction {
  id: BadMoActionId;
  sprite: BadMoSpriteState;
  duration: number;
  motion: "none" | "sway" | "tilt";
}

export interface BadMoPageProfile {
  mood: BadMoMood;
  routeAction?: Exclude<BadMoActionId, "idle">;
}

export const SPRITE_ANIMATIONS: Record<BadMoSpriteState, SpriteAnimation> = {
  idle: { row: 0, frames: 6, fps: 2.4, loop: true },
  "running-right": { row: 1, frames: 8, fps: 8, loop: true },
  "running-left": { row: 2, frames: 8, fps: 8, loop: true },
  waving: { row: 3, frames: 4, fps: 5.5, loop: false },
  jumping: { row: 4, frames: 5, fps: 7, loop: false },
  failed: { row: 5, frames: 8, fps: 5, loop: false },
  waiting: { row: 6, frames: 6, fps: 4, loop: false },
  running: { row: 7, frames: 6, fps: 6, loop: true },
  review: { row: 8, frames: 6, fps: 5, loop: false },
  "look-row-9": { row: 9, frames: 8, fps: 0, loop: false },
  "look-row-10": { row: 10, frames: 8, fps: 0, loop: false },
};

export const BADMO_ACTIONS: Record<BadMoActionId, BadMoAction> = {
  idle: {
    id: "idle",
    sprite: "idle",
    duration: 0,
    motion: "none",
  },
  wave: {
    id: "wave",
    sprite: "waving",
    duration: 1_100,
    motion: "none",
  },
  jump: {
    id: "jump",
    sprite: "jumping",
    duration: 900,
    motion: "none",
  },
  sway: {
    id: "sway",
    sprite: "idle",
    duration: 1_150,
    motion: "sway",
  },
  ponder: {
    id: "ponder",
    sprite: "waiting",
    duration: 1_500,
    motion: "tilt",
  },
  review: {
    id: "review",
    sprite: "review",
    duration: 1_350,
    motion: "none",
  },
};

export const DEFAULT_DIALOGUES = [
  "我在。",
  "这个想法，有点意思。",
  "再看一眼。",
  "别急，慢慢来。",
  "发现一小块灵感。",
] as const;

export const BADMO_EVENTS = {
  interaction: "badmo:interaction",
} as const;

// Large jumps and seated poses stay available through the imperative API,
// but ordinary clicks use the standing wave sequence.
export const ACTION_SEQUENCES: Record<Exclude<BadMoActionId, "idle">, readonly { row: number; frame: number; hold: number }[]> = {
  wave: [{ row: 0, frame: 0, hold: 160 }, { row: 3, frame: 0, hold: 140 }, { row: 3, frame: 1, hold: 240 }, { row: 3, frame: 2, hold: 160 }, { row: 3, frame: 3, hold: 180 }, { row: 3, frame: 0, hold: 140 }, { row: 0, frame: 0, hold: 180 }],
  sway: [{ row: 0, frame: 0, hold: 500 }],
  jump: [0, 1, 2, 3, 4].map(frame => ({ row: 4, frame, hold: 130 })).concat([{ row: 0, frame: 0, hold: 240 }]),
  ponder: [0, 1, 0].map(frame => ({ row: 6, frame, hold: 280 })).concat([{ row: 0, frame: 0, hold: 220 }]),
  review: [0, 1, 0].map(frame => ({ row: 8, frame, hold: 280 })).concat([{ row: 0, frame: 0, hold: 220 }]),
};

export function getPageProfile(pathname: string): BadMoPageProfile {
  if (pathname.startsWith("/works")) {
    return { mood: "focused", routeAction: "review" };
  }

  if (pathname.startsWith("/life")) {
    return { mood: "relaxed", routeAction: "sway" };
  }

  if (pathname.startsWith("/journey")) {
    return { mood: "reflective", routeAction: "ponder" };
  }

  if (pathname.startsWith("/about")) {
    return { mood: "friendly", routeAction: "wave" };
  }

  return { mood: "curious" };
}

export function pickInteractionAction(
  previous?: Exclude<BadMoActionId, "idle">,
): Exclude<BadMoActionId, "idle"> {
  return previous === "wave" ? "sway" : "wave";
}

export function getFramePosition(row: number, frame: number): string {
  const x = (frame / (BADMO_SPRITE.columns - 1)) * 100;
  const y = (row / (BADMO_SPRITE.rows - 1)) * 100;

  return `${x}% ${y}%`;
}

export function getLookFrame(deltaX: number, deltaY: number): {
  state: "look-row-9" | "look-row-10";
  frame: number;
} {
  const clockwiseFromUp =
    ((Math.atan2(deltaX, -deltaY) * 180) / Math.PI + 360) % 360;
  const direction = Math.round(clockwiseFromUp / 22.5) % 16;

  return direction < 8
    ? { state: "look-row-9", frame: direction }
    : { state: "look-row-10", frame: direction - 8 };
}
