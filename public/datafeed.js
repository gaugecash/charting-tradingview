// TradingView UDF-compatible Datafeed Adapter
// Fetches GAU Index and currency data from backend API

class GAUDatafeed {
  constructor(apiBaseUrl) {
    this.apiBaseUrl = apiBaseUrl;
    this.cache = new Map();
  }

  // Required method: Called when the chart is initialized
  onReady(callback) {
    console.log('[GAUDatafeed] onReady called');
    setTimeout(() => {
      callback({
        supported_resolutions: ['1D'], // Daily data only
        supports_marks: false,
        supports_timescale_marks: false,
        supports_time: true,
        exchanges: [{ value: 'GAU', name: 'GAU Index', desc: 'GAU Index' }]
      });
    }, 0);
  }

  // Required method: Search for symbols
  searchSymbols(userInput, exchange, symbolType, onResultReadyCallback) {
    console.log('[GAUDatafeed] searchSymbols:', userInput);
    const results = [];

    // Search through all currencies
    Object.values(CURRENCIES).forEach(categoryGroup => {
      categoryGroup.forEach(currency => {
        if (currency.symbol.toLowerCase().includes(userInput.toLowerCase()) ||
            currency.name.toLowerCase().includes(userInput.toLowerCase()) ||
            currency.description.toLowerCase().includes(userInput.toLowerCase())) {
          results.push({
            symbol: currency.symbol,
            full_name: currency.name,
            description: currency.description,
            exchange: 'GAU',
            type: 'index'
          });
        }
      });
    });

    onResultReadyCallback(results);
  }

  // Required method: Resolve symbol info
  resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    console.log('[GAUDatafeed] resolveSymbol:', symbolName);

    // Find symbol in our config
    let symbolInfo = null;
    Object.values(CURRENCIES).forEach(categoryGroup => {
      const found = categoryGroup.find(c => c.symbol === symbolName);
      if (found) {
        symbolInfo = found;
      }
    });

    if (!symbolInfo) {
      onResolveErrorCallback('Symbol not found');
      return;
    }

    // Return symbol information in TradingView format
    setTimeout(() => {
      onSymbolResolvedCallback({
        name: symbolInfo.symbol,
        description: symbolInfo.description,
        type: 'index',
        session: '24x7',
        timezone: 'Etc/UTC',
        ticker: symbolInfo.symbol,
        exchange: 'GAU',
        minmov: 1,
        pricescale: 10000, // 4 decimal places
        has_intraday: false,
        has_no_volume: true,
        has_daily: true,
        has_weekly_and_monthly: false,
        supported_resolutions: ['1D'],
        volume_precision: 0,
        data_status: 'streaming',
        format: 'price'
      });
    }, 0);
  }

  // Required method: Get historical bars
  async getBars(symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) {
    const { from, to, firstDataRequest } = periodParams;

    console.log('[GAUDatafeed] getBars:', {
      symbol: symbolInfo.name,
      resolution,
      from: new Date(from * 1000).toISOString(),
      to: new Date(to * 1000).toISOString(),
      firstDataRequest
    });

    try {
      // Convert symbol to lowercase for API call
      const apiSymbol = symbolInfo.name.toLowerCase();
      const url = `${this.apiBaseUrl}/${apiSymbol}`;

      console.log('[GAUDatafeed] Fetching from:', url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[GAUDatafeed] Received data points:', data.length);

      if (!data || data.length === 0) {
        onHistoryCallback([], { noData: true });
        return;
      }

      // Convert backend format to TradingView format
      const bars = data
        .map(item => {
          const date = new Date(item.datetime + 'T00:00:00Z');
          const time = date.getTime();

          return {
            time: time,
            open: item.close,  // Daily data: use close as open
            high: item.close,  // Daily data: use close as high
            low: item.close,   // Daily data: use close as low
            close: item.close
          };
        })
        .filter(bar => {
          // Filter bars within requested time range
          const barTime = bar.time / 1000;
          return barTime >= from && barTime <= to;
        })
        .sort((a, b) => a.time - b.time); // Sort by time ascending

      console.log('[GAUDatafeed] Returning bars:', bars.length);

      if (bars.length === 0) {
        onHistoryCallback([], { noData: true });
      } else {
        onHistoryCallback(bars, { noData: false });
      }
    } catch (error) {
      console.error('[GAUDatafeed] getBars error:', error);
      onErrorCallback(error.message);
    }
  }

  // Required method: Subscribe to real-time updates (not implemented for daily data)
  subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) {
    console.log('[GAUDatafeed] subscribeBars:', symbolInfo.name);
    // No real-time updates for daily data
  }

  // Required method: Unsubscribe from real-time updates
  unsubscribeBars(subscribeUID) {
    console.log('[GAUDatafeed] unsubscribeBars:', subscribeUID);
    // No-op for daily data
  }

  // Optional method: Get server time
  getServerTime(callback) {
    callback(Math.floor(Date.now() / 1000));
  }
}

// Export for use in HTML
if (typeof window !== 'undefined') {
  window.GAUDatafeed = GAUDatafeed;
}
