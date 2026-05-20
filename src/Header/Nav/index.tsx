'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

import type { Header as HeaderType } from '@/payload-types'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()

  const getHref = (link: (typeof navItems)[0]['link']) => {
    if (
      link.type === 'reference' &&
      typeof link.reference?.value === 'object' &&
      link.reference.value.slug
    ) {
      return `/${link.reference?.relationTo !== 'pages' ? `${link.reference?.relationTo}/` : ''}${link.reference.value.slug}`
    }
    return link.url || ''
  }

  return (
    <nav
      className="flex items-center gap-1 px-2 py-2 rounded-full border"
      style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
      }}
    >
      {navItems.map(({ link }, i) => {
        const href = getHref(link)
        const isActive = pathname === href
        const newTabProps = link.newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

        return (
          <Link
            key={i}
            href={href}
            {...newTabProps}
            className="px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300"
            style={{
              backgroundColor: isActive ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
              color: isActive ? '#1a1a1a' : 'rgba(0, 0, 0, 0.7)',
              textShadow: isActive ? 'none' : '0 1px 1px rgba(255, 255, 255, 0.8)',
              boxShadow: isActive
                ? '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                : 'none',
            }}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
