import { SITE_NAME } from '@/lib/constants'

/**
 * Retro Route Group Layout
 *
 * This layout completely replaces the root layout for /retro routes.
 * It provides a standalone HTML document without any modern components
 * like Header, Footer, Galaxy background, ThemeProvider, etc.
 *
 * This ensures text browsers like Lynx don't see the modern navigation
 * and other elements that don't make sense in the retro context.
 *
 * Uses:
 * - HTML 3.2 compatible markup (tables for layout!)
 * - Inline styles only (for browsers that don't support external CSS)
 * - No JavaScript dependencies
 * - Basic colors and fonts that work in Mosaic/Netscape
 *
 * Tested compatibility targets:
 * - NCSA Mosaic 2.0+
 * - Netscape Navigator 1.0+
 * - Internet Explorer 3.0+
 * - Lynx, Links, w3m (text browsers)
 */

export default function RetroRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <title>{`${SITE_NAME} - Retro Version`}</title>
        {/* CSS1-compatible stylesheet for browsers that support it */}
        <link rel="stylesheet" href="/retro.css" type="text/css" />
      </head>
      <body
        style={{
          backgroundColor: '#c0c0c0',
          color: '#000000',
          fontFamily: 'Times New Roman, Times, serif',
          margin: 0,
          padding: 0,
        }}
      >
        {/* Main layout table - the 90s way! */}
        <table
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          style={{ maxWidth: '800px', margin: '0 auto' }}
        >
          <tbody>
            {/* Header row */}
            <tr>
              <td
                colSpan={3}
                style={{
                  backgroundColor: '#000080',
                  color: '#ffffff',
                  padding: '10px',
                  textAlign: 'center',
                }}
              >
                <table width="100%" cellPadding={0} cellSpacing={0}>
                  <tbody>
                    <tr>
                      <td style={{ textAlign: 'left' }}>
                        <font size={5} color="#ffffff">
                          <b>☆ {SITE_NAME} ☆</b>
                        </font>
                        <br />
                        <font size={2} color="#ffff00">
                          <i>A personal website since 2024</i>
                        </font>
                      </td>
                      <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>
                        <font size={2} color="#ffffff">
                          [<a href="/retro" style={{ color: '#00ffff' }}>Home</a>]
                          {' '}
                          [<a href="/retro/about" style={{ color: '#00ffff' }}>About</a>]
                          {' '}
                          [<a href="/retro/blog" style={{ color: '#00ffff' }}>Blog</a>]
                          {' '}
                          [<a href="/retro/projects" style={{ color: '#00ffff' }}>Projects</a>]
                          {' '}
                          [<a href="/retro/contact" style={{ color: '#00ffff' }}>Contact</a>]
                        </font>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            {/* Decorative HR */}
            <tr>
              <td colSpan={3} style={{ padding: '5px 0' }}>
                <hr style={{
                  border: 'none',
                  height: '3px',
                  backgroundColor: '#000080',
                }} />
              </td>
            </tr>

            {/* Modern browser notice */}
            <tr>
              <td colSpan={3} style={{ padding: '5px 10px' }}>
                <table
                  width="100%"
                  cellPadding={5}
                  cellSpacing={0}
                  style={{
                    backgroundColor: '#ffffcc',
                    border: '2px solid #ff9900',
                  }}
                >
                  <tbody>
                    <tr>
                      <td>
                        <font size={2}>
                          <b>📣 Note:</b> You are viewing the <b>retro-compatible version</b> of this website.
                          For the full experience with all modern features, please visit{' '}
                          <a href="/" style={{ color: '#0000ff' }}>the main site</a>{' '}
                          using a modern browser.
                        </font>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            {/* Content area with sidebar */}
            <tr>
              <td colSpan={3} style={{ padding: '10px' }}>
                <table width="100%" cellPadding={0} cellSpacing={10}>
                  <tbody>
                    <tr>
                      {/* Main content */}
                      <td
                        valign="top"
                        width="75%"
                        style={{
                          backgroundColor: '#ffffff',
                          padding: '15px',
                          border: '2px inset #808080',
                        }}
                      >
                        {children}
                      </td>

                      {/* Sidebar */}
                      <td
                        valign="top"
                        width="25%"
                        style={{
                          backgroundColor: '#e0e0e0',
                          padding: '10px',
                          border: '2px inset #808080',
                        }}
                      >
                        <RetroSidebar />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            {/* Footer */}
            <tr>
              <td
                colSpan={3}
                style={{
                  backgroundColor: '#000080',
                  color: '#ffffff',
                  padding: '10px',
                  textAlign: 'center',
                }}
              >
                <RetroFooter />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Bottom badges */}
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <RetroBadges />
        </div>
      </body>
    </html>
  )
}

