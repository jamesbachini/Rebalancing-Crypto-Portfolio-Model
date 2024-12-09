const ccxt = require('ccxt');
const fs = require('fs');

const fetchHistoricalData = async (exchangeId, symbol, timeframe, since) => {
    const exchange = new ccxt[exchangeId]({ enableRateLimit: true });
    let allData = [];
    let fetchSince = since;
    while (fetchSince < exchange.milliseconds()) {
        try {
            const data = await exchange.fetchOHLCV(symbol, timeframe, fetchSince, 1000);
            if (data.length === 0) break;
            const closePrices = data.map(entry => entry[4]);
            allData = allData.concat(closePrices);
            fetchSince = data[data.length - 1][0] + 1;
            console.log(`Fetched ${data.length} candles for ${symbol}`);
        } catch (error) {
            console.error(`Error fetching data for ${symbol}:`, error.message);
            break;
        }
    }
    return allData;
};

const main = async () => {
    const exchangeId = 'binance';
    const timeframe = '1d';
    const since = new Date().getTime() - 8 * 365 * 24 * 60 * 60 * 1000;
    try {
        console.log('Fetching Bitcoin data...');
        const btcPrices = await fetchHistoricalData(exchangeId, 'BTC/USDT', timeframe, since);
        console.log('Fetching Ethereum data...');
        const ethPrices = await fetchHistoricalData(exchangeId, 'ETH/USDT', timeframe, since);
        const result = {
            BTC: btcPrices,
            ETH: ethPrices
        };
        fs.writeFileSync('crypto_prices.json', JSON.stringify(result, null, 2));
        console.log('Saved data to crypto_prices.json');
    } catch (error) {
        console.error('Error:', error.message);
    }
};

main();
