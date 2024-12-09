# Rebalancing Model For Bitcoin, Ethereum & USD Portfolios

There's a full write up about this here: https://jamesbachini.com/rebalancing-portfolio/

This code was used to try and find out how often I should be rebalancing a portfolio containing:

40% USDC
40% ETH
20% BTC

fetch.js - Fetches daily prices for the last 8 years for digital assets
model.js - Models how different rebalancing periods affect returns over random 4 year periods within the dataset

Trading fees set at 0.1%
Volatility set at -50% compared to last 8 years
Yield - USDC @ 10%, ETH @ 3%, BTC @ 0%

## TL;DR

The optimal period for rebalancing is between 180 and 365 days.

## Full Results

Initial Investment: $10000.00
Starting with 40% USDC, 40% ETH, 20% BTC
Trading fee: 0.1% per rebalance

--- 10000 random 4-year periods at interval=1 days ---
Average final portfolio value: $85712.05

--- 10000 random 4-year periods at interval=7 days ---
Average final portfolio value: $105592.87

--- 10000 random 4-year periods at interval=14 days ---
Average final portfolio value: $111880.15

--- 10000 random 4-year periods at interval=30 days ---
Average final portfolio value: $116987.56

--- 10000 random 4-year periods at interval=60 days ---
Average final portfolio value: $118906.82

--- 10000 random 4-year periods at interval=90 days ---
Average final portfolio value: $117130.26

--- 10000 random 4-year periods at interval=180 days ---
Average final portfolio value: $124153.33

--- 10000 random 4-year periods at interval=270 days ---
Average final portfolio value: $125914.05

--- 10000 random 4-year periods at interval=365 days ---
Average final portfolio value: $123273.54

--- 10000 random 4-year periods at interval=548 days ---
Average final portfolio value: $118626.35

--- 10000 random 4-year periods at interval=730 days ---
Average final portfolio value: $110165.96


## Links

- [Website](https://jamesbachini.com)
- [YouTube](https://www.youtube.com/c/JamesBachini?sub_confirmation=1)
- [Substack](https://bachini.substack.com)
- [Podcast](https://podcasters.spotify.com/pod/show/jamesbachini)
- [Twitter](https://twitter.com/james_bachini)
- [LinkedIn](https://www.linkedin.com/in/james-bachini/)
- [GitHub](https://github.com/jamesbachini)
