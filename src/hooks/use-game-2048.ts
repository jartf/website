// 2048 game hook - ported from Next.js v4
import { useState, useEffect, useCallback } from 'react'

// Types
export type GameBoard = number[][]
export type TileAnimation = {
  from: { row: number; col: number }
  merged: boolean
}
export type TileAnimations = {
  [key: string]: TileAnimation
}
export type GameState = {
  board: GameBoard
  score: number
}
export type MoveResult = {
  newBoard: GameBoard
  score: number
  tileAnimations: TileAnimations
}

// Initialize empty board
export const createEmptyBoard = (): GameBoard =>
  Array(4)
    .fill(0)
    .map(() => Array(4).fill(0))

// Add a random tile (2 or 4) to the board
export const addRandomTile = (board: GameBoard): GameBoard => {
  const newBoard = board.map((row) => [...row])
  const emptyCells = []

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (newBoard[i][j] === 0) {
        emptyCells.push({ i, j })
      }
    }
  }

  if (emptyCells.length > 0) {
    const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)]
    newBoard[i][j] = Math.random() < 0.9 ? 2 : 4
  }

  return newBoard
}

// Check if two boards are equal
export const areEqual = (board1: GameBoard, board2: GameBoard): boolean => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board1[i][j] !== board2[i][j]) {
        return false
      }
    }
  }
  return true
}

// Check if there are any valid moves left
export const hasValidMoves = (board: GameBoard): boolean => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) return true
    }
  }

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const value = board[i][j]
      if (j < 3 && board[i][j + 1] === value) return true
      if (i < 3 && board[i + 1][j] === value) return true
    }
  }

  return false
}

// Check if the player has won
export const hasWon = (board: GameBoard): boolean => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 2048) return true
    }
  }
  return false
}

// Move functions
export const moveLeft = (board: GameBoard): MoveResult => {
  const newBoard = board.map((row) => [...row])
  let score = 0
  const tileAnimations: TileAnimations = {}

  for (let i = 0; i < 4; i++) {
    const originalRow = [...newBoard[i]]
    let row = newBoard[i].filter((val) => val !== 0)
    const mergedIndices: number[] = []

    for (let j = 0; j < row.length - 1; j++) {
      if (row[j] === row[j + 1] && !mergedIndices.includes(j)) {
        row[j] *= 2
        score += row[j]
        row[j + 1] = 0
        mergedIndices.push(j)
      }
    }

    row = row.filter((val) => val !== 0)
    while (row.length < 4) row.push(0)

    for (let j = 0; j < 4; j++) {
      if (row[j] !== 0) {
        let originalCol = -1
        for (let k = 0; k < 4; k++) {
          if (originalRow[k] === row[j] || (mergedIndices.includes(j) && originalRow[k] === row[j] / 2)) {
            originalCol = k
            break
          }
        }
        if (originalCol !== -1 && originalCol !== j) {
          tileAnimations[`${i}-${j}-${row[j]}`] = {
            from: { row: i, col: originalCol },
            merged: mergedIndices.includes(j),
          }
        }
      }
    }

    newBoard[i] = row
  }

  return { newBoard, score, tileAnimations }
}

export const moveRight = (board: GameBoard): MoveResult => {
  const newBoard = board.map((row) => [...row])
  let score = 0
  const tileAnimations: TileAnimations = {}

  for (let i = 0; i < 4; i++) {
    const originalRow = [...newBoard[i]]
    let row = newBoard[i].filter((val) => val !== 0)
    const mergedIndices: number[] = []

    for (let j = row.length - 1; j > 0; j--) {
      if (row[j] === row[j - 1] && !mergedIndices.includes(j)) {
        row[j] *= 2
        score += row[j]
        row[j - 1] = 0
        mergedIndices.push(j)
      }
    }

    row = row.filter((val) => val !== 0)
    while (row.length < 4) row.unshift(0)

    newBoard[i] = row
  }

  return { newBoard, score, tileAnimations }
}

