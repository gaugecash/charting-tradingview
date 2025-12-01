// GAU Index Datafeed for TradingView Charting Library
// Implements IBasicDataFeed interface

const config = {
  supported_resolutions: ['D', 'W', 'M', '3M', 'Y']
};

// Helper function to get processSourceRecords
function getProcessor() {
  if (!window.DataProcessor || !window.DataProcessor.processSourceRecords) {
    console.error('ERROR: DataProcessor not loaded!');
    throw new Error('DataProcessor not available');
  }
  return window.DataProcessor.processSourceRecords;
}

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
    this.cacheKey = 'gau_data_cache_v4';
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
    console.log('===== DATAFEED: onReady called =====');
    console.log('Config:', config);
    setTimeout(() => {
      cb(config);
      console.log('✓ onReady callback executed');
    }, 0);
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
    console.log('===== DATAFEED: resolveSymbol called =====');
    console.log('Symbol name:', symbolName);

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

    console.log('Symbol info:', symbol_stub);

    setTimeout(function() {
      onSymbolResolvedCallback(symbol_stub);
      console.log('✓ resolveSymbol callback executed');
    }, 0);
  },

  getBars: async (symbolInfo, resolution, periodParams, onResult, onError) => {
    console.log('===== DATAFEED: getBars called =====');
    console.log('Symbol:', symbolInfo.name);
    console.log('Resolution:', resolution);
    console.log('Period params:', periodParams);

    try {
      const symbol = symbolInfo.name.toLowerCase();
      console.log('Fetching data for symbol:', symbol);

      let records;

      // Try cache first
      const cachedData = dataCache.get(symbol);

      if (cachedData) {
        console.log('✓ Cache HIT for:', symbol);
        records = cachedData;
      } else {
        console.log('✗ Cache MISS - Fetching from API');
        // Fetch from API
        const url = `https://oxr-data-server-mqoo.vercel.app/${symbol}usd`;
        console.log('API URL:', url);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        records = await response.json();
        console.log('✓ API returned', records.length, 'records');

        // Cache the response
        dataCache.set(symbol, records);
      }

      // Get processor function
      const processSourceRecords = getProcessor();

      // Process records to TradingView bar format
      console.log('Processing records to bars...');
      const bars = processSourceRecords(records);
      console.log('✓ Processed', bars.length, 'bars');

      // Filter by date range
      const to = periodParams.to * 1000;
      const from = periodParams.from * 1000;

      const filtered = bars.filter((el) => {
        return el.time >= from && el.time <= to;
      });

      console.log('== RESULT ==');
      console.log('Date range:', new Date(from).toISOString(), 'to', new Date(to).toISOString());
      console.log('Requested:', periodParams.countBack, 'bars');
      console.log('Returning:', filtered.length, 'bars');

      if (filtered.length > 0) {
        console.log('First bar:', new Date(filtered[0].time).toISOString(), filtered[0]);
        console.log('Last bar:', new Date(filtered[filtered.length - 1].time).toISOString(), filtered[filtered.length - 1]);
      }

      onResult(filtered, { noData: bars.length == 0 });
      console.log('✓ getBars completed successfully');

    } catch (error) {
      console.error('❌ ERROR in getBars:', error);
      console.error('Stack:', error.stack);
      onError(error.message);
    }
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
