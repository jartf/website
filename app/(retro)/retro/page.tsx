/* eslint-disable @next/next/no-img-element */
import { siteName, siteDescription } from '@/lib/constants'

/**
 * Retro Home Page
 *
 * A nostalgic 90s-style homepage compatible with ancient browsers.
 * Uses only HTML 3.2 compatible elements and inline styles.
 */

export const metadata = {
  title: `${siteName} - Retro version`,
  description: siteDescription,
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

      {/* Webrings */}
      <center>
        <font size={3}>
          <b>Webrings</b>
        </font>
        <br />
        <font size={2}>
          This site is part of several webrings. Check them out, they're cool!
          <br />
          <a href="/retro/webrings">View all webrings</a>
        </font>
      </center>

      <hr />

      {/* Last updated */}
      <center>
        <font size={2} color="#aaaaaa">
          <i>
            Last updated: {new Date().toLocaleDateString('en-GB', {
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