export const moveUp = (board: GameBoard): MoveResult => {
  const newBoard = board.map((row) => [...row])
  let score = 0
  const tileAnimations: TileAnimations = {}

  for (let j = 0; j < 4; j++) {
    let column = []
    for (let i = 0; i < 4; i++) {
      if (newBoard[i][j] !== 0) column.push(newBoard[i][j])
    }

    const mergedIndices: number[] = []

    for (let i = 0; i < column.length - 1; i++) {
      if (column[i] === column[i + 1] && !mergedIndices.includes(i)) {
        column[i] *= 2
        score += column[i]
        column[i + 1] = 0
        mergedIndices.push(i)
      }
    }

    column = column.filter((val) => val !== 0)
    while (column.length < 4) column.push(0)

    for (let i = 0; i < 4; i++) {
      newBoard[i][j] = column[i]
    }
  }

  return { newBoard, score, tileAnimations }
}

export const moveDown = (board: GameBoard): MoveResult => {
  const newBoard = board.map((row) => [...row])
  let score = 0
  const tileAnimations: TileAnimations = {}

  for (let j = 0; j < 4; j++) {
    let column = []
    for (let i = 0; i < 4; i++) {
      if (newBoard[i][j] !== 0) column.push(newBoard[i][j])
    }

    const mergedIndices: number[] = []

    for (let i = column.length - 1; i > 0; i--) {
      if (column[i] === column[i - 1] && !mergedIndices.includes(i)) {
        column[i] *= 2
        score += column[i]
        column[i - 1] = 0
        mergedIndices.push(i)
      }
    }

    column = column.filter((val) => val !== 0)
    while (column.length < 4) column.unshift(0)

    for (let i = 0; i < 4; i++) {
      newBoard[i][j] = column[i]
    }
  }

  return { newBoard, score, tileAnimations }
}

// Get tile color based on value
export const getTileColor = (value: number, isDark: boolean): string => {
  const colors: Record<number, string> = {
    0: 'bg-transparent',
    2: isDark ? 'bg-slate-700 text-slate-100' : 'bg-slate-200 text-slate-800',
    4: isDark ? 'bg-blue-800 text-blue-100' : 'bg-blue-200 text-blue-800',
    8: isDark ? 'bg-cyan-700 text-cyan-100' : 'bg-cyan-300 text-cyan-900',
    16: isDark ? 'bg-teal-700 text-teal-100' : 'bg-teal-300 text-teal-900',
    32: isDark ? 'bg-green-700 text-green-100' : 'bg-green-300 text-green-900',
    64: isDark ? 'bg-lime-700 text-lime-100' : 'bg-lime-300 text-lime-900',
    128: isDark ? 'bg-yellow-700 text-yellow-100' : 'bg-yellow-300 text-yellow-900',
    256: isDark ? 'bg-amber-700 text-amber-100' : 'bg-amber-300 text-amber-900',
    512: isDark ? 'bg-orange-700 text-orange-100' : 'bg-orange-300 text-orange-900',
    1024: isDark ? 'bg-red-700 text-red-100' : 'bg-red-300 text-red-900',
    2048: isDark ? 'bg-purple-700 text-purple-100' : 'bg-purple-300 text-purple-900',
    4096: isDark ? 'bg-fuchsia-700 text-fuchsia-100' : 'bg-fuchsia-300 text-fuchsia-900',
    8192: isDark ? 'bg-pink-700 text-pink-100' : 'bg-pink-300 text-pink-900',
    16384: isDark ? 'bg-rose-700 text-rose-100' : 'bg-rose-300 text-rose-900',
    32768: isDark ? 'bg-indigo-700 text-indigo-100' : 'bg-indigo-300 text-indigo-900',
    65536: isDark ? 'bg-violet-700 text-violet-100' : 'bg-violet-300 text-violet-900',
  }
  return colors[value] || (isDark
    ? 'bg-gradient-to-br from-purple-700 to-pink-700 text-white'
    : 'bg-gradient-to-br from-purple-300 to-pink-300 text-purple-900')
}

