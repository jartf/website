import { generateMetadata } from "@/lib/metadata"
import Game2048Client from "./2048Client"

export const metadata = generateMetadata({
  title: "2048",
  description: "A clone of the popular 2048 game built with React.",
  path: "2048",
})

export default () => <Game2048Client />
