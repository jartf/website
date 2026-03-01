"use client"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"
import Link from "next/link"
import { ProgressiveImage } from "./progressive-image"

/**
 * @typedef {Object} MarkdownRendererProps
 * @property {string} content - The markdown content to render
 */

/**
 * Component renderers for markdown
 */
const components = {
  a: ({ node, ...props }) => {
    const href = props.href || ""
    const isExternal = href.startsWith("http")

    if (isExternal) {
      return <a target="_blank" rel="noopener noreferrer" className="text-primary underline" {...props} />
    }

    return <Link href={href} className="text-primary underline" {...props} />
  },
  img: ({ node, ...props }) => {
    const src = props.src || ""
    const alt = props.alt || ""
    const width = props.width
    const height = props.height
    const dimensions = width && height ? `${width}x${height}` : undefined
    const caption = props.title || ""

    // Check if image should be prioritized (e.g., hero images at the top)
    const isPriority = props.className?.includes("priority") || false

    return (
      <figure className="my-8">
        <ProgressiveImage
          src={src}
          alt={alt}
          className="rounded-md overflow-hidden"
          dimensions={dimensions}
          priority={isPriority}
          caption={caption}
        />
        {caption && <figcaption className="text-center text-sm text-muted-foreground mt-2">{caption}</figcaption>}
      </figure>
    )
  },
}

/**
 * Renders markdown content with custom components
 * @param {MarkdownRendererProps} props - Component props
 * @returns {JSX.Element} Rendered markdown content
 */
export function MarkdownRenderer({ content }) {
  return (
    <div className="prose dark:prose-invert max-w-none blog-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSanitize]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
