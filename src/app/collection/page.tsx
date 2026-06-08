export default function Collection() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gold">Your Collection</h1>
      <p className="text-gray-400 mb-8">
        Manage and view all your trading cards in one place.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] bg-gradient-to-br from-purple-dark to-blue-dark rounded-lg border border-card-border flex items-center justify-center"
          >
            <span className="text-4xl">🎴</span>
          </div>
        ))}
      </div>
    </div>
  )
}
