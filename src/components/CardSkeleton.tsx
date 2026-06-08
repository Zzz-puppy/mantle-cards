'use client'

export function CardSkeleton() {
  return (
    <div className="relative w-[280px] h-[400px] shrink-0 rounded-xl overflow-hidden">
      {/* Base shimmer background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
        {/* Animated shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r 
                        from-transparent via-white/5 to-transparent 
                        animate-shimmer" />
      </div>

      {/* Top Section Skeleton */}
      <div className="absolute top-0 left-0 right-0 p-3 space-y-2">
        <div className="flex justify-between items-start">
          <div className="h-4 w-24 bg-gray-700/50 rounded animate-pulse" />
          <div className="h-5 w-16 bg-gray-700/50 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Center Image Area Skeleton */}
      <div className="absolute top-16 left-3 right-3 bottom-24 rounded-lg 
                      bg-gray-800/50 border border-gray-700/30 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-gray-700/50 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Bottom Stats Skeleton */}
      <div className="absolute bottom-0 left-0 right-0 p-3 space-y-3">
        {/* Stats Row */}
        <div className="flex justify-between">
          <div className="h-7 w-14 bg-gray-700/50 rounded animate-pulse" />
          <div className="h-7 w-14 bg-gray-700/50 rounded animate-pulse" />
        </div>
        
        {/* Ability Text */}
        <div className="space-y-1">
          <div className="h-3 w-full bg-gray-700/50 rounded animate-pulse" />
          <div className="h-3 w-3/4 bg-gray-700/50 rounded animate-pulse" />
        </div>

        {/* Card ID */}
        <div className="flex justify-between">
          <div className="h-3 w-16 bg-gray-700/50 rounded animate-pulse" />
          <div className="h-3 w-10 bg-gray-700/50 rounded animate-pulse" />
        </div>
      </div>

      {/* Rarity Glow Border Effect */}
      <div className="absolute inset-0 rounded-xl border border-gray-600/30" />
    </div>
  )
}

export function CardGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {[...Array(count)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}
