import type { Metadata } from 'next'
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
        <div className="min-h-screen flex flex-col">
          <header className="bg-gradient-to-r from-purple-dark via-purple to-blue-dark text-white shadow-lg">
            <nav className="container mx-auto px-4 py-4">
              <ul className="flex space-x-6">
                <li><a href="/" className="hover:text-gold transition-colors">Home</a></li>
                <li><a href="/collection" className="hover:text-gold transition-colors">Collection</a></li>
                <li><a href="/battle" className="hover:text-gold transition-colors">Battle</a></li>
                <li><a href="/market" className="hover:text-gold transition-colors">Market</a></li>
                <li><a href="/profile" className="hover:text-gold transition-colors">Profile</a></li>
              </ul>
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
      </body>
    </html>
  )
}
