import { USES_CATEGORIES } from '@/content/uses-items'
import { SITE_NAME } from '@/lib/constants'

export const metadata = {
  title: `Uses - ${SITE_NAME} (Retro)`,
  robots: 'noindex, nofollow',
}

export default function RetroUsesPage() {
  return (
    <>
      {/* Page title */}
      <center>
        <font size={5}>
          <b>Uses</b>
        </font>
        <hr width="50%" />
        <font size={2}>
          <i>
            A{' '}
            <a href="https://uses.tech/">uses page</a>
            {' '}listing my tools and tech
          </i>
        </font>
      </center>

      <hr />

      <p>
        <font size={3}>
          Here&apos;s a list of the hardware, software, and tools I use on a daily basis.
        </font>
      </p>

      {/* Uses categories */}
      {USES_CATEGORIES.map((category, catIndex) => (
        <div key={catIndex}>
          <font size={4}>
            <b>
              {category.title.charAt(0).toUpperCase() + category.title.slice(1)}
            </b>
          </font>

          <table
            width="100%"
            cellPadding={5}
            cellSpacing={2}
            style={{
              marginBottom: '15px',
            }}
          >
            <tbody>
              {category.items.map((item, itemIndex) => (
                <tr
                  key={itemIndex}
                >
                  <td width="30%" valign="top">
                    <font size={2}>
                      <b>{item.name}</b>
                    </font>
                  </td>
                  <td width="70%">
                    <font size={2}>
                      {item.descriptionKey}
                      {item.link && (
                        <>
                          {' '}
                          <a href={item.link}>[Link]</a>
                        </>
                      )}
                    </font>
                  </td>
                </tr>
              ))}
              {category.subsections?.map((sub, subIndex) => (
                sub.items.map((item, itemIndex) => (
                  <tr
                    key={`${subIndex}-${itemIndex}`}
                  >
                    <td width="30%" valign="top">
                      <font size={2}>
                        <b>{item.name}</b>
                      </font>
                    </td>
                    <td width="70%">
                      <font size={2}>
                        {item.descriptionKey || item.description}
                        {item.link && (
                          <>
                            {' '}
                            <a href={item.link}>[Link]</a>
                          </>
                        )}
                      </font>
                    </td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <hr />

      {/* Back link */}
      <center>
        <font size={2}>
          <a href="/retro">&lt;&lt; Back to homepage</a>
        </font>
      </center>
    </>
  )
}
