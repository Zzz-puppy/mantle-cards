'use client'

export default function Profile() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gold">Player Profile</h1>
      <div className="bg-card-bg border border-card-border rounded-xl p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-purple to-blue rounded-full flex items-center justify-center">
            <span className="text-4xl">👤</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Player One</h2>
            <p className="text-gray-400">0x1234...5678</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card-border rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-gold">42</p>
            <p className="text-gray-400">Cards</p>
          </div>
          <div className="bg-card-border rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-purple">15</p>
            <p className="text-gray-400">Wins</p>
          </div>
          <div className="bg-card-border rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-blue">8</p>
            <p className="text-gray-400">Losses</p>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Wallet</h3>
          <button className="px-6 py-3 bg-gradient-to-r from-gold to-gold-dark text-black font-semibold rounded-lg hover:opacity-90 transition-opacity">
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  )
}
