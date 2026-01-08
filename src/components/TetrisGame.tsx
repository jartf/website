// Tetris Game - React component for Astro
// Ported from Next.js v4 with i18n adapted for Astro's t() function

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@nanostores/react'
import { languageStore, initLanguage } from '@/i18n'

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
const MUSIC_PLAYLIST = [
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
const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const INITIAL_SPEED = 800
const SPEED_INCREMENT = 50
const MIN_SPEED = 100

// Create empty board
const createEmptyBoard = () =>
  Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null))

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

// Translations for all supported languages
const translations: Record<string, Record<string, string>> = {
  en: {
    title: 'Tetris',
    description: 'A classic game of falling blocks and disappearing lines',
    gameInfo: 'Game info',
    score: 'Score',
    level: 'Level',
    status: 'Status',
    next: 'Next',
    gameOver: 'Game over',
    paused: 'Paused',
    playing: 'Playing',
    ready: 'Ready',
    playAgain: 'Play again',
    pause: 'Pause',
    resume: 'Resume',
    start: 'Start',
    reset: 'Reset',
    controls: 'Controls',
    moveLeft: 'Move left',
    moveRight: 'Move right',
    moveDown: 'Move down',
    rotate: 'Rotate block',
    hardDrop: 'Hard drop',
    pauseGame: 'Pause game',
    musicOn: 'Music on',
    musicOff: 'Music off',
    nowPlaying: 'Now playing',
  },
  vi: {
    title: 'Tetris',
    description: 'Trò chơi xếp hình cổ điển gắn liền với tuổi thơ của bao thế hệ.',
    gameInfo: 'Thông tin màn chơi',
    score: 'Điểm',
    level: 'Cấp độ',
    status: 'Trạng thái',
    next: 'Tiếp theo',
    gameOver: 'Kết thúc',
    paused: 'Tạm dừng',
    playing: 'Đang chơi',
    ready: 'Sẵn sàng',
    playAgain: 'Chơi lại',
    pause: 'Tạm dừng',
    resume: 'Tiếp tục',
    start: 'Bắt đầu',
    reset: 'Đặt lại',
    controls: 'Điều khiển',
    moveLeft: 'Di chuyển sang trái',
    moveRight: 'Di chuyển sang phải',
    moveDown: 'Di chuyển xuống',
    rotate: 'Xoay khối',
    hardDrop: 'Thả nhanh',
    pauseGame: 'Tạm dừng trò chơi',
    musicOn: 'Bật nhạc',
    musicOff: 'Tắt nhạc',
    nowPlaying: 'Đang phát',
  },
  da: {
    title: 'Tetris',
    description: 'Et klassisk spil med faldende blokke og forsvindende linjer',
    gameInfo: 'Spilinformation',
    score: 'Score',
    level: 'Niveau',
    status: 'Status',
    next: 'Næste',
    gameOver: 'Spil slut',
    paused: 'Pauset',
    playing: 'Spiller',
    ready: 'Klar',
    playAgain: 'Spil igen',
    pause: 'Pause',
    resume: 'Fortsæt',
    start: 'Start',
    reset: 'Nulstil',
    controls: 'Kontroller',
    moveLeft: 'Flyt til venstre',
    moveRight: 'Flyt til højre',
    moveDown: 'Flyt ned',
    rotate: 'Rotér',
    hardDrop: 'Hård drop',
    pauseGame: 'Pause spil',
    musicOn: 'Musik til',
    musicOff: 'Musik fra',
    nowPlaying: 'Spiller nu',
  },
  et: {
    title: 'Tetris',
    description: 'A classic game of falling blocks and disappearing lines',
    gameInfo: 'Mängu info',
    score: 'Skoor',
    level: 'Level',
    status: 'Staatus',
    next: 'Järgmine',
    gameOver: 'Mäng läbi',
    paused: 'Peatatud',
    playing: 'Mängib',
    ready: 'Valmis',
    playAgain: 'Mängi uuesti',
    pause: 'Paus',
    resume: 'Jätka mängu',
    start: 'Alusta',
    reset: 'Lähtesta',
    controls: 'Juhtimiselemendid',
    moveLeft: 'Liiguta vasakule',
    moveRight: 'Liiguta paremale',
    moveDown: 'Liiguta alla',
    rotate: 'Rotate block',
    hardDrop: 'Hard drop',
    pauseGame: 'Mängu peatamine',
    musicOn: 'Muusika sees',
    musicOff: 'Muusika välja lülitatud',
    nowPlaying: 'Praegu mängib',
  },
  fi: {
    title: 'Tetris',
    description: 'Klassinen peli putoavista palikoista ja katoavista riveistä',
    gameInfo: 'Pelinfo',
    score: 'Pisteet',
    level: 'Taso',
    status: 'Tila',
    next: 'Seuraava',
    gameOver: 'Peli ohi',
    paused: 'Tauolla',
    playing: 'Pelaa',
    ready: 'Valmis',
    playAgain: 'Pelaa uudelleen',
    pause: 'Tauko',
    resume: 'Jatka',
    start: 'Aloita',
    reset: 'Nollaa',
    controls: 'Ohjaimet',
    moveLeft: 'Siirrä vasemmalle',
    moveRight: 'Siirrä oikealle',
    moveDown: 'Siirrä alas',
    rotate: 'Kierrä palikkaa',
    hardDrop: 'Nopea pudotus',
    pauseGame: 'Tauota peli',
    musicOn: 'Musiikki päällä',
    musicOff: 'Musiikki pois',
    nowPlaying: 'Nyt soi',
  },
  pl: {
    title: 'Tetris',
    description: 'Klasyczna gra z opadającymi klockami i znikającymi liniami',
    gameInfo: 'Informacje o grze',
    score: 'Wynik',
    level: 'Poziom',
    status: 'Status',
    next: 'Następny',
    gameOver: 'Koniec gry',
    paused: 'Pauza',
    playing: 'Grasz',
    ready: 'Gotowy',
    playAgain: 'Zagraj ponownie',
    pause: 'Pauza',
    resume: 'Wznów',
    start: 'Start',
    reset: 'Zresetuj',
    controls: 'Sterowanie',
    moveLeft: 'W lewo',
    moveRight: 'W prawo',
    moveDown: 'W dół',
    rotate: 'Obróć',
    hardDrop: 'Szybki rzut',
    pauseGame: 'Pauza',
    musicOn: 'Muzyka włączona',
    musicOff: 'Muzyka wyłączona',
    nowPlaying: 'Teraz gra',
  },
  ru: {
    title: 'Тетрис',
    description: 'Классическая игра с падающими блоками и исчезающими линиями',
    gameInfo: 'Информация об игре',
    score: 'Счет',
    level: 'Уровень',
    status: 'Статус',
    next: 'Следующий',
    gameOver: 'Игра окончена',
    paused: 'Пауза',
    playing: 'Игра',
    ready: 'Готов',
    playAgain: 'Играть снова',
    pause: 'Пауза',
    resume: 'Продолжить',
    start: 'Старт',
    reset: 'Сбросить',
    controls: 'Управление',
    moveLeft: 'Влево',
    moveRight: 'Вправо',
    moveDown: 'Вниз',
    rotate: 'Повернуть',
    hardDrop: 'Сбросить',
    pauseGame: 'Пауза',
    musicOn: 'Музыка вкл',
    musicOff: 'Музыка выкл',
    nowPlaying: 'Сейчас играет',
  },
  sv: {
    title: 'Tetris',
    description: 'Ett klassiskt spel med fallande block och försvinnande rader',
    gameInfo: 'Spelinformation',
    score: 'Poäng',
    level: 'Nivå',
    status: 'Status',
    next: 'Nästa',
    gameOver: 'Spelet över',
    paused: 'Pausad',
    playing: 'Spelar',
    ready: 'Redo',
    playAgain: 'Spela igen',
    pause: 'Paus',
    resume: 'Fortsätt',
    start: 'Starta',
    reset: 'Återställ',
    controls: 'Kontroller',
    moveLeft: 'Flytta vänster',
    moveRight: 'Flytta höger',
    moveDown: 'Flytta ner',
    rotate: 'Rotera block',
    hardDrop: 'Snabbsläpp',
    pauseGame: 'Pausa spelet',
    musicOn: 'Musik på',
    musicOff: 'Musik av',
    nowPlaying: 'Spelar nu',
  },
  tok: {
    title: 'Tetris',
    description: 'musi sinpin pi palisa anpa en linja weka',
    gameInfo: 'sona musi',
    score: 'nanpa',
    level: 'nanpa ma',
    status: 'kule',
    next: 'kama',
    gameOver: 'musi li pini',
    paused: 'awen',
    playing: 'musi lon',
    ready: 'pali',
    playAgain: 'o musi sin',
    pause: 'awen',
    resume: 'o kama musi',
    start: 'open',
    reset: 'o sin',
    controls: 'nasin noka',
    moveLeft: 'tawa lete',
    moveRight: 'tawa poka',
    moveDown: 'tawa anpa',
    rotate: 'o sike palisa',
    hardDrop: 'anpa wawa',
    pauseGame: 'o awen e musi',
    musicOn: 'kalama lon',
    musicOff: 'kalama weka',
    nowPlaying: 'kalama ni',
  },
  tr: {
    title: 'Tetris',
    description: 'Düşen bloklar ve kaybolan çizgilerle klasik bir oyun',
    gameInfo: 'Oyun Bilgisi',
    score: 'Puan',
    level: 'Seviye',
    status: 'Durum',
    next: 'Sonraki',
    gameOver: 'Oyun Bitti',
    paused: 'Duraklatıldı',
    playing: 'Oynanıyor',
    ready: 'Hazır',
    playAgain: 'Tekrar Oyna',
    pause: 'Duraklat',
    resume: 'Devam Et',
    start: 'Başla',
    reset: 'Sıfırla',
    controls: 'Kontroller',
    moveLeft: 'Sola Git',
    moveRight: 'Sağa Git',
    moveDown: 'Aşağı Git',
    rotate: 'Döndür',
    hardDrop: 'Hızlı Düşür',
    pauseGame: 'Oyunu Duraklat',
    musicOn: 'Müzik Açık',
    musicOff: 'Müzik Kapalı',
    nowPlaying: 'Şimdi çalıyor',
  },
  'vi-Hani': {
    title: 'Tetris',
    description: '𠻀𨔈攝形古典𮇜連貝歲苴𧵑別包世系。',
    gameInfo: '通信幔𨔈',
    score: '點數',
    level: '級度',
    status: '狀態',
    next: '接續',
    gameOver: '結束',
    paused: '暫仃',
    playing: '當𨔈',
    ready: '淍損',
    playAgain: '𨔈吏',
    pause: '暫仃',
    resume: '接續',
    start: '𢲧頭',
    reset: '撻吏',
    controls: '調遣',
    moveLeft: '移轉𨖅債',
    moveRight: '移轉𨖅沛',
    moveDown: '移轉𬺗',
    rotate: '𢮿塊',
    hardDrop: '抯𬺗𮞊',
    pauseGame: '暫仃𠻀𨔈',
    musicOn: '弼樂',
    musicOff: '𤎕樂',
    nowPlaying: '當發',
  },
  zh: {
    title: '俄罗斯方块',
    description: '一个经典的下落方块和消除行的游戏',
    gameInfo: '游戏信息',
    score: '分数',
    level: '等级',
    status: '状态',
    next: '下一个',
    gameOver: '游戏结束',
    paused: '已暂停',
    playing: '游戏中',
    ready: '准备好',
    playAgain: '再玩一次',
    pause: '暂停',
    resume: '继续',
    start: '开始',
    reset: '重置',
    controls: '控制',
    moveLeft: '向左移动',
    moveRight: '向右移动',
    moveDown: '向下移动',
    rotate: '旋转',
    hardDrop: '快速下落',
    pauseGame: '暂停游戏',
    musicOn: '音乐开',
    musicOff: '音乐关',
    nowPlaying: '正在播放',
  },
}

