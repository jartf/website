/**
 * Parse image dimensions from a string in the format "widthxheight"
 * @param {string} [dimensions] - Image dimensions in the format "widthxheight"
 * @returns {{width: number, height: number}} The parsed width and height
 */
export function parseImageDimensions(dimensions) {
  if (!dimensions?.includes("x")) return { width: 1200, height: 630 }
  const [width, height] = dimensions.split("x").map(Number)
  return { width: width || 1200, height: height || 630 }
}

/**
 * Generate a blur data URL for image placeholders
 * @param {number} [width=1200] - The width of the image
 * @param {number} [height=630] - The height of the image
 * @returns {string} The blur data URL
 */
export function getBlurDataURL(width = 1200, height = 630) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#e2e8f0"/></svg>`
  return typeof Buffer !== "undefined"
    ? `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`
    : `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

/**
 * Check if an image should be prioritized based on its position in the content
 * @param {number} index - The index of the image in the content
 * @param {boolean} [isHero=false] - Whether the image is a hero image
 * @returns {boolean} Whether the image should be prioritized
 */
export function shouldPrioritizeImage(index, isHero = false) {
  return index === 0 || isHero
}

/**
 * Generate a placeholder image URL with the given dimensions and query
 * @param {number} width - The width of the image
 * @param {number} height - The height of the image
 * @param {string} [query] - The query to use for the placeholder image
 * @returns {string} The placeholder image URL
 */
export function getPlaceholderImageUrl(width, height, query) {
  const url = `/placeholder.svg?height=${height}&width=${width}`
  return query ? `${url}&query=${encodeURIComponent(query)}` : url
}

/**
 * Safely load an image with CORS handling
 * @param {string} src - The source URL of the image
 * @returns {Promise<HTMLImageElement>} A promise that resolves to the loaded image
 */
export function loadImageWithCors(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}
