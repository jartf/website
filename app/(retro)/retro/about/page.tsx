import { SITE_NAME } from '@/lib/constants'

export const metadata = {
  title: `About Me - ${SITE_NAME} (Retro)`,
  robots: 'noindex, nofollow',
}

export default function RetroAboutPage() {
  return (
    <>
      {/* Page title */}
      <center>
        <font size={5}>
          <b>About me</b>
        </font>
        <hr width="50%" />
      </center>

      {/* Profile section */}
      <table width="100%" cellPadding={10} cellSpacing={0}>
        <tbody>
          <tr>
            <td width="20%" valign="top" style={{ textAlign: 'center' }}>
              {/* Profile image placeholder */}
              <table
                cellPadding={5}
                style={{
                  border: '3px ridge #808080',
                  backgroundColor: '#e0e0e0',
                }}
              >
                <tbody>
                  <tr>
                    <td>
                      <font size={6}>🧑‍💻</font>
                      <br />
                      <font size={2}><i>That&apos;s me!</i></font>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td width="80%" valign="top">
              <font size={3}>
                <p>
                  <b>Hello!</b> I&apos;m <font color="#ff0000"><b>Jarema</b></font>,
                  a student from somewhere on Earth.
                </p>
                <p>
                  I enjoy tinkering with my stuff, and sometimes you&apos;ll find me
                  maintaining this little corner of the internet that I call home.
                </p>
                <p>
                  When I&apos;m not coding, you might find me:
                </p>
                <ul>
                  <li>Reading about technology</li>
                  <li>Watching something on YouTube</li>
                  <li>Listening to music</li>
                  <li>Drinking too much tea and coffee</li>
                </ul>
              </font>
            </td>
          </tr>
        </tbody>
      </table>

      <hr />

      {/* Skills section */}
      <font size={4}>
        <b>Technical</b>
      </font>

      <table
        width="100%"
        cellPadding={5}
        cellSpacing={2}
      >
        <tbody>
          <tr>
            <th align="left"><font size={2}>Category</font></th>
            <th align="left"><font size={2}>Technologies</font></th>
          </tr>
          <tr>
            <td><font size={2}><b>Languages</b></font></td>
            <td><font size={2}>JavaScript, TypeScript, Python, HTML, CSS</font></td>
          </tr>
          <tr>
            <td><font size={2}><b>Frontend</b></font></td>
            <td><font size={2}>React, Next.js, Vue.js, Tailwind CSS</font></td>
          </tr>
          <tr>
            <td><font size={2}><b>Backend</b></font></td>
            <td><font size={2}>Node.js, Express, PostgreSQL, MongoDB</font></td>
          </tr>
          <tr>
            <td><font size={2}><b>Tools</b></font></td>
            <td><font size={2}>Git, VS Code, Docker, Linux</font></td>
          </tr>
        </tbody>
      </table>

      <hr />

      {/* Philosophy section */}
      <font size={4}>
        <b>Philosophy</b>
      </font>

      <blockquote
        style={{
          borderLeft: '4px solid #808080',
          paddingLeft: '15px',
          marginLeft: '10px',
        }}
      >
        <font size={3}>
          <i>
            &quot;The web should be accessible to everyone, regardless of their browser
            or device. That&apos;s why this site works even on browsers from 1993!&quot;
          </i>
        </font>
      </blockquote>

      <p>
        <font size={3}>
          I believe in:
        </font>
      </p>
      <ul>
        <li><font size={3}>Progressive enhancement</font></li>
        <li><font size={3}>Semantic HTML</font></li>
        <li><font size={3}>Accessibility for all</font></li>
        <li><font size={3}>The indie web and personal websites</font></li>
        <li><font size={3}>Open source software</font></li>
      </ul>

      <hr />

      {/* Contact CTA */}
      <center>
        <font size={3}>
          Want to get in touch?
          <br />
          <a href="/retro/contact">
            <b>Contact me!</b>
          </a>
        </font>
      </center>

      <br />

      {/* Back link */}
      <center>
        <font size={2}>
          <a href="/retro">&lt;&lt; Back to homepage</a>
        </font>
      </center>
    </>
  )
}
