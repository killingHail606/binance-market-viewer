import type { TickerSocketFormatted, TickerSocketResponse } from '@/types/market'

export function useBinanceTickerSocket(symbols: string[], onMessage: (data: TickerSocketFormatted) => void) {
  let socket: WebSocket | null = null
  const isConnected = ref(false)

  const connect = () => {
    if (!symbols.length) return

    const streamNames = symbols.map((s) => s.toLowerCase() + '@ticker').join('/')
    socket = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streamNames}`)

    socket.onopen = () => {
      isConnected.value = true
      console.log('WebSocket connected')
    }

    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data)
        if (!parsed?.data) {
          console.warn('Invalid WebSocket message format:', parsed)
          return
        }

        const ticker = parsed.data as TickerSocketResponse
        const formatted: TickerSocketFormatted = {
          symbol: ticker.s,
          price: +ticker.c,
          priceChangePercent: +ticker.P,
        }
        onMessage(formatted)
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    socket.onerror = (error) => {
      console.error('WebSocket error:', error)
      isConnected.value = false
    }

    socket.onclose = () => {
      isConnected.value = false
      console.log('WebSocket closed')
    }
  }

  const disconnect = () => {
    if (socket) {
      socket.close()
      socket = null
      isConnected.value = false
    }
  }

  return { connect, disconnect, isConnected }
}
