import type { TickerSocketFormatted, TickerSocketResponse } from '@/types/market'

export function useBinanceTickerSocket(symbols: string[], onMessage: (data: TickerSocketFormatted) => void) {
  let socket: WebSocket | null = null

  const connect = () => {
    if (!symbols.length) return

    const streamNames = symbols.map((s) => s.toLowerCase() + '@ticker').join('/')
    socket = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streamNames}`)

    socket.onmessage = (event) => {
      const parsed = JSON.parse(event.data)
      const ticker = parsed.data as TickerSocketResponse

      onMessage({
        symbol: ticker.s,
        price: +ticker.c,
        priceChangePercent: +ticker.P,
      })
    }
  }

  const disconnect = () => {
    socket?.close()
  }

  return { connect, disconnect }
}
