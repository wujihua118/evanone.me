import { notFound } from 'next/navigation'

import { formatDate, getBlogPosts } from 'app/blog/utils'
import { CustomMDX } from 'app/components/mdx'
import { baseUrl } from 'app/sitemap'

interface BlogProps {
  params: {
    slug: string
  }
}

function getBlogPostBySlug(slug: string) {
  return getBlogPosts().find((post) => post.slug === slug)
}

export async function generateStaticParams() {
  const posts = getBlogPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogProps) {
  const post = getBlogPostBySlug(params.slug)
  if (!post) {
    return
  }

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata

  const ogImage = image ? image : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function Page({ params }: BlogProps) {
  const post = getBlogPostBySlug(params.slug)
  if (!post) {
    notFound()
  }

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              '@type': 'Person',
              name: 'Evan',
            },
          })
        }}
      />
      <h1 className="title font-semibold text-2xl tracking-tighter">
        {post.metadata.title}
      </h1>
      <div className="flex gap-6 items-center mt-2 mb-8 text-sm">
        <time
          dateTime={post.metadata.publishedAt}
          className="text-sm text-neutral-600 dark:text-neutral-400"
        >
          {formatDate(post.metadata.publishedAt, true)}
        </time>
        <span>约 {post.metadata.readingTime.words} 字</span>
        <span>约 {Math.ceil(post.metadata.readingTime.minutes)} 分钟</span>
      </div>
      <article className="prose">
        <CustomMDX source={post.content} />
      </article>
    </section>
  )
}
