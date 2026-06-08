'use client'

export default function Battle() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gold">Battle Arena</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-card-bg border border-card-border rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue">Your Deck</h2>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-gradient-to-br from-purple to-purple-dark rounded-lg border border-purple-light flex items-center justify-center"
              >
                <span className="text-2xl">🎴</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card-bg border border-card-border rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-red-500">Opponent</h2>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-gradient-to-br from-red-800 to-red-900 rounded-lg border border-red-600 flex items-center justify-center"
              >
                <span className="text-2xl">🎴</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 text-center">
        <button className="px-8 py-3 bg-gradient-to-r from-gold to-gold-dark text-black font-semibold rounded-lg hover:opacity-90 transition-opacity">
          Start Battle
        </button>
      </div>
    </div>
  )
}
