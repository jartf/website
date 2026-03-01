/**
 * @typedef {Object} MetadataProps
 * @property {string} [title] - The page title
 * @property {string} [description] - The page description
 * @property {string} [path] - The page path
 * @property {boolean} [isHomePage] - Whether this is the home page
 */

/**
 * Generates metadata for a page
 * @param {MetadataProps} param0 - The metadata properties
 * @returns {Object} The metadata object
 */
export function generateMetadata({ title, description, path = "", isHomePage = false }) {
  const metaTitle = isHomePage ? "Jarema's digital garden" : `${title} - Jarema`
  const url = `https://jarema.me${path ? `/${path}` : ""}`

  return {
    title: metaTitle,
    description,
    openGraph: {
      type: "website",
      url,
      title: metaTitle,
      description,
      siteName: "Jarema's digital garden",
    },
    twitter: {
      card: "summary",
      title: metaTitle,
      description,
    },
  }
}
