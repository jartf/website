import { generateMetadata } from "@/lib/metadata"
import { AlertCircle } from "lucide-react"
import TetrisClient from "./TetrisClient"

export const metadata = generateMetadata({
  title: "Tetris",
  description: "A simple Tetris game built with React.",
  path: "tetris",
})

export default function TetrisPage() {
  return (
    <>
      {/* Server-rendered fallback for no-JS users */}
      <noscript>
        <main className="relative min-h-screen w-full overflow-hidden">
          <div className="container mx-auto px-4 py-16 relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8 flex justify-center">
                <div className="bg-yellow-500/10 border-2 border-yellow-500 rounded-full p-6">
                  <AlertCircle className="h-16 w-16 text-yellow-500" />
                </div>
              </div>

              <h1 className="text-4xl font-bold mb-4">Tetris Game</h1>

              <div className="bg-card border-2 border-yellow-500/50 rounded-lg p-8 mb-6">
                <h2 className="text-2xl font-bold mb-4 text-yellow-600 dark:text-yellow-400">
                  JavaScript Required
                </h2>
                <p className="text-lg text-muted-foreground mb-4">
                  This game requires JavaScript to run. Please enable JavaScript in your browser settings to play.
                </p>
                <p className="text-sm text-muted-foreground">
                  Tetris is an interactive puzzle game where you arrange falling blocks to clear lines. The game uses JavaScript for real-time piece movements, rotations, collision detection, and game logic.
                </p>
              </div>
            </div>
          </div>
        </main>
      </noscript>

      {/* Client component for JS-enabled users */}
      <TetrisClient />
    </>
  )
}
