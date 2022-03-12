
export class GameOverError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export class StormTokensDepletedError extends GameOverError {
  constructor(message?: string) {
    super(message);
  }
}

export class DrawDeckDepletedError extends GameOverError {
  constructor(message?: string) {
    super(message);
  }
}
