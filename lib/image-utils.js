const DEFAULT_WIDTH = 1200
const DEFAULT_HEIGHT = 630

export function parseImageDimensions(dimensions) {
  if (!dimensions?.includes("x")) return { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT }
  const [width, height] = dimensions.split("x").map(Number)
  return { width: width || DEFAULT_WIDTH, height: height || DEFAULT_HEIGHT }
}

export function getBlurDataURL(width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#e2e8f0"/></svg>`
  return typeof Buffer !== "undefined"
    ? `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`
    : `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export const shouldPrioritizeImage = (index, isHero = false) => index === 0 || isHero

export const getPlaceholderImageUrl = (width, height, query) =>
  `/placeholder.svg?height=${height}&width=${width}${query ? `&query=${encodeURIComponent(query)}` : ''}`

export const loadImageWithCors = (src) => new Promise((resolve, reject) => {
  const img = new Image()
  img.crossOrigin = "anonymous"
  img.onload = () => resolve(img)
  img.onerror = reject
  img.src = src
})
