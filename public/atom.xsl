<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  exclude-result-prefixes="atom">

  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title><xsl:value-of select="/atom:feed/atom:title"/> - Atom Feed</title>
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
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
            border-left: 4px solid #f093fb;
            padding: 1.5rem;
            margin: 1.5rem;
            border-radius: 8px;
          }

          .info-box h2 {
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
            color: #f5576c;
          }

          .info-box p {
            color: #666;
          }

          .feed-url {
            background: #fff;
            border: 2px solid #f093fb;
            padding: 0.75rem;
            border-radius: 6px;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.9rem;
            word-break: break-all;
            margin-top: 0.5rem;
            color: #f5576c;
          }

          .posts {
            padding: 1.5rem;
          }

          .posts h2 {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            color: #333;
            border-bottom: 2px solid #f093fb;
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
            color: #f5576c;
            text-decoration: none;
            transition: color 0.2s;
          }

          .post h3 a:hover {
            color: #f093fb;
            text-decoration: underline;
          }

          .post-meta {
            font-size: 0.9rem;
            color: #666;
            margin-bottom: 0.75rem;
          }

          .post-summary {
            color: #555;
            line-height: 1.7;
          }

          .tags {
            margin-top: 0.75rem;
          }

          .tag {
            display: inline-block;
            background: #ffe0f0;
            color: #f5576c;
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
            <h1><xsl:value-of select="/atom:feed/atom:title"/></h1>
            <p><xsl:value-of select="/atom:feed/atom:subtitle"/></p>
          </div>

          <div class="info-box">
            <h2>⚛️ Atom Feed</h2>
            <p>This is an Atom feed. Copy the URL below to subscribe in your favorite RSS reader.</p>
            <div class="feed-url">
              <xsl:value-of select="/atom:feed/atom:link[@rel='self']/@href"/>
            </div>
          </div>

          <div class="posts">
            <h2>Recent Posts</h2>
            <xsl:for-each select="/atom:feed/atom:entry">
              <div class="post">
                <h3>
                  <a>
                    <xsl:attribute name="href">
                      <xsl:value-of select="atom:link[@rel='alternate']/@href"/>
                    </xsl:attribute>
                    <xsl:value-of select="atom:title"/>
                  </a>
                </h3>
                <div class="post-meta">
                  Published: <xsl:value-of select="substring(atom:published, 0, 11)"/>
                </div>
                <div class="post-summary">
                  <xsl:value-of select="atom:summary"/>
                </div>
                <xsl:if test="atom:category">
                  <div class="tags">
                    <xsl:for-each select="atom:category">
                      <span class="tag"><xsl:value-of select="@term"/></span>
                    </xsl:for-each>
                  </div>
                </xsl:if>
              </div>
            </xsl:for-each>
          </div>

          <div class="footer">
            Last updated: <xsl:value-of select="substring(/atom:feed/atom:updated, 0, 11)"/>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>
