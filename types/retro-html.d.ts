/**
 * Type declarations for deprecated HTML elements used in the retro version.
 *
 * These elements are valid HTML but deprecated, and not included in React's
 * default JSX types. We need to declare them to use them without TypeScript errors.
 */

import "react"

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      // Deprecated text formatting elements
      font: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          color?: string
          size?: string | number
          face?: string
        },
        HTMLElement
      >
      center: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >
      blink: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >
      marquee: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          behavior?: "scroll" | "slide" | "alternate"
          direction?: "left" | "right" | "up" | "down"
          scrollamount?: number
          scrolldelay?: number
          loop?: number
          bgcolor?: string
          width?: string | number
          height?: string | number
        },
        HTMLElement
      >
    }
  }
}

// Extend HTML element attributes to include deprecated attributes
declare module "react" {
  interface HTMLAttributes<T> {
    // Deprecated table attributes
    bgcolor?: string
    valign?: "top" | "middle" | "bottom" | "baseline"
    align?: "left" | "center" | "right" | "justify"
  }

  interface TdHTMLAttributes<T> {
    width?: string | number
    height?: string | number
    bgcolor?: string
    valign?: "top" | "middle" | "bottom" | "baseline"
    nowrap?: boolean
  }

  interface TableHTMLAttributes<T> {
    width?: string | number
    height?: string | number
    bgcolor?: string
    border?: string | number
    cellPadding?: string | number
    cellSpacing?: string | number
    frame?: string
    rules?: string
  }

  interface ImgHTMLAttributes<T> {
    border?: string | number
    hspace?: number
    vspace?: number
  }

  interface HRHTMLAttributes {
    width?: string | number
    size?: number
    noshade?: boolean
    color?: string
  }

  // Allow width on HR elements
  interface HTMLAttributes<T> {
    width?: string | number
  }
}

export {}
