import { nowItems } from '@/content/now-items'
import { SITE_NAME } from '@/lib/constants'

export const metadata = {
  title: `Now - ${SITE_NAME} (Retro)`,
  robots: 'noindex, nofollow',
}

export default function RetroNowPage() {
  return (
    <>
      {/* Page title */}
      <center>
        <font size={5} color="#000080">
          <b>📍 What I&apos;m Doing Now</b>
        </font>
        <hr width="50%" />
        <font size={2}>
          <i>
            A{' '}
            <a href="https://nownownow.com/about">now page</a>
            {' '}inspired by Derek Sivers
          </i>
        </font>
      </center>

      <hr />

      <p>
        <font size={3}>
          This page shows what I&apos;m currently focused on in life.
          It&apos;s updated periodically to reflect my current priorities and activities.
        </font>
      </p>

      {/* Now items */}
      {nowItems.map((item, index) => (
        <div key={item.id}>
          <table
            width="100%"
            cellPadding={10}
            style={{
              backgroundColor: '#f5f5f5',
              border: '2px inset #808080',
              marginBottom: '10px',
            }}
          >
            <tbody>
              <tr>
                <td>
                  <font size={3} color="#000080">
                    <b>📌 {item.category.charAt(0).toUpperCase() + item.category.slice(1)}</b>
                  </font>
                  <br />
                  <font size={2}>
                    {item.content.en}
                  </font>
                  <br />
                  <font size={1} color="#666666">
                    <i>Updated: {new Date(item.date).toLocaleDateString('en-US')}</i>
                  </font>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}

      <hr />

      {/* Last updated */}
      <center>
        <font size={2} color="#666666">
          <i>
            Last updated: {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </i>
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
