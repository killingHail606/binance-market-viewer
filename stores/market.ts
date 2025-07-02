import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import {
  type TradingPair,
  type TickerData,
  type CandlestickSocketFormatted,
  type TickerSocketFormatted,
  PriceChangeType,
} from '@/types/market'

export const useMarketStore = defineStore('market', () => {
  // All available trading pairs (fetched once)
  const allPairs = ref<TradingPair[]>([])
  const selectedSymbols = useStorage<string[]>('selected-symbols', [])

  const tickers = useStorage<Record<string, TickerData>>('tickers', {})

  let socketControlCandlestick: { connect: () => void; disconnect: () => void } | null = null
  let socketControlTicker: { connect: () => void; disconnect: () => void } | null = null

  const savingDataInterval = 60 * 1000 // 60s in ms

  // Remove a selected pair from a list and stop receiving its data
  function removePair(symbol: string) {
    selectedSymbols.value = selectedSymbols.value.filter((item) => item !== symbol)
    delete tickers.value[symbol]

    initTickerSockets()
    initCandleStickSockets()
  }

  // Fetch all trading pairs from Binance
  async function fetchPairs() {
    try {
      const res = await fetch('https://api.binance.com/api/v3/exchangeInfo')
      const data = await res.json()

      allPairs.value = data.symbols
        .filter((s: any) => s.status === 'TRADING')
        .map((s: any) => ({
          symbol: s.symbol,
          baseAsset: s.baseAsset,
          quoteAsset: s.quoteAsset,
          displayName: `${s.baseAsset}/${s.quoteAsset}`,
        }))
    } catch (error) {
      console.error('Failed to fetch trading pairs', error)
    }
  }

  // Update or initialize ticker data from socket
  function handleTickerSocketData(data: TickerSocketFormatted) {
    if (tickers.value[data.symbol]) {
      tickers.value[data.symbol].price = data.price
      tickers.value[data.symbol].priceChangePercent = data.priceChangePercent
    } else {
      tickers.value[data.symbol] = {
        price: data.price,
        priceChangePercent: data.priceChangePercent,
        priceChange: 0,
        candlestick: [],
      }
    }
  }

  // Update candlestick data and trim old entries
  function handleCandlestickSocketData(data: CandlestickSocketFormatted) {
    if (tickers.value[data.symbol]) {
      const candlestickData = tickers.value[data.symbol].candlestick
      const lastCandlestickData = candlestickData[candlestickData.length - 1]
      const firstCandlestickData = candlestickData[0]

      tickers.value[data.symbol].priceChange = Math.sign(
        data.price - (lastCandlestickData?.price || 0),
      ) as PriceChangeType
      tickers.value[data.symbol].candlestick.push(data)

      // clear old data
      const firstChartDataTimestamp = firstCandlestickData?.timestamp || Infinity // infinity -> newest
      const currentChartDataTimestamp = data.timestamp

      if (currentChartDataTimestamp - firstChartDataTimestamp > savingDataInterval) {
        // delete first chart data
        tickers.value[data.symbol].candlestick.shift()
      }
    } else {
      tickers.value[data.symbol].candlestick = [data]
    }
  }

  // Init candlestick socket with selected symbols
  function initCandleStickSockets() {
    socketControlCandlestick?.disconnect()
    socketControlCandlestick = useBinanceCandlestickSocket(selectedSymbols.value, handleCandlestickSocketData)
    // Wait a bit before connecting to avoid race conditions
    setTimeout(() => socketControlCandlestick?.connect(), 100)
  }

  // Init ticker socket with selected symbols
  function initTickerSockets() {
    socketControlTicker?.disconnect()
    socketControlTicker = useBinanceTickerSocket(selectedSymbols.value, handleTickerSocketData)
    setTimeout(() => socketControlTicker?.connect(), 100)
  }

  // Automatically re-init sockets when selectedSymbols change
  watch(
    selectedSymbols,
    (newSymbols, oldSymbols) => {
      // Also delete it from selected tickers
      const removedSymbols = oldSymbols?.filter((val) => !newSymbols.includes(val)) || []
      removedSymbols.forEach((symbol) => delete tickers.value[symbol])

      initTickerSockets()
      initCandleStickSockets()
    },
    { immediate: true },
  )

  return {
    allPairs,
    selectedSymbols,
    tickers,
    fetchPairs,
    removePair,
  }
})
