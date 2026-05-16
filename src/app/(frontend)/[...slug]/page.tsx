import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import Link from 'next/link'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  // We map the slug string to an array for the [...slug] route
  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug: [slug!] }
    })

  return params || []
}

type Args = {
  params: Promise<{
    slug?: string[]
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug: slugArray = ['home'] } = await paramsPromise
  
  // For standard pages, we try to match the last segment as the slug,
  // or join them. Usually Pages have a single slug.
  const decodedSlug = decodeURIComponent(slugArray[slugArray.length - 1] || 'home')
  const url = '/' + slugArray.join('/')
  
  let page: RequiredDataFromCollectionSlug<'pages'> | null

  // 1. Try to find a Static Page first
  if (slugArray.length <= 1 || slugArray[0] === 'home') {
    page = await queryPageBySlug({
      slug: decodedSlug,
    })

    if (!page && slugArray[0] === 'home') {
      page = homeStatic
    }

    if (page) {
      const { hero, layout } = page
      return (
        <article className="pt-16 pb-24">
          <PageClient />
          <PayloadRedirects disableNotFound url={url} />
          {draft && <LivePreviewListener />}
          <RenderHero {...hero} />
          <RenderBlocks blocks={layout} />
        </article>
      )
    }
  }

  // 2. If not a Page, try to find a Category (Board or SubCategory)
  const payload = await getPayload({ config: configPromise })
  
  const boardSlug = decodeURIComponent(slugArray[0])
  const boardRes = await payload.find({
    collection: 'categories',
    where: { slug: { equals: boardSlug }, parent: { exists: false } },
    depth: 1,
  })
  const boardData = boardRes.docs[0]

  if (!boardData) {
    return <PayloadRedirects url={url} />
  }

  // SCENARIO 1: BOARD PAGE (e.g., /news)
  if (slugArray.length === 1) {
    const childrenRes = await payload.find({
      collection: 'categories',
      where: { parent: { equals: boardData.id } },
    })
    const childCategories = childrenRes.docs

    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4 capitalize">{boardData.title}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {childCategories.map((cat) => (
            <Link key={cat.id} href={`/${boardSlug}/${cat.slug}`}>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow border border-gray-100 h-full flex flex-col justify-center items-center text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{cat.title}</h2>
              </div>
            </Link>
          ))}
        </div>
        {childCategories.length === 0 && <p className="mt-8">No subcategories found.</p>}
      </div>
    )
  }

  // SCENARIO 2: SUBCATEGORY PAGE (e.g., /news/politics)
  if (slugArray.length === 2) {
    const currentSubSlug = decodeURIComponent(slugArray[1])
    const subRes = await payload.find({
      collection: 'categories',
      where: { slug: { equals: currentSubSlug }, parent: { equals: boardData.id } },
      depth: 1,
    })
    const subData = subRes.docs[0]

    if (!subData) {
      return <PayloadRedirects url={url} />
    }

    // Fetch posts for this subcategory
    const postsRes = await payload.find({
      collection: 'posts',
      where: { categories: { contains: subData.id } },
      sort: '-createdAt',
    })
    const posts = postsRes.docs

    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <nav className="text-sm mb-8 text-gray-500">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/${boardSlug}`} className="hover:text-blue-600 capitalize">{boardData.title}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium capitalize">{subData.title}</span>
        </nav>

        <h1 className="text-3xl font-bold mb-8">{subData.title} Posts</h1>

        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <Link href={`/posts/${post.slug}`}>
                <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors mb-2">
                  {post.title}
                </h2>
              </Link>
              <div className="text-sm text-gray-400 mt-4">
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </article>
          ))}
          {posts.length === 0 && <p className="text-gray-500">No posts found in this category.</p>}
        </div>
      </div>
    )
  }

  return <PayloadRedirects url={url} />
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug: slugArray = ['home'] } = await paramsPromise
  const decodedSlug = decodeURIComponent(slugArray[slugArray.length - 1] || 'home')
  
  if (slugArray.length <= 1 || slugArray[0] === 'home') {
    const page = await queryPageBySlug({
      slug: decodedSlug,
    })
    if (page) {
      return generateMeta({ doc: page })
    }
  }
  
  // Basic fallback metadata for categories
  return {
    title: decodedSlug,
  }
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
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
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
