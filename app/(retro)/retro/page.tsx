/* eslint-disable @next/next/no-img-element */
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants'

/**
 * Retro Home Page
 *
 * A nostalgic 90s-style homepage compatible with ancient browsers.
 * Uses only HTML 3.2 compatible elements and inline styles.
 */

export const metadata = {
  title: `${SITE_NAME} - Retro version`,
  description: SITE_DESCRIPTION,
  robots: 'noindex, nofollow', // Don't index the retro version
}

export default function RetroHomePage() {
  return (
    <>
      {/* Welcome banner */}
      <center>
        <font size={6}>
          <b>Welcome to my corner!</b>
        </font>
      </center>

      <hr />

      {/* Introduction */}
      <p>
        <font size={3}>
          <b>Hello wanderer!</b> My name is <font color="#ff0000"><b>Jarema</b></font> and
          this is my corner on the internet!
        </font>
      </p>

      <p>
        <font size={3}>
          I am a student and developer who enjoys tinkering and building things. This website is the place I share my{' '}
          <a href="/retro/blog">thoughts</a>,{' '}
          <a href="/retro/projects">projects</a>, and also{' '}
          <a href="/retro/about">a bit about myself</a>.
        </font>
      </p>

      <hr />

      {/* What's here section */}
      <table width="100%" cellPadding={5} cellSpacing={0}>
        <tbody>
          <tr>
            <td>
              <font size={4}>
                <b>What&apos;s on here?</b>
              </font>
            </td>
          </tr>
        </tbody>
      </table>

      <blockquote>
        <dl>
          <dt><b><a href="/retro/about">About me</a></b></dt>
          <dd>Learn more about who I am and what I do.</dd>

          <dt><b><a href="/retro/blog">Blog</a></b></dt>
          <dd>Read my latest thoughts, tutorials, and ramblings.</dd>

          <dt><b><a href="/retro/projects">Projects</a></b></dt>
          <dd>Check out the things I&apos;ve built.</dd>

          <dt><b><a href="/retro/now">Now</a></b></dt>
          <dd>What I&apos;m currently focused on.</dd>

          <dt><b><a href="/retro/uses">Uses</a></b></dt>
          <dd>The tools and tech I use daily.</dd>

          <dt><b><a href="/retro/contact">Contact</a></b></dt>
          <dd>Ways to get in touch with me.</dd>
        </dl>
      </blockquote>

      <hr />

      {/* Fun facts section */}
      <table
        width="100%"
        cellPadding={10}
        cellSpacing={0}
        style={{ backgroundColor: '#e8e8e8', border: '2px groove #808080' }}
      >
        <tbody>
          <tr>
            <td>
              <center>
                <font size={4} color="#008000">
                  <b>✨ Fun Facts! ✨</b>
                </font>
              </center>
              <ul>
                <li>This site works on browsers from 1993! 🖥️</li>
                <li>No JavaScript required for basic navigation! 📜</li>
                <li>Tables are used for layout (as nature intended) 📊</li>
                <li>Best viewed at 800x600 with millions of colors 🎨</li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>

      <hr />

      {/* Guestbook call to action */}
      <center>
        <table
          cellPadding={10}
          cellSpacing={0}
          style={{ backgroundColor: '#ffffcc', border: '3px ridge #808080' }}
        >
          <tbody>
            <tr>
              <td>
                <center>
                  <img
                    src="https://web.archive.org/web/20091027042814im_/http://geocities.com/SiliconValley/Lab/3638/penpals.gif"
                    alt="Guestbook"
                    width={100}
                  />
                  <br />
                  <font size={3} color="#800000">
                    <b>Sign my Guestbook!</b>
                  </font>
                  <br />
                  <font size={2}>
                    Leave a message and let me know you were here!
                    <br />
                    <a href="/guestbook">
                      <b>[Click Here to Sign]</b>
                    </a>
                  </font>
                </center>
              </td>
            </tr>
          </tbody>
        </table>
      </center>

      <hr />

      {/* Webrings */}
      <center>
        <font size={3} color="#000080">
          <b>🕸️ Webrings 🕸️</b>
        </font>
        <br />
        <font size={2}>
          This site is part of several webrings connecting cool personal sites!
          <br />
          <a href="/retro/webrings">[View All Webrings]</a>
        </font>
      </center>

      <hr />

      {/* News/Updates */}
      <table
        width="100%"
        cellPadding={5}
        style={{ backgroundColor: '#f0f0f0', border: '1px solid #000' }}
      >
        <tbody>
          <tr>
            <td style={{ backgroundColor: '#000080', color: '#ffffff' }}>
              <font size={3}><b>📰 Latest News</b></font>
            </td>
          </tr>
          <tr>
            <td>
              <font size={2}>
                <b>Jan 2026:</b> Added retro browser support! Now compatible with
                Mosaic, Netscape Navigator, and other vintage browsers. 🎉
                <br /><br />
                <b>2024:</b> Site launched! Welcome to my digital garden.
                <br /><br />
                <i>Check the <a href="/retro/blog">blog</a> for more updates!</i>
              </font>
            </td>
          </tr>
        </tbody>
      </table>

      <br />

      {/* Site ring graphic */}
      <center>
        <img
          src="https://web.archive.org/web/20091020060133im_/http://geocities.com/Hollywood/4616/emailme.gif"
          alt="Email Me!"
          width={100}
        />
        <br />
        <font size={2}>
          Questions? Comments? <a href="mailto:hi@jarema.me">Drop me a line!</a>
        </font>
      </center>

      <br />

      {/* Last updated */}
      <center>
        <font size={1} color="#666666">
          <i>
            Last updated: {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </i>
        </font>
      </center>
    </>
  )
}
