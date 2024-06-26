import { baseUrl } from 'app/sitemap'
import { getBlogPosts } from 'lib/post'

export async function GET() {
  const allPosts = getBlogPosts()

  const itemsXml = allPosts
    .sort((a, b) => {
      if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
        return -1
      } else {
        return 1
      }
    })
    .map(
      (post) =>
        `<item>
          <title>${post.metadata.title}</title>
          <link>${baseUrl}/blog/${post.slug}</link>
          <description>${post.metadata.summary || ''}</description>
          <pubDate>${new Date(
            post.metadata.publishedAt
          ).toUTCString()}</pubDate>
        </item>`
    )
    .join('\n')

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>Evan's Blog</title>
        <link>${baseUrl}</link>
        <description>This is my blog RSS feed</description>
        ${itemsXml}
      </channel>
    </rss>`

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'text/xml',
    },
  })
}
