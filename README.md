# GAU Index TradingView Charts

Professional TradingView charting interface for the GAU Index vs 35 fiat currencies.

## Overview

This repository contains a pure HTML/JavaScript implementation of TradingView Advanced Charts, configured to display historical GAU Index data from 2002 to present. The charts fetch data from the backend API and provide an interactive visualization of GAU's performance against major global currencies.

**Live Site:** [charting.gaugecash.com](https://charting.gaugecash.com)

## Features

- **35 Fiat Currencies + GAU Index** - Comprehensive coverage of global currencies
- **Historical Data** - Daily price data from 2002 to November 2025
- **TradingView Integration** - Professional charting powered by TradingView Advanced Charts
- **Zero Dependencies** - Pure HTML/JavaScript, no build process required
- **Organized by Region** - Currencies grouped by Major, Asian, European, Americas, and Other
- **Dark Theme** - Professional UI matching TradingView's style
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Daily Updates** - Data updated daily via automated cron job

## Architecture

```
charting-tradingview/
├── public/
│   ├── index.html      # Main chart page with UI
│   ├── config.js       # Currency configuration
│   └── datafeed.js     # TradingView UDF-compatible datafeed adapter
├── vercel.json         # Vercel deployment configuration
├── .gitignore          # Git ignore file
└── README.md           # This file
```

### Technology Stack

- **Frontend:** Pure HTML5, CSS3, JavaScript (ES6+)
- **Charting:** TradingView Advanced Charts (free tier with attribution)
- **Backend API:** https://oxr-data-server-mqoo.vercel.app
- **Hosting:** Vercel (auto-deploy from main branch)
- **Domain:** charting.gaugecash.com

## Supported Currencies

### GAU Index
- GAUUSD - GAU vs US Dollar

### Major Currencies
- USD, EUR, GBP, JPY, CHF, CAD, AUD, NZD

### Asian Currencies
- CNY, HKD, INR, KRW, SGD, THB, IDR, MYR, PHP, VND

### European Currencies
- SEK, NOK, DKK, PLN, CZK, HUF, RON, RUB, TRY

### Americas
- MXN, BRL, ARS, CLP, COP

### Other
- ZAR, ILS, SAR, AED

## Backend API

The charts fetch data from the backend API:

**Base URL:** `https://oxr-data-server-mqoo.vercel.app`

**Endpoint Format:** `/{symbol}` (lowercase)

**Example:** `https://oxr-data-server-mqoo.vercel.app/gauusd`

**Data Format:**
```json
[
  {
    "datetime": "2025-11-20",
    "close": 1.7992
  },
  ...
]
```

## Deployment

### Automatic Deployment (Recommended)

1. Push to the `main` branch on GitHub
2. Vercel automatically deploys the changes
3. Live at: https://charting.gaugecash.com

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Custom Domain Setup

To configure `charting.gaugecash.com`:

1. Go to Vercel Dashboard → Project Settings → Domains
2. Add domain: `charting.gaugecash.com`
3. Configure DNS with your domain registrar:

```
Type: CNAME
Name: charting
Value: cname.vercel-dns.com
```

Or use Vercel nameservers for automatic configuration.

## Development

### Local Testing

Simply open `public/index.html` in a web browser, or use a local server:

```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx serve public

# PHP
php -S localhost:8000 -t public
```

Then open: http://localhost:8000

### File Structure

**`public/index.html`**
- Main HTML page with TradingView chart container
- Currency selector dropdown
- Responsive UI with dark theme
- Footer with attributions

**`public/config.js`**
- API base URL configuration
- Currency definitions organized by region
- Symbol mappings and descriptions

**`public/datafeed.js`**
- TradingView UDF-compatible datafeed implementation
- Fetches data from backend API
- Converts backend format to TradingView format
- Handles symbol resolution and bar data

**`vercel.json`**
- Vercel deployment configuration
- URL rewrites and headers
- Security headers and caching rules

## Code Overview

### TradingView Datafeed Implementation

The datafeed adapter (`datafeed.js`) implements the TradingView UDF interface:

- `onReady()` - Returns configuration and supported features
- `searchSymbols()` - Searches for symbols
- `resolveSymbol()` - Resolves symbol information
- `getBars()` - Fetches historical bar data
- `subscribeBars()` - Real-time updates (not implemented for daily data)
- `unsubscribeBars()` - Unsubscribe from updates

### Data Flow

1. User selects currency from dropdown
2. TradingView requests symbol information via `resolveSymbol()`
3. TradingView requests historical data via `getBars()`
4. Datafeed fetches from backend: `https://oxr-data-server-mqoo.vercel.app/{symbol}`
5. Datafeed converts backend format to TradingView format
6. Chart renders with historical data

## Future Enhancements

- [ ] On-chain verification integration
- [ ] Additional timeframes (weekly, monthly)
- [ ] Technical indicators
- [ ] Export functionality (CSV, PNG)
- [ ] Comparison mode (multiple currencies)
- [ ] Real-time updates via WebSocket
- [ ] Mobile app integration

## License

Copyright © 2025 Gauge Cash. All rights reserved.

## Attribution

- Charts powered by [TradingView](https://www.tradingview.com/)
- Data by [Gauge Cash](https://gaugecash.com)
- Backend API hosted on Vercel

## Support

For issues or questions:
- GitHub Issues: https://github.com/gaugecash/charting-tradingview/issues
- Website: https://gaugecash.com
- Email: support@gaugecash.com

---

Built with ❤️ by Gauge Cash
