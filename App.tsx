
import React from 'react';
import { Theme } from './types';
import { useGameLogic } from './hooks/useGameLogic';
import Header from './components/Header';
import Footer from './components/Footer';
import GameBoard from './components/GameBoard';
import StartScreen from './components/StartScreen';
import PauseScreen from './components/PauseScreen';
import GameOverScreen from './components/GameOverScreen';

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
    <div className={`${gameLogic.theme.bgColor} min-h-150 flex flex-col items-center p-2 sm:p-4 transition-colors duration-500 overflow-auto`}>
      <Header
        status={gameLogic.status}
        score={gameLogic.score}
        timeLeft={gameLogic.timeLeft}
        currentLevel={gameLogic.currentLevel}
        onPauseToggle={() => gameLogic.setStatus(gameLogic.status === 'PAUSED' ? 'PLAYING' : 'PAUSED')}
        onSettings={() => gameLogic.setStatus('IDLE')}
        formatTime={gameLogic.formatTime}
      />

      <div className="relative flex-1 w-full flex items-center justify-center p-1 sm:p-4">
        {gameLogic.status === 'IDLE' ? (
          <StartScreen
            theme={gameLogic.theme}
            stats={gameLogic.stats}
            onThemeSelect={handleThemeSelect}
            onLevelSelect={handleLevelSelect}
            formatTime={gameLogic.formatTime}
          />
        ) : <>
        <div className="relative p-1.5 sm:p-5 bg-slate-200/20 rounded-3xl sm:rounded-[2.5rem] border-2 sm:border-4 border-white/60 shadow-inner overflow-x-auto shrink-0 mx-3">
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
              wrongPair={gameLogic.wrongPair}
              connection={gameLogic.connection}
              isMobile={gameLogic.isMobile}
              onTileClick={gameLogic.handleTileClick}
            />
         </div>
        </>
        }

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
