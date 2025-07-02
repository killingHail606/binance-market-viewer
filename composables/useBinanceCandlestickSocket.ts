import type { CandlestickSocketResponse, CandlestickSocketFormatted } from '@/types/market'

export function useBinanceCandlestickSocket(symbols: string[], onMessage: (data: CandlestickSocketFormatted) => void) {
  let socket: WebSocket | null = null
  const isConnected = ref(false)

  const connect = () => {
    if (!symbols.length) return

    const streamNames = symbols.map((s) => s.toLowerCase() + '@kline_1m').join('/')
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

        const candlestickData = parsed.data as CandlestickSocketResponse
        const formatted: CandlestickSocketFormatted = {
          symbol: candlestickData.s,
          price: Number(candlestickData.k.c),
          timestamp: candlestickData.E,
          close: Number(candlestickData.k.c),
          high: Number(candlestickData.k.h),
          low: Number(candlestickData.k.l),
          open: Number(candlestickData.k.o),
          volume: Number(candlestickData.k.v),
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
