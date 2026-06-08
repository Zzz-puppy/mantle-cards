'use client'

import { useAccount, useConnect, useDisconnect, useConnections } from 'wagmi'
import { useState, useEffect } from 'react'

export interface WalletState {
  address: string | null
  isConnected: boolean
  isConnecting: boolean
  isDisconnected: boolean
  chainId: number | null
  connector: string | null
}

export function useWallet() {
  const [mounted, setMounted] = useState(false)
  const { address, isConnected, isConnecting, chainId } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const connections = useConnections()

  useEffect(() => {
    setMounted(true)
  }, [])

  const connectWallet = async (connectorId?: string) => {
    try {
      const connector = connectors.find(c => c.id === connectorId) || connectors[0]
      if (connector) {
        connect({ connector })
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    }
  }

  const disconnectWallet = () => {
    const connection = connections[0]
    if (connection) {
      disconnect({ connector: connection.connector })
    }
  }

  const getConnectorName = () => {
    const connection = connections[0]
    return connection?.connector.name || null
  }

  return {
    address: mounted ? address : null,
    isConnected: mounted ? isConnected : false,
    isConnecting: mounted ? isConnecting : false,
    isDisconnected: mounted ? (!isConnected && !isConnecting) : true,
    chainId: mounted ? chainId : null,
    connector: mounted ? getConnectorName() : null,
    connect: connectWallet,
    disconnect: disconnectWallet,
  }
}
