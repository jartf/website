import { WEBRING_ITEMS } from '@/content/webring-items'
import { siteName } from "@/lib/constants"

export const metadata = {
  title: `Webrings - ${siteName} (Retro)`,
  robots: 'noindex, nofollow',
}

export default function RetroWebringsPage() {
  return (
    <>
      {/* Page title */}
      <center>
        <font size={5}>
          <b>Webrings</b>
        </font>
        <hr width="50%" />
        <font size={3}>
          <i>
            The original way to discover cool websites on the interwebs!
          </i>
        </font>
      </center>

      <hr />

      <p>
        <font size={3}>
          <b>What are webrings?</b> Webrings are collections of websites linked together
          in a circular structure. They were incredibly popular in the 1990s as a way
          to discover new websites with similar interests before search engines came to be.
        </font>
      </p>

      <p>
        <font size={3}>
          This website is proud to be part of the following webrings:
        </font>
      </p>

      <hr />

      {/* Webrings list */}
      {WEBRING_ITEMS.map((webring, index) => (
        <div key={index}>
          <table
            width="100%"
            cellPadding={10}
            cellSpacing={0}
            style={{
              border: '2px groove #808080',
              marginBottom: '10px',
            }}
          >
            <tbody>
              <tr>
                <td>
                  <center>
                    <font size={3} color="#000080">
                      <b>
                        <a href={webring.url}>{webring.name}</a>
                      </b>
                    </font>
                    <br />
                    {webring.description && (
                      <>
                        <br />
                        <font size={2}>
                          <i>{webring.description}</i>
                        </font>
                      </>
                    )}
                    <br /><br />
                    <font size={2}>
                      [<a href={webring.previous}>&lt;&lt; Previous</a>]
                      {webring.random && (
                        <>
                          {' '}
                          [<a href={webring.random}>🎲 Random</a>]
                        </>
                      )}
                      {' '}
                      [<a href={webring.next}>Next &gt;&gt;</a>]
                    </font>
                  </center>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}

      <hr />

      {/* Join CTA */}
      <table
        width="100%"
        cellPadding={15}
        style={{ border: '3px ridge #4caf50' }}
      >
        <tbody>
          <tr>
            <td>
              <center>
                <font size={3}>
                  Choose one webring above and navigate through them to discover other cool websites!
                </font>
              </center>
            </td>
          </tr>
        </tbody>
      </table>

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
