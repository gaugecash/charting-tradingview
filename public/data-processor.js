// Data Processor for GAU Index
// Converts API response format to TradingView Bar format

/**
 * Processes source records from API into TradingView bars
 *
 * Input format: [{"datetime": "2002-01-02", "close": 1.7989}, ...]
 * Output format: [{time: 1009929600000, open: 1.7989, high: 1.8012, low: 1.8012, close: 1.8012}, ...]
 *
 * @param {Array} records - Array of {datetime, close} objects from API
 * @returns {Array} Array of TradingView Bar objects
 */
function processSourceRecords(records) {
  const bars = [];

  // Loop from index 1 to length-1 (skip first and last records)
  // We need previous record to calculate open price
  for (let i = 1; i < records.length - 1; i++) {
    const el = records[i];
    const prev = records[i - 1];

    // Convert datetime string to milliseconds since epoch
    const time = new Date(el.datetime).getTime();

    // Create TradingView bar
    // Since we only have daily close prices, we use:
    // - open: previous day's close
    // - close: current day's close
    // - high: max(open, close) - ensures valid OHLC
    // - low: min(open, close) - ensures valid OHLC
    const bar = {
      time: time,           // TradingView requires bar time in ms
      open: prev.close,     // Use previous close as open
      close: el.close,
      high: Math.max(prev.close, el.close),
      low: Math.min(prev.close, el.close)
    };

    bars.push(bar);
  }

  return bars;
}

// Export to window for global access
window.DataProcessor = {
  processSourceRecords: processSourceRecords
};
