"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { RotateCcw, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Undo2 } from "lucide-react"
import { useTheme } from "next-themes"
import { Firefly } from "@/components/firefly"
import { useTranslation } from "react-i18next"
import { usePlatform } from "@/hooks/use-platform"
import { useViewport } from "@/hooks/use-viewport"
import { useGame2048, getTileColor, getFontSize } from "@/hooks/use-game-2048"
import { useMounted } from "@/hooks/use-mounted"

function Game2048() {
  const { t } = useTranslation()
  const { theme, resolvedTheme } = useTheme()
  const mounted = useMounted()
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 })
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 })
  const { isMobile } = useViewport()
  const { isDesktop } = usePlatform()
  const touchCooldowns = useRef({
    left: 0,
    right: 0,
    up: 0,
    down: 0,
  })
  const TOUCH_COOLDOWN = 200 // Cooldown in milliseconds

  const {
    board,
    score,
    bestScore,
    gameOver,
    gameWon,
    animatingTiles,
    isAnimating,
    undoMove,
    processMove,
    resetGame,
    continueGame,
  } = useGame2048()

  // Handle touch controls
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    })
  }

  const handleTouchAction = (action: () => void, actionType: "left" | "right" | "up" | "down") => {
    const now = Date.now()
    if (now - touchCooldowns.current[actionType] < TOUCH_COOLDOWN) {
      return // Still in cooldown period
    }

    // Update the cooldown timestamp
    touchCooldowns.current[actionType] = now

    // Execute the action
    action()
  }

  const handleTouchEnd = () => {
    if (gameOver || isAnimating) return

    const deltaX = touchEnd.x - touchStart.x
    const deltaY = touchEnd.y - touchStart.y

    // Minimum swipe distance
    const minSwipeDistance = 30

    if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
      return // Not a swipe
    }

    // Determine swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > 0) {
        // Swipe right
        handleTouchAction(() => processMove("right"), "right")
      } else {
        // Swipe left
        handleTouchAction(() => processMove("left"), "left")
      }
    } else {
      // Vertical swipe
      if (deltaY > 0) {
        // Swipe down
        handleTouchAction(() => processMove("down"), "down")
      } else {
        // Swipe up
        handleTouchAction(() => processMove("up"), "up")
      }
    }
  }

  // Handle keyboard controls
  useEffect(() => {
    if (!mounted || gameOver) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore all game controls if Ctrl is held
      if (e.ctrlKey) {
        return
      }
      if (gameOver || isAnimating) return

      // Prevent default browser behavior for game control keys
      if (["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", "w", "a", "s", "d", "W", "A", "S", "D"].includes(e.key)) {
        e.preventDefault()
      }

      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          processMove("left")
          break
        case "ArrowRight":
        case "d":
        case "D":
          processMove("right")
          break
        case "ArrowUp":
        case "w":
        case "W":
          processMove("up")
          break
        case "ArrowDown":
        case "s":
        case "S":
          processMove("down")
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [board, gameOver, mounted, isAnimating, processMove])

  if (!mounted) return null

  const isDark = theme === "dark" || resolvedTheme === "dark"
  const showKeyboardControls = isDesktop || !isMobile

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {isDark && <Firefly count={15} />}

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">2048</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("2048.description", "Join the tiles, get to 2048!")}
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center mb-2">
                <div className="bg-card border rounded-lg p-3 text-center min-w-[120px]">
                  <div className="text-sm font-medium text-muted-foreground">{t("2048.score", "Score")}</div>
                  <div className="text-2xl font-bold">{score}</div>
                </div>

                <div className="bg-card border rounded-lg p-3 text-center min-w-[120px]">
                  <div className="text-sm font-medium text-muted-foreground">{t("2048.best", "Best")}</div>
                  <div className="text-2xl font-bold">{bestScore}</div>
                </div>
              </div>

              <div
                className="bg-card border rounded-lg p-4 relative"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className="grid grid-cols-4 gap-2 bg-muted rounded-lg p-2">
                  {board.map((row, i) =>
                    row.map((cell, j) => {
                      const key = `${i}-${j}-${cell}`
                      const animation = animatingTiles[key]

                      return (
                        <motion.div
                          key={key}
                          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center ${getTileColor(cell, isDark)}`}
                          initial={
                            animation
                              ? {
                                  x: (animation.from.col - j) * 84,
                                  y: (animation.from.row - i) * 84,
                                  scale: animation.merged ? 0.8 : 1,
                                }
                              : { scale: cell ? 0 : 1 }
                          }
                          animate={{
                            x: 0,
                            y: 0,
                            scale: 1,
                          }}
                          transition={{
                            duration: 0.15,
                            ease: animation?.merged ? "easeOut" : "easeInOut",
                          }}
                        >
                          {cell !== 0 && (
                            <motion.span
                              className={`font-bold ${getFontSize(cell)}`}
                              animate={
                                animation?.merged
                                  ? {
                                      scale: [1, 1.2, 1],
                                    }
                                  : {}
                              }
                              transition={{
                                duration: 0.15,
                                times: [0, 0.5, 1],
                                ease: "easeInOut",
                              }}
                            >
                              {cell}
                            </motion.span>
                          )}
                        </motion.div>
                      )
                    }),
                  )}
                </div>

                {/* Game Over Overlay */}
                <AnimatePresence>
                  {gameOver && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg"
                    >
                      <h2 className="text-2xl md:text-3xl font-bold text-red-500 mb-3">
                        {t("2048.gameOver", "Game Over")}
                      </h2>
                      <p className="text-base md:text-lg mb-4">
                        {t("2048.finalScore", "Final Score")}: <span className="font-bold">{score}</span>
                      </p>
                      <Button onClick={resetGame} size="lg">
                        {t("2048.tryAgain", "Try Again")}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Win Overlay */}
                <AnimatePresence>
                  {gameWon && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg"
                    >
                      <Trophy className="h-12 w-12 text-yellow-500 mb-2" />
                      <h2 className="text-2xl md:text-3xl font-bold text-green-500 mb-3">
                        {t("2048.youWin", "You Win!")}
                      </h2>
                      <p className="text-base md:text-lg mb-4">
                        {t("2048.currentScore", "Current Score")}: <span className="font-bold">{score}</span>
                      </p>
                      <div className="flex gap-3">
                        <Button onClick={continueGame} variant="outline">
                          {t("2048.keepPlaying", "Keep Playing")}
                        </Button>
                        <Button onClick={resetGame}>{t("2048.newGame", "New Game")}</Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Touch Controls for Mobile */}
              <div className="md:hidden mt-4">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="col-span-3 flex justify-center">
                    <button
                      className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center"
                      onClick={() => processMove("up")}
                      aria-label="Move up"
                    >
                      <ArrowUp className="h-8 w-8" />
                    </button>
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center"
                      onClick={() => processMove("left")}
                      aria-label="Move left"
                    >
                      <ArrowLeft className="h-8 w-8" />
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <button
                      className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center"
                      onClick={() => processMove("down")}
                      aria-label="Move down"
                    >
                      <ArrowDown className="h-8 w-8" />
                    </button>
                  </div>
                  <div className="flex justify-start">
                    <button
                      className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center"
                      onClick={() => processMove("right")}
                      aria-label="Move right"
                    >
                      <ArrowRight className="h-8 w-8" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 w-full">
                <Button onClick={undoMove} className="flex-1" disabled={isAnimating}>
                  <Undo2 className="mr-2 h-4 w-4" />
                  {t("2048.undo", "Undo")}
                </Button>
                <Button onClick={resetGame} className="flex-1">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {t("2048.newGame", "New Game")}
                </Button>
              </div>
            </div>

            <div className="bg-card border rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">{t("2048.howToPlay", "How to Play")}</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  {t(
                    "2048.instructions1",
                    "Use your arrow keys to move the tiles. Tiles with the same number merge into one when they touch.",
                  )}
                </p>
                <p>{t("2048.instructions2", "Add them up to reach 2048!")}</p>
                <p>
                  {t(
                    "2048.instructions3",
                    "When all squares are occupied and no adjacent tiles have the same value, the game ends.",
                  )}
                </p>
                <p className="text-sm">
                  {t(
                    "2048.instructions4",
                    "After reaching 2048, you can continue playing to achieve even higher scores!",
                  )}
                </p>
              </div>

              {/* Conditionally render keyboard controls section */}
              {showKeyboardControls && (
                <>
                  <h3 className="text-xl font-bold mt-6 mb-3">{t("2048.controls", "Controls")}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="inline-block w-8 h-8 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded">
                          <ArrowLeft className="h-4 w-4" />
                        </span>
                        <span className="inline-block w-8 h-8 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded">
                          A
                        </span>
                      </div>
                      <span>{t("2048.moveLeft", "Move Left")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="inline-block w-8 h-8 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded">
                          <ArrowRight className="h-4 w-4" />
                        </span>
                        <span className="inline-block w-8 h-8 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded">
                          D
                        </span>
                      </div>
                      <span>{t("2048.moveRight", "Move Right")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="inline-block w-8 h-8 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded">
                          <ArrowUp className="h-4 w-4" />
                        </span>
                        <span className="inline-block w-8 h-8 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded">
                          W
                        </span>
                      </div>
                      <span>{t("2048.moveUp", "Move Up")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="inline-block w-8 h-8 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded">
                          <ArrowDown className="h-4 w-4" />
                        </span>
                        <span className="inline-block w-8 h-8 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded">
                          S
                        </span>
                      </div>
                      <span>{t("2048.moveDown", "Move Down")}</span>
                    </div>
                  </div>
                </>
              )}

              {isMobile && (
                <p className="mt-6 text-sm text-muted-foreground">
                  {t("2048.touchInstructions", "On mobile devices, use the on-screen controls to move tiles.")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Game2048
