import type { Metadata } from 'next'
import Link from 'next/link'
import { Web3Provider } from '@/components/providers/Web3Provider'
import { WalletButton } from '@/components/WalletButton'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Trading Card Game',
  description: 'An AI-powered trading card game on Mantle Network',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Web3Provider>
          <div className="min-h-screen flex flex-col">
            <header className="bg-gradient-to-r from-purple-dark via-purple to-blue-dark text-white shadow-lg">
              <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <ul className="flex space-x-6">
                    <li><Link href="/" className="hover:text-gold transition-colors">Home</Link></li>
                    <li><Link href="/collection" className="hover:text-gold transition-colors">Collection</Link></li>
                    <li><Link href="/battle" className="hover:text-gold transition-colors">Battle</Link></li>
                    <li><Link href="/market" className="hover:text-gold transition-colors">Market</Link></li>
                    <li><Link href="/profile" className="hover:text-gold transition-colors">Profile</Link></li>
                  </ul>
                  <div className="flex items-center gap-4">
                    <WalletButton />
                  </div>
                </div>
              </nav>
            </header>
            <main className="flex-1">
              {children}
            </main>
            <footer className="bg-card-bg text-gray-400 py-6">
              <div className="container mx-auto px-4 text-center">
                <p>AI Trading Card Game - Powered by Mantle Network</p>
              </div>
            </footer>
          </div>
        </Web3Provider>
      </body>
    </html>
  )
}
