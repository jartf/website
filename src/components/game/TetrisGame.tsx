// Tetris Game - React component for Astro

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { t as i18nT } from '@/i18n/client'

// Tetromino shapes and colors
const TETROMINOS = {
  I: {
    shape: [
      [1, 1, 1, 1]
    ],
    color: 'bg-cyan-500',
    colorValue: '#06b6d4'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: 'bg-yellow-500',
    colorValue: '#eab308'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    color: 'bg-purple-500',
    colorValue: '#a855f7'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    color: 'bg-green-500',
    colorValue: '#22c55e'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    color: 'bg-red-500',
    colorValue: '#ef4444'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1]
    ],
    color: 'bg-blue-500',
    colorValue: '#3b82f6'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1]
    ],
    color: 'bg-orange-500',
    colorValue: '#f97316'
  }
}

type TetrominoType = keyof typeof TETROMINOS

// Music playlist - using SoundHelix demo tracks (reliable, CORS-enabled)
// These are royalty-free electronic/ambient tracks good for gaming
const musicPlaylist = [
  {
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    title: 'SoundHelix Song 1'
  },
  {
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    title: 'SoundHelix Song 2'
  },
  {
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    title: 'SoundHelix Song 3'
  },
  {
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    title: 'SoundHelix Song 4'
  },
  {
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    title: 'SoundHelix Song 5'
  },
]

// Game constants
const boardWidth = 10
const boardHeight = 20
const initialSpeed = 800
const speedIncrement = 50
const minSpeed = 100

// Create empty board
const createEmptyBoard = () =>
  Array(boardHeight).fill(null).map(() => Array(boardWidth).fill(null))

// Get random tetromino
const getRandomTetromino = (): TetrominoType => {
  const types = Object.keys(TETROMINOS) as TetrominoType[]
  return types[Math.floor(Math.random() * types.length)]
}

// Rotate matrix
const rotateMatrix = (matrix: number[][]): number[][] => {
  const rows = matrix.length
  const cols = matrix[0].length
  const rotated: number[][] = []
  for (let i = 0; i < cols; i++) {
    rotated[i] = []
    for (let j = rows - 1; j >= 0; j--) {
      rotated[i].push(matrix[j][i])
    }
  }
  return rotated
}

