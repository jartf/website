/* eslint-disable @next/next/no-html-link-for-pages */
import { getAllBlogPosts } from '@/lib/blog'
import { SITE_NAME } from '@/lib/constants'

export const metadata = {
  title: `Blog - ${SITE_NAME} (Retro)`,
  robots: 'noindex, nofollow',
}

export default async function RetroBlogPage() {
  const posts = await getAllBlogPosts()

  return (
    <>
      {/* Page title */}
      <center>
        <font size={5}>
          <b>Blog</b>
        </font>
      </center>

      <hr />

      {/* Blog posts list */}
      {posts.length === 0 ? (
        <center>
          <font size={3}>
            <i>No blog posts yet! Check back soon.</i>
          </font>
        </center>
      ) : (
        <>
          <font size={3}>
            <b>All posts ({posts.length})</b>
          </font>

          <table
            width="100%"
            cellPadding={5}
            cellSpacing={0}
            style={{ marginTop: '10px' }}
          >
            <tbody>
              <tr style={{ backgroundColor: '#000080' }}>
                <th align="left">
                  <font size={3}>Date</font>
                </th>
                <th align="left">
                  <font size={3}>Title</font>
                </th>
              </tr>

              {posts.map((post, index) => (
                <tr
                  key={post.slug}
                >
                  <td width="120" valign="top">
                    <font size={3}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </font>
                  </td>
                  <td>
                    <font size={3}>
                      <a href={`/blog/${post.slug}`}>
                        <b>{post.title}</b>
                      </a>
                      {post.excerpt && (
                        <>
                          <br />
                          <font size={2} color="#aaaaaa">
                            {post.excerpt.length > 150
                              ? post.excerpt.substring(0, 150) + '...'
                              : post.excerpt
                            }
                          </font>
                        </>
                      )}
                      {post.tags && post.tags.length > 0 && (
                        <>
                          <br />
                          <font size={1}>
                            Tags: {post.tags.map((tag: string, i: number) => (
                              <span key={tag}>
                                [{tag}]
                                {i < (post.tags?.length ?? 0) - 1 ? ' ' : ''}
                              </span>
                            ))}
                          </font>
                        </>
                      )}
                    </font>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <br />

      {/* RSS feed */}
      <table
        width="100%"
        cellPadding={10}
        style={{ border: '2px solid #ff9800' }}
      >
        <tbody>
          <tr>
            <td>
              <center>
                <font size={3} color="#e65100">
                  <b>Subscribe via XML feeds</b>
                </font>
                <br />
                <font size={2}>
                  Stay updated with my latest posts!
                  <br />
                  <a href="/rss.xml">
                    <b>RSS 2.0</b>
                  </a>
                  {' | '}
                  <a href="/atom.xml">
                    <b>Atom</b>
                  </a>
                  {' | '}
                  <a href="/feed.json">
                    <b>JSON</b>
                  </a>
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
          <a href="/retro">&lt;&lt; Back to homepage</a>
        </font>
      </center>
    </>
  )
}
