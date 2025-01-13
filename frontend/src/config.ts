export const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://api.buysellhold.live'
    : 'http://localhost:3001',
  websiteName: 'BuySellHold'
};