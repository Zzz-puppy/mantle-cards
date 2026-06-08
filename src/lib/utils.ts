export const formatAddress = (address: string): string => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const formatEther = (wei: bigint): string => {
  return (Number(wei) / 1e18).toFixed(4)
}

export const getRarityColor = (rarity: string): string => {
  switch (rarity) {
    case 'Legendary':
      return 'text-gold'
    case 'Epic':
      return 'text-purple'
    case 'Rare':
      return 'text-blue'
    default:
      return 'text-gray-400'
  }
}
