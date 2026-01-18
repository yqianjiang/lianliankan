import { useState, useEffect, useCallback, useRef } from 'react';
import { Position, TileData, GameStatus, Theme, Level, ConnectionPath, GameStats } from '../types';
import { LEVELS, INITIAL_HINTS, INITIAL_SHUFFLES, THEMES } from '../constants';
import { findPath, findAvailablePair, shuffleArray, isSamePosition } from '../services/gameLogic';

const STORAGE_KEY = 'zen_match_stats';
const COMBO_WINDOW = 3000;

export const useGameLogic = () => {
  const [grid, setGrid] = useState<(TileData | null)[][]>([]);
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [currentLevel, setCurrentLevel] = useState<Level>(LEVELS[0]);
  const [theme, setTheme] = useState<Theme>(THEMES[0]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [hints, setHints] = useState(INITIAL_HINTS);
  const [shuffles, setShuffles] = useState(INITIAL_SHUFFLES);
  const [selected, setSelected] = useState<Position | null>(null);
  const [connection, setConnection] = useState<ConnectionPath | null>(null);
  const [hintedPair, setHintedPair] = useState<[Position, Position] | null>(null);
  const [wrongPair, setWrongPair] = useState<[Position, Position] | null>(null);
  const [stats, setStats] = useState<GameStats>({ totalGames: 0, highScores: {} });
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const [lastMatchTime, setLastMatchTime] = useState(0);

  const timerRef = useRef<number | null>(null);

  // Load stats from local storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStats({
          totalGames: parsed.totalGames || 0,
          highScores: parsed.highScores || {}
        });
      } catch (e) {
        console.error("Failed to parse stats", e);
      }
    }
  }, []);

  // Initialize Game
  const initGame = useCallback((level: Level = currentLevel, selectedTheme: Theme = theme) => {
    // Logic grid: Padded by 1 on each side for pathfinding
    const rows = level.rows + 2;
    const cols = level.cols + 2;
    const totalContentTiles = level.rows * level.cols;

    let items: string[] = [];
    const pool = selectedTheme.items;
    for (let i = 0; i < totalContentTiles / 2; i++) {
      const item = pool[i % pool.length];
      items.push(item, item);
    }
    items = shuffleArray(items);

    const newGrid: (TileData | null)[][] = [];
    let itemIdx = 0;

    for (let y = 0; y < rows; y++) {
      const row: (TileData | null)[] = [];
      for (let x = 0; x < cols; x++) {
        const isBorder = x === 0 || y === 0 || x === cols - 1 || y === rows - 1;
        if (isBorder) {
          row.push(null);
        } else {
          row.push({
            id: `${x}-${y}-${Math.random()}`,
            value: items[itemIdx++],
            type: selectedTheme.type,
            pos: { x, y }
          });
        }
      }
      newGrid.push(row);
    }

    setGrid(newGrid);
    setStatus(GameStatus.PLAYING);
    setScore(0);
    setTimeLeft(level.time);
    setHints(INITIAL_HINTS);
    setShuffles(INITIAL_SHUFFLES);
    setSelected(null);
    setConnection(null);
    setHintedPair(null);
    setIsNewRecord(false);
    setComboCount(0);
    setLastMatchTime(0);
  }, [currentLevel, theme]);

  // Timer Effect
  useEffect(() => {
    if (status === GameStatus.PLAYING && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setStatus(GameStatus.LOST);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status, timeLeft]);

  // Statistics Update
  useEffect(() => {
    if (status === GameStatus.WON) {
      const levelIdx = LEVELS.findIndex(l => l.id === currentLevel.id) + 1;
      const propsBonus = (hints + shuffles) * 50;
      const timeBonus = timeLeft * 10;
      const levelBonus = levelIdx * 100;
      const finalScore = score + propsBonus + timeBonus + levelBonus;

      const currentBest = stats.highScores[currentLevel.id] || 0;
      const newStats = { ...stats, totalGames: stats.totalGames + 1 };

      if (finalScore > currentBest) {
        newStats.highScores[currentLevel.id] = finalScore;
        setIsNewRecord(true);
      }
      setStats(newStats);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
    } else if (status === GameStatus.LOST) {
      const newStats = { ...stats, totalGames: stats.totalGames + 1 };
      setStats(newStats);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
    }
  }, [status]);

  // Combo Reset Effect
  useEffect(() => {
    if (comboCount > 0) {
      const timer = setTimeout(() => {
        setComboCount(0);
      }, COMBO_WINDOW);
      return () => clearTimeout(timer);
    }
  }, [comboCount, lastMatchTime]);

  const handleTileClick = (pos: Position) => {
    if (status !== GameStatus.PLAYING || wrongPair) return;
    const tile = grid[pos.y][pos.x];
    if (!tile) return;

    if (!selected) {
      setSelected(pos);
      return;
    }

    if (isSamePosition(selected, pos)) {
      setSelected(null);
      return;
    }

    const firstTile = grid[selected.y][selected.x];
    if (firstTile && firstTile.value === tile.value) {
      const path = findPath(grid, selected, pos);
      if (path) {
        setConnection({ points: path });
        
        // Scoring logic
        const now = Date.now();
        let newComboCount = 1;
        
        if (now - lastMatchTime <= COMBO_WINDOW) {
          newComboCount = comboCount + 1;
        }
        
        setComboCount(newComboCount);
        setLastMatchTime(now);
        
        const basePoints = 10;
        const comboBonus = newComboCount > 1 ? (newComboCount - 1) * 20 : 0;
        setScore(prev => prev + basePoints + comboBonus);
        
        setHintedPair(null);

        setTimeout(() => {
          const newGrid = [...grid.map(row => [...row])];
          newGrid[selected.y][selected.x] = null;
          newGrid[pos.y][pos.x] = null;
          setGrid(newGrid);
          setSelected(null);
          setConnection(null);

          const remaining = newGrid.flat().filter(t => t !== null);
          if (remaining.length === 0) {
            setStatus(GameStatus.WON);
          } else if (!findAvailablePair(newGrid)) {
            handleShuffle(true);
          }
        }, 300);
      } else {
        // Same value but no valid path
        setWrongPair([selected, pos]);
        setSelected(null);
        setTimeout(() => {
          setWrongPair(null);
        }, 500);
      }
    } else {
      // Different values
      setWrongPair([selected, pos]);
      setSelected(null);
      setTimeout(() => {
        setWrongPair(null);
      }, 500);
    }
  };

  const handleShuffle = (isAuto = false) => {
    if (!isAuto && shuffles <= 0) return;
    const currentTiles = grid.flat().filter(t => t !== null) as TileData[];
    let items = shuffleArray(currentTiles.map(t => t.value));
    const newGrid = [...grid.map(row => [...row])];
    let idx = 0;
    for (let y = 0; y < newGrid.length; y++) {
      for (let x = 0; x < newGrid[y].length; x++) {
        if (newGrid[y][x] !== null) {
          newGrid[y][x] = { ...newGrid[y][x]!, value: items[idx++] };
        }
      }
    }
    setGrid(newGrid);
    if (!isAuto) setShuffles(prev => prev - 1);
    if (!findAvailablePair(newGrid)) handleShuffle(true);
  };

  const handleHint = () => {
    if (hints <= 0) return;
    const pair = findAvailablePair(grid);
    if (pair) {
      setHintedPair(pair);
      setHints(prev => prev - 1);
      setTimeout(() => setHintedPair(null), 3000);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleNextLevel = () => {
    const currentIndex = LEVELS.findIndex(l => l.id === currentLevel.id);
    if (currentIndex < LEVELS.length - 1) {
      const next = LEVELS[currentIndex + 1];
      setCurrentLevel(next);
      initGame(next);
    }
  };

  return {
    // State
    grid,
    status,
    currentLevel,
    theme,
    score,
    timeLeft,
    hints,
    shuffles,
    selected,
    connection,
    hintedPair,
    wrongPair,
    stats,
    isNewRecord,
    comboCount,

    // Actions
    setTheme,
    setCurrentLevel,
    setStatus,
    initGame,
    handleTileClick,
    handleShuffle,
    handleHint,
    handleNextLevel,
    formatTime
  };
};