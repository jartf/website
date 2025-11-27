"use client"

import { useState, useEffect, useRef, useCallback, memo } from "react"
import { X } from "lucide-react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

/**
 * Image zoom component for viewing images in a modal
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Image alt text
 * @param {Function} props.onClose - Function to call when closing the modal
 * @param {boolean} props.isOpen - Whether the modal is open
 */
export const ImageZoom = memo(function ImageZoom({ src, alt, onClose, isOpen }) {
  const [isLoading, setIsLoading] = useState(true)
  const [scale, setScale] = useState(1)
  const modalRef = useRef(null)
  const imageRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  // Handle keyboard events
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  // Focus trap
  useEffect(() => {
    if (isOpen) {
      // Save the previously focused element
      const previouslyFocused = document.activeElement

      // Focus the modal
      modalRef.current?.focus()

      // Return focus when closed
      return () => {
        previouslyFocused?.focus()
      }
    }
  }, [isOpen])

  // Handle image load - memoized
  const handleImageLoad = useCallback(() => {
    setIsLoading(false)
  }, [])

  // Handle zoom in/out - memoized
  const toggleZoom = useCallback(() => {
    setScale(scale === 1 ? 1.5 : 1)
  }, [scale])

  // Handle background click to close - memoized
  const handleBackdropClick = useCallback((e) => {
    if (e.target === modalRef.current) {
      onClose()
    }
  }, [onClose])

  if (!isOpen) return null

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 md:p-8"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Image: ${alt}`}
      tabIndex={-1}
    >
      <div className="relative max-w-7xl w-full max-h-[90vh] flex flex-col items-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-background/80 text-foreground hover:bg-background transition-colors"
          aria-label="Close image"
        >
          <X size={24} />
        </button>

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={cn(
                "h-8 w-8 rounded-full border-4 border-primary/30 border-t-primary",
                prefersReducedMotion ? "" : "animate-spin",
              )}
            />
          </div>
        )}

        {/* Image */}
        <div className="overflow-auto max-h-[calc(90vh-4rem)] w-full flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imageRef}
            src={src || "/placeholder.svg"}
            alt={alt}
            className={cn(
              "max-w-full max-h-[calc(90vh-4rem)] object-contain cursor-zoom-in",
              prefersReducedMotion ? "" : "transition-transform duration-300",
              scale > 1 ? "cursor-zoom-out" : "cursor-zoom-in",
            )}
            style={{ transform: `scale(${scale})` }}
            onClick={toggleZoom}
            onLoad={handleImageLoad}
          />
        </div>

        {/* Caption */}
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>{alt}</p>
          <p className="text-xs mt-1">Click image to zoom in/out, or press ESC to close</p>
        </div>
      </div>
    </div>
  )
})
