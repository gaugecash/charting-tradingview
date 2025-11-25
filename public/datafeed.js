// GAU Index Datafeed for TradingView Charting Library
// Implements IBasicDataFeed interface

// Import data processor
const { processSourceRecords } = window.DataProcessor || {};

const config = {
  supported_resolutions: ['D', 'W', 'M', '3M', 'Y']
};

// 35 currency symbols
const symbols = [
  'GAU',
  'EUR',
  'GBP',
  'CHF',
  'AUD',
  'CAD',
  'CNY',
  'HKD',
  'NZD',
  'SEK',
  'KRW',
  'SGD',
  'NOK',
  'MXN',
  'INR',
  'RUB',
  'ZAR',
  'TRY',
  'BRL',
  'TWD',
  'DKK',
  'PLN',
  'THB',
  'IDR',
  'HUF',
  'CZK',
  'ILS',
  'CLP',
  'PHP',
  'COP',
  'MYR',
  'RON',
  'PEN',
  'ARS',
  'BGN'
];

// Simple localStorage cache with 12-hour TTL
class DataCache {
  constructor() {
    this.cacheKey = 'gau_data_cache_v2';
  }

  get(symbol) {
    try {
      const cache = JSON.parse(localStorage.getItem(this.cacheKey) || '{}');
      const entry = cache[symbol];

      if (!entry) return null;

      // Check if expired
      if (entry.expireEpoch < Date.now()) {
        return null;
      }

      return entry.data;
    } catch (e) {
      console.error('Cache read error:', e);
      return null;
    }
  }

  set(symbol, data) {
    try {
      const cache = JSON.parse(localStorage.getItem(this.cacheKey) || '{}');

      cache[symbol] = {
        expireEpoch: Date.now() + (1000 * 60 * 60 * 12), // 12 hours
        data: data
      };

      localStorage.setItem(this.cacheKey, JSON.stringify(cache));
      console.log('Cache saved for:', symbol);
    } catch (e) {
      console.error('Cache write error:', e);
    }
  }
}

const dataCache = new DataCache();

// Datafeed implementation
const GAUDatafeed = {
  onReady: (cb) => {
    console.log('=====onReady running');
    setTimeout(() => cb(config), 0);
  },

  searchSymbols: (userInput, exchange, symbolType, cb) => {
    console.log('====Search Symbols running');
    const input = userInput.trim().toLowerCase();

    const results = symbols
      .filter((el) => {
        if (input.length == 1) {
          return true;
        }
        return el.toLowerCase().includes(input);
      })
      .map((el) => {
        return {
          symbol: el,
          full_name: el + ':USD',
          description: el + ':USD',
          exchange: el != 'GAU' ? 'OpenExchangeRates' : 'Index',
          ticker: el,
          type: el != 'GAU' ? 'fiat' : 'crypto'
        };
      });

    cb(results);
  },

  resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
    console.log('======resolveSymbol running: ' + symbolName);
    const symbol_stub = {
      name: symbolName,
      description: symbolName + ':USD',
      type: 'crypto',
      session: '24x7',
      timezone: 'Etc/UTC',
      ticker: symbolName,
      exchange: 'Custom',
      minmov: 1,
      pricescale: 1000000,
      has_intraday: false,
      supported_resolution: config.supported_resolutions,
      volume_precision: 8,
      data_status: 'streaming'
    };

    setTimeout(function() {
      onSymbolResolvedCallback(symbol_stub);
    }, 0);
  },

  getBars: async (symbolInfo, resolution, periodParams, onResult, onError) => {
    console.log('======getBars running for:', symbolInfo.name);
    console.log('Trying to recover from cache');

    const symbol = symbolInfo.name.toLowerCase();

    let records;

    // Try cache first
    const cachedData = dataCache.get(symbol);

    if (cachedData) {
      console.log('There is a cache!');
      records = cachedData;
    } else {
      // Fetch from API
      try {
        const url = `https://oxr-data-server-mqoo.vercel.app/${symbol}usd`;
        console.log('Fetching from:', url);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        records = await response.json();

        // Cache the response
        dataCache.set(symbol, records);

      } catch (error) {
        console.error('Error fetching data:', error);
        onError(error.message);
        return;
      }
    }

    // Process records to TradingView bar format
    const bars = processSourceRecords(records);

    // Filter by date range
    const to = periodParams.to * 1000;
    const from = periodParams.from * 1000;

    const filtered = bars.filter((el) => {
      return el.time >= from && el.time <= to;
    });

    console.log('== INFO ==');
    console.log('from, to: ', periodParams.from, periodParams.to);
    console.log('requested: ', periodParams.countBack);
    console.log('given: ', filtered.length);

    onResult(filtered, { noData: bars.length == 0 });
  },

  subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
    // Not implemented - no real-time updates
  },

  unsubscribeBars: (subscriberUID) => {
    // Not implemented
  },

  getServerTime: (cb) => {
    // Optional - not implemented
  },

  calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
    // Optional - not implemented
  },

  getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
    // Optional - not implemented
  },

  getTimeScaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
    // Optional - not implemented
  }
};

// Export to window for global access
window.GAUDatafeed = GAUDatafeed;
