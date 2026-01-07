// 2048 Game - React component for Astro
// Ported from Next.js v4

import { useEffect, useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@nanostores/react'
import { languageStore, initLanguage } from '@/i18n'
import { useGame2048, getTileColor, getFontSize } from '@/hooks/use-game-2048'

// Size of each tile for animation calculations
const TILE_SIZE = 80 // Approximate size including gap

// Translations for all supported languages
const translations: Record<string, Record<string, string>> = {
  en: {
    title: '2048',
    description: 'Join the tiles, get to 2048!',
    score: 'Score',
    best: 'Best',
    gameOver: 'Game Over!',
    finalScore: 'Final score',
    tryAgain: 'Try again',
    youWin: 'You win!',
    currentScore: 'Current score',
    keepPlaying: 'Keep playing',
    newGame: 'New game',
    howToPlay: 'How to play',
    instructions1: 'Use your arrow keys or WASD to move the tiles. When two tiles with the same number touch, they merge into one!',
    instructions2: 'After each move, a new tile appears (either 2 or 4).',
    instructions3: 'Create a tile with the number 2048 to win the game!',
    instructions4: 'After reaching 2048, you can continue playing to achieve even higher scores!',
    controls: 'Controls',
    moveLeft: 'Move left',
    moveRight: 'Move right',
    moveUp: 'Move up',
    moveDown: 'Move down',
    touchInstructions: 'On mobile devices, swipe in any direction to move the tiles.',
    undo: 'Undo',
  },
  vi: {
    title: '2048',
    description: 'Kết hợp các ô để đạt đến số 2048',
    score: 'Điểm',
    best: 'Cao nhất',
    gameOver: 'Trò chơi kết thúc!',
    finalScore: 'Điểm cuối cùng',
    tryAgain: 'Chơi lại',
    youWin: 'Bạn đã thắng!',
    currentScore: 'Điểm hiện tại',
    keepPlaying: 'Tiếp tục chơi',
    newGame: 'Chơi ván mới',
    howToPlay: 'Cách chơi',
    instructions1: 'Sử dụng phím mũi tên hoặc WASD để di chuyển các ô. Khi hai ô có cùng số được gộp vào nhau, chúng sẽ kết hợp thành số tổng của hai số đó.',
    instructions2: 'Sau mỗi lượt di chuyển, một ô mới (số 2 hoặc 4) xuất hiện.',
    instructions3: 'Hãy tạo một ô với số 2048 để thắng trò chơi nhé!',
    instructions4: 'Sau khi đạt được 2048, bạn có thể tiếp tục chơi để đạt điểm cao hơn!',
    controls: 'Điều khiển',
    moveLeft: 'Di chuyển sang trái',
    moveRight: 'Di chuyển sang phải',
    moveUp: 'Di chuyển lên',
    moveDown: 'Di chuyển xuống',
    touchInstructions: 'Trên điện thoại, hãy vuốt theo bất kỳ hướng nào để di chuyển các ô.',
    undo: 'Hoàn tác',
  },
  da: {
    title: '2048',
    description: 'Saml brikkerne, nå til 2048!',
    score: 'Score',
    best: 'Bedste',
    gameOver: 'Spillet er slut!',
    finalScore: 'Endelig score',
    tryAgain: 'Prøv igen',
    youWin: 'Du vandt!',
    currentScore: 'Nuværende score',
    keepPlaying: 'Fortsæt spillet',
    newGame: 'Nyt spil',
    howToPlay: 'Sådan spiller du',
    instructions1: 'Brug piletasterne eller WASD til at flytte brikkerne. Når to brikker med samme tal rører hinanden, smelter de sammen til én!',
    instructions2: 'Efter hvert træk dukker en ny brik op (enten 2 eller 4).',
    instructions3: 'Skab en brik med tallet 2048 for at vinde spillet!',
    instructions4: 'Efter at have nået 2048, kan du fortsætte med at spille for at opnå endnu højere scores!',
    controls: 'Kontroller',
    moveLeft: 'Flyt til venstre',
    moveRight: 'Flyt til højre',
    moveUp: 'Flyt op',
    moveDown: 'Flyt ned',
    touchInstructions: 'På mobile enheder, swipe for at flytte brikker.',
    undo: 'Fortryd',
  },
  et: {
    title: '2048',
    description: 'Join the tiles, get to 2048!',
    score: 'Skoor',
    best: 'Parim',
    gameOver: 'Mäng läbi!',
    finalScore: 'Lõppskoor',
    tryAgain: 'Try again',
    youWin: 'Sa võidad!',
    currentScore: 'Praegune tulemus',
    keepPlaying: 'Keep playing',
    newGame: 'Uus mäng',
    howToPlay: 'Mängujuhend',
    instructions1: 'Use your arrow keys or WASD to move the tiles. When two tiles with the same number touch, they merge into one!',
    instructions2: 'After each move, a new tile appears (either 2 or 4).',
    instructions3: 'Create a tile with the number 2048 to win the game!',
    instructions4: 'After reaching 2048, you can continue playing to achieve even higher scores!',
    controls: 'Juhtimiselemendid',
    moveLeft: 'Liiguta vasakule',
    moveRight: 'Liiguta paremale',
    moveUp: 'Liiguta üles',
    moveDown: 'Liiguta alla',
    touchInstructions: 'On mobile devices, use the on-screen controls to move tiles.',
    undo: 'Võta tagasi',
  },
  fi: {
    title: '2048',
    description: 'Yhdistä laatat, pääse 2048:aan!',
    score: 'Pisteet',
    best: 'Paras',
    gameOver: 'Peli ohi!',
    finalScore: 'Loppupisteet',
    tryAgain: 'Yritä uudelleen',
    youWin: 'Voitit!',
    currentScore: 'Nykyiset pisteet',
    keepPlaying: 'Jatka peliä',
    newGame: 'Uusi peli',
    howToPlay: 'Kuinka pelata',
    instructions1: 'Käytä nuolinäppäimiä tai WASD:ta siirtääksesi laattoja. Kun kaksi samanlaista laattaa koskettaa, ne yhdistyvät!',
    instructions2: 'Jokaisen siirron jälkeen ilmestyy uusi laatta (2 tai 4).',
    instructions3: 'Luo laatta, jossa on numero 2048, voittaaksesi pelin!',
    instructions4: 'Saavutettuasi 2048, voit jatkaa pelaamista saavuttaaksesi vielä korkeampia pisteitä!',
    controls: 'Ohjaimet',
    moveLeft: 'Siirrä vasemmalle',
    moveRight: 'Siirrä oikealle',
    moveUp: 'Siirrä ylös',
    moveDown: 'Siirrä alas',
    touchInstructions: 'Mobiililaitteilla käytä ruudun ohjaimia siirtääksesi laattoja.',
    undo: 'Kumoa',
  },
  pl: {
    title: '2048',
    description: 'Łącz płytki, dojdź do 2048!',
    score: 'Wynik',
    best: 'Rekord',
    gameOver: 'Koniec gry!',
    finalScore: 'Końcowy wynik',
    tryAgain: 'Spróbuj ponownie',
    youWin: 'Wygrałeś!',
    currentScore: 'Aktualny wynik',
    keepPlaying: 'Graj dalej',
    newGame: 'Nowa gra',
    howToPlay: 'Jak grać',
    instructions1: 'Użyj strzałek lub WASD, by przesuwać płytki. Gdy dwie płytki z tą samą liczbą się zetkną, łączą się w jedną!',
    instructions2: 'Po każdym ruchu pojawia się nowa płytka (2 lub 4).',
    instructions3: 'Stwórz płytkę z liczbą 2048, by wygrać!',
    instructions4: 'Po osiągnięciu 2048, możesz kontynuować grę, aby osiągnąć jeszcze wyższy wynik!',
    controls: 'Sterowanie',
    moveLeft: 'W lewo',
    moveRight: 'W prawo',
    moveUp: 'W górę',
    moveDown: 'W dół',
    touchInstructions: 'Na telefonie użyj przycisków na ekranie.',
    undo: 'Cofnij',
  },
  ru: {
    title: '2048',
    description: 'Объединяйте плитки, достигните 2048!',
    score: 'Счёт',
    best: 'Рекорд',
    gameOver: 'Игра окончена!',
    finalScore: 'Итоговый счёт',
    tryAgain: 'Попробовать снова',
    youWin: 'Вы выиграли!',
    currentScore: 'Текущий счёт',
    keepPlaying: 'Продолжить игру',
    newGame: 'Новая игра',
    howToPlay: 'Как играть',
    instructions1: 'Используйте стрелки или WASD для перемещения плиток. Когда две плитки с одинаковым числом соприкасаются, они объединяются в одну!',
    instructions2: 'После каждого хода появляется новая плитка (2 или 4).',
    instructions3: 'Создайте плитку с числом 2048, чтобы выиграть!',
    instructions4: 'После достижения 2048, вы можете продолжить играть, чтобы набрать ещё больше очков!',
    controls: 'Управление',
    moveLeft: 'Влево',
    moveRight: 'Вправо',
    moveUp: 'Вверх',
    moveDown: 'Вниз',
    touchInstructions: 'На мобильных устройствах проводите пальцем для перемещения плиток.',
    undo: 'Отменить',
  },
  sv: {
    title: '2048',
    description: 'Slå ihop brickorna, nå 2048!',
    score: 'Poäng',
    best: 'Bästa',
    gameOver: 'Spelet över!',
    finalScore: 'Slutpoäng',
    tryAgain: 'Försök igen',
    youWin: 'Du vann!',
    currentScore: 'Nuvarande poäng',
    keepPlaying: 'Fortsätt spela',
    newGame: 'Nytt spel',
    howToPlay: 'Hur man spelar',
    instructions1: 'Använd piltangenterna eller WASD för att flytta brickorna. När två brickor med samma nummer möts, slås de ihop!',
    instructions2: 'Efter varje drag dyker en ny bricka upp (antingen 2 eller 4).',
    instructions3: 'Skapa en bricka med siffran 2048 för att vinna spelet!',
    instructions4: 'Efter att ha nått 2048, kan du fortsätta spela för att uppnå ännu högre poäng!',
    controls: 'Kontroller',
    moveLeft: 'Flytta vänster',
    moveRight: 'Flytta höger',
    moveUp: 'Flytta upp',
    moveDown: 'Flytta ner',
    touchInstructions: 'På mobila enheter, använd knapparna på skärmen för att flytta brickor.',
    undo: 'Ångra',
  },
  tok: {
    title: '2048',
    description: 'o wan e palisa nanpa; o kama 2048!',
    score: 'nanpa',
    best: 'nanpa suli',
    gameOver: 'musi li pini!',
    finalScore: 'nanpa pini',
    tryAgain: 'o pali sin',
    youWin: 'sina kama!',
    currentScore: 'nanpa ni',
    keepPlaying: 'o awen musi',
    newGame: 'musi sin',
    howToPlay: 'nasin musi',
    instructions1: 'o kepeken noka sitelen anu WASD tawa palisa. palisa tu pi nanpa sama la, ona li kama wan!',
    instructions2: 'tenpo ale la, palisa sin (2 anu 4) li kama.',
    instructions3: 'o pali e palisa nanpa 2048 tawa kama!',
    instructions4: 'kama 2048 la, sina ken awen musi tawa nanpa suli!',
    controls: 'nasin noka',
    moveLeft: 'tawa lete',
    moveRight: 'tawa poka',
    moveUp: 'tawa sewi',
    moveDown: 'tawa anpa',
    touchInstructions: 'lon ilo tawa la, o kepeken noka poka lon insa sitelen.',
    undo: 'wekamoli',
  },
  tr: {
    title: '2048',
    description: 'Karoları birleştirin, 2048\'e ulaşın!',
    score: 'Puan',
    best: 'En İyi',
    gameOver: 'Oyun Bitti!',
    finalScore: 'Son Puan',
    tryAgain: 'Tekrar Dene',
    youWin: 'Kazandınız!',
    currentScore: 'Mevcut Puan',
    keepPlaying: 'Oynamaya Devam Et',
    newGame: 'Yeni Oyun',
    howToPlay: 'Nasıl Oynanır',
    instructions1: 'Karoları hareket ettirmek için ok tuşlarını veya WASD\'yi kullanın. Aynı sayıya sahip iki karo birbirine dokunduğunda, birleşerek tek bir karo oluşturur!',
    instructions2: 'Her hareketten sonra yeni bir karo belirir (2 veya 4).',
    instructions3: '2048 sayısına sahip bir karo oluşturarak oyunu kazanın!',
    instructions4: '2048\'e ulaştıktan sonra, daha yüksek puanlar için oynamaya devam edebilirsiniz!',
    controls: 'Kontroller',
    moveLeft: 'Sola Hareket',
    moveRight: 'Sağa Hareket',
    moveUp: 'Yukarı Hareket',
    moveDown: 'Aşağı Hareket',
    touchInstructions: 'Mobil cihazlarda, karoları hareket ettirmek için kaydırın.',
    undo: 'Geri Al',
  },
  'vi-Hani': {
    title: '2048',
    description: 'Kết hợp các ô để đạt đến số 2048',
    score: 'Điểm',
    best: 'Cao nhất',
    gameOver: 'Trò chơi kết thúc!',
    finalScore: 'Điểm cuối cùng',
    tryAgain: 'Chơi lại',
    youWin: 'Bạn đã thắng!',
    currentScore: 'Điểm hiện tại',
    keepPlaying: 'Tiếp tục chơi',
    newGame: 'Chơi ván mới',
    howToPlay: 'Cách chơi',
    instructions1: 'Sử dụng phím mũi tên hoặc WASD để di chuyển các ô. Khi hai ô có cùng số được gộp vào nhau, chúng sẽ kết hợp thành số tổng của hai số đó.',
    instructions2: 'Sau mỗi lượt di chuyển, một ô mới (số 2 hoặc 4) xuất hiện.',
    instructions3: 'Hãy tạo một ô với số 2048 để thắng trò chơi nhé!',
    instructions4: 'Sau khi đạt được 2048, bạn có thể tiếp tục chơi để đạt điểm cao hơn!',
    controls: 'Điều khiển',
    moveLeft: 'Di chuyển sang trái',
    moveRight: 'Di chuyển sang phải',
    moveUp: 'Di chuyển lên',
    moveDown: 'Di chuyển xuống',
    touchInstructions: 'Trên điện thoại, hãy sử dụng các nút điều khiển ở trên màn hình.',
    undo: 'Hoàn tác',
  },
  zh: {
    title: '2048',
    description: '合并方块，达到2048！',
    score: '分数',
    best: '最佳',
    gameOver: '游戏结束！',
    finalScore: '最终分数',
    tryAgain: '再试一次',
    youWin: '你赢了！',
    currentScore: '当前分数',
    keepPlaying: '继续游戏',
    newGame: '新游戏',
    howToPlay: '游戏方法',
    instructions1: '使用方向键或WASD移动方块。当两个相同数字的方块相碰时，它们会合并成一个！',
    instructions2: '每次移动后，会出现一个新方块（2或4）。',
    instructions3: '创建一个数字为2048的方块来赢得游戏！',
    instructions4: '达到2048后，您可以继续游戏以获得更高分数！',
    controls: '控制',
    moveLeft: '向左移动',
    moveRight: '向右移动',
    moveUp: '向上移动',
    moveDown: '向下移动',
    touchInstructions: '在移动设备上，滑动来移动方块。',
    undo: '撤销',
  },
}

interface Game2048Props {
  lang?: string
}

export default function Game2048({ lang: propLang }: Game2048Props) {
  // Use language from store, fallback to prop
  const storeLang = useStore(languageStore)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    initLanguage()
    setMounted(true)
  }, [])

  const lang = mounted ? storeLang : (propLang || 'en')
  const t = translations[lang] || translations.en

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

  // Touch handling
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY }
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.current.x
    const deltaY = touch.clientY - touchStart.current.y

    const minSwipeDistance = 50

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        processMove(deltaX > 0 ? 'right' : 'left')
      }
    } else {
      if (Math.abs(deltaY) > minSwipeDistance) {
        processMove(deltaY > 0 ? 'down' : 'up')
      }
    }

    touchStart.current = null
  }, [processMove])

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.description}
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8">
          {/* Left column - Game */}
          <div className="flex flex-col gap-4">
            {/* Score display */}
            <div className="flex justify-between items-center mb-2">
              <div className="bg-card border rounded-lg p-3 text-center min-w-[120px]">
                <div className="text-sm font-medium text-muted-foreground">{t.score}</div>
                <div className="text-2xl font-bold">{score}</div>
              </div>
              <div className="bg-card border rounded-lg p-3 text-center min-w-[120px]">
                <div className="text-sm font-medium text-muted-foreground">{t.best}</div>
                <div className="text-2xl font-bold">{bestScore}</div>
              </div>
            </div>

            {/* Game board */}
            <div
              className="bg-card border rounded-lg p-4 relative"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="grid grid-cols-4 gap-2 bg-muted rounded-lg p-2"
                style={{ width: 'min(80vw, 340px)' }}
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
                    <h2 className="text-2xl md:text-3xl font-bold text-red-500 mb-3">{t.gameOver}</h2>
                    <p className="text-base md:text-lg mb-4">{t.finalScore}: <span className="font-bold">{score}</span></p>
                    <button
                      onClick={resetGame}
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors"
                    >
                      {t.tryAgain}
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
                    <h2 className="text-2xl md:text-3xl font-bold text-green-500 mb-3">{t.youWin}</h2>
                    <p className="text-base md:text-lg mb-4">{t.currentScore}: <span className="font-bold">{score}</span></p>
                    <div className="flex gap-3">
                      <button
                        onClick={continueGame}
                        className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
                      >
                        {t.keepPlaying}
                      </button>
                      <button
                        onClick={resetGame}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        {t.newGame}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
                {t.undo}
              </button>
              <button
                onClick={resetGame}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t.newGame}
              </button>
            </div>
          </div>

          {/* Right column - How to Play & Controls */}
          <section className="bg-card border rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{t.howToPlay}</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>{t.instructions1}</p>
              <p>{t.instructions2}</p>
              <p>{t.instructions3}</p>
              <p className="text-sm">{t.instructions4}</p>
            </div>

            {/* Controls section */}
            <h3 className="text-xl font-bold mt-6 mb-3">{t.controls}</h3>
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
                  <span className="inline-flex w-8 h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded">↑</span>
                  <span className="inline-flex w-8 h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded">W</span>
                </div>
                <span>{t.moveUp}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="inline-flex w-8 h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded">↓</span>
                  <span className="inline-flex w-8 h-8 bg-primary text-primary-foreground text-xs items-center justify-center rounded">S</span>
                </div>
                <span>{t.moveDown}</span>
              </div>
            </div>

            <p className="mt-6 text-sm text-muted-foreground md:hidden">
              {t.touchInstructions}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
