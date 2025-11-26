"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { ImageZoom } from "./image-zoom"

/**
 * Progressive image component with zoom capability
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Image alt text
 * @param {number} [props.width] - Image width
 * @param {number} [props.height] - Image height
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.priority] - Whether to prioritize loading
 * @param {string} [props.dimensions] - Optional "widthxheight" format
 * @param {string} [props.caption] - Optional image caption
 */
export function ProgressiveImage({ src, alt, width, height, className, priority = false, dimensions, caption }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isZoomed, setIsZoomed] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  // Parse dimensions if provided
  const parsedDimensions = dimensions?.split("x").map(Number) || []
  const parsedWidth = parsedDimensions[0] || width || 1200
  const parsedHeight = parsedDimensions[1] || height || 630

  // Handle image load complete
  const handleImageLoad = () => {
    setIsLoading(false)
  }

  // Toggle zoom
  const toggleZoom = () => {
    setIsZoomed(true)
  }

  // Close zoom
  const closeZoom = () => {
    setIsZoomed(false)
  }

  return (
    <>
      <div
        className={cn("relative overflow-hidden", className, "cursor-zoom-in")}
        onClick={toggleZoom}
        role="button"
        tabIndex={0}
        aria-label={`View ${alt} in full size`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            toggleZoom()
          }
        }}
      >
        {/* Low quality placeholder */}
        {isLoading && !priority && (
          <div
            className={cn("absolute inset-0 bg-muted", prefersReducedMotion ? "" : "animate-pulse")}
            aria-hidden="true"
          />
        )}

        {/* Main image */}
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={parsedWidth}
          height={parsedHeight}
          className={cn(
            "w-full h-auto",
            isLoading && !prefersReducedMotion && !priority ? "scale-[1.02] blur-sm" : "scale-100 blur-none",
            prefersReducedMotion ? "" : "transition-all duration-700",
          )}
          onLoad={handleImageLoad}
          priority={priority}
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${Buffer.from(
            `<svg xmlns="http://www.w3.org/2000/svg" width="${parsedWidth}" height="${parsedHeight}" viewBox="0 0 ${parsedWidth} ${parsedHeight}"><rect width="100%" height="100%" fill="#e2e8f0"/></svg>`,
          ).toString("base64")}`}
        />
      </div>

      {/* Image zoom modal */}
      <ImageZoom src={src || "/placeholder.svg"} alt={alt} isOpen={isZoomed} onClose={closeZoom} />
    </>
  )
}
