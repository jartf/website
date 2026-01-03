import { WEBRING_ITEMS } from '@/content/webring-items'
import { SITE_NAME } from '@/lib/constants'

export const metadata = {
  title: `Webrings - ${SITE_NAME} (Retro)`,
  robots: 'noindex, nofollow',
}

export default function RetroWebringsPage() {
  return (
    <>
      {/* Page title */}
      <center>
        <font size={5} color="#000080">
          <b>🕸️ Webrings</b>
        </font>
        <hr width="50%" />
        <font size={2}>
          <i>
            Webrings: the original way to discover cool websites on the World Wide Web!
          </i>
        </font>
      </center>

      <hr />

      <p>
        <font size={3}>
          <b>What are webrings?</b> Webrings are collections of websites linked together
          in a circular structure. They were incredibly popular in the 1990s as a way
          to discover new websites with similar interests before search engines became
          dominant.
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
              backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff',
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
        style={{ backgroundColor: '#e8f5e9', border: '3px ridge #4caf50' }}
      >
        <tbody>
          <tr>
            <td>
              <center>
                <font size={3} color="#2e7d32">
                  <b>🌐 Start Your Own Webring Journey!</b>
                </font>
                <br />
                <font size={2}>
                  Click through the webrings above to discover amazing personal websites.
                  <br />
                  The spirit of the old web lives on!
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
