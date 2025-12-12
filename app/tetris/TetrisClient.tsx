"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Music, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react"
import { DarkModeFirefly } from "@/components/firefly"
import { useTranslation } from "react-i18next"
import { usePlatform, useMounted } from "@/hooks"
import styles from "./Tetris.module.css"

type TouchAction = 'left' | 'right' | 'down' | 'rotate' | 'drop' | 'pause'

type TetrominoShape = number[][] | readonly (readonly number[])[]
type TetrominoColor = string

interface Tetromino {
  shape: TetrominoShape
  color: TetrominoColor
}

interface TetrominoWithKey extends Tetromino {
  key: string
}

interface CurrentPiece {
  x: number
  y: number
  tetromino: TetrominoWithKey
}

type BoardCell = number | string

const TETROMINOS = {
  I: { shape: [[1, 1, 1, 1]], color: "bg-cyan-500 dark:bg-cyan-400" },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: "bg-blue-500 dark:bg-blue-400",
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: "bg-orange-500 dark:bg-orange-400",
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "bg-yellow-500 dark:bg-yellow-400",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: "bg-green-500 dark:bg-green-400",
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: "bg-purple-500 dark:bg-purple-400",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: "bg-red-500 dark:bg-red-400",
  },
} as const

// Music playlist
const SONGS = [
  {
    title: "A Video Game",
    artist: "moodmode",
    url: "https://cdn.pixabay.com/download/audio/2024/10/08/audio_4f1b310188.mp3",
    attribution: "https://pixabay.com/music/video-games-a-video-game-248444/",
  },
  {
    title: "Epic Battle",
    artist: "Lesiakower",
    url: "https://cdn.pixabay.com/download/audio/2023/06/11/audio_0405130ae3.mp3",
    attribution: "https://pixabay.com/music/video-games-epic-battle-153400/",
  },
  {
    title: "Fun With My 8-Bit Game",
    artist: "DJARTMUSIC",
    url: "https://cdn.pixabay.com/download/audio/2025/02/14/audio_a0ac60848c.mp3",
    attribution: "https://pixabay.com/music/video-games-fun-with-my-8-bit-game-301278/",
  },
  {
    title: "Item Obtained!",
    artist: "Lesiakower",
    url: "https://cdn.pixabay.com/download/audio/2022/10/22/audio_a56df42c4e.mp3",
    attribution: "https://pixabay.com/music/video-games-item-obtained-123644/",
  },
  {
    title: "My 8-bit Hero",
    artist: "DJARTMUSIC",
    url: "https://cdn.pixabay.com/download/audio/2025/02/14/audio_f91acd60ff.mp3",
    attribution: "https://pixabay.com/music/video-games-my-8-bit-hero-301280/",
  },
  {
    title: "The Return Of The 8-bit Era",
    artist: "DJARTMUSIC",
    url: "https://cdn.pixabay.com/download/audio/2025/02/14/audio_64c5ab0979.mp3",
    attribution: "https://pixabay.com/music/video-games-the-return-of-the-8-bit-era-301292/",
  },
  {
    title: "The World Of 8-bit Games",
    artist: "DJARTMUSIC",
    url: "https://cdn.pixabay.com/download/audio/2025/02/14/audio_6f9e15d0d9.mp3",
    attribution: "https://pixabay.com/music/video-games-the-world-of-8-bit-games-301273/",
  },
  {
    title: "This 8 Bit Music",
    artist: "moodmode",
    url: "https://cdn.pixabay.com/download/audio/2024/09/27/audio_3d488e9b75.mp3",
    attribution: "https://pixabay.com/music/video-games-this-8-bit-music-245266/",
  },
  {
    title: "Vitamin F",
    artist: "AudioCoffee",
    url: "https://cdn.pixabay.com/download/audio/2024/10/07/audio_cc8013c966.mp3",
    attribution: "https://pixabay.com/music/upbeat-vitamin-f-248247/",
  },
]

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const INITIAL_DROP_TIME = 800
const SPEED_INCREASE_FACTOR = 0.95
const TOUCH_COOLDOWN = 200 // Cooldown in milliseconds

