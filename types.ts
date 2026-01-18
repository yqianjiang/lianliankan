
export interface Position {
  x: number;
  y: number;
}

export interface TileData {
  id: string;
  value: string;
  type: 'emoji' | 'image';
  pos: Position;
}

export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  WON = 'WON',
  LOST = 'LOST'
}

export interface Theme {
  id: string;
  name: string;
  type: 'emoji' | 'image';
  items: string[];
  bgColor: string;
  accentColor: string;
}

export interface Level {
  id: string;
  name: string;
  rows: number;
  cols: number;
  time: number;
  uniqueTiles: number;
}

export interface ConnectionPath {
  points: Position[];
}

export interface GameStats {
  totalGames: number;
  highScores: Record<string, number>; // levelId -> score
}