interface TetrisGameProps {
  lang?: string
}

export default function TetrisGame({ lang: propLang }: TetrisGameProps) {
  // Use language from store, fallback to prop
  const storeLang = useStore(languageStore)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    initLanguage()
    setMounted(true)
  }, [])

  const lang = mounted ? storeLang : (propLang || 'en')
  const t = translations[lang] || translations.en

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
    return Math.max(MIN_SPEED, INITIAL_SPEED - (level - 1) * SPEED_INCREMENT)
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
            newX >= BOARD_WIDTH ||
            newY >= BOARD_HEIGHT ||
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
  const lockPiece = useCallback(() => {
    if (!currentPiece) return

    const newBoard = board.map(row => [...row])
    const { type, shape, x, y } = currentPiece
    const color = TETROMINOS[type].color

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const newY = y + row
          const newX = x + col
          if (newY >= 0 && newY < BOARD_HEIGHT && newX >= 0 && newX < BOARD_WIDTH) {
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

    // Add empty rows at top
    while (finalBoard.length < BOARD_HEIGHT) {
      finalBoard.unshift(Array(BOARD_WIDTH).fill(null))
    }

    // Update score
    if (linesCleared > 0) {
      const points = [0, 100, 300, 500, 800][linesCleared] * level
      setScore(prev => prev + points)
      setLines(prev => {
        const newLines = prev + linesCleared
        const newLevel = Math.floor(newLines / 10) + 1
        if (newLevel > level) {
          setLevel(newLevel)
        }
        return newLines
      })
    }

    setBoard(finalBoard)

    // Spawn new piece
    const newType = nextPiece
    const newShape = TETROMINOS[newType].shape
    const startX = Math.floor((BOARD_WIDTH - newShape[0].length) / 2)

    if (checkCollision(newShape, startX, 0, finalBoard)) {
      setGameOver(true)
    } else {
      setCurrentPiece({
        type: newType,
        shape: newShape,
        x: startX,
        y: 0
      })
      setNextPiece(getRandomTetromino())
    }
  }, [board, currentPiece, nextPiece, level, checkCollision])

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

    // Try normal rotation
    if (!checkCollision(rotated, currentPiece.x, currentPiece.y, board)) {
      setCurrentPiece(prev => prev ? { ...prev, shape: rotated } : null)
      return
    }

    // Wall kick attempts
    const kicks = [-1, 1, -2, 2]
    for (const kick of kicks) {
      if (!checkCollision(rotated, currentPiece.x + kick, currentPiece.y, board)) {
        setCurrentPiece(prev => prev ? { ...prev, shape: rotated, x: prev.x + kick } : null)
        return
      }
    }
  }, [currentPiece, board, gameOver, isPaused, checkCollision])

  // Hard drop - drops piece instantly and locks it immediately
  const hardDrop = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return

    const { type, shape, x } = currentPiece
    const color = TETROMINOS[type].color

    // Find the lowest valid position
    let dropY = currentPiece.y
    while (!checkCollision(shape, x, dropY + 1, board)) {
      dropY++
    }

    // Immediately create the new board with piece placed
    const newBoard = board.map(row => [...row])
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const newY = dropY + row
          const newX = x + col
          if (newY >= 0 && newY < BOARD_HEIGHT && newX >= 0 && newX < BOARD_WIDTH) {
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

    // Add empty rows at top
    while (finalBoard.length < BOARD_HEIGHT) {
      finalBoard.unshift(Array(BOARD_WIDTH).fill(null))
    }

    // Update score
    if (linesCleared > 0) {
      const points = [0, 100, 300, 500, 800][linesCleared] * level
      setScore(prev => prev + points)
      setLines(prev => {
        const newLines = prev + linesCleared
        const newLevel = Math.floor(newLines / 10) + 1
        if (newLevel > level) {
          setLevel(newLevel)
        }
        return newLines
      })
    }

    setBoard(finalBoard)

    // Spawn new piece
    const newType = nextPiece
    const newShape = TETROMINOS[newType].shape
    const startX = Math.floor((BOARD_WIDTH - newShape[0].length) / 2)

    if (checkCollision(newShape, startX, 0, finalBoard)) {
      setGameOver(true)
      setCurrentPiece(null)
    } else {
      setCurrentPiece({
        type: newType,
        shape: newShape,
        x: startX,
        y: 0
      })
      setNextPiece(getRandomTetromino())
    }
  }, [currentPiece, board, gameOver, isPaused, nextPiece, level, checkCollision])

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
    const startX = Math.floor((BOARD_WIDTH - shape[0].length) / 2)

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
      audioRef.current.src = MUSIC_PLAYLIST[currentTrackIndex].url
      audioRef.current.onended = () => {
        setCurrentTrackIndex(prev => (prev + 1) % MUSIC_PLAYLIST.length)
      }
    }
  }, [])

  // Update track when index changes
  useEffect(() => {
    if (audioRef.current && isMusicPlaying) {
      audioRef.current.src = MUSIC_PLAYLIST[currentTrackIndex].url
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
      audioRef.current.src = MUSIC_PLAYLIST[currentTrackIndex].url
      audioRef.current.onended = () => {
        setCurrentTrackIndex(prev => (prev + 1) % MUSIC_PLAYLIST.length)
      }
      audioRef.current.onerror = () => {
        console.warn('Track failed to load, trying next...')
        setCurrentTrackIndex(prev => (prev + 1) % MUSIC_PLAYLIST.length)
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
        setCurrentTrackIndex(prev => (prev + 1) % MUSIC_PLAYLIST.length)
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
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
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
              if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH && !displayBoard[boardY][boardX]) {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.description}
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
                      {t.start}
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
                    <p className="text-2xl font-bold mb-4">{t.pause}</p>
                    <button
                      onClick={togglePause}
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors"
                    >
                      {t.resume}
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
                    <p className="text-3xl font-bold mb-2 text-red-500">{t.gameOver}</p>
                    <p className="text-xl mb-4">{t.score}: {score}</p>
                    <button
                      onClick={startGame}
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors"
                    >
                      {t.playAgain}
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
              <h2 className="text-2xl font-bold mb-4">{t.gameInfo}</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">{t.score}:</span>
                  <span className="text-primary font-bold">{score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t.level}:</span>
                  <span className="text-primary font-bold">{level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t.status}:</span>
                  <span className={`font-bold ${gameOver ? 'text-red-500' : isPaused ? 'text-amber-500' : 'text-green-500'}`}>
                    {gameOver ? t.gameOver : isPaused ? t.paused : isStarted ? t.playing : t.ready}
                  </span>
                </div>
              </div>

              {/* Next piece preview */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">{t.next}</p>
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
              <h2 className="text-2xl font-bold mb-4">{t.controls}</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="inline-flex w-8 h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded">←</span>
                    <span className="inline-flex w-8 h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded">A</span>
                  </div>
                  <span>{t.moveLeft}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="inline-flex w-8 h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded">→</span>
                    <span className="inline-flex w-8 h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded">D</span>
                  </div>
                  <span>{t.moveRight}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="inline-flex w-8 h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded">↓</span>
                    <span className="inline-flex w-8 h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded">S</span>
                  </div>
                  <span>{t.moveDown}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="inline-flex w-8 h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded">↑</span>
                    <span className="inline-flex w-8 h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded">W</span>
                  </div>
                  <span>{t.rotate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex min-w-[65px] h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded px-2">Space</span>
                  <span>{t.hardDrop}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex w-8 h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded">P</span>
                  <span>{t.pauseGame}</span>
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
                {gameOver ? t.playAgain : t.reset}
              </button>
              <button
                onClick={toggleMusic}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${isMusicPlaying ? 'bg-primary text-primary-foreground' : 'border hover:bg-muted'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                {isMusicPlaying ? t.musicOn : t.musicOff}
              </button>
            </div>

            {/* Now playing */}
            {isMusicPlaying && (
              <div className="text-sm text-muted-foreground">
                🎵 {t.nowPlaying}: {MUSIC_PLAYLIST[currentTrackIndex].title}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
