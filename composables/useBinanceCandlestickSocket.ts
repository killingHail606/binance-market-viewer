import type { CandlestickSocketResponse, CandlestickSocketFormatted } from '@/types/market'

export function useBinanceCandlestickSocket(symbols: string[], onMessage: (data: CandlestickSocketFormatted) => void) {
  let socket: WebSocket | null = null

  const connect = () => {
    if (!symbols.length) return

    const streamNames = symbols.map((s) => s.toLowerCase() + '@kline_1m').join('/')
    socket = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streamNames}`)

    socket.onmessage = (event) => {
      const parsed = JSON.parse(event.data)
      const ticker = parsed.data as CandlestickSocketResponse

      onMessage({
        symbol: ticker.s,
        price: +ticker.k.c,
        timestamp: ticker.E,
        close: +ticker.k.c,
        high: +ticker.k.h,
        low: +ticker.k.l,
        open: +ticker.k.o,
        volume: +ticker.k.v,
      })
    }
  }

  const disconnect = () => {
    socket?.close()
  }

  return { connect, disconnect }
}
