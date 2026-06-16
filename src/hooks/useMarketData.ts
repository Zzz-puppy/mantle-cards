'use client'

import { useState, useEffect, useMemo } from 'react'
import { useWallet } from './useWallet'
import { fetchMarketListings, getCardsMap, getUserCards } from '@/lib/market-data'
import type { Card } from '@/types'
import type { Listing } from '@/components/marketplace'

export function useMarketData() {
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { address } = useWallet()

  const cardsMap = useMemo(() => getCardsMap(), [])

  const userCards = useMemo(() => {
    return address ? getUserCards(address) : []
  }, [address])

  useEffect(() => {
    const loadListings = async () => {
      try {
        setIsLoading(true)
        const data = await fetchMarketListings()
        setListings(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }
    loadListings()
  }, [])

  const removeListing = (listingId: number) => {
    setListings(prev => prev.filter(l => l.listingId !== listingId))
  }

  const addListing = (params: { tokenId: number; price: bigint; description: string }) => {
    const newListing: Listing = {
      listingId: listings.length + 1,
      seller: address || '0x0000000000000000000000000000000000000000',
      tokenId: params.tokenId,
      price: params.price,
      description: params.description,
      createdAt: Date.now(),
      isActive: true,
    }
    setListings(prev => [...prev, newListing])
  }

  const updateListingPrice = (listingId: number, newPrice: bigint) => {
    setListings(prev => prev.map(l => 
      l.listingId === listingId ? { ...l, price: newPrice } : l
    ))
  }

  const refreshListings = async () => {
    try {
      setIsLoading(true)
      const data = await fetchMarketListings()
      setListings(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    listings,
    cardsMap,
    userCards,
    isLoading,
    error,
    removeListing,
    addListing,
    updateListingPrice,
    refreshListings,
  }
}