import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { RenderHero } from '@/heros/RenderHero'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { generateMeta } from '@/utilities/generateMeta'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import PageClient from './[...slug]/page.client'
import { PayloadRedirects } from '@/components/PayloadRedirects'

const queryHomePage = cache(async () => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: 'home',
      },
    },
  })
  
  return result.docs?.[0] || null
})

export default async function HomePage() {
  const { isEnabled: draft } = await draftMode()
  let page = await queryHomePage()
  
  // Use static payload if seeded data is missing
  if (!page) {
    page = homeStatic as any
  }

  const payload = await getPayload({ config: configPromise })

  // 1. Fetch top-level boards
  const boardsRes = await payload.find({
    collection: 'categories',
    where: { parent: { exists: false } },
    sort: 'title',
  })
  const boards = boardsRes.docs

  // 2. Prepare data for each board
  const boardData = await Promise.all(
    boards.map(async (board) => {
      // Find all subcategories for the current board
      const childrenRes = await payload.find({
        collection: 'categories',
        where: { parent: { equals: board.id } },
      })
      const childIds = childrenRes.docs.map((c) => c.id)
      const allCategoryIds = [board.id, ...childIds]

      // Query the latest 3 posts belonging to these categories
      const postsRes = await payload.find({
        collection: 'posts',
        where: { categories: { in: allCategoryIds } },
        sort: '-createdAt',
        limit: 3,
      })

      return {
        board,
        posts: postsRes.docs,
      }
    })
  )

  const { hero, layout } = page || {}

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      {draft && <LivePreviewListener />}

      {/* Render Hero Section from CMS */}
      {hero && <RenderHero {...hero} />}

      {/* Render Custom CMS Blocks (e.g. text, forms) */}
      {layout && <RenderBlocks blocks={layout} />}

      {/* Dynamic Board Aggregation Section */}
      <div className="max-w-7xl mx-auto px-4 mt-24 space-y-16">
        {boardData.map(({ board, posts }) => {
          if (posts.length === 0) return null // Hide boards without posts

          return (
            <section key={board.id}>
              <div className="flex items-center justify-between border-b-2 border-gray-900 pb-4 mb-8">
                <h2 className="text-3xl font-bold capitalize">{board.title}</h2>
                <Link href={`/${board.slug}`} className="text-blue-600 hover:text-blue-800 font-medium">
                  View All &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <div key={post.id} className="group cursor-pointer">
                    <Link href={`/posts/${post.slug}`}>
                      <div className="bg-gray-100 aspect-video rounded-lg mb-4 overflow-hidden relative">
                         {/* Optional Image rendering placeholder if post has heroImage */}
                         <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                           {post.title}
                         </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="text-xs text-gray-400 mt-3">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryHomePage()
  return generateMeta({ doc: page || homeStatic })
}
