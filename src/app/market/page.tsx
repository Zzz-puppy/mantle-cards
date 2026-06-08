export default function Market() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gold">Card Market</h1>
      <p className="text-gray-400 mb-8">
        Buy, sell, and trade cards with other players.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] bg-gradient-to-br from-card-highlight to-card-bg rounded-lg border border-card-border p-2 hover:border-gold transition-colors cursor-pointer"
          >
            <div className="w-full h-full bg-gradient-to-br from-purple-dark to-blue-dark rounded flex items-center justify-center">
              <span className="text-3xl">🎴</span>
            </div>
            <div className="mt-2 text-xs">
              <p className="font-semibold">Card #{i + 1}</p>
              <p className="text-gold">0.05 MNT</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