function RetroSidebar() {
  return (
    <>
      <center>
        <font size={3}><b>Navigation</b></font>
      </center>
      <hr />
      <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
        <li><a href="/retro">🏠 Home</a></li>
        <li><a href="/retro/about">👤 About Me</a></li>
        <li><a href="/retro/blog">📝 Blog</a></li>
        <li><a href="/retro/projects">💻 Projects</a></li>
        <li><a href="/retro/now">📍 Now</a></li>
        <li><a href="/retro/uses">🔧 Uses</a></li>
        <li><a href="/retro/contact">📧 Contact</a></li>
      </ul>

      <hr />

      <center>
        <font size={3}><b>Site Info</b></font>
      </center>
      <hr />
      <font size={2}>
        <p>
          <b>Last updated:</b><br />
          {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        <p>
          <b>Webmaster:</b><br />
          Jarema
        </p>
      </font>

      <hr />

      <center>
        <font size={3}><b>Links</b></font>
      </center>
      <hr />
      <font size={2}>
        <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
          <li><a href="https://github.com/0x4a656666">GitHub</a></li>
          <li><a href="/rss.xml">RSS Feed</a></li>
          <li><a href="/">Modern Site</a></li>
        </ul>
      </font>

      <hr />

      <center>
        <font size={2}>
          <img
            src="https://web.archive.org/web/20090830040033im_/http://geocities.com/SiliconValley/Heights/4164/animated_construction.gif"
            alt="Under Construction"
            width={40}
            height={40}
            style={{ imageRendering: 'pixelated' }}
          />
          <br />
          <blink>Under Construction!</blink>
        </font>
      </center>
    </>
  )
}

function RetroFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <>
      <font size={2} color="#ffffff">
        <p>
          &copy; 1996-{currentYear} Jarema | All Rights Reserved
          <br />
          <a href="mailto:hi@jarema.me" style={{ color: '#00ffff' }}>
            hi@jarema.me
          </a>
        </p>
        <p>
          <font size={1}>
            This page has been accessed{' '}
            <font color="#00ff00">
              <b>∞</b>
            </font>{' '}
            times since you loaded it!
            <br />
            You are visitor #42069
            {' '}(probably)
          </font>
        </p>
        <p>
          <font size={1}>
            [<a href="/" style={{ color: '#ffff00' }}>View Modern Version</a>]
            {' | '}
            [<a href="/sitemap.xml" style={{ color: '#ffff00' }}>Sitemap</a>]
            {' | '}
            [<a href="/rss.xml" style={{ color: '#ffff00' }}>RSS</a>]
          </font>
        </p>
      </font>
    </>
  )
}

function RetroBadges() {
  return (
    <table cellPadding={5} cellSpacing={5} style={{ margin: '0 auto' }}>
      <tbody>
        <tr>
          <td>
            <a href="https://www.anybrowser.org/campaign/">
              <img
                src="https://www.anybrowser.org/campaign/bvgraphics/abanybrowser3.gif"
                alt="Best Viewed With Any Browser"
                width={88}
                height={31}
                style={{ border: '1px solid #000' }}
              />
            </a>
          </td>
          <td>
            <img
              src="https://web.archive.org/web/20091027081833im_/http://geocities.com/ResearchTriangle/Station/5765/netscape.gif"
              alt="Netscape Now!"
              width={88}
              height={31}
              style={{ border: '1px solid #000' }}
            />
          </td>
          <td>
            <img
              src="https://web.archive.org/web/20091019182711im_/http://geocities.com/SiliconValley/Way/4302/w3c_html40.gif"
              alt="Valid HTML 4.0"
              width={88}
              height={31}
              style={{ border: '1px solid #000' }}
            />
          </td>
          <td>
            <img
              src="https://web.archive.org/web/20091024201254im_/http://geocities.com/SiliconValley/Hills/3116/css_valid.gif"
              alt="Valid CSS"
              width={88}
              height={31}
              style={{ border: '1px solid #000' }}
            />
          </td>
          <td>
            <img
              src="https://web.archive.org/web/20090831030905im_/http://geocities.com/SiliconValley/Horizon/7810/madmac.gif"
              alt="Made on a Mac"
              width={88}
              height={31}
              style={{ border: '1px solid #000' }}
            />
          </td>
        </tr>
        <tr>
          <td colSpan={5} style={{ textAlign: 'center' }}>
            <font size={1} color="#666666">
              Best viewed at 800x600 resolution with 256 colors
            </font>
          </td>
        </tr>
      </tbody>
    </table>
  )
}
