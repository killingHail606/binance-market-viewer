export interface TradingPair {
  symbol: string
  baseAsset: string
  quoteAsset: string
  displayName: string
  iconUrl: string
}

export enum PriceChangeType {
  DOWN = -1,
  STABLE = 0,
  UP = 1,
}

export interface TickerData {
  price: number
  priceChangePercent: number
  priceChange: PriceChangeType
  candlestick: CandlestickSocketFormatted[]
}

export interface TickerSocketFormatted {
  symbol: string
  priceChangePercent: number
  price: number
}

export interface CandlestickSocketFormatted {
  symbol: string
  price: number
  timestamp: number
  close: number
  high: number
  low: number
  open: number
  volume: number
}

export interface CandlestickSocketResponse {
  e: string // Event type
  E: number // Event time
  s: string // Symbol
  k: {
    t: number // Kline start time
    T: number // Kline close time
    s: string // Symbol
    i: string // Interval
    f: number // First trade ID
    L: number // Last trade ID
    o: string // Open price
    c: string // Close price
    h: string // High price
    l: string // Low price
    v: string // Base asset volume
    n: number // Number of trades
    x: boolean // Is this kline closed?
    q: string // Quote asset volume
    V: string // Taker buy base asset volume
    Q: string // Taker buy quote asset volume
    B: string // Ignore
  }
}

export interface TickerSocketResponse {
  e: string // Event type
  E: number // Event time
  s: string // Symbol
  p: string // Price change
  P: string // Price change percent
  w: string // Weighted average price
  c: string // Last price
  Q: string // Last quantity
  o: string // Open price
  h: string // High price
  l: string // Low price
  v: string // Total traded base asset volume
  q: string // Total traded quote asset volume
  O: number // Statistics open time
  C: number // Statistics close time
  F: number // First trade ID
  L: number // Last trade Id
  n: number // Total number of trades
}
