
import { Position, TileData } from '../types';

export const isSamePosition = (p1: Position, p2: Position) => p1.x === p2.x && p1.y === p2.y;

const isEmpty = (grid: (TileData | null)[][], pos: Position) => {
  if (pos.y < 0 || pos.y >= grid.length || pos.x < 0 || pos.x >= grid[0].length) return false;
  return grid[pos.y][pos.x] === null;
};

export const findPath = (grid: (TileData | null)[][], p1: Position, p2: Position): Position[] | null => {
  if (isSamePosition(p1, p2)) return null;

  const rows = grid.length;
  const cols = grid[0].length;

  // We use BFS to find the shortest path in terms of segments (turns)
  // Each node in queue: { pos, dir, path }
  // dir: 0: none, 1: horizontal, 2: vertical
  const queue: { pos: Position; dir: number; turns: number; path: Position[] }[] = [];
  
  // Initial neighbors
  const directions = [
    { x: 1, y: 0, dir: 1 },
    { x: -1, y: 0, dir: 1 },
    { x: 0, y: 1, dir: 2 },
    { x: 0, y: -1, dir: 2 },
  ];

  for (const d of directions) {
    const next = { x: p1.x + d.x, y: p1.y + d.y };
    if (next.x >= 0 && next.x < cols && next.y >= 0 && next.y < rows) {
      if (isSamePosition(next, p2)) return [p1, p2];
      if (isEmpty(grid, next)) {
        queue.push({ pos: next, dir: d.dir, turns: 0, path: [p1, next] });
      }
    }
  }

  // visited[y][x][dir] = minTurns
  const visited: number[][][] = Array.from({ length: rows }, () => 
    Array.from({ length: cols }, () => [Infinity, Infinity, Infinity])
  );

  while (queue.length > 0) {
    const { pos, dir, turns, path } = queue.shift()!;

    if (turns > visited[pos.y][pos.x][dir]) continue;
    visited[pos.y][pos.x][dir] = turns;

    // Although we allow more than 2 turns now, we should still try to find a path with reasonable turns.
    // Most Onet games are played with 2 turns max, so we can set a higher limit like 10 or none.
    // For now, let's not strictly limit but prioritize lower turns.
    
    for (const d of directions) {
      const next = { x: pos.x + d.x, y: pos.y + d.y };
      const nextTurns = d.dir === dir ? turns : turns + 1;

      if (nextTurns > 3) continue;
      if (next.x < 0 || next.x >= cols || next.y < 0 || next.y >= rows) continue;

      if (isSamePosition(next, p2)) {
        // Found path! Returns only the corners for the UI to draw straight lines.
        return simplifyPath([...path, p2]);
      }

      if (isEmpty(grid, next) && nextTurns < visited[next.y][next.x][d.dir]) {
        visited[next.y][next.x][d.dir] = nextTurns;
        queue.push({ 
          pos: next, 
          dir: d.dir, 
          turns: nextTurns, 
          path: [...path, next] 
        });
      }
    }
    // Sort queue by turns to act like Dijkstra for minimum turns
    queue.sort((a, b) => a.turns - b.turns);
  }

  return null;
};

const simplifyPath = (path: Position[]): Position[] => {
  if (path.length <= 2) return path;
  const simplified: Position[] = [path[0]];
  for (let i = 1; i < path.length - 1; i++) {
    const prev = path[i - 1];
    const curr = path[i];
    const next = path[i + 1];
    // If direction changes, it's a corner
    const isHorizontal = prev.y === curr.y && curr.y === next.y;
    const isVertical = prev.x === curr.x && curr.x === next.x;
    if (!isHorizontal && !isVertical) {
      simplified.push(curr);
    }
  }
  simplified.push(path[path.length - 1]);
  return simplified;
};

export const findAvailablePair = (grid: (TileData | null)[][]): [Position, Position] | null => {
  const tiles: TileData[] = [];
  grid.forEach(row => row.forEach(tile => { if (tile) tiles.push(tile); }));

  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i].value === tiles[j].value) {
        if (findPath(grid, tiles[i].pos, tiles[j].pos)) {
          return [tiles[i].pos, tiles[j].pos];
        }
      }
    }
  }
  return null;
};

export const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};
