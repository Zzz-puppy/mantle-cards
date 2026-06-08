export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-gold via-purple-light to-blue text-transparent bg-clip-text">
          AI Trading Card Game
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Battle with AI-powered cards on the Mantle Network
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/battle"
            className="px-8 py-3 bg-gradient-to-r from-gold to-gold-dark text-black font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Start Battle
          </a>
          <a
            href="/market"
            className="px-8 py-3 border border-purple text-purple rounded-lg hover:bg-purple hover:text-white transition-colors"
          >
            Open Market
          </a>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-card-bg border border-card-border rounded-xl p-6">
          <div className="w-12 h-12 bg-purple rounded-lg mb-4 flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gold">AI-Powered Cards</h3>
          <p className="text-gray-400">
            Each card features unique AI-generated abilities and attributes that evolve with your gameplay.
          </p>
        </div>
        <div className="bg-card-bg border border-card-border rounded-xl p-6">
          <div className="w-12 h-12 bg-blue rounded-lg mb-4 flex items-center justify-center">
            <span className="text-2xl">⚔️</span>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gold">Strategic Battles</h3>
          <p className="text-gray-400">
            Deploy cards wisely and outsmart your opponents with tactical card combinations.
          </p>
        </div>
        <div className="bg-card-bg border border-card-border rounded-xl p-6">
          <div className="w-12 h-12 bg-gold rounded-lg mb-4 flex items-center justify-center">
            <span className="text-2xl">🌐</span>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gold">On-Chain Ownership</h3>
          <p className="text-gray-400">
            Truly own your cards as NFTs on Mantle Network with verifiable scarcity.
          </p>
        </div>
      </section>
    </div>
  )
}
