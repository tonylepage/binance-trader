
// https://www.investopedia.com/terms/r/rsi.asp
// https://nullbeans.com/how-to-calculate-the-relative-strength-index-rsi/

// {    "eventType":"kline",
//      "eventTime":1599693488385,
//      "symbol":"BTCUSDT",
//      "kline":{
//          "startTime":1599693480000,
//          "endTime":1599693539999,
//          "symbol":"BTCUSDT",
//          "interval":"1m",
//          "firstTradeId":410752766,
//          "lastTradeId":410752855,
//          "open":"10245.90000000",
//          "close":"10243.20000000",
//          "high":"10245.90000000",
//          "low":"10243.02000000",
//          "volume":"3.21495200",
//          "trades":90,
//          "final":false,
//          "quoteVolume":"32933.49392488",
//          "volumeActive":"1.23579800",
//          "quoteVolumeActive":"12658.98128942",
//          "ignored":"0"
//      }
//  }

module.exports.calculateRSI = function(candles, periods){


    candleKeys = Object.keys(candles);

    currentPrice = parseFloat(candles[candleKeys[0]].close);
    priceChange = parseFloat(candles[candleKeys[0]].open) - currentPrice;
    percentChange = priceChange / parseFloat(candles[candleKeys[0]].open);

    numPositivePeriods = 0;
    sumPositivePeriods = 0;
    numNegativePeriods = 0;
    sumNegativePeriods = 0;

    for(i = 0; i < periods; i++){
        tempCurrentPrice = parseFloat(candles[candleKeys[i]].close);
        tempPriceChange = parseFloat(candles[candleKeys[i]].open) - tempCurrentPrice;
        tempPercentChange = tempPriceChange / parseFloat(candles[candleKeys[i]].open);
        
        if (tempPercentChange > 0){
            numPositivePeriods++;
            sumPositivePeriods = sumPositivePeriods + tempPercentChange;
        } else if (tempPercentChange < 0){
            numNegativePeriods++;
            negOne = -1;
            sumNegativePeriods = sumNegativePeriods + (tempPercentChange * negOne);
        }

    }

    relativeStrength = (sumPositivePeriods/numPositivePeriods) / (sumNegativePeriods/numNegativePeriods);
    relativeStrengthIndex = (100 - (100 / (1 + relativeStrength)));

    return relativeStrengthIndex;
}