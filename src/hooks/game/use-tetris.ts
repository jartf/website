// Tetris game hook
import { useState, useEffect, useCallback, useRef } from 'react'

// Constants

export const TETROMINOS = {
  I: {
    shape: [[1, 1, 1, 1]],
    color: 'bg-cyan-500',
    colorValue: '#06b6d4',
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: 'bg-yellow-500',
    colorValue: '#eab308',
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: 'bg-purple-500',
    colorValue: '#a855f7',
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: 'bg-green-500',
    colorValue: '#22c55e',
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: 'bg-red-500',
    colorValue: '#ef4444',
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: 'bg-blue-500',
    colorValue: '#3b82f6',
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: 'bg-orange-500',
    colorValue: '#f97316',
  },
} as const

export type TetrominoType = keyof typeof TETROMINOS

export type CurrentPiece = {
  type: TetrominoType
  shape: number[][]
  x: number
  y: number
}

export type TetrisBoard = (string | null)[][]

export const BOARD_WIDTH = 10
export const BOARD_HEIGHT = 20

const INITIAL_SPEED = 800
const SPEED_INCREMENT = 50
const MIN_SPEED = 100

// Music playlist

export const musicPlaylist = [
  { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', title: 'SoundHelix Song 1' },
  { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', title: 'SoundHelix Song 2' },
  { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', title: 'SoundHelix Song 3' },
  { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', title: 'SoundHelix Song 4' },
  { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', title: 'SoundHelix Song 5' },
]

// Pure utilities

export const createEmptyBoard = (): TetrisBoard =>
  Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null))

export const getRandomTetromino = (): TetrominoType => {
  const types = Object.keys(TETROMINOS) as TetrominoType[]
  return types[Math.floor(Math.random() * types.length)]
}

export const rotateMatrix = (matrix: number[][]): number[][] => {
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

export const isColliding = (
  shape: number[][],
  x: number,
  y: number,
  board: TetrisBoard
): boolean => {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const nx = x + col
        const ny = y + row
        if (nx < 0 || nx >= BOARD_WIDTH || ny >= BOARD_HEIGHT || (ny >= 0 && board[ny][nx])) {
          return true
        }
      }
    }
  }
  return false
}

/** Builds the display board: placed pieces + ghost piece + active piece. */
export const buildDisplayBoard = (board: TetrisBoard, piece: CurrentPiece | null): TetrisBoard => {
  const display = board.map((row) => [...row])
  if (!piece) return display

  const { type, shape, x, y } = piece
  const color = TETROMINOS[type].color

  // Ghost piece
  let ghostY = y
  while (!isColliding(shape, x, ghostY + 1, board)) ghostY++

  if (ghostY !== y) {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const by = ghostY + row
          const bx = x + col
          if (by >= 0 && by < BOARD_HEIGHT && bx >= 0 && bx < BOARD_WIDTH && !display[by][bx]) {
            display[by][bx] = 'ghost'
          }
        }
      }
    }
  }

  // Active piece (drawn after ghost so it always wins)
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const by = y + row
        const bx = x + col
        if (by >= 0 && by < BOARD_HEIGHT && bx >= 0 && bx < BOARD_WIDTH) {
          display[by][bx] = color
        }
      }
    }
  }

  return display
}

// Hook

