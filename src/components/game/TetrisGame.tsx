// Tetris - React component

import { motion, AnimatePresence } from 'framer-motion'
import { t as i18nT } from '@/i18n/client'
import {
  useTetris,
  TETROMINOS,
  musicPlaylist,
  BOARD_WIDTH,
  BOARD_HEIGHT,
} from '@/hooks/game/use-tetris'

export default function TetrisGame() {
  const t = (key: string) => i18nT(`tetris.${key}`)

  const {
    displayBoard,
    nextPiece,
    score,
    level,
    gameOver,
    isPaused,
    isStarted,
    isMusicPlaying,
    currentTrackIndex,
    startGame,
    togglePause,
    toggleMusic,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useTetris()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8">
          {/* Game board */}
          <div className="bg-card border rounded-lg shadow-lg p-4 relative">
            <div
              className="relative"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="grid gap-px bg-slate-800"
                style={{
                  gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
                  width: 'min(80vw, 300px)',
                  aspectRatio: `${BOARD_WIDTH}/${BOARD_HEIGHT}`
                }}
              >
                {displayBoard.map((row, y) =>
                  row.map((cell, x) => (
                    <div
                      key={`${x}-${y}`}
                      className={`
                        aspect-square
                        ${cell === 'ghost'
                          ? 'bg-slate-700/50 border border-slate-500/30'
                          : cell
                            ? `${cell} shadow-inner`
                            : 'bg-slate-900/50'
                        }
                      `}
                    />
                  ))
                )}
              </div>

              {/* Overlays */}
              <AnimatePresence>
                {!isStarted && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg"
                  >
                    <button
                      onClick={startGame}
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary/90 transition-colors"
                    >
                      {t("start")}
                    </button>
                  </motion.div>
                )}

                {isPaused && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg"
                  >
                    <p className="text-2xl font-bold mb-4">{t("pause")}</p>
                    <button
                      onClick={togglePause}
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors"
                    >
                      {t("resume")}
                    </button>
                  </motion.div>
                )}

                {gameOver && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg"
                  >
                    <p className="text-3xl font-bold mb-2 text-red-500">{t("gameOver")}</p>
                    <p className="text-xl mb-4">{t("score")}: {score}</p>
                    <button
                      onClick={startGame}
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors"
                    >
                      {t("playAgain")}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right column - Info panels */}
          <div className="flex flex-col gap-6 w-full max-w-md">
            {/* Game Info panel */}
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">{t("gameInfo")}</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">{t("score")}:</span>
                  <span className="text-primary font-bold">{score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t("level")}:</span>
                  <span className="text-primary font-bold">{level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t("status")}:</span>
                  <span className={`font-bold ${gameOver ? 'text-red-500' : isPaused ? 'text-amber-500' : 'text-green-500'}`}>
                    {gameOver ? t("gameOver") : isPaused ? t("paused") : isStarted ? t("playing") : t("ready")}
                  </span>
                </div>
              </div>

              {/* Next piece preview */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">{t("next")}</p>
                <div className="flex justify-center">
                  <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${TETROMINOS[nextPiece].shape[0].length}, 20px)` }}>
                    {TETROMINOS[nextPiece].shape.map((row, y) =>
                      row.map((cell, x) => (
                        <div
                          key={`next-${x}-${y}`}
                          className={`w-5 h-5 ${cell ? TETROMINOS[nextPiece].color : 'bg-transparent'}`}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls panel */}
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">{t("controls")}</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="inline-flex w-8 h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded">←</span>
                    <span className="inline-flex w-8 h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded">A</span>
                  </div>
                  <span>{t("moveLeft")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="inline-flex w-8 h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded">→</span>
                    <span className="inline-flex w-8 h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded">D</span>
                  </div>
                  <span>{t("moveRight")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="inline-flex w-8 h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded">↓</span>
                    <span className="inline-flex w-8 h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded">S</span>
                  </div>
                  <span>{t("moveDown")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="inline-flex w-8 h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded">↑</span>
                    <span className="inline-flex w-8 h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded">W</span>
                  </div>
                  <span>{t("rotate")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex min-w-[65px] h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded px-2">Space</span>
                  <span>{t("hardDrop")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex w-8 h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded">P</span>
                  <span>{t("pauseGame")}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={startGame}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {gameOver ? t("playAgain") : t("reset")}
              </button>
              <button
                onClick={toggleMusic}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${isMusicPlaying ? 'bg-primary text-primary-foreground' : 'border hover:bg-muted'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                {isMusicPlaying ? t("musicOn") : t("musicOff")}
              </button>
            </div>

            {/* Now playing */}
            {isMusicPlaying && (
              <div className="text-sm text-muted-foreground">
                🎵 {t("nowPlaying")}: {musicPlaylist[currentTrackIndex].title}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
