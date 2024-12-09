const fs = require('fs');

const data = JSON.parse(fs.readFileSync('crypto_prices.json', 'utf-8'));
const BTCPrices = data.BTC;
const ETHPrices = data.ETH;

if (BTCPrices.length !== ETHPrices.length || BTCPrices.length === 0) {
  console.error("Data arrays are empty or not aligned.");
  process.exit(1);
}

const INITIAL_INVESTMENT = 10000;
const USDC_RATIO = 0.4;
const ETH_RATIO = 0.4;
const BTC_RATIO = 0.2;
const USDC_PRICE = 1;
const TRADING_FEE_RATE = 0.001;

const initialBTCPrice = BTCPrices[0];
const initialETHPrice = ETHPrices[0];

const initialUSDCValue = INITIAL_INVESTMENT * USDC_RATIO;
const initialETHValue = INITIAL_INVESTMENT * ETH_RATIO;
const initialBTCValue = INITIAL_INVESTMENT * BTC_RATIO;

const initialUSDC = initialUSDCValue / USDC_PRICE;
const initialETH = initialETHValue / initialETHPrice;
const initialBTC = initialBTCValue / initialBTCPrice;

function optionallyReduceVolatility(btcArr, ethArr) {
  for (let i = 1; i < btcArr.length; i++) {
    const originalChange = btcArr[i] - btcArr[i - 1];
    const reducedChange = originalChange * 0.5;
    btcArr[i] = btcArr[i - 1] + reducedChange;
  }
  for (let i = 1; i < ethArr.length; i++) {
    const originalChange = ethArr[i] - ethArr[i - 1];
    const reducedChange = originalChange * 0.5;
    ethArr[i] = ethArr[i - 1] + reducedChange;
  }
}

function applyDailyInterest(USDCAmount, ETHAmount) {
  const USDC_APR = 0.10;
  const ETH_APR = 0.03;
  const dailyUSDCInterest = USDCAmount * (USDC_APR / 365);
  const dailyETHInterest = ETHAmount * (ETH_APR / 365);
  USDCAmount += dailyUSDCInterest;
  ETHAmount += dailyETHInterest;
  return { USDCAmount, ETHAmount };
}

function getPortfolioValue(USDCAmount, ETHAmount, BTCAmount, ETHPrice, BTCPrice) {
  return (USDCAmount * USDC_PRICE) + (ETHAmount * ETHPrice) + (BTCAmount * BTCPrice);
}

function rebalance(USDCAmount, ETHAmount, BTCAmount, ETHPrice, BTCPrice) {
  const currentValue = getPortfolioValue(USDCAmount, ETHAmount, BTCAmount, ETHPrice, BTCPrice);
  const targetUSDCUSD = currentValue * USDC_RATIO;
  const targetETHUSD = currentValue * ETH_RATIO;
  const targetBTCUSD = currentValue * BTC_RATIO;
  const currentUSDCUSD = USDCAmount * USDC_PRICE;
  const currentETHUSD = ETHAmount * ETHPrice;
  const currentBTCUSD = BTCAmount * BTCPrice;
  const diffUSDC = targetUSDCUSD - currentUSDCUSD;
  const diffETH = targetETHUSD - currentETHUSD;
  const diffBTC = targetBTCUSD - currentBTCUSD;
  const totalTradeVolume = Math.abs(diffUSDC) + Math.abs(diffETH) + Math.abs(diffBTC);
  const fee = totalTradeVolume * TRADING_FEE_RATE;
  const postFeeValue = currentValue - fee;
  const finalUSDCUSD = postFeeValue * USDC_RATIO;
  const finalETHUSD = postFeeValue * ETH_RATIO;
  const finalBTCUSD = postFeeValue * BTC_RATIO;
  return {
    USDC: finalUSDCUSD / USDC_PRICE,
    ETH: finalETHUSD / ETHPrice,
    BTC: finalBTCUSD / BTCPrice
  };
}

function simulateRebalancing(interval, btcData, ethData) {
  let USDCAmount = initialUSDC;
  let ETHAmount = initialETH;
  let BTCAmount = initialBTC;
  for (let day = 1; day < btcData.length; day++) {
    const ETHPrice = ethData[day];
    const BTCPrice = btcData[day];
    const interestResult = applyDailyInterest(USDCAmount, ETHAmount);
    USDCAmount = interestResult.USDCAmount;
    ETHAmount = interestResult.ETHAmount;
    if (interval === 1 || (day % interval === 0)) {
      const newPortfolio = rebalance(USDCAmount, ETHAmount, BTCAmount, ETHPrice, BTCPrice);
      USDCAmount = newPortfolio.USDC;
      ETHAmount = newPortfolio.ETH;
      BTCAmount = newPortfolio.BTC;
    }
  }
  const finalValue = getPortfolioValue(
    USDCAmount,
    ETHAmount,
    BTCAmount,
    ETHPrices[ETHPrices.length - 1],
    BTCPrices[BTCPrices.length - 1]
  );
  return finalValue;
}

function testRandomFourYearPeriods(numTests, interval, BTCPrices, ETHPrices) {
  const totalDays = BTCPrices.length;
  const fourYearDays = 365 * 4;
  const maxStart = totalDays - fourYearDays;
  if (maxStart <= 0) {
    console.error("Not enough data for a 4-year period.");
    return;
  }
  const results = [];
  for (let i = 0; i < numTests; i++) {
    const start = Math.floor(Math.random() * maxStart);
    const end = start + fourYearDays - 1;
    const btcSlice = BTCPrices.slice(start, end + 1);
    const ethSlice = ETHPrices.slice(start, end + 1);
    const finalVal = simulateRebalancing(interval, btcSlice, ethSlice);
    results.push(finalVal);
  }
  const average = results.reduce((acc, val) => acc + val, 0) / results.length;
  console.log(`\n--- ${numTests} random 4-year periods at interval=${interval} days ---`);
  console.log(`Average final portfolio value: $${average.toFixed(2)}`);
}

function main() {
  optionallyReduceVolatility(BTCPrices, ETHPrices); // Can comment out if not required
  const intervals = {
    "1 day": 1,
    "7 days": 7,
    "14 days": 14,
    "30 days": 30,
    "60 days": 60,
    "90 days": 90,
    "180 days": 180,
    "270 days": 270,
    "365 days": 365,
    "548 days": 548,
    "730 days": 730
  };
  console.log(`Initial Investment: $${INITIAL_INVESTMENT.toFixed(2)}`);
  console.log(`Starting with 40% USDC, 40% ETH, 20% BTC`);
  console.log(`Trading fee: ${TRADING_FEE_RATE * 100}% per rebalance`);
  for (const [label, interval] of Object.entries(intervals)) {
    testRandomFourYearPeriods(10000, interval, BTCPrices, ETHPrices);
  }
}

main();
