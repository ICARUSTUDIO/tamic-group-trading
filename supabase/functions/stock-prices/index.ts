import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

interface AlphaVantageQuote {
  '01. symbol'?: string;
  '05. price'?: string;
  '06. volume'?: string;
  '09. change'?: string;
  '10. change percent'?: string;
}

interface AlphaVantageResponse {
  'Global Quote'?: AlphaVantageQuote;
}

// Cache for stock prices (5 min TTL to respect API limits)
const cache = new Map<string, { data: StockQuote; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = (await req.json()) as { symbols?: unknown };
    const symbols = Array.isArray(requestBody.symbols)
      ? requestBody.symbols
          .filter((symbol): symbol is string => typeof symbol === 'string' && symbol.trim().length > 0)
          .map((symbol) => symbol.trim().toUpperCase())
      : [];

    if (symbols.length === 0) {
      return new Response(
        JSON.stringify({ error: 'At least one stock symbol is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('ALPHA_VANTAGE_API_KEY');

    if (!apiKey) {
      console.error('ALPHA_VANTAGE_API_KEY not configured');
      return new Response(
        JSON.stringify({ stocks: generateFallbackPrices(symbols) }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const stocks: StockQuote[] = [];

    for (const symbol of symbols) {
      const cached = cache.get(symbol);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        stocks.push(cached.data);
        continue;
      }

      try {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
        const response = await fetch(url);
        const data = (await response.json()) as AlphaVantageResponse;
        const quote = data['Global Quote'];

        if (quote && Object.keys(quote).length > 0) {
          const stockData: StockQuote = {
            symbol: quote['01. symbol'] || symbol,
            price: Number.parseFloat(quote['05. price'] || '0') || 0,
            change: Number.parseFloat(quote['09. change'] || '0') || 0,
            changePercent: Number.parseFloat((quote['10. change percent'] || '0').replace('%', '')) || 0,
            volume: Number.parseInt(quote['06. volume'] || '0', 10) || 0,
          };

          cache.set(symbol, { data: stockData, timestamp: Date.now() });
          stocks.push(stockData);
        } else {
          console.log(`No data for ${symbol}, using fallback`);
          stocks.push(generateFallbackPrice(symbol));
        }

        await new Promise<void>((resolve) => setTimeout(resolve, 200));
      } catch (error: unknown) {
        console.error(`Error fetching ${symbol}:`, error);
        stocks.push(generateFallbackPrice(symbol));
      }
    }

    return new Response(
      JSON.stringify({ stocks }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error in stock-prices function:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateFallbackPrice(symbol: string): StockQuote {
  const basePrices: Record<string, number> = {
    'AAPL': 178.50,
    'MSFT': 378.25,
    'GOOGL': 141.80,
    'AMZN': 178.90,
    'TSLA': 248.50,
    'META': 505.75,
    'NVDA': 875.30,
    'JPM': 195.40,
    'V': 278.60,
    'JNJ': 156.80,
    'WMT': 165.20,
    'PG': 158.90,
  };

  const basePrice = basePrices[symbol] || 100;
  const change = (Math.random() - 0.5) * basePrice * 0.03;
  const changePercent = (change / basePrice) * 100;

  return {
    symbol,
    price: Number((basePrice + change).toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    volume: Math.floor(Math.random() * 50000000) + 1000000,
  };
}

function generateFallbackPrices(symbols: string[]): StockQuote[] {
  return symbols.map((symbol) => generateFallbackPrice(symbol));
}
