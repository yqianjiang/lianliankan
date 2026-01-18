
import React from 'react';
import { Theme } from './types';
import { useGameLogic } from './hooks/useGameLogic';
import { Header, StartScreen, GameOverScreen, PauseScreen, GameBoard, Footer } from './components';

const App: React.FC = () => {
  const gameLogic = useGameLogic();

  const handleThemeSelect = (theme: Theme) => {
    gameLogic.setTheme(theme);
  };

  const handleLevelSelect = (level: any) => {
    gameLogic.setCurrentLevel(level);
    gameLogic.initGame(level);
  };

  return (
    <div className={`fixed inset-0 ${gameLogic.theme.bgColor} flex flex-col items-center p-2 sm:p-4 transition-colors duration-500 overflow-hidden`}>
      <Header
        status={gameLogic.status}
        score={gameLogic.score}
        timeLeft={gameLogic.timeLeft}
        currentLevel={gameLogic.currentLevel}
        onPauseToggle={() => gameLogic.setStatus(gameLogic.status === 'PAUSED' ? 'PLAYING' : 'PAUSED')}
        onSettings={() => gameLogic.setStatus('IDLE')}
        formatTime={gameLogic.formatTime}
      />

      <div className="relative flex-1 w-full flex items-center justify-center p-1 sm:p-4 overflow-hidden">
        {gameLogic.status === 'IDLE' && (
          <StartScreen
            theme={gameLogic.theme}
            stats={gameLogic.stats}
            onThemeSelect={handleThemeSelect}
            onLevelSelect={handleLevelSelect}
            formatTime={gameLogic.formatTime}
          />
        )}

        <GameOverScreen
          status={gameLogic.status}
          currentLevel={gameLogic.currentLevel}
          score={gameLogic.score}
          timeLeft={gameLogic.timeLeft}
          levelTime={gameLogic.currentLevel.time}
          isNewRecord={gameLogic.isNewRecord}
          onNextLevel={gameLogic.handleNextLevel}
          onRestart={() => gameLogic.initGame()}
          onBackToMenu={() => gameLogic.setStatus('IDLE')}
          formatTime={gameLogic.formatTime}
        />

        <PauseScreen
          status={gameLogic.status}
          onResume={() => gameLogic.setStatus('PLAYING')}
        />

        <GameBoard
          grid={gameLogic.grid}
          status={gameLogic.status}
          selected={gameLogic.selected}
          hintedPair={gameLogic.hintedPair}
          connection={gameLogic.connection}
          isMobile={gameLogic.isMobile}
          onTileClick={gameLogic.handleTileClick}
        />
      </div>

      <Footer
        status={gameLogic.status}
        hints={gameLogic.hints}
        shuffles={gameLogic.shuffles}
        onHint={gameLogic.handleHint}
        onShuffle={gameLogic.handleShuffle}
      />
    </div>
  );
};

export default App;
