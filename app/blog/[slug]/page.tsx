import Link from 'next/link'
import { notFound } from 'next/navigation'

import { baseUrl } from 'app/sitemap'
import {
  BookOpenIcon,
  ChevronLeftIcon,
  ClockIcon,
  FlaskConicalIcon,
} from 'components/icons'
import { CustomMDX } from 'components/mdx'
import { getBlogPosts } from 'lib/post'
import { formatDate } from 'lib/utils'

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
      <div className="bg-profile sm:-mt-20 -mt-48 sm:px-10 sm:py-9 px-5 py-4 flex flex-col shadow-profile sm:rounded-[0.625rem]">
        <div className="flex items-center">
          <Link href="/" className="text-blue flex items-center">
            <ChevronLeftIcon />
            <span className="sm:text-xs text-sm">返回</span>
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-title mt-5">{post.metadata.title}</h1>
        <div className="flex gap-6 items-center mt-3 text-sm text-span">
          <div className="flex items-center gap-1">
            <ClockIcon />
            <time dateTime={post.metadata.publishedAt}>
              {formatDate(post.metadata.publishedAt)}
            </time>
          </div>
          <div className="flex items-center gap-1">
            <BookOpenIcon />
            <span>约 {post.metadata.readingTime.words} 字</span>
          </div>
          <div className="flex items-center gap-1">
            <FlaskConicalIcon />
            <span>约 {Math.ceil(post.metadata.readingTime.minutes)} 分钟</span>
          </div>
        </div>
      </div>
      <article className="prose bg-background sm:px-8 sm:py-10 px-4 py-5">
        <CustomMDX source={post.content} />
      </article>
    </section>
  )
}