const createEmptyBoard = (): BoardCell[][] => Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0))

const randomTetromino = (): TetrominoWithKey => {
  const keys = Object.keys(TETROMINOS) as Array<keyof typeof TETROMINOS>
  const randKey = keys[Math.floor(Math.random() * keys.length)]
  return { ...TETROMINOS[randKey], key: randKey }
}

export default function TetrisGame() {
  const { t } = useTranslation()
  const [board, setBoard] = useState<BoardCell[][]>(createEmptyBoard())
  const [currentPiece, setCurrentPiece] = useState<CurrentPiece | null>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [dropTime, setDropTime] = useState(INITIAL_DROP_TIME)
  const [level, setLevel] = useState(1)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [showNowPlaying, setShowNowPlaying] = useState(false)
  const [completedRows, setCompletedRows] = useState<number[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const mounted = useMounted()
  const [isMobileView, setIsMobileView] = useState(false)
  const { isDesktop } = usePlatform()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const dropInterval = useRef<NodeJS.Timeout | null>(null)
  const touchCooldowns = useRef<Record<TouchAction, number>>({
    left: 0,
    right: 0,
    down: 0,
    rotate: 0,
    drop: 0,
    pause: 0,
  })

  // Check if viewport is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  const checkCollision = useCallback((x: number, y: number, shape: TetrominoShape): boolean => {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] !== 0) {
          const newX = x + col
          const newY = y + row
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT || (newY >= 0 && board[newY][newX] !== 0)) {
            return true
          }
        }
      }
    }
    return false
  }, [board])

  const isValidMove = useCallback(
    (x: number, y: number, shape: TetrominoShape): boolean => !checkCollision(x, y, shape),
    [checkCollision]
  )

  const clearLines = useCallback(
    (newBoard: BoardCell[][]) => {
      const linesCleared: number[] = []
      const updatedBoard = newBoard.filter((row: BoardCell[], index: number) => {
        if (row.every((cell: BoardCell) => cell !== 0)) {
          linesCleared.push(index)
          return false
        }
        return true
      })

      if (linesCleared.length > 0) {
        setCompletedRows(linesCleared)
        setTimeout(() => {
          while (updatedBoard.length < BOARD_HEIGHT) {
            updatedBoard.unshift(Array(BOARD_WIDTH).fill(0))
          }
          setBoard(updatedBoard)
          setCompletedRows([])

          const linePoints = [0, 100, 300, 500, 800] // Points for 0, 1, 2, 3, 4 lines
          const newScore = score + linePoints[linesCleared.length]
          setScore(newScore)

          if (Math.floor(newScore / 500) > level - 1) {
            setLevel((prev) => prev + 1)
            setDropTime((prev) => prev * SPEED_INCREASE_FACTOR)
          }
        }, 500)
      }
    },
    [score, level],
  )

  const spawnNewPiece = useCallback(() => {
    const newPiece = {
      x: Math.floor(BOARD_WIDTH / 2) - 1,
      y: 0,
      tetromino: randomTetromino(),
    }
    if (checkCollision(newPiece.x, newPiece.y, newPiece.tetromino.shape)) {
      setGameOver(true)
    } else {
      setCurrentPiece(newPiece)
    }
  }, [checkCollision])

  const placePiece = useCallback(() => {
    if (!currentPiece) return
    const newBoard = board.map((row) => [...row])
    currentPiece.tetromino.shape.forEach((row, y: number) => {
      row.forEach((value: number, x: number) => {
        if (value !== 0) {
          const boardY = y + currentPiece.y
          const boardX = x + currentPiece.x
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            newBoard[boardY][boardX] = currentPiece.tetromino.color
          }
        }
      })
    })
    setBoard(newBoard)
    clearLines(newBoard)
    spawnNewPiece()
  }, [currentPiece, board, clearLines, spawnNewPiece])

  const moveLeft = useCallback(() => {
    if (currentPiece && !isPaused && isValidMove(currentPiece.x - 1, currentPiece.y, currentPiece.tetromino.shape)) {
      setCurrentPiece((prev) => prev ? ({ ...prev, x: prev.x - 1 }) : null)
    }
  }, [currentPiece, isPaused, isValidMove])

  const moveRight = useCallback(() => {
    if (currentPiece && !isPaused && isValidMove(currentPiece.x + 1, currentPiece.y, currentPiece.tetromino.shape)) {
      setCurrentPiece((prev) => prev ? ({ ...prev, x: prev.x + 1 }) : null)
    }
  }, [currentPiece, isPaused, isValidMove])

  const moveDown = useCallback(() => {
    if (!currentPiece || isPaused) return
    if (isValidMove(currentPiece.x, currentPiece.y + 1, currentPiece.tetromino.shape)) {
      setCurrentPiece((prev) => prev ? ({ ...prev, y: prev.y + 1 }) : null)
    } else {
      placePiece()
    }
  }, [currentPiece, isPaused, isValidMove, placePiece])

  const rotate = useCallback(() => {
    if (!currentPiece || isPaused) return
    const rotated: TetrominoShape = currentPiece.tetromino.shape[0].map((_, i) =>
      currentPiece.tetromino.shape.map((row) => row[i]).reverse(),
    )
    let newX = currentPiece.x
    let newY = currentPiece.y

    // Try to rotate, if not possible, try to adjust position
    if (!isValidMove(newX, newY, rotated)) {
      // Try to move left
      if (isValidMove(newX - 1, newY, rotated)) {
        newX -= 1
      }
      // Try to move right
      else if (isValidMove(newX + 1, newY, rotated)) {
        newX += 1
      }
      // Try to move up
      else if (isValidMove(newX, newY - 1, rotated)) {
        newY -= 1
      }
      // If still not possible, don't rotate
      else {
        return
      }
    }

    setCurrentPiece((prev) => prev ? ({
      ...prev,
      x: newX,
      y: newY,
      tetromino: { ...prev.tetromino, shape: rotated },
    }) : null)
  }, [currentPiece, isPaused, isValidMove])


  const hardDrop = useCallback(() => {
    if (!currentPiece || isPaused) return
    let newY = currentPiece.y
    while (isValidMove(currentPiece.x, newY + 1, currentPiece.tetromino.shape)) {
      newY += 1
    }

    // Update the piece position first
    setCurrentPiece((prev) => prev ? ({ ...prev, y: newY }) : null)

    // Then immediately place the piece without waiting
    // We need to use the updated Y position directly rather than relying on state update
    const updatedPiece: CurrentPiece = { ...currentPiece, y: newY }

    // Create a new board with the piece placed at the bottom
    const newBoard = board.map((row) => [...row])
    updatedPiece.tetromino.shape.forEach((row, y: number) => {
      row.forEach((value: number, x: number) => {
        if (value !== 0) {
          const boardY = y + updatedPiece.y
          const boardX = x + updatedPiece.x
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            newBoard[boardY][boardX] = updatedPiece.tetromino.color
          }
        }
      })
    })

    // Update the board and clear lines
    setBoard(newBoard)
    clearLines(newBoard)

    // Spawn a new piece
    setCurrentPiece(null)
  }, [currentPiece, isPaused, board, clearLines, isValidMove])

  // Touch control handlers with cooldown
  const handleTouchAction = (action: () => void, actionType: TouchAction) => {
    const now = Date.now()
    if (now - touchCooldowns.current[actionType] < TOUCH_COOLDOWN) {
      return // Still in cooldown period
    }

    // Update the cooldown timestamp
    touchCooldowns.current[actionType] = now

    // Execute the action
    action()
  }

  useEffect(() => {
    if (!currentPiece && !gameOver && !isPaused) {
      queueMicrotask(() => spawnNewPiece())
    }
  }, [currentPiece, gameOver, isPaused, spawnNewPiece])

  useEffect(() => {
    if (!gameOver && !isPaused) {
      dropInterval.current = setInterval(moveDown, dropTime)
    } else {
      if (dropInterval.current) clearInterval(dropInterval.current)
    }
    return () => {
      if (dropInterval.current) clearInterval(dropInterval.current)
    }
  }, [moveDown, gameOver, isPaused, dropTime])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore all game controls if Ctrl is held
      if (e.ctrlKey) {
        return
      }
      if (gameOver) return

      // Prevent default browser behavior for game control keys
      if (
        [
          "ArrowLeft",
          "ArrowRight",
          "ArrowDown",
          "ArrowUp",
          " ",
          "p",
          "P",
          "w",
          "a",
          "s",
          "d",
          "W",
          "A",
          "S",
          "D",
        ].includes(e.key)
      ) {
        e.preventDefault()
      }

      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          moveLeft()
          break
        case "ArrowRight":
        case "d":
        case "D":
          moveRight()
          break
        case "ArrowDown":
        case "s":
        case "S":
          moveDown()
          break
        case "ArrowUp":
        case "w":
        case "W":
          rotate()
          break
        case " ":
          hardDrop()
          break
        case "p":
        case "P":
          setIsPaused((prev) => !prev)
          break
        default:
          break
      }
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [moveLeft, moveRight, moveDown, rotate, hardDrop, gameOver])

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current
      audio.volume = 0.5
      audio.loop = false // Set to false since we'll handle song transitions

      // Add event listener for when a song ends
      const handleSongEnd = () => {
        // Move to the next song
        setCurrentSongIndex((prevIndex) => (prevIndex + 1) % SONGS.length)
      }

      audio.addEventListener("ended", handleSongEnd)

      if (!gameOver && isMusicPlaying && !isPaused) {
        audio.src = SONGS[currentSongIndex].url
        audio.play().catch((error) => console.error("Audio playback failed:", error))

        // Show the now playing info for a few seconds - defer to avoid cascading renders
        const timer = setTimeout(() => {
          setShowNowPlaying(true)
          setTimeout(() => {
            setShowNowPlaying(false)
          }, 5000)
        }, 0)

        return () => {
          clearTimeout(timer)
          audio.removeEventListener("ended", handleSongEnd)
        }
      } else {
        audio.pause()
      }

      return () => {
        audio.removeEventListener("ended", handleSongEnd)
      }
    }
  }, [gameOver, isMusicPlaying, isPaused, currentSongIndex])

  const resetGame = () => {
    setBoard(createEmptyBoard())
    setCurrentPiece(null)
    setScore(0)
    setGameOver(false)
    setDropTime(INITIAL_DROP_TIME)
    setLevel(1)
    setCompletedRows([])
    setIsPaused(false)
    if (dropInterval.current) clearInterval(dropInterval.current)
  }

  const togglePause = () => {
    setIsPaused((prev) => !prev)
  }

  const renderCell = (x: number, y: number): BoardCell => {
    if (
      currentPiece &&
      y >= currentPiece.y &&
      y < currentPiece.y + currentPiece.tetromino.shape.length &&
      x >= currentPiece.x &&
      x < currentPiece.x + currentPiece.tetromino.shape[0].length &&
      currentPiece.tetromino.shape[y - currentPiece.y][x - currentPiece.x]
    ) {
      return currentPiece.tetromino.color
    }
    return board[y][x]
  }

  const toggleMusic = () => {
    const newState = !isMusicPlaying
    setIsMusicPlaying(newState)

    if (newState) {
      // Show the now playing info when music is turned on
      setShowNowPlaying(true)
      setTimeout(() => {
        setShowNowPlaying(false)
      }, 5000)
    }
  }

  const nextSong = () => {
    if (!isMusicPlaying) return

    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % SONGS.length)
    setShowNowPlaying(true)
    setTimeout(() => {
      setShowNowPlaying(false)
    }, 5000)
  }

  if (!mounted) return null

  const showKeyboardControls = isDesktop || !isMobileView

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <DarkModeFirefly count={15} />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("tetris.title")}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("tetris.description")}</p>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="bg-card border rounded-lg shadow-lg p-4 relative">
              {/* Game Status Bar - Mobile Only */}
              <div className="md:hidden bg-card/95 border-b px-2 pb-2 pt-0 flex justify-between items-center z-10 sticky top-0 left-0 right-0 mb-2">
                <div className="text-sm font-medium">
                  {t("tetris.score")}: <span className="text-primary font-bold">{score}</span>
                </div>
                <div className="text-sm font-medium">
                  {t("tetris.level")}: <span className="text-primary font-bold">{level}</span>
                </div>
                <div className="text-sm font-medium">
                  <span
                    className={`font-bold ${gameOver ? "text-red-500" : isPaused ? "text-amber-500" : "text-green-500"}`}
                  >
                    {gameOver ? t("tetris.gameOver") : isPaused ? t("tetris.paused") : t("tetris.playing")}
                  </span>
                </div>
              </div>

              <div className={`${styles.gameBoard} bg-muted`}>
                {board.map((row, y) =>
                  row.map((_, x) => (
                    <AnimatePresence key={`${y}-${x}`}>
                      <motion.div
                        initial={false}
                        animate={{
                          opacity: completedRows.includes(y) ? 0 : 1,
                          scale: completedRows.includes(y) ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                        className={`${styles.cell} ${renderCell(x, y) || "bg-background dark:bg-background/50"}`}
                      />
                    </AnimatePresence>
                  )),
                )}
              </div>

              {/* Game Over Overlay - All screen sizes */}
              {gameOver && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center p-4"
                  >
                    <h2 className="text-2xl md:text-3xl font-bold text-red-500 mb-3">{t("tetris.gameOverMessage")}</h2>
                    <p className="text-base md:text-lg mb-4">
                      {t("tetris.finalScore")} <span className="font-bold">{score}</span>
                    </p>
                    <Button onClick={resetGame} size="lg">
                      {t("tetris.playAgain")}
                    </Button>
                  </motion.div>
                </div>
              )}

              {/* Touch Controls for Mobile - Now directly below the game board */}
              <div className="md:hidden mt-4">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="col-span-3 flex justify-center">
                    <button
                      className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center"
                      onTouchStart={(e) => {
                        e.preventDefault()
                        handleTouchAction(rotate, "rotate")
                      }}
                      onClick={(e) => {
                        e.preventDefault()
                        handleTouchAction(rotate, "rotate")
                      }}
                      aria-label="Rotate piece"
                    >
                      <ArrowUp className="h-8 w-8" />
                    </button>
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center"
                      onTouchStart={(e) => {
                        e.preventDefault()
                        handleTouchAction(moveLeft, "left")
                      }}
                      onClick={(e) => {
                        e.preventDefault()
                        handleTouchAction(moveLeft, "left")
                      }}
                      aria-label="Move left"
                    >
                      <ArrowLeft className="h-8 w-8" />
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <button
                      className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center"
                      onTouchStart={(e) => {
                        e.preventDefault()
                        handleTouchAction(moveDown, "down")
                      }}
                      onClick={(e) => {
                        e.preventDefault()
                        handleTouchAction(moveDown, "down")
                      }}
                      aria-label="Move down"
                    >
                      <ArrowDown className="h-8 w-8" />
                    </button>
                  </div>
                  <div className="flex justify-start">
                    <button
                      className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center"
                      onTouchStart={(e) => {
                        e.preventDefault()
                        handleTouchAction(moveRight, "right")
                      }}
                      onClick={(e) => {
                        e.preventDefault()
                        handleTouchAction(moveRight, "right")
                      }}
                      aria-label="Move right"
                    >
                      <ArrowRight className="h-8 w-8" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    className="w-24 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center"
                    onTouchStart={(e) => {
                      e.preventDefault()
                      handleTouchAction(togglePause, "pause")
                    }}
                    onClick={(e) => {
                      e.preventDefault()
                      handleTouchAction(togglePause, "pause")
                    }}
                  >
                    {isPaused ? t("tetris.resume") : t("tetris.pause")}
                  </button>
                  <button
                    className="w-24 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center"
                    onTouchStart={(e) => {
                      e.preventDefault()
                      handleTouchAction(hardDrop, "drop")
                    }}
                    onClick={(e) => {
                      e.preventDefault()
                      handleTouchAction(hardDrop, "drop")
                    }}
                  >
                    {t("tetris.drop")}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 items-center md:items-start">
              {/* Game Info - Hidden on mobile */}
              <div className="hidden md:block bg-card border rounded-lg p-6 w-full">
                <h2 className="text-2xl font-bold mb-4">{t("tetris.gameInfo")}</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">{t("tetris.score")}:</span>
                    <span className="text-primary font-bold">{score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">{t("tetris.level")}:</span>
                    <span className="text-primary font-bold">{level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">{t("tetris.status")}:</span>
                    <span
                      className={`font-bold ${gameOver ? "text-red-500" : isPaused ? "text-amber-500" : "text-green-500"}`}
                    >
                      {gameOver ? t("tetris.gameOver") : isPaused ? t("tetris.paused") : t("tetris.playing")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-6 w-full">
                <h2 className="text-2xl font-bold mb-4">{t("tetris.controls")}</h2>

                {/* Conditionally render keyboard controls section */}
                {showKeyboardControls && (
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
                      <span>{t("tetris.moveLeft")}</span>
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
                      <span>{t("tetris.moveRight")}</span>
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
                      <span>{t("tetris.moveDown")}</span>
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
                      <span>{t("tetris.rotate")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block min-w-[65px] h-8 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded px-2">
                        Space
                      </span>
                      <span>{t("tetris.hardDrop")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-8 h-8 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded">
                        P
                      </span>
                      <span>{t("tetris.pauseGame")}</span>
                    </div>
                  </div>
                )}

                {!showKeyboardControls && (
                  <p className="text-sm text-muted-foreground">
                    {t("tetris.touchInstructions", "Use the touch controls below the game board to play.")}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Button onClick={resetGame} variant="default">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {gameOver ? t("tetris.playAgain") : t("tetris.resetGame")}
                </Button>
                {!gameOver && (
                  <Button onClick={togglePause} variant="outline">
                    {isPaused ? t("tetris.resume") : t("tetris.pause")}
                  </Button>
                )}
                <Button onClick={toggleMusic} variant={isMusicPlaying ? "default" : "outline"}>
                  <Music className="mr-2 h-4 w-4" />
                  {isMusicPlaying ? t("tetris.musicOn") : t("tetris.musicOff")}
                </Button>
                {isMusicPlaying && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowNowPlaying(true)
                      setTimeout(() => {
                        setShowNowPlaying(false)
                      }, 5000)
                    }}
                  >
                    <Music className="mr-2 h-4 w-4" />
                    Now Playing
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Now Playing Display */}
      <AnimatePresence>
        {isMusicPlaying && showNowPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 right-4 bg-background/90 backdrop-blur-sm border rounded-lg p-4 shadow-lg max-w-xs"
          >
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Now Playing</h3>
                <button
                  onClick={() => nextSong()}
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                  aria-label="Skip to next song"
                >
                  Skip &rarr;
                </button>
              </div>
              <p className="text-base font-bold">{SONGS[currentSongIndex].title}</p>
              <p className="text-sm text-muted-foreground">by {SONGS[currentSongIndex].artist}</p>
              <a
                href={SONGS[currentSongIndex].attribution}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline mt-1"
              >
                Source: Pixabay
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} preload="none" />
    </main>
  )
}
