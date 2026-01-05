<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom">

  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title><xsl:value-of select="/rss/channel/title"/> - RSS Feed</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 2rem 1rem;
          }

          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
          }

          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            text-align: center;
          }

          .header h1 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            font-weight: 700;
          }

          .header p {
            opacity: 0.9;
            font-size: 1.1rem;
          }

          .info-box {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 1.5rem;
            margin: 1.5rem;
            border-radius: 8px;
          }

          .info-box h2 {
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
            color: #667eea;
          }

          .info-box p {
            color: #666;
          }

          .feed-url {
            background: #fff;
            border: 2px solid #667eea;
            padding: 0.75rem;
            border-radius: 6px;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.9rem;
            word-break: break-all;
            margin-top: 0.5rem;
            color: #667eea;
          }

          .posts {
            padding: 1.5rem;
          }

          .posts h2 {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            color: #333;
            border-bottom: 2px solid #667eea;
            padding-bottom: 0.5rem;
          }

          .post {
            margin-bottom: 2rem;
            padding-bottom: 2rem;
            border-bottom: 1px solid #e9ecef;
          }

          .post:last-child {
            border-bottom: none;
          }

          .post h3 {
            font-size: 1.3rem;
            margin-bottom: 0.5rem;
          }

          .post h3 a {
            color: #667eea;
            text-decoration: none;
            transition: color 0.2s;
          }

          .post h3 a:hover {
            color: #764ba2;
            text-decoration: underline;
          }

          .post-meta {
            font-size: 0.9rem;
            color: #666;
            margin-bottom: 0.75rem;
          }

          .post-description {
            color: #555;
            line-height: 1.7;
          }

          .tags {
            margin-top: 0.75rem;
          }

          .tag {
            display: inline-block;
            background: #e7e9fc;
            color: #667eea;
            padding: 0.25rem 0.75rem;
            border-radius: 4px;
            font-size: 0.85rem;
            margin-right: 0.5rem;
            margin-top: 0.25rem;
          }

          .footer {
            background: #f8f9fa;
            padding: 1.5rem;
            text-align: center;
            color: #666;
            font-size: 0.9rem;
          }

          @media (max-width: 600px) {
            body {
              padding: 1rem 0.5rem;
            }

            .header h1 {
              font-size: 1.5rem;
            }

            .info-box {
              margin: 1rem;
              padding: 1rem;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1><xsl:value-of select="/rss/channel/title"/></h1>
            <p><xsl:value-of select="/rss/channel/description"/></p>
          </div>

          <div class="info-box">
            <h2>RSS Feed</h2>
            <p>This is an RSS feed. Copy the URL below to subscribe in your favorite RSS reader.</p>
            <div class="feed-url">
              <xsl:value-of select="/rss/channel/atom:link[@rel='self']/@href"/>
            </div>
          </div>

          <div class="posts">
            <h2>Recent Posts</h2>
            <xsl:for-each select="/rss/channel/item">
              <div class="post">
                <h3>
                  <a>
                    <xsl:attribute name="href">
                      <xsl:value-of select="link"/>
                    </xsl:attribute>
                    <xsl:value-of select="title"/>
                  </a>
                </h3>
                <div class="post-meta">
                  Published: <xsl:value-of select="pubDate"/>
                </div>
                <div class="post-description">
                  <xsl:value-of select="description"/>
                </div>
                <xsl:if test="category">
                  <div class="tags">
                    <xsl:for-each select="category">
                      <span class="tag"><xsl:value-of select="."/></span>
                    </xsl:for-each>
                  </div>
                </xsl:if>
              </div>
            </xsl:for-each>
          </div>

          <div class="footer">
            Last updated: <xsl:value-of select="/rss/channel/lastBuildDate"/>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>
