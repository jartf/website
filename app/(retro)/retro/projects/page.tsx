import { projects } from '@/content/project-items'
import { SITE_NAME } from '@/lib/constants'

export const metadata = {
  title: `Projects - ${SITE_NAME} (Retro)`,
  robots: 'noindex, nofollow',
}

export default function RetroProjectsPage() {
  return (
    <>
      {/* Page title */}
      <center>
        <font size={5} color="#000080">
          <b>💻 Projects</b>
        </font>
        <hr width="50%" />
        <font size={2}>
          <i>Things I&apos;ve built and worked on</i>
        </font>
      </center>

      <hr />

      {/* Projects list */}
      {projects.filter(p => !p.hidden).map((project, index) => (
        <div key={project.id}>
          <table
            width="100%"
            cellPadding={10}
            cellSpacing={0}
            style={{
              backgroundColor: index % 2 === 0 ? '#ffffff' : '#f5f5f5',
              border: '2px groove #808080',
              marginBottom: '10px',
            }}
          >
            <tbody>
              <tr>
                <td>
                  <font size={3} color="#000080">
                    <b>
                      💻 {project.content.en.title}
                    </b>
                  </font>
                  <br />
                  <font size={2}>
                    {project.content.en.description}
                  </font>
                  <br /><br />
                  <font size={2}>
                    <b>Status:</b> {project.status}
                    {' | '}
                    <b>Category:</b> {project.category}
                  </font>
                  <br />
                  <font size={1}>
                    Tags: {project.tags.map((tag, i) => (
                      <span key={tag}>
                        [{tag}]
                        {i < project.tags.length - 1 ? ' ' : ''}
                      </span>
                    ))}
                  </font>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}

      <hr />

      {/* GitHub CTA */}
      <center>
        <table
          cellPadding={10}
          style={{ backgroundColor: '#f5f5f5', border: '2px solid #333' }}
        >
          <tbody>
            <tr>
              <td>
                <center>
                  <font size={3}>
                    <b>🐙 More on GitHub</b>
                  </font>
                  <br />
                  <font size={2}>
                    Check out more of my work on GitHub!
                    <br /><br />
                    <a href="https://github.com/0x4a656666">
                      <b>[View My GitHub Profile]</b>
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
