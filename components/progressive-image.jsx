"use client"

import { useState, useCallback, memo, useEffect, useRef } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks"

/** Image zoom modal component */
const ImageZoom = memo(function ImageZoom({ src, alt, onClose, isOpen }) {
  const [scale, setScale] = useState(1)
  const modalRef = useRef(null)
  const closeButtonRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", handleKey)
    // Focus the close button when modal opens for better accessibility
    closeButtonRef.current?.focus()
    return () => window.removeEventListener("keydown", handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 md:p-8"
      onClick={(e) => e.target === modalRef.current && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-zoom-title"
      aria-describedby="image-zoom-instructions"
    >
      <div className="relative max-w-7xl w-full max-h-[90vh] flex flex-col items-center">
        <h2 id="image-zoom-title" className="sr-only">Image viewer: {alt}</h2>
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-background/80 text-foreground hover:bg-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Close image viewer"
        >
          <X size={24} aria-hidden="true" />
        </button>
        <div className="overflow-auto max-h-[calc(90vh-4rem)] w-full flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className={cn(
              "max-w-full max-h-[calc(90vh-4rem)] object-contain",
              !prefersReducedMotion && "transition-transform duration-300",
              scale > 1 ? "cursor-zoom-out" : "cursor-zoom-in"
            )}
            style={{ transform: `scale(${scale})` }}
            onClick={() => setScale(s => s === 1 ? 1.5 : 1)}
            role="img"
          />
        </div>
        <div className="mt-4 text-center text-sm text-muted-foreground" id="image-zoom-instructions">
          <p>{alt}</p>
          <p className="text-xs mt-1">Click image to zoom in/out, or press ESC to close</p>
        </div>
      </div>
    </div>
  )
})

/** Progressive image component with zoom capability */
export const ProgressiveImage = memo(function ProgressiveImage({ src, alt, width, height, className, priority = false, dimensions, caption }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isZoomed, setIsZoomed] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const [parsedWidth, parsedHeight] = dimensions?.split("x").map(Number) || [width || 1200, height || 630]
  const blurDataURL = `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${parsedWidth}" height="${parsedHeight}" viewBox="0 0 ${parsedWidth} ${parsedHeight}"><rect width="100%" height="100%" fill="#e2e8f0"/></svg>`
  ).toString("base64")}`

  const openZoom = useCallback(() => setIsZoomed(true), [])
  const closeZoom = useCallback(() => setIsZoomed(false), [])

  return (
    <>
      <div
        className={cn("relative overflow-hidden cursor-zoom-in", className)}
        onClick={openZoom}
        role="button"
        tabIndex={0}
        aria-label={`View ${alt} in full size`}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), openZoom())}
      >
        {isLoading && !priority && <div className={cn("absolute inset-0 bg-muted", !prefersReducedMotion && "animate-pulse")} aria-hidden="true" />}
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={parsedWidth}
          height={parsedHeight}
          className={cn(
            "w-full h-auto",
            isLoading && !prefersReducedMotion && !priority ? "scale-[1.02] blur-sm" : "scale-100 blur-none",
            !prefersReducedMotion && "transition-all duration-700"
          )}
          onLoad={() => setIsLoading(false)}
          priority={priority}
          placeholder="blur"
          blurDataURL={blurDataURL}
        />
      </div>
      <ImageZoom src={src || "/placeholder.svg"} alt={alt} isOpen={isZoomed} onClose={closeZoom} />
    </>
  )
})

export { ImageZoom }
