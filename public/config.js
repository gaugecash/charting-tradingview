// Configuration for GAU Index and 35 fiat currencies
// Backend API: https://oxr-data-server-mqoo.vercel.app

const API_BASE_URL = 'https://oxr-data-server-mqoo.vercel.app';

const CURRENCIES = {
  'GAU Index': [
    { symbol: 'GAUUSD', name: 'GAU vs USD', description: 'GAU Index vs US Dollar' }
  ],
  'Major Currencies': [
    { symbol: 'GAUUSD', name: 'GAU vs USD', description: 'US Dollar' },
    { symbol: 'GAUEUR', name: 'GAU vs EUR', description: 'Euro' },
    { symbol: 'GAUGBP', name: 'GAU vs GBP', description: 'British Pound' },
    { symbol: 'GAUJPY', name: 'GAU vs JPY', description: 'Japanese Yen' },
    { symbol: 'GAUCHF', name: 'GAU vs CHF', description: 'Swiss Franc' },
    { symbol: 'GAUCAD', name: 'GAU vs CAD', description: 'Canadian Dollar' },
    { symbol: 'GAUAUD', name: 'GAU vs AUD', description: 'Australian Dollar' },
    { symbol: 'GAUNZD', name: 'GAU vs NZD', description: 'New Zealand Dollar' }
  ],
  'Asian Currencies': [
    { symbol: 'GAUCNY', name: 'GAU vs CNY', description: 'Chinese Yuan' },
    { symbol: 'GAUHKD', name: 'GAU vs HKD', description: 'Hong Kong Dollar' },
    { symbol: 'GAUINR', name: 'GAU vs INR', description: 'Indian Rupee' },
    { symbol: 'GAUKRW', name: 'GAU vs KRW', description: 'South Korean Won' },
    { symbol: 'GAUSGD', name: 'GAU vs SGD', description: 'Singapore Dollar' },
    { symbol: 'GAUTHB', name: 'GAU vs THB', description: 'Thai Baht' },
    { symbol: 'GAUIDR', name: 'GAU vs IDR', description: 'Indonesian Rupiah' },
    { symbol: 'GAUMYR', name: 'GAU vs MYR', description: 'Malaysian Ringgit' },
    { symbol: 'GAUPHP', name: 'GAU vs PHP', description: 'Philippine Peso' },
    { symbol: 'GAUVND', name: 'GAU vs VND', description: 'Vietnamese Dong' }
  ],
  'European Currencies': [
    { symbol: 'GAUSEK', name: 'GAU vs SEK', description: 'Swedish Krona' },
    { symbol: 'GAUNOK', name: 'GAU vs NOK', description: 'Norwegian Krone' },
    { symbol: 'GAUDKK', name: 'GAU vs DKK', description: 'Danish Krone' },
    { symbol: 'GAUPLN', name: 'GAU vs PLN', description: 'Polish Zloty' },
    { symbol: 'GAUCZK', name: 'GAU vs CZK', description: 'Czech Koruna' },
    { symbol: 'GAUHUF', name: 'GAU vs HUF', description: 'Hungarian Forint' },
    { symbol: 'GAURON', name: 'GAU vs RON', description: 'Romanian Leu' },
    { symbol: 'GAURUB', name: 'GAU vs RUB', description: 'Russian Ruble' },
    { symbol: 'GAUTRY', name: 'GAU vs TRY', description: 'Turkish Lira' }
  ],
  'Americas': [
    { symbol: 'GAUMXN', name: 'GAU vs MXN', description: 'Mexican Peso' },
    { symbol: 'GAUBRL', name: 'GAU vs BRL', description: 'Brazilian Real' },
    { symbol: 'GAUARS', name: 'GAU vs ARS', description: 'Argentine Peso' },
    { symbol: 'GAUCLP', name: 'GAU vs CLP', description: 'Chilean Peso' },
    { symbol: 'GAUCOP', name: 'GAU vs COP', description: 'Colombian Peso' }
  ],
  'Other': [
    { symbol: 'GAUZAR', name: 'GAU vs ZAR', description: 'South African Rand' },
    { symbol: 'GAUILS', name: 'GAU vs ILS', description: 'Israeli Shekel' },
    { symbol: 'GAUSAU', name: 'GAU vs SAR', description: 'Saudi Riyal' },
    { symbol: 'GAUAED', name: 'GAU vs AED', description: 'UAE Dirham' }
  ]
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API_BASE_URL, CURRENCIES };
}