export default function TetrisGame() {
  const t = (key: string) => i18nT(`tetris.${key}`)

  // Game state
  const [board, setBoard] = useState(createEmptyBoard())
  const [currentPiece, setCurrentPiece] = useState<{
    type: TetrominoType
    shape: number[][]
    x: number
    y: number
  } | null>(null)
  const [nextPiece, setNextPiece] = useState<TetrominoType>(getRandomTetromino())
  const [score, setScore] = useState(0)
  const [, setLines] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isStarted, setIsStarted] = useState(false)

  // Music state
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Touch state
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const lastMoveRef = useRef<number>(0)
  const lastDropRef = useRef<number>(0)

  // Calculate speed based on level
  const getSpeed = useCallback(() => {
    return Math.max(minSpeed, initialSpeed - (level - 1) * speedIncrement)
  }, [level])

  // Check collision
  const checkCollision = useCallback((
    shape: number[][],
    x: number,
    y: number,
    boardState: (string | null)[][]
  ): boolean => {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const newX = x + col
          const newY = y + row
          if (
            newX < 0 ||
            newX >= boardWidth ||
            newY >= boardHeight ||
            (newY >= 0 && boardState[newY][newX])
          ) {
            return true
          }
        }
      }
    }
    return false
  }, [])

  // Lock piece to board
  // Place piece on board, clear lines, spawn next piece
  const placePieceAndSpawn = useCallback((pieceType: TetrominoType, shape: number[][], px: number, py: number) => {
    const newBoard = board.map(row => [...row])
    const color = TETROMINOS[pieceType].color

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const newY = py + row
          const newX = px + col
          if (newY >= 0 && newY < boardHeight && newX >= 0 && newX < boardWidth) {
            newBoard[newY][newX] = color
          }
        }
      }
    }

    // Clear completed lines
    let linesCleared = 0
    const finalBoard = newBoard.filter(row => {
      const isFull = row.every(cell => cell !== null)
      if (isFull) linesCleared++
      return !isFull
    })
    while (finalBoard.length < boardHeight) {
      finalBoard.unshift(Array(boardWidth).fill(null))
    }

    if (linesCleared > 0) {
      const points = [0, 100, 300, 500, 800][linesCleared] * level
      setScore(prev => prev + points)
      setLines(prev => {
        const newLines = prev + linesCleared
        const newLevel = Math.floor(newLines / 10) + 1
        if (newLevel > level) setLevel(newLevel)
        return newLines
      })
    }

    setBoard(finalBoard)

    const newType = nextPiece
    const newShape = TETROMINOS[newType].shape
    const startX = Math.floor((boardWidth - newShape[0].length) / 2)

    if (checkCollision(newShape, startX, 0, finalBoard)) {
      setGameOver(true)
      setCurrentPiece(null)
    } else {
      setCurrentPiece({ type: newType, shape: newShape, x: startX, y: 0 })
      setNextPiece(getRandomTetromino())
    }
  }, [board, nextPiece, level, checkCollision])

  // Lock piece to board
  const lockPiece = useCallback(() => {
    if (!currentPiece) return
    placePieceAndSpawn(currentPiece.type, currentPiece.shape, currentPiece.x, currentPiece.y)
  }, [currentPiece, placePieceAndSpawn])

  // Move piece
  const movePiece = useCallback((dx: number, dy: number) => {
    if (!currentPiece || gameOver || isPaused) return

    const newX = currentPiece.x + dx
    const newY = currentPiece.y + dy

    if (!checkCollision(currentPiece.shape, newX, newY, board)) {
      setCurrentPiece(prev => prev ? { ...prev, x: newX, y: newY } : null)
    } else if (dy > 0) {
      lockPiece()
    }
  }, [currentPiece, board, gameOver, isPaused, checkCollision, lockPiece])

  // Rotate piece
  const rotatePiece = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return

    const rotated = rotateMatrix(currentPiece.shape)

    if (!checkCollision(rotated, currentPiece.x, currentPiece.y, board)) {
      setCurrentPiece(prev => prev ? { ...prev, shape: rotated } : null)
      return
    }

    for (const kick of [-1, 1, -2, 2]) {
      if (!checkCollision(rotated, currentPiece.x + kick, currentPiece.y, board)) {
        setCurrentPiece(prev => prev ? { ...prev, shape: rotated, x: prev.x + kick } : null)
        return
      }
    }
  }, [currentPiece, board, gameOver, isPaused, checkCollision])

  // Hard drop
  const hardDrop = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return

    let dropY = currentPiece.y
    while (!checkCollision(currentPiece.shape, currentPiece.x, dropY + 1, board)) {
      dropY++
    }
    placePieceAndSpawn(currentPiece.type, currentPiece.shape, currentPiece.x, dropY)
  }, [currentPiece, board, gameOver, isPaused, checkCollision, placePieceAndSpawn])

  // Start game
  const startGame = useCallback(() => {
    setBoard(createEmptyBoard())
    setScore(0)
    setLines(0)
    setLevel(1)
    setGameOver(false)
    setIsStarted(true)
    setIsPaused(false)

    const type = getRandomTetromino()
    const shape = TETROMINOS[type].shape
    const startX = Math.floor((boardWidth - shape[0].length) / 2)

    setCurrentPiece({
      type,
      shape,
      x: startX,
      y: 0
    })
    setNextPiece(getRandomTetromino())
  }, [])

  // Toggle pause
  const togglePause = useCallback(() => {
    if (isStarted && !gameOver) {
      setIsPaused(prev => !prev)
    }
  }, [isStarted, gameOver])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isStarted) {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault()
          startGame()
        }
        return
      }

      if (gameOver) {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault()
          startGame()
        }
        return
      }

      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          e.preventDefault()
          movePiece(-1, 0)
          break
        case 'ArrowRight':
        case 'KeyD':
          e.preventDefault()
          movePiece(1, 0)
          break
        case 'ArrowDown':
        case 'KeyS':
          e.preventDefault()
          movePiece(0, 1)
          break
        case 'ArrowUp':
        case 'KeyW':
          e.preventDefault()
          rotatePiece()
          break
        case 'Space':
          e.preventDefault()
          hardDrop()
          break
        case 'KeyP':
        case 'Escape':
          e.preventDefault()
          togglePause()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isStarted, gameOver, movePiece, rotatePiece, hardDrop, togglePause, startGame])

  // Game loop
  useEffect(() => {
    if (!isStarted || gameOver || isPaused) return

    const interval = setInterval(() => {
      movePiece(0, 1)
    }, getSpeed())

    return () => clearInterval(interval)
  }, [isStarted, gameOver, isPaused, movePiece, getSpeed])

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart || !isStarted || gameOver || isPaused) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y
    const now = Date.now()

    // Horizontal movement
    if (Math.abs(deltaX) > 30 && now - lastMoveRef.current > 100) {
      movePiece(deltaX > 0 ? 1 : -1, 0)
      setTouchStart({ x: touch.clientX, y: touchStart.y })
      lastMoveRef.current = now
    }

    // Soft drop
    if (deltaY > 30 && now - lastDropRef.current > 50) {
      movePiece(0, 1)
      setTouchStart({ x: touchStart.x, y: touch.clientY })
      lastDropRef.current = now
    }
  }, [touchStart, isStarted, gameOver, isPaused, movePiece])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y

    // Tap to rotate
    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      rotatePiece()
    }

    // Swipe down for hard drop
    if (deltaY > 100 && Math.abs(deltaX) < 50) {
      hardDrop()
    }

    setTouchStart(null)
  }, [touchStart, rotatePiece, hardDrop])

  // Initialize audio on first user interaction
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.volume = 0.5
      audioRef.current.src = musicPlaylist[currentTrackIndex].url
      audioRef.current.onended = () => {
        setCurrentTrackIndex(prev => (prev + 1) % musicPlaylist.length)
      }
    }
  }, [])

  // Update track when index changes
  useEffect(() => {
    if (audioRef.current && isMusicPlaying) {
      audioRef.current.src = musicPlaylist[currentTrackIndex].url
      audioRef.current.load()
      audioRef.current.play().catch((err) => {
        console.warn('Failed to play track:', err)
        // Don't auto-advance here to avoid infinite loop
      })
    }
  }, [currentTrackIndex])

  // Music controls
  const toggleMusic = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.volume = 0.5
      audioRef.current.crossOrigin = 'anonymous'
      audioRef.current.src = musicPlaylist[currentTrackIndex].url
      audioRef.current.onended = () => {
        setCurrentTrackIndex(prev => (prev + 1) % musicPlaylist.length)
      }
      audioRef.current.onerror = () => {
        console.warn('Track failed to load, trying next...')
        setCurrentTrackIndex(prev => (prev + 1) % musicPlaylist.length)
      }
    }

    if (isMusicPlaying) {
      audioRef.current.pause()
      setIsMusicPlaying(false)
    } else {
      // Try to load and play
      audioRef.current.load()
      audioRef.current.play().then(() => {
        setIsMusicPlaying(true)
      }).catch((err) => {
        console.error('Audio playback failed:', err)
        // Try next track
        setCurrentTrackIndex(prev => (prev + 1) % musicPlaylist.length)
        setIsMusicPlaying(false)
      })
    }
  }, [isMusicPlaying, currentTrackIndex])

  // Render the board with current piece
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row])

    // Add current piece to display
    if (currentPiece) {
      const { type, shape, x, y } = currentPiece
      const color = TETROMINOS[type].color

      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col]) {
            const boardY = y + row
            const boardX = x + col
            if (boardY >= 0 && boardY < boardHeight && boardX >= 0 && boardX < boardWidth) {
              displayBoard[boardY][boardX] = color
            }
          }
        }
      }

      // Add ghost piece
      let ghostY = y
      while (!checkCollision(shape, x, ghostY + 1, board)) {
        ghostY++
      }

      if (ghostY !== y) {
        for (let row = 0; row < shape.length; row++) {
          for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
              const boardY = ghostY + row
              const boardX = x + col
              if (boardY >= 0 && boardY < boardHeight && boardX >= 0 && boardX < boardWidth && !displayBoard[boardY][boardX]) {
                displayBoard[boardY][boardX] = 'ghost'
              }
            }
          }
        }
      }
    }

    return displayBoard
  }

  const displayBoard = renderBoard()

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
                  gridTemplateColumns: `repeat(${boardWidth}, 1fr)`,
                  width: 'min(80vw, 300px)',
                  aspectRatio: `${boardWidth}/${boardHeight}`
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
