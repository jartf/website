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
        <font size={5} color="#000080">
          <b>👤 About Me</b>
        </font>
        <hr width="50%" />
      </center>

      {/* Profile section */}
      <table width="100%" cellPadding={10} cellSpacing={0}>
        <tbody>
          <tr>
            <td width="30%" valign="top" style={{ textAlign: 'center' }}>
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
            <td width="70%" valign="top">
              <font size={3}>
                <p>
                  <b>Hello!</b> I&apos;m <font color="#ff0000"><b>Jarema</b></font>,
                  a developer and digital gardener from planet Earth 🌍.
                </p>
                <p>
                  I enjoy building things for the web, tinkering with technology,
                  and maintaining this little corner of the internet that I call home.
                </p>
                <p>
                  When I&apos;m not coding, you might find me:
                </p>
                <ul>
                  <li>📚 Reading about technology and design</li>
                  <li>🎮 Playing video games</li>
                  <li>🎵 Listening to music</li>
                  <li>☕ Drinking too much coffee</li>
                </ul>
              </font>
            </td>
          </tr>
        </tbody>
      </table>

      <hr />

      {/* Skills section */}
      <font size={4} color="#000080">
        <b>💻 Technical Skills</b>
      </font>

      <table
        width="100%"
        cellPadding={5}
        cellSpacing={2}
        style={{ backgroundColor: '#f0f0f0' }}
      >
        <tbody>
          <tr style={{ backgroundColor: '#c0c0c0' }}>
            <th align="left"><font size={2}>Category</font></th>
            <th align="left"><font size={2}>Technologies</font></th>
          </tr>
          <tr>
            <td><font size={2}><b>Languages</b></font></td>
            <td><font size={2}>JavaScript, TypeScript, Python, HTML, CSS</font></td>
          </tr>
          <tr style={{ backgroundColor: '#e8e8e8' }}>
            <td><font size={2}><b>Frontend</b></font></td>
            <td><font size={2}>React, Next.js, Vue.js, Tailwind CSS</font></td>
          </tr>
          <tr>
            <td><font size={2}><b>Backend</b></font></td>
            <td><font size={2}>Node.js, Express, PostgreSQL, MongoDB</font></td>
          </tr>
          <tr style={{ backgroundColor: '#e8e8e8' }}>
            <td><font size={2}><b>Tools</b></font></td>
            <td><font size={2}>Git, VS Code, Docker, Linux</font></td>
          </tr>
        </tbody>
      </table>

      <hr />

      {/* Philosophy section */}
      <font size={4} color="#000080">
        <b>🌱 My Philosophy</b>
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

      {/* Fun facts */}
      <table
        width="100%"
        cellPadding={10}
        style={{ backgroundColor: '#ffffcc', border: '2px solid #ffcc00' }}
      >
        <tbody>
          <tr>
            <td>
              <center>
                <font size={3} color="#800000">
                  <b>✨ Random Facts About Me ✨</b>
                </font>
              </center>
              <ul>
                <li>I speak multiple languages (human ones, not just programming!)</li>
                <li>I enjoy collecting vintage tech and retro computing</li>
                <li>This retro version of my site was made with love 💙</li>
                <li>My favorite decade for web design? The 90s, obviously!</li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>

      <hr />

      {/* Contact CTA */}
      <center>
        <font size={3}>
          Want to get in touch?
          <br />
          <a href="/retro/contact">
            <b>[📧 Contact Me]</b>
          </a>
          {' | '}
          <a href="https://github.com/0x4a656666">
            <b>[GitHub]</b>
          </a>
        </font>
      </center>

      <br />

      {/* Back link */}
      <center>
        <font size={2}>
          <a href="/retro">&lt;&lt; Back to Homepage</a>
        </font>
      </center>
    </>
  )
}