export function useTetris() {
  // Game state
  const [board, setBoard] = useState<TetrisBoard>(createEmptyBoard)
  const [currentPiece, setCurrentPiece] = useState<CurrentPiece | null>(null)
  const [nextPiece, setNextPiece] = useState<TetrominoType>(getRandomTetromino)
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

  // Speed

  const getSpeed = useCallback(
    () => Math.max(MIN_SPEED, INITIAL_SPEED - (level - 1) * SPEED_INCREMENT),
    [level]
  )

  // Core: place piece, clear lines, spawn next

  const placePieceAndSpawn = useCallback(
    (pieceType: TetrominoType, shape: number[][], px: number, py: number) => {
      const newBoard = board.map((row) => [...row])
      const color = TETROMINOS[pieceType].color

      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col]) {
            const ny = py + row
            const nx = px + col
            if (ny >= 0 && ny < BOARD_HEIGHT && nx >= 0 && nx < BOARD_WIDTH) {
              newBoard[ny][nx] = color
            }
          }
        }
      }

      let linesCleared = 0
      const finalBoard = newBoard.filter((row) => {
        const full = row.every((cell) => cell !== null)
        if (full) linesCleared++
        return !full
      })
      while (finalBoard.length < BOARD_HEIGHT) {
        finalBoard.unshift(Array(BOARD_WIDTH).fill(null))
      }

      if (linesCleared > 0) {
        const points = [0, 100, 300, 500, 800][linesCleared] * level
        setScore((prev) => prev + points)
        setLines((prev) => {
          const newLines = prev + linesCleared
          const newLevel = Math.floor(newLines / 10) + 1
          if (newLevel > level) setLevel(newLevel)
          return newLines
        })
      }

      setBoard(finalBoard)

      const newType = nextPiece
      const newShape = TETROMINOS[newType].shape.map((r) => [...r])
      const startX = Math.floor((BOARD_WIDTH - newShape[0].length) / 2)

      if (isColliding(newShape, startX, 0, finalBoard)) {
        setGameOver(true)
        setCurrentPiece(null)
      } else {
        setCurrentPiece({ type: newType, shape: newShape, x: startX, y: 0 })
        setNextPiece(getRandomTetromino())
      }
    },
    [board, nextPiece, level]
  )

  const lockPiece = useCallback(() => {
    if (!currentPiece) return
    placePieceAndSpawn(currentPiece.type, currentPiece.shape, currentPiece.x, currentPiece.y)
  }, [currentPiece, placePieceAndSpawn])

  // Move actions

  const movePiece = useCallback(
    (dx: number, dy: number) => {
      if (!currentPiece || gameOver || isPaused) return

      const nx = currentPiece.x + dx
      const ny = currentPiece.y + dy

      if (!isColliding(currentPiece.shape, nx, ny, board)) {
        setCurrentPiece((prev) => (prev ? { ...prev, x: nx, y: ny } : null))
      } else if (dy > 0) {
        lockPiece()
      }
    },
    [currentPiece, board, gameOver, isPaused, lockPiece]
  )

  const rotatePiece = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return

    const rotated = rotateMatrix(currentPiece.shape)

    if (!isColliding(rotated, currentPiece.x, currentPiece.y, board)) {
      setCurrentPiece((prev) => (prev ? { ...prev, shape: rotated } : null))
      return
    }

    for (const kick of [-1, 1, -2, 2]) {
      if (!isColliding(rotated, currentPiece.x + kick, currentPiece.y, board)) {
        setCurrentPiece((prev) => (prev ? { ...prev, shape: rotated, x: prev.x + kick } : null))
        return
      }
    }
  }, [currentPiece, board, gameOver, isPaused])

  const hardDrop = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return

    let dropY = currentPiece.y
    while (!isColliding(currentPiece.shape, currentPiece.x, dropY + 1, board)) dropY++

    placePieceAndSpawn(currentPiece.type, currentPiece.shape, currentPiece.x, dropY)
  }, [currentPiece, board, gameOver, isPaused, placePieceAndSpawn])

  // Lifecycle

  const startGame = useCallback(() => {
    setBoard(createEmptyBoard())
    setScore(0)
    setLines(0)
    setLevel(1)
    setGameOver(false)
    setIsStarted(true)
    setIsPaused(false)

    const type = getRandomTetromino()
    const shape = TETROMINOS[type].shape.map((r) => [...r])
    const startX = Math.floor((BOARD_WIDTH - shape[0].length) / 2)

    setCurrentPiece({ type, shape, x: startX, y: 0 })
    setNextPiece(getRandomTetromino())
  }, [])

  const togglePause = useCallback(() => {
    if (isStarted && !gameOver) setIsPaused((prev) => !prev)
  }, [isStarted, gameOver])

  // Game loop

  useEffect(() => {
    if (!isStarted || gameOver || isPaused) return

    const id = setInterval(() => movePiece(0, 1), getSpeed())
    return () => clearInterval(id)
  }, [isStarted, gameOver, isPaused, movePiece, getSpeed])

  // Keyboard controls

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isStarted || gameOver) {
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

  // Touch controls

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }, [])

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart || !isStarted || gameOver || isPaused) return

      const touch = e.touches[0]
      const deltaX = touch.clientX - touchStart.x
      const deltaY = touch.clientY - touchStart.y
      const now = Date.now()

      if (Math.abs(deltaX) > 30 && now - lastMoveRef.current > 100) {
        movePiece(deltaX > 0 ? 1 : -1, 0)
        setTouchStart({ x: touch.clientX, y: touchStart.y })
        lastMoveRef.current = now
      }

      if (deltaY > 30 && now - lastDropRef.current > 50) {
        movePiece(0, 1)
        setTouchStart({ x: touchStart.x, y: touch.clientY })
        lastDropRef.current = now
      }
    },
    [touchStart, isStarted, gameOver, isPaused, movePiece]
  )

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart) return

      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStart.x
      const deltaY = touch.clientY - touchStart.y

      if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) rotatePiece()
      if (deltaY > 100 && Math.abs(deltaX) < 50) hardDrop()

      setTouchStart(null)
    },
    [touchStart, rotatePiece, hardDrop]
  )

  // Music

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.volume = 0.5
      audioRef.current.src = musicPlaylist[currentTrackIndex].url
      audioRef.current.onended = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % musicPlaylist.length)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (audioRef.current && isMusicPlaying) {
      audioRef.current.src = musicPlaylist[currentTrackIndex].url
      audioRef.current.load()
      audioRef.current.play().catch((err) => {
        console.warn('Failed to play track:', err)
      })
    }
  }, [currentTrackIndex])

  const toggleMusic = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.volume = 0.5
      audioRef.current.crossOrigin = 'anonymous'
      audioRef.current.src = musicPlaylist[currentTrackIndex].url
      audioRef.current.onended = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % musicPlaylist.length)
      }
      audioRef.current.onerror = () => {
        console.warn('Track failed to load, trying next...')
        setCurrentTrackIndex((prev) => (prev + 1) % musicPlaylist.length)
      }
    }

    if (isMusicPlaying) {
      audioRef.current.pause()
      setIsMusicPlaying(false)
    } else {
      audioRef.current.load()
      audioRef.current
        .play()
        .then(() => setIsMusicPlaying(true))
        .catch((err) => {
          console.error('Audio playback failed:', err)
          setCurrentTrackIndex((prev) => (prev + 1) % musicPlaylist.length)
          setIsMusicPlaying(false)
        })
    }
  }, [isMusicPlaying, currentTrackIndex])

  // Return

  return {
    displayBoard: buildDisplayBoard(board, currentPiece),
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
    movePiece,
    rotatePiece,
    hardDrop,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }
}
