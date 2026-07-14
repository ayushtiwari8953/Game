// Game constants
export const GRID_SIZE = 20;

export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

export const DIFFICULTY = {
  Easy: { initialSpeed: 200, minSpeed: 120, step: 4 },
  Medium: { initialSpeed: 140, minSpeed: 70, step: 5 },
  Hard: { initialSpeed: 90, minSpeed: 40, step: 6 },
};

export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];
