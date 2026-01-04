/* eslint-disable @next/next/no-css-tags, @next/next/no-html-link-for-pages, @next/next/no-img-element */
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
          backgroundColor: '#1a1625',
          color: '#f2f2f2',
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
                  backgroundColor: '#2d1b4e',
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
                        <font size={2} color="#5dd9f4">
                          <i>A personal website since 2024</i>
                        </font>
                      </td>
                      <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>
                        <font size={2} color="#ffffff">
                          [<a href="/retro" style={{ color: '#5dd9f4' }}>Home</a>]
                          {' '}
                          [<a href="/retro/about" style={{ color: '#5dd9f4' }}>About</a>]
                          {' '}
                          [<a href="/retro/blog" style={{ color: '#5dd9f4' }}>Blog</a>]
                          {' '}
                          [<a href="/retro/projects" style={{ color: '#5dd9f4' }}>Projects</a>]
                          {' '}
                          [<a href="/retro/contact" style={{ color: '#5dd9f4' }}>Contact</a>]
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
                  backgroundColor: '#5dd9f4',
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
                    backgroundColor: '#2d1b4e',
                    border: '2px solid #5dd9f4',
                  }}
                >
                  <tbody>
                    <tr>
                      <td>
                        <font size={3} color="#f2f2f2">
                          <b>Note:</b> You are viewing the <b>retro version</b> of this website. Welcome!
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
                          backgroundColor: '#211833',
                          color: '#f2f2f2',
                          padding: '15px',
                          border: '2px inset #3d2f5a',
                        }}
                      >
                        {children}
                      </td>

                      {/* Sidebar */}
                      <td
                        valign="top"
                        width="25%"
                        style={{
                          backgroundColor: '#2d1b4e',
                          color: '#f2f2f2',
                          padding: '10px',
                          border: '2px inset #3d2f5a',
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
                  backgroundColor: '#2d1b4e',
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
        <font size={3} color="#5dd9f4"><b>Navigation</b></font>
      </center>
      <hr style={{ backgroundColor: '#3d2f5a', border: 'none', height: '2px' }} />
      <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
        <li><a href="/retro" style={{ color: '#5dd9f4' }}>Home</a></li>
        <li><a href="/retro/about" style={{ color: '#5dd9f4' }}>About me</a></li>
        <li><a href="/retro/blog" style={{ color: '#5dd9f4' }}>Blog</a></li>
        <li><a href="/retro/projects" style={{ color: '#5dd9f4' }}>Projects</a></li>
        <li><a href="/retro/now" style={{ color: '#5dd9f4' }}>Now</a></li>
        <li><a href="/retro/uses" style={{ color: '#5dd9f4' }}>Uses</a></li>
        <li><a href="/retro/webrings" style={{ color: '#5dd9f4' }}>Webrings</a></li>
        <li><a href="/retro/contact" style={{ color: '#5dd9f4' }}>Contact</a></li>
      </ul>

      <hr style={{ backgroundColor: '#3d2f5a', border: 'none', height: '2px' }} />

      <center>
        <font size={3} color="#5dd9f4"><b>Site info</b></font>
      </center>
      <hr style={{ backgroundColor: '#3d2f5a', border: 'none', height: '2px' }} />
      <font size={2}>
        <p>
          <b>Last updated:</b><br />
          {new Date().toLocaleDateString('en-GB', {
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

      <hr style={{ backgroundColor: '#3d2f5a', border: 'none', height: '2px' }} />

      <center>
        <font size={3} color="#5dd9f4"><b>Links</b></font>
      </center>
      <hr style={{ backgroundColor: '#3d2f5a', border: 'none', height: '2px' }} />
      <font size={2}>
        <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
          <li><a href="https://github.com/jartf" style={{ color: '#5dd9f4' }}>GitHub</a></li>
          <li><a href="/rss.xml" style={{ color: '#5dd9f4' }}>RSS feed</a></li>
          <li><a href="/" style={{ color: '#5dd9f4' }}>Modern site</a></li>
        </ul>
      </font>

      <hr style={{ backgroundColor: '#3d2f5a', border: 'none', height: '2px' }} />

      <center>
        <font size={2}>
          <img
            src="/underconstruction.png"
            alt="Under construction"
            width={88}
            height={31}
            style={{ imageRendering: 'pixelated' }}
          />
          <br />
          <font>This site is always under construction!</font>
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
          Jarema, {currentYear} - No rights reserved
          <br />
          <a href="mailto:hello@jarema.me" style={{ color: '#5dd9f4' }}>
            hello@jarema.me
          </a>
        </p>
        <p>
          <font size={2}>
            This page has been accessed{' '}
            <font color="#5dd9f4">
              <b>∞</b>
            </font>{' '}
            times since you loaded it!
            <br />
            You are visitor #42069
            {' '}(probably)
          </font>
        </p>
        <p>
          <font size={2}>
            [<a href="/" style={{ color: '#5dd9f4' }}>View modern version</a>]
            {' | '}
            [<a href="/sitemap.xml" style={{ color: '#5dd9f4' }}>Sitemap</a>]
            {' | '}
            [<a href="/rss.xml" style={{ color: '#5dd9f4' }}>RSS</a>]
          </font>
        </p>
      </font>
    </>
  )
}

function RetroBadges() {
  return (
    <table cellPadding={5} cellSpacing={5} style={{ margin: '0 auto' }} align="center">
      <tbody>
        {/* Row 1 - First 8 badges */}
        <tr align="center">
          <td>
            <img
              src="/sweet.png"
              alt="Sweet homepage"
              width={88}
              height={31}
            />
          </td>
          <td>
            <a href="https://www.anybrowser.org/campaign/">
              <img
                src="/any_browser.gif"
                alt="Best viewed with any browser"
                width={88}
                height={31}
              />
            </a>
          </td>
          <td>
            <img
              src="/lynxnow.gif"
              alt="Lynx Now!"
              width={88}
              height={31}
            />
          </td>
          <td>
            <img
              src="/dumbass.gif"
              alt="Dumbass webmaster ahead"
              width={88}
              height={31}
            />
          </td>
          <td>
            <img
              src="/join_logo.gif"
              alt="Miaow"
              width={88}
              height={31}
            />
          </td>
          <td>
            <img
              src="/bannars.gif"
              alt="Miaow"
              width={88}
              height={31}
            />
          </td>
          <td>
            <img
              src="/teto.gif"
              alt="Teto"
              width={88}
              height={31}
            />
          </td>
          <td>
            <img
              src="/button2019.gif"
              alt="Still using buttons in 2019!"
              width={88}
              height={31}
            />
          </td>
        </tr>
        {/* Row 2 - Next 8 badges */}
        <tr align="center">
          <td>
            <a href="https://people.pledge.party">
              <img
                src="/people_pledge_badge_party_cream_pink_88x31.png"
                alt="People Pledge"
                width={88}
                height={31}
              />
            </a>
          </td>
          <td>
            <a href="https://kagi.com/smallweb">
              <img
                src="/kagi-smallweb-yellow.gif"
                alt="Kagi Small Web"
                width={88}
                height={31}
              />
            </a>
          </td>
          <td>
            <img
              src="/internetprivacy.gif"
              alt="Internet Privacy Now!"
              width={88}
              height={31}
            />
          </td>
          <td>
            <a href="https://yesterweb.org/no-to-web3/">
              <img
                src="/saynotoweb3_88x31.gif"
                alt="Keep the web free, say no to Web3"
                width={88}
                height={31}
              />
            </a>
          </td>
          <td>
            <a href="/rss.xml">
              <img
                src="/valid-rss-rogers.png"
                alt="Valid RSS feed"
                width={88}
                height={31}
              />
            </a>
          </td>
          <td>
            <a href="/atom.xml">
              <img
                src="/valid-atom.png"
                alt="Valid Atom feed"
                width={88}
                height={31}
              />
            </a>
          </td>
          <td>
            <a href="/humans.txt">
              <img
                src="/humanstxt.png"
                alt="humans.txt"
                width={88}
                height={31}
              />
            </a>
          </td>
          <td>
            <img
              src="/got_html.gif"
              alt="Got HTML?"
              width={88}
              height={31}
            />
          </td>
        </tr>
        {/* Row 3 - Last 3 badges */}
        <tr>
          <td colSpan={8} align="center">
            <a href="https://fedoraproject.org/">
              <img
                src="/fedora.gif"
                alt="Fedora Linux"
                width={88}
                height={31}
              />
            </a>
            {' '}
            <a href="/blog/2025/08/anything-but-chrome">
              <img
                src="/anythingbut.gif"
                alt="Anything but Chrome"
                width={88}
                height={31}
              />
            </a>
            {' '}
            <img
              src="/retrokid.gif"
              alt="Retro"
              width={88}
              height={31}
            />
          </td>
        </tr>
      </tbody>
    </table>
  )
}