// Get font size based on digit count
export const getFontSize = (value: number): string => {
  if (value === 0) return 'text-2xl'
  const digits = Math.floor(Math.log10(value)) + 1
  if (digits <= 1) return 'text-2xl'
  if (digits === 2) return 'text-xl'
  if (digits === 3) return 'text-lg'
  if (digits === 4) return 'text-base'
  return 'text-sm'
}

// Main hook
export function useGame2048() {
  const [board, setBoard] = useState<GameBoard>(() => addRandomTile(createEmptyBoard()))
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [hasWonBefore, setHasWonBefore] = useState(false)
  const [history, setHistory] = useState<GameState[]>([])
  const [animatingTiles, setAnimatingTiles] = useState<TileAnimations>({})
  const [isAnimating, setIsAnimating] = useState(false)

  const [bestScore, setBestScore] = useState<number>(() => {
    if (typeof window === 'undefined') return 0
    const saved = localStorage.getItem('2048-best-score')
    return saved ? parseInt(saved) : 0
  })

  // Check for game over or win
  useEffect(() => {
    const currentHasWon = hasWon(board)
    const currentHasValidMoves = hasValidMoves(board)

    if (currentHasWon && !hasWonBefore) {
      queueMicrotask(() => {
        setGameWon(true)
        setHasWonBefore(true)
      })
    }

    if (!currentHasValidMoves) {
      queueMicrotask(() => {
        setGameOver(true)
      })
    }
  }, [board, hasWonBefore])

  // Save best score
  useEffect(() => {
    if (score > bestScore) {
      queueMicrotask(() => {
        setBestScore(score)
        localStorage.setItem('2048-best-score', score.toString())
      })
    }
  }, [score, bestScore])

  // Save to history
  const saveToHistory = useCallback((currentBoard: GameBoard, currentScore: number) => {
    setHistory((prev) => {
      const newHistory = [...prev, { board: currentBoard.map((row) => [...row]), score: currentScore }]
      if (newHistory.length > 20) {
        return newHistory.slice(-20)
      }
      return newHistory
    })
  }, [])

  // Undo
  const undoMove = useCallback(() => {
    if (history.length === 0 || isAnimating) return

    const previousState = history[history.length - 1]
    setBoard(previousState.board.map((row) => [...row]))
    setScore(previousState.score)
    setHistory((prev) => prev.slice(0, -1))

    if (gameOver) setGameOver(false)
  }, [history, isAnimating, gameOver])

  // Process move
  const processMove = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    if (gameOver || isAnimating) return

    let result: MoveResult | undefined
    const oldBoard = board.map((row) => [...row])

    switch (direction) {
      case 'left':
        result = moveLeft(board)
        break
      case 'right':
        result = moveRight(board)
        break
      case 'up':
        result = moveUp(board)
        break
      case 'down':
        result = moveDown(board)
        break
    }

    if (result && !areEqual(oldBoard, result.newBoard)) {
      saveToHistory(oldBoard, score)

      setAnimatingTiles(result.tileAnimations)
      setIsAnimating(true)

      setScore((prevScore) => prevScore + result.score)

      setTimeout(() => {
        setBoard(addRandomTile(result.newBoard))
        setIsAnimating(false)
      }, 150)
    }
  }, [gameOver, isAnimating, board, score, saveToHistory])

  // Reset game
  const resetGame = useCallback(() => {
    setBoard(addRandomTile(createEmptyBoard()))
    setScore(0)
    setGameOver(false)
    setGameWon(false)
    setHasWonBefore(false)
    setHistory([])
    setAnimatingTiles({})
  }, [])

  // Continue after win
  const continueGame = useCallback(() => {
    setGameWon(false)
  }, [])

  return {
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
  }
}
