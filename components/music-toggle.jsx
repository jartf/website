"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useMounted } from "@/hooks/use-mounted"

export function MusicToggle() {
  const { t } = useTranslation()
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const mounted = useMounted()
  const audioRef = useRef(null)
  if (!mounted) return null

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={!audioLoaded}
            className={!audioLoaded ? "opacity-50 cursor-not-allowed" : ""}
          >
            {isPlaying ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            <span className="sr-only">Toggle music</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {!audioLoaded ? "Music currently unavailable" : isPlaying ? t("music.pause") : t("music.play")}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
