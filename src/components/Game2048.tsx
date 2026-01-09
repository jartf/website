// 2048 - React component for Astro
// Ported from Next.js v4

import { useEffect, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@nanostores/react'
import { languageStore, initLanguage, t as i18nT } from '@/i18n'
import { useGame2048, getTileColor, getFontSize } from '@/hooks/use-game-2048'

// Size of each tile for animation calculations
const TILE_SIZE = 80 // Approximate size including gap

export default function Game2048() {
  // Subscribe so the component re-renders on language changes
  const lang = useStore(languageStore)
  void lang

  useEffect(() => {
    // Use pre-detected language if available for faster initialization
    const initialLang = (window as any).__INITIAL_LANG__
    if (initialLang && initialLang !== languageStore.get()) {
      languageStore.set(initialLang)
      return
    }

    initLanguage()
  }, [])

  const t = useCallback((key: string, fallback?: string): string => {
    const fullKey = `2048.${key}`
    const translated = i18nT(fullKey)
    return translated === fullKey ? (fallback ?? fullKey) : translated
  }, [])

  const {
    board,
    score,
    bestScore,
    gameOver,
    gameWon,
    history,
    animatingTiles,
    isAnimating,
    undoMove,
    processMove,
    resetGame,
    continueGame,
  } = useGame2048()

  // Theme detection
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkTheme()

    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameWon || gameOver) return

      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          e.preventDefault()
          processMove('left')
          break
        case 'ArrowRight':
        case 'KeyD':
          e.preventDefault()
          processMove('right')
          break
        case 'ArrowUp':
        case 'KeyW':
          e.preventDefault()
          processMove('up')
          break
        case 'ArrowDown':
        case 'KeyS':
          e.preventDefault()
          processMove('down')
          break
        case 'KeyZ':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            undoMove()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameWon, gameOver, processMove, undoMove])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title', '2048')}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('description', 'Join the tiles, get to 2048!')}
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8">
          {/* Left column - Game */}
          <div className="flex flex-col gap-4">
            {/* Score display */}
            <div className="flex justify-between items-center mb-2">
              <div className="bg-card border rounded-lg p-3 text-center min-w-[120px]">
                <div className="text-sm font-medium text-muted-foreground">{t('score', 'Score')}</div>
                <div className="text-2xl font-bold">{score}</div>
              </div>
              <div className="bg-card border rounded-lg p-3 text-center min-w-[120px]">
                <div className="text-sm font-medium text-muted-foreground">{t('best', 'Best')}</div>
                <div className="text-2xl font-bold">{bestScore}</div>
              </div>
            </div>

            {/* Game board */}
            <div className="bg-card border rounded-lg p-4 relative">
              <div
                className="grid grid-cols-4 gap-2 bg-muted rounded-lg p-2 w-[min(80vw,340px)]"
              >
                {board.map((row, rowIndex) =>
                  row.map((cell, colIndex) => {
                    const key = `${rowIndex}-${colIndex}-${cell}`
                    const animation = animatingTiles[key]

                    const initialX = animation ? (animation.from.col - colIndex) * TILE_SIZE : 0
                    const initialY = animation ? (animation.from.row - rowIndex) * TILE_SIZE : 0

                    return (
                      <motion.div
                        key={key}
                        className={`
                          w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center
                          ${getTileColor(cell, isDark)}
                          ${getFontSize(cell)}
                        `}
                        initial={
                          animation
                            ? { x: initialX, y: initialY, scale: animation.merged ? 0.8 : 1 }
                            : cell ? { scale: 0 } : { scale: 1 }
                        }
                        animate={{ x: 0, y: 0, scale: 1 }}
                        transition={{ duration: 0.15, ease: animation?.merged ? 'easeOut' : 'easeInOut' }}
                      >
                        {cell > 0 && (
                          <motion.span
                            className="font-bold"
                            animate={animation?.merged ? { scale: [1, 1.2, 1] } : {}}
                            transition={{ duration: 0.15, times: [0, 0.5, 1], ease: 'easeInOut' }}
                          >
                            {cell}
                          </motion.span>
                        )}
                      </motion.div>
                    )
                  })
                )}
              </div>

              {/* Game over overlay */}
              <AnimatePresence>
                {gameOver && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg"
                  >
                    <h2 className="text-2xl md:text-3xl font-bold text-red-500 mb-3">{t('gameOver', 'Game Over!')}</h2>
                    <p className="text-base md:text-lg mb-4">{t('finalScore', 'Final score')}: <span className="font-bold">{score}</span></p>
                    <button
                      onClick={resetGame}
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors"
                    >
                      {t('tryAgain', 'Try again')}
                    </button>
                  </motion.div>
                )}

                {gameWon && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg"
                  >
                    <span className="text-4xl mb-2">🏆</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-green-500 mb-3">{t('youWin', 'You win!')}</h2>
                    <p className="text-base md:text-lg mb-4">{t('currentScore', 'Current score')}: <span className="font-bold">{score}</span></p>
                    <div className="flex gap-3">
                      <button
                        onClick={continueGame}
                        className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
                      >
                        {t('keepPlaying', 'Keep playing')}
                      </button>
                      <button
                        onClick={resetGame}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        {t('newGame', 'New game')}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile on-screen controls */}
            <div className="md:hidden flex justify-center">
              <div className="grid grid-cols-3 gap-2">
                <div />
                <button
                  type="button"
                  onClick={() => processMove('up')}
                  disabled={gameOver || gameWon || isAnimating}
                  aria-label={t('moveUp', 'Move up')}
                  className="w-14 h-14 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  ↑
                </button>
                <div />
                <button
                  type="button"
                  onClick={() => processMove('left')}
                  disabled={gameOver || gameWon || isAnimating}
                  aria-label={t('moveLeft', 'Move left')}
                  className="w-14 h-14 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => processMove('down')}
                  disabled={gameOver || gameWon || isAnimating}
                  aria-label={t('moveDown', 'Move down')}
                  className="w-14 h-14 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => processMove('right')}
                  disabled={gameOver || gameWon || isAnimating}
                  aria-label={t('moveRight', 'Move right')}
                  className="w-14 h-14 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  →
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 w-full">
              <button
                onClick={undoMove}
                disabled={history.length === 0 || isAnimating}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                {t('undo', 'Undo')}
              </button>
              <button
                onClick={resetGame}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t('newGame', 'New game')}
              </button>
            </div>
          </div>

          {/* Right column - How to Play & Controls */}
          <section className="bg-card border rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{t('howToPlay', 'How to play')}</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>{t('instructions1')}</p>
              <p>{t('instructions2')}</p>
              <p>{t('instructions3')}</p>
              <p className="text-sm">{t('instructions4')}</p>
            </div>

            {/* Controls section */}
            <h3 className="text-xl font-bold mt-6 mb-3">{t('controls', 'Controls')}</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="inline-flex w-8 h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded">←</span>
                  <span className="inline-flex w-8 h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded">A</span>
                </div>
                <span>{t('moveLeft', 'Move left')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="inline-flex w-8 h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded">→</span>
                  <span className="inline-flex w-8 h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded">D</span>
                </div>
                <span>{t('moveRight', 'Move right')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="inline-flex w-8 h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded">↑</span>
                  <span className="inline-flex w-8 h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded">W</span>
                </div>
                <span>{t('moveUp', 'Move up')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="inline-flex w-8 h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded">↓</span>
                  <span className="inline-flex w-8 h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded">S</span>
                </div>
                <span>{t('moveDown', 'Move down')}</span>
              </div>
            </div>

            <p className="mt-6 text-sm text-muted-foreground md:hidden">
              {t('touchInstructions')}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
