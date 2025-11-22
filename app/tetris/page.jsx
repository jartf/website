import { generateMetadata } from "@/lib/metadata"
import TetrisClient from "./TetrisClient"

export const metadata = generateMetadata({
  title: "Tetris",
  description: "A simple Tetris game built with React.",
  path: "tetris",
})

export default () => <TetrisClient />
