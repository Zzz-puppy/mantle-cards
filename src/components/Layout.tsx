'use client'

import { type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  name: string
  href: string
}

const navItems: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Collection', href: '/collection' },
  { name: 'Battle', href: '/battle' },
  { name: 'Market', href: '/market' },
  { name: 'Profile', href: '/profile' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <header className="bg-gradient-to-r from-purple-dark via-purple to-blue-dark text-white shadow-lg">
      <nav className="container mx-auto px-4 py-4">
        <ul className="flex space-x-6">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`
                  transition-colors
                  ${pathname === item.href ? 'text-gold font-semibold' : 'hover:text-gold'}
                `}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-card-bg text-gray-400 py-6">
        <div className="container mx-auto px-4 text-center">
          <p>AI Trading Card Game - Powered by Mantle Network</p>
        </div>
      </footer>
    </div>
  )
}
