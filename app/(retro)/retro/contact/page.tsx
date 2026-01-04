/* eslint-disable @next/next/no-img-element */
import { SITE_NAME } from '@/lib/constants'

export const metadata = {
  title: `Contact - ${SITE_NAME} (Retro)`,
  robots: 'noindex, nofollow',
}

export default function RetroContactPage() {
  return (
    <>
      {/* Page title */}
      <center>
        <font size={5} color="#000080">
          <b>📧 Contact Me</b>
        </font>
        <hr width="50%" />
        <img
          src="https://web.archive.org/web/20091027042814im_/http://geocities.com/SiliconValley/Lab/3638/penpals.gif"
          alt="Contact"
          width={80}
        />
      </center>

      <hr />

      <center>
        <font size={3}>
          <b>I&apos;d love to hear from you!</b>
        </font>
      </center>

      <p>
        <font size={3}>
          Whether you have a question, want to collaborate, or just want to say hello,
          feel free to reach out using any of the methods below:
        </font>
      </p>

      {/* Contact methods */}
      <table
        width="100%"
        cellPadding={15}
        cellSpacing={5}
      >
        <tbody>
          {/* Email */}
          <tr>
            <td
              style={{
                backgroundColor: '#e3f2fd',
                border: '2px groove #808080',
              }}
            >
              <font size={4} color="#1565c0">
                <b>📧 Email</b>
              </font>
              <br />
              <font size={3}>
                The best way to reach me!
                <br /><br />
                <a href="mailto:hi@jarema.me">
                  <b>hi@jarema.me</b>
                </a>
              </font>
            </td>
          </tr>

          {/* GitHub */}
          <tr>
            <td
              style={{
                backgroundColor: '#f5f5f5',
                border: '2px groove #808080',
              }}
            >
              <font size={4} color="#333333">
                <b>🐙 GitHub</b>
              </font>
              <br />
              <font size={3}>
                Check out my code and open issues or discussions!
                <br /><br />
                <a href="https://github.com/0x4a656666">
                  <b>github.com/0x4a656666</b>
                </a>
              </font>
            </td>
          </tr>

          {/* Fediverse */}
          <tr>
            <td
              style={{
                backgroundColor: '#f3e5f5',
                border: '2px groove #808080',
              }}
            >
              <font size={4} color="#7b1fa2">
                <b>🐘 Fediverse</b>
              </font>
              <br />
              <font size={3}>
                Find me on the decentralized social web!
                <br /><br />
                <a href="https://mastodon.social/@jarema">
                  <b>@jarema@mastodon.social</b>
                </a>
              </font>
            </td>
          </tr>
        </tbody>
      </table>

      <hr />

      {/* Response time notice */}
      <table
        width="100%"
        cellPadding={10}
        style={{ backgroundColor: '#fff8e1', border: '2px solid #ff9800' }}
      >
        <tbody>
          <tr>
            <td>
              <center>
                <font size={2}>
                  <b>⏱️ Response Time:</b> I try to respond to all messages within
                  48 hours. If you don&apos;t hear back, feel free to send a follow-up!
                </font>
              </center>
            </td>
          </tr>
        </tbody>
      </table>

      <hr />

      {/* Guestbook */}
      <center>
        <table
          cellPadding={15}
          style={{ backgroundColor: '#e8f5e9', border: '3px ridge #4caf50' }}
        >
          <tbody>
            <tr>
              <td>
                <center>
                  <font size={3} color="#2e7d32">
                    <b>📝 Or Sign My Guestbook!</b>
                  </font>
                  <br />
                  <font size={2}>
                    Leave a public message for everyone to see!
                    <br /><br />
                    <a href="/guestbook">
                      <b>[Go to Guestbook]</b>
                    </a>
                  </font>
                </center>
              </td>
            </tr>
          </tbody>
        </table>
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
