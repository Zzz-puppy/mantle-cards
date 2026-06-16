'use client'

import { type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WalletProvider } from '@/contexts/WalletContext'
import { Web3Provider } from '@/components/providers/Web3Provider'
import { WalletButton } from '@/components/WalletButton'

interface ClientLayoutProps {
  children: ReactNode
}

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Collection', href: '/collection' },
  { name: 'Battle', href: '/battle' },
  { name: 'Market', href: '/market' },
  { name: 'Leaderboard', href: '/leaderboard' },
  { name: 'Profile', href: '/profile' },
]

function Navigation() {
  const pathname = usePathname()

  return (
    <header className="bg-gradient-to-r from-[#1a1625] via-[#2d1f3d] to-[#1a2535] text-white shadow-lg">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="drop-shadow-lg">
                <rect x="4" y="2" width="24" height="32" rx="3" fill="url(#logoGrad1)" stroke="#C9A227" strokeWidth="1.5"/>
                <rect x="12" y="6" width="24" height="32" rx="3" fill="url(#logoGrad2)" stroke="#8B7EC9" strokeWidth="1.5"/>
                <circle cx="24" cy="22" r="8" fill="#1a1625" stroke="#C9A227" strokeWidth="1"/>
                <text x="24" y="27" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#C9A227">🎴</text>
                <defs>
                  <linearGradient id="logoGrad1" x1="4" y1="2" x2="28" y2="34">
                    <stop offset="0%" stopColor="#2d2450"/>
                    <stop offset="100%" stopColor="#1a1625"/>
                  </linearGradient>
                  <linearGradient id="logoGrad2" x1="12" y1="6" x2="36" y2="38">
                    <stop offset="0%" stopColor="#4a3d6e"/>
                    <stop offset="100%" stopColor="#2d2450"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 bg-purple-500/20 rounded-lg blur-md group-hover:bg-purple-500/30 transition-colors" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-wide">
                <span className="text-[#C9A227]">AI</span> <span className="text-white">Card</span>
              </span>
              <span className="text-[10px] text-gray-400 tracking-widest uppercase">Trading Game</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <ul className="flex space-x-6">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      transition-colors text-sm
                      ${pathname === item.href ? 'text-[#C9A227] font-semibold' : 'hover:text-[#C9A227]'}
                    `}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <WalletButton />
          </div>
        </div>
      </nav>
    </header>
  )
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <WalletProvider>
      <Web3Provider>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-[#12111a] text-gray-500 py-6">
            <div className="container mx-auto px-4 text-center">
              <p>AI Trading Card Game - Powered by Mantle Network</p>
            </div>
          </footer>
        </div>
      </Web3Provider>
    </WalletProvider>
  )
}
