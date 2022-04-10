const jq = require('jquery');  
const api = require('binance');
const trade = require('./models/trade');
//const rsi = require('./calculate/rsi');

const rsiPeriod = 14;

const watchlist = new Array;

const btcCandles = new Array;
var btcPriceNow = 0.00;
var btcRsiNow = 0.00;
const btcTradePrecision = 6;
const btcPricePrecision = 2;
const btcAcronym = 'btc';

const btcupCandles = new Array;
var btcupPriceNow = 0.00;
const btcupTradePrecision = 2;
const btcupPricePrecision = 3;
const btcupAcronym = 'btcup';

const ethCandles = new Array;
var ethPriceNow = 0.00;
const ethTradePrecision = 6;
const ethPricePrecision = 2;
const ethAcronym = 'eth';

const adaCandles = new Array;
var adaPriceNow = 0.00;
const adaTradePrecision = 6;
const adaPricePrecision = 6;
const adaAcronym = 'ada';

const neoCandles = new Array;
var neoPriceNow = 0.00;
const neoTradePrecision = 6;
const neoPricePrecision = 2;
const neoAcronym = 'neo';

const ltcCandles = new Array;
var ltcPriceNow = 0.00;
const ltcTradePrecision = 6;
const ltcPricePrecision = 2;
const ltcAcronym = 'ltc';

const bnbCandles = new Array;
var bnbPriceNow = 0.00;
const bnbTradePrecision = 6;
const bnbPricePrecision = 2;
const bnbAcronym = 'bnb';

const kavaCandles = new Array;
var kavaPriceNow = 0.00;
const kavaTradePrecision = 6;
const kavaPricePrecision = 4;
const kavaAcronym = 'kava';

const kncCandles = new Array;
var kncPriceNow = 0.00;
const kncTradePrecision = 6;
const kncPricePrecision = 4;
const kncAcronym = 'knc';

const trxCandles = new Array;
var trxPriceNow = 0.00;
const trxTradePrecision = 6;
const trxPricePrecision = 6;
const trxAcronym = 'trx';

const eosCandles = new Array;
var eosPriceNow = 0.00;
const eosTradePrecision = 6;
const eosPricePrecision = 4;
const eosAcronym = 'eos';

const curTrades = new Array;




const binanceRest = new api.BinanceRest({
    key: 'q2nchdsgya0Gc3D7bLIk1LWvMVw5rqeeJTNkbmWVoyj9UqCs3f0vKRZR0pcoEipT', // Get this from your account on binance.com
    secret: 'hwWEKHLsGiPULqod6uUDZE3MfguQyRmqidXPrNx1uMGitw5edpbiPmkPux21OCrt', // Same for this
    timeout: 15000, // Optional, defaults to 15000, is the request time out in milliseconds
    recvWindow: 10000, // Optional, defaults to 5000, increase if you're getting timestamp errors
    disableBeautification: false,
    /*
     * Optional, default is false. Binance's API returns objects with lots of one letter keys.  By
     * default those keys will be replaced with more descriptive, longer ones.
     */
    handleDrift: false,
    /*
     * Optional, default is false.  If turned on, the library will attempt to handle any drift of
     * your clock on it's own.  If a request fails due to drift, it'll attempt a fix by requesting
     * binance's server time, calculating the difference with your own clock, and then reattempting
     * the request.
     */
    baseUrl: 'https://api.binance.com/',
    /*
     * Optional, default is 'https://api.binance.com/'. Can be useful in case default url stops working.
     * In february 2018, Binance had a major outage and when service started to be up again, only
     * https://us.binance.com was working.
     */
    requestOptions: {}
    /*
     * Options as supported by the 'request' library
     * For a list of available options, see:
     * https://github.com/request/request
     */
});


/*
 * WebSocket API
 *
 * Each call to onXXXX initiates a new websocket for the specified route, and calls your callback with
 * the payload of each message received.  Each call to onXXXX returns the instance of the websocket
 * client if you want direct access(https://www.npmjs.com/package/ws).
 */
const binanceWS = new api.BinanceWS(true); // Argument specifies whether the responses should be beautified, defaults to true
 


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


/*
 * You can use one websocket for multiple streams.  There are also helpers for the stream names, but the
 * documentation has all of the stream names should you want to specify them explicitly.
 */
const streams = binanceWS.streams;


binanceWS.onCombinedStream(
    [
        streams.kline('BTCUSDT', '1m'),
        streams.kline('BTCUPUSDT', '1m'),
        streams.kline('ETHUSDT', '1m'),
/*        streams.kline('ETHUPUSDT', '1m'),
        streams.kline('XRPUSDT', '1m'),
        streams.kline('BCHUSDT', '1m'),
        streams.kline('BNBUSDT', '1m'),
        streams.kline('DOTUSDT', '1m'),
        streams.kline('LINKUSDT', '1m'),
        streams.kline('LTCUSDT', '1m'),
        streams.kline('LTCUPUSDT', '1m'),
        streams.kline('CROUSDT', '1m'),
        streams.kline('BSVUSDT', '1m'),
        streams.kline('ADAUSDT', '1m'),
        streams.kline('XMRUSDT', '1m'),
        streams.kline('TRXUSDT', '1m'),
        streams.kline('XTZUSDT', '1m'),
        streams.kline('XLMUSDT', '1m'),
        streams.kline('LEOUSDT', '1m'),
        streams.kline('NEOUSDT', '1m'),
        streams.kline('XEMUSDT', '1m'),
        streams.kline('ATOMUSDT', '1m'),
        streams.kline('HTUSDT', '1m'),
        streams.kline('DAIUSDT', '1m'),
        streams.kline('VETUSDT', '1m'),
        streams.kline('MIOTAUSDT', '1m'),
        streams.kline('DASHUSDT', '1m'),
        streams.kline('ZECUSDT', '1m'),
        streams.kline('THETAUSDT', '1m'),
        streams.kline('ETCUSDT', '1m'),
        streams.kline('LENDUSDT', '1m'),
        streams.kline('MKRUSDT', '1m'),
        streams.kline('YFIUSDT', '1m'),
        streams.kline('OMGUSDT', '1m'),
        streams.kline('ONTUSDT', '1m'),
        streams.kline('SNXUSDT', '1m'),
        streams.kline('OKBUSDT', '1m'),
        streams.kline('UMAUSDT', '1m'),
        streams.kline('DGBUSDT', '1m'),
        streams.kline('FTTUSDT', '1m'),
        streams.kline('ALGOUSDT', '1m'),
        streams.kline('BATUSDT', '1m'),
        streams.kline('HEDGUSDT', '1m'),
        streams.kline('UNIUSDT', '1m'),
        streams.kline('CELUSDT', '1m'),
        streams.kline('EOSUSDT', '1m'),
        streams.kline('KAVAUSDT', '1m'), 
        streams.kline('KNCUSDT', '1m'), */

    ],
    streamEvent => {
        switch (streamEvent.stream) {
            case streams.kline('BTCUSDT', '1m'):
                setBTCPrice(streamEvent.data);
                setChangesAndSwings(streamEvent.data, btcCandles, btcAcronym);
                handleStreamData(streamEvent.data);
                break;
            case streams.kline('BTCUPUSDT', '1m'):
                setPrice(streamEvent.data, btcupAcronym, btcupPricePrecision);
                setChangesAndSwings(streamEvent.data, btcupCandles, btcupAcronym);
                break;
            case streams.kline('ETHUSDT', '1m'):
                setPrice(streamEvent.data, ethAcronym, ethPricePrecision);
                setChangesAndSwings(streamEvent.data, ethCandles, ethAcronym);
                break;
            case streams.kline('ETHUPUSDT', '1m'):
                setPrice(streamEvent.data, ethupAcronym, ethupPricePrecision);
                setChangesAndSwings(streamEvent.data, ethupCandles, ethupAcronym);
                break;
/*            case streams.kline('ADAUSDT', '1m'):
                setPrice(streamEvent.data, adaAcronym, adaPricePrecision);
                setChangesAndSwings(streamEvent.data, adaCandles, adaAcronym);
                break;
            case streams.kline('NEOUSDT', '1m'):
                setPrice(streamEvent.data, neoAcronym, neoPricePrecision);
                setChangesAndSwings(streamEvent.data, neoCandles, neoAcronym);
                break;
            case streams.kline('LTCUSDT', '1m'):
                setPrice(streamEvent.data, ltcAcronym, ltcPricePrecision);
                setChangesAndSwings(streamEvent.data, ltcCandles, ltcAcronym);
                break;
            case streams.kline('LTCUPUSDT', '1m'):
                setPrice(streamEvent.data, ltcAcronym, ltcPricePrecision);
                setChangesAndSwings(streamEvent.data, ltcCandles, ltcAcronym);
                break;
            case streams.kline('BNBUSDT', '1m'):
                setPrice(streamEvent.data, bnbAcronym, bnbPricePrecision);
                setChangesAndSwings(streamEvent.data, bnbCandles, bnbAcronym);
                break;
            case streams.kline('KAVAUSDT', '1m'):
                setPrice(streamEvent.data, kavaAcronym, kavaPricePrecision);
                setChangesAndSwings(streamEvent.data, kavaCandles, kavaAcronym);
                break;
            case streams.kline('KNCUSDT', '1m'):
                setPrice(streamEvent.data, kncAcronym, kncPricePrecision);
                setChangesAndSwings(streamEvent.data, kncCandles, kncAcronym);
                break;
            case streams.kline('TRXUSDT', '1m'):
                setPrice(streamEvent.data, trxAcronym, trxPricePrecision);
                setChangesAndSwings(streamEvent.data, trxCandles, trxAcronym);
                break;
            case streams.kline('EOSUSDT', '1m'):
                setPrice(streamEvent.data, eosAcronym, eosPricePrecision);
                setChangesAndSwings(streamEvent.data, eosCandles, eosAcronym);
                break; */
        }
    }
);



const render24hrChange = (percentChange) => {
    if (percentChange.elementId != null) {
        percent24_html = '-.--';
        percent24 = percentChange.percent;
//        console.log(`24hrChange percent24==>`, percent24);  
        if (percent24 >= 0) {
            percent24_html = '<font color=\'green\'>' + percent24 + '</font>';
        } else if (percent24 < 0) {
            percent24_html = '<font color=\'red\'>' + percent24 + '</font>';
        }
        document.getElementById('average24_'+percentChange.elementId).innerHTML = percent24_html;
    } else {
        console.log(`24hr render err ==>`, percentChange);
    }
};

const fetch24hrChange = (symbol24, symbolAcronym) => {

    watchlistRow = watchlist.find(row => row.symbol === symbol24);

    if (watchlistRow == null){
        watchlistRow = {
            symbol: symbol24,
            price: 0,
            average24: 0,
            average60: 0,
            average30: 0,
            average15: 0,
            average05: 0,
            swing60: 0,
            swing45: 0,
            swing30: 0,
            swing15: 0,
            swing05: 0,
            rsi01: 0,
            rsi15: 0,
            candles: new Array
        }
    }

    binanceRest.ticker24hr(symbol24) // Object is transformed into a query string, timestamp is automatically added
        .then(data => {
            percentChange = {
                percent:  parseFloat(data.priceChangePercent),
                elementId: symbolAcronym
            };
            render24hrChange(percentChange);
            watchlistRow.average24 = percentChange.percent;
        })
        .catch(err => console.error(err));
};



/*const fetchRSI = (candles, period) => {

    data = calculateRSI(candles, period)
    renderRSI(parseFloat(data));

}*/


const fetchCandles = (symbol24, candles, limit) => {

    if (watchlist != null){
        watchlistRow = watchlist.find(row => row.symbol === symbol24);
    } else {
        tempCandles = new Array;
        watchlistRow = {
            symbol: symbol24,
            price: 0,
            average24: 0,
            average60: 0,
            average30: 0,
            average15: 0,
            average05: 0,
            swing60: 0,
            swing45: 0,
            swing30: 0,
            swing15: 0,
            swing05: 0,
            rsi01: 0,
            rsi15: 0,
            candles: tempCandles
        }
        watchlist.unshift(watchlistRow);
    }

    binanceRest.klines({
            symbol: symbol24,
            interval: "1m",
            limit: limit
        })
        .then(data => {
            //console.log('fetchCandles ', symbol24, '=>', data);
            for (i = 0; i < limit; i++) {
                
                sumChangesUp = 0;
                sumChangesDown = 0;
                changeUp = 0;
                changeDown = 0;
                smaUp = 0;
                smaDown = 0;
                smmaUp = 0;
                smmaDown = 0;

                rs = 0;
                rsi = 0;

                tempOpen = parseFloat(data[i].open);
                tempClose = parseFloat(data[i].close);
                //console.log(i + " open & close: " + tempOpen + " & " + tempClose);

                if (tempOpen > tempClose){
                    changeUp = 0;
                    changeDown = tempOpen - tempClose;
                } else if (tempOpen < tempClose){
                    changeUp = tempClose - tempOpen;
                    changeDown = 0;
                }

                sumChangesUp = changeUp;
                sumChangesDown = changeDown;
                
                //console.log(i + " changeUp & changeDown: " + changeUp + " & " + changeDown);

                // get SMA - simple moving average
                if (i == limit - rsiPeriod){
                    //console.log('candles at sma=>', candles);
                    for (j = 0; j < rsiPeriod-1; j++){
                        //console.log(i + " sumChangesUp & candles[j].changeUp: " + sumChangesUp + " & " + candles[j].changeUp);
                        //console.log(i + " sumChangesDown & candles[j].changeDown: " + sumChangesDown + " & " + candles[j].changeDown);
                        sumChangesUp += candles[j].changeUp;
                        sumChangesDown += candles[j].changeDown;

                    }
                    //console.log(i + " sumChangesUp & sumChangesDown: " + sumChangesUp + " & " + sumChangesDown);

                    smaUp = sumChangesUp / rsiPeriod;
                    smaDown = sumChangesDown / rsiPeriod;

                    //console.log(i + " smaUp & smaDown: " + smaUp + " & " + smaDown);

                    smmaUp = smaUp;
                    smmaDown = smaDown;
                }

                // get SMMA - simple modified moving average
                if (i > limit - rsiPeriod){
                    smmaUp = ((candles[0].smmaUp * (rsiPeriod-1)) + changeUp) / rsiPeriod;
                    smmaDown = ((candles[0].smmaDown * (rsiPeriod-1)) + changeDown) / rsiPeriod;

                    //console.log(i + " smmaUp & smmaDown: " + smmaUp + " & " + smmaDown);
    
                    // calculate RS
                    rs = smmaUp / smmaDown; 

                    // calculate RSI
                    rsi = 100.0 - 100.0 / (1.0 + rs);

                    //console.log(i + " rs & rsi: " + rs + " & " + rsi);
                }

                tempKline = {
                    // fix the attributes so that REST matches WebSocket
                    close: data[i].close,
                    changeUp: changeUp,
                    changeDown: changeDown,
                    smaUp: smaUp,
                    smaDown: smaDown,
                    smmaUp: smmaUp,
                    smmaDown: smmaDown,
                    rs: rs.toFixed(4),
                    rsi: rsi.toFixed(2),
                    startTime: data[i].openTime,
                    endTime: data[i].closeTime,
                    symbol: symbol24,
                    interval: "1m",
                    firstTradeId: null,
                    final: true,
                    high: data[i].high,
                    ignored: data[i].ignored,
                    lastTradeId: null,
                    low: data[i].low,
                    open: data[i].open,
                    quoteVolume: null,
                    quoteVolumeActive: null,
                    trades: data[i].trades,
                    volume: data[i].volume,
                    volumeActive: null
                }
                candles.unshift(tempKline);
                watchlist.rsi01 = rsi.toFixed(2);
               // watchlistRow.candles.unshift(tempKline);
            }
            //watchlistRow.candles = candles;
        })
        .catch(err => {
            console.error(err);
        });


};



function setBTCPrice(wsdata){
    document.getElementById("btc-symbol").innerHTML = wsdata.symbol;
    btcPriceNow = parseFloat(wsdata.kline.close);
    btcPrice = parseFloat(wsdata.kline.close);
    document.getElementById("btc-price").innerHTML = btcPrice.toFixed(2);

    if (document.getElementById("btc-target-price") != null) {
        targetPrice = document.getElementById("btc-target-price");

        if(btcPrice > targetPrice){
            document.getElementById("btc-target-price").className = "reached-target-price";
        }
    }
};


function setPrice(wsdata, symbolName, precision){
    document.getElementById(`${symbolName}-symbol`).innerHTML = wsdata.symbol;
    
    symbol = wsdata.symbol;
    if (symbol == 'BTCUSDT'){
        btcPriceNow = parseFloat(wsdata.kline.close);
    } else if (symbol == 'BTCUPUSDT') {
        btcupPriceNow = parseFloat(wsdata.kline.close);
    } else if (symbol == 'ETHUSDT') {
        ethPriceNow = parseFloat(wsdata.kline.close);
    } else if (symbol == 'NEOUSDT') {
        neoPriceNow = parseFloat(wsdata.kline.close);
    } else if (symbol == 'LTCUSDT') {
        ltcPriceNow = parseFloat(wsdata.kline.close);
    } else if (symbol == 'BNBUSDT') {
        bnbPriceNow = parseFloat(wsdata.kline.close);
    } else if (symbol == 'ADAUSDT') {
        adaPriceNow = parseFloat(wsdata.kline.close);
    } else if (symbol == 'KAVAUSDT') {
        kavaPriceNow = parseFloat(wsdata.kline.close);
    } else if (symbol == 'EOSUSDT') {
        eosPriceNow = parseFloat(wsdata.kline.close);
    } else if (symbol == 'TRXUSDT') {
        trxPriceNow = parseFloat(wsdata.kline.close);
    } else if (symbol == 'KNCUSDT') {
        kncPriceNow = parseFloat(wsdata.kline.close);
    } 

    tempPrice = parseFloat(wsdata.kline.close);
    document.getElementById(`${symbolName}-price`).innerHTML = tempPrice.toFixed(precision);
};



 
function setChangesAndSwings(wsdata, candles, elementType){

    tempCandle = wsdata.kline;
    candleKeys = Object.keys(candles);

   // console.log("rsi candleKeys=>" + candleKeys);

    changeUp = 0;
    changeDown = 0;
    smaUp = 0;
    smaDown = 0;
    smmaUp = 0;
    smmaDown = 0;
    rs = 0;
    rsi = 0;

    tempOpen = parseFloat(tempCandle.open);
    tempClose = parseFloat(tempCandle.close);

    if (tempOpen > tempClose){
        changeUp = 0;
        changeDown = tempOpen - tempClose;
    } else if (tempOpen < tempClose){
        changeUp = tempClose - tempOpen;
        changeDown = 0;
    } else {
        changeUp = 0;
        changeDown = 0;
        console.log('No price change.');
    }

    //console.log("rsi JSON candles[candleKeys[0]]=>" + JSON.stringify(candles[candleKeys[0]]));
        
    if (candles[candleKeys[0]] != null){
       // console.log("rsi candles[candleKeys[0]].smmaUp=>" + candles[candleKeys[0]].smmaUp);
       // console.log("rsi candles[candleKeys[0]].smmaDown=>" + candles[candleKeys[0]].smmaDown);

        smmaUp = ((candles[candleKeys[0]].smmaUp * (rsiPeriod-1)) + changeUp) / rsiPeriod;
        smmaDown = ((candles[candleKeys[0]].smmaDown * (rsiPeriod-1)) + changeDown) / rsiPeriod;
    }

    // calculate RS
    rs = smmaUp / smmaDown; 
    
    // calculate RSI
    rsi = 100.0 - 100.0 / (1.0 + rs);
    if (rsi != null && document.getElementById("rsi_" + elementType) != null){
       // document.getElementById(`rsi_${elementType}_2`).innerHTML = (candles[candleKeys[1]].rsi);
       // document.getElementById(`rsi_${elementType}_1`).innerHTML = (candles[candleKeys[0]].rsi);
        document.getElementById(`rsi_${elementType}`).innerHTML = rsi.toFixed(1);
       // console.log("rsi candles=>" + candles);
    }

    tempKline = {
        // fix the attributes so that REST matches WebSocket
        close: tempCandle.close,
        changeUp: changeUp,
        changeDown: changeDown,
        smaUp: smaUp,
        smaDown: smaDown,
        smmaUp: smmaUp,
        smmaDown: smmaDown,
        rs: rs.toFixed(4),
        rsi: rsi.toFixed(2),
        startTime: tempCandle.openTime,
        endTime: tempCandle.closeTime,
        symbol: elementType,
        interval: "1m",
        firstTradeId: null,
        final: tempCandle.final,
        high: tempCandle.high,
        ignored: tempCandle.ignored,
        lastTradeId: null,
        low: tempCandle.low,
        open: tempCandle.open,
        quoteVolume: null,
        quoteVolumeActive: null,
        trades: tempCandle.trades,
        volume: tempCandle.volume,
        volumeActive: null
    }

    finalCandle = wsdata.kline.final;

    if(finalCandle){
        candles.unshift(tempKline);
    }

    priceNow = parseFloat(wsdata.kline.close);
    candleKeys = Object.keys(candles);
//    console.log(elementType, ` candles ==>`,  candles);  

    if(sizeObj(candles) > 4){

        // calculate 5 min % change
        price05 = parseFloat(candles[candleKeys[4]].open);
        difference05 = price05 - priceNow;
        average05 = difference05 / price05;
        average05 = average05 * 100;
        average05 = average05.toFixed(2);
//        console.log("average05 =>", average05);
        average05_html = '-.--';
        if (average05 >= 0){
            average05_html = '<font color=\'green\'>' + average05 + '</font>';
        } else if(average05 < 0){
            average05_html = '<font color=\'red\'>' + average05 + '</font>';
        } 
        document.getElementById(`average05_${elementType}`).innerHTML = average05_html;

    }

    if(sizeObj(candles) > 14){

        price15 = parseFloat(candles[candleKeys[14]].open);
        difference15 = price15 - priceNow;
        average15 = difference15 / price15;
        average15 = average15 * 100;
        average15 = average15.toFixed(2);
//        console.log("average15 =>", average15);
        average15_html = '-.--';
        if (average15 >= 0){
            average15_html = '<font color=\'green\'>' + average15 + '</font>';
        } else if(average15 < 0){
            average15_html = '<font color=\'red\'>' + average15 + '</font>';
        }
        document.getElementById("average15_" + elementType).innerHTML = average15_html;

    }

    if(sizeObj(candles) > 29){

        price30 = parseFloat(candles[candleKeys[29]].open);
        difference30 = price30 - priceNow;
        average30 = difference30 / price30;
        average30 = average30 * 100;
        average30 = average30.toFixed(2);
//        console.log("average30 =>", average30);
        average30_html = '-.--';
        if (average30 >= 0){
            average30_html = '<font color=\'green\'>' + average30 + '</font>';
        } else if(average30 < 0){
            average30_html = '<font color=\'red\'>' + average30 + '</font>';
        }
        document.getElementById("average30_" + elementType).innerHTML = average30_html;

    }

    if(sizeObj(candles) > 59){

        price60 = parseFloat(candles[candleKeys[59]].open);
        difference60 = price60 - priceNow;
        average60 = difference60 / price60;
        average60 = average60 * 100;
        average60 = average60.toFixed(2);
//        console.log("average60 =>", average60);
        average60_html = '-.--';
        if (average60 >= 0){
            average60_html = '<font color=\'green\'>' + average60 + '</font>';
        } else if(average60 < 0){
            average60_html = '<font color=\'red\'>' + average60 + '</font>';
        }
        document.getElementById("average60_" + elementType).innerHTML = average60_html;

    }

    candles.length = 61;

    swing05 = getMaxSwing(candles, 4);
    if (swing05 != null){
        document.getElementById("swings05_" + elementType).innerHTML = swing05;
    }
    swing15 = getMaxSwing(candles, 14);
    if (swing15 != null){
        document.getElementById("swings15_" + elementType).innerHTML = swing15;
    }
    swing30 = getMaxSwing(candles, 29);
    if (swing30 != null){
        document.getElementById("swings30_" + elementType).innerHTML = swing30;
    }
    swing45 = getMaxSwing(candles, 44);
    if (swing45 != null){
        document.getElementById("swings45_" + elementType).innerHTML = swing45;
    }
    swing60 = getMaxSwing(candles, 59);
    if (swing60 != null){
        document.getElementById("swings60_" + elementType).innerHTML = swing60;
    }


    
};

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

function handleStreamData(streamData){

    symbol = streamData.symbol;
    watchlistRow = watchlist.find(row => row.symbol === symbol);

    if (watchlistRow == null){
        watchlistRow = {
            symbol: symbol,
            price: 0,
            average24: 0,
            average60: 0,
            average30: 0,
            average15: 0,
            average05: 0,
            swing60: 0,
            swing45: 0,
            swing30: 0,
            swing15: 0,
            swing05: 0,
            rsi01: 0,
            rsi15: 0,
            candles: new Array
        };
        watchlist.push(watchlistRow);
    }

    watchlistRow.price = streamData.kline.close;
    
    calculateAverages(streamData);
    renderCoin(streamData);

}

function renderCoin(watchlistRow){
      

    var existingRow = document.getElementById(`trade_row_${watchlistRow.symbol}`);

    if (existingRow != null){

        price_html = '-.--';
        price = watchlistRow.price;

        if (price >= 0) {
            price_html = '<font color=\'red\'>' + price + '</font>';
        }

        document.getElementById(`watchlist_price_${watchlistRow.symbol}`).innerHTML = price_html;
        document.getElementById(`watchlist_average24_${watchlistRow.symbol}`).innerHTML = watchlistRow.average24;
        document.getElementById(`watchlist_rsi01_${watchlistRow.symbol}`).innerHTML = watchlistRow.rsi01;

    } else {

        // update the page
        var table = document.getElementById("table_watchlist");

        // Create an empty <tr> element and add it to the 3rd position of the table:
        var row = table.insertRow(3);
        row.id = "trade_row_" + watchlistRow.symbol;

        // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
        var cell1 = row.insertCell(0);    // <th>  <td> watchlist_symbol_btc </td>
        var cell2 = row.insertCell(1);    //       <td> watchlist_price_btc </td>
        var cell3 = row.insertCell(2);    //       <td> watchlist_average24_btc </td>
        var cell4 = row.insertCell(3);    //       <td> watchlist_average60_btc </td>
        var cell5 = row.insertCell(4);    //       <td> watchlist_average30_btc </td>
        var cell6 = row.insertCell(5);    //       <td> watchlist_average15_btc </td>
        var cell7 = row.insertCell(6);    //       <td> watchlist_average05_btc </td>
        var cell8 = row.insertCell(7);    //       <td> watchlist_swings60_btc </td>
        var cell9 = row.insertCell(8);    //       <td> watchlist_swings45_btc </td>
        var cell10 = row.insertCell(9);   //       <td> watchlist_swings30_btc </td>
        var cell11 = row.insertCell(10);   //      <td> watchlist_swings15_btc </td>
        var cell12 = row.insertCell(11);   //      <td> watchlist_swings05_btc </td>
        var cell13 = row.insertCell(12);   //      <td> watchlist_rsi01_btc </td>
        var cell14 = row.insertCell(13);   //      <td> watchlist_rsi15_btc </td>
        var cell15 = row.insertCell(14);   //      <td> watchlist_buttons_btc </td>   </th>

        // Add some text to the new cells:
        cell1.innerHTML = watchlistRow.symbol;
        cell1.className = "watchlist_symbol";
        cell1.id        = "watchlist_symbol_" + watchlistRow.symbol;
        
        cell2.innerHTML = watchlistRow.price;
        cell2.className = "watchlist_price";
        cell2.id = "watchlist_price_" + watchlistRow.symbol;

        cell3.innerHTML = watchlistRow.average24;
        cell3.className = "watchlist_average24";
        cell3.id = "watchlist_average24_" + watchlistRow.symbol;

        cell4.innerHTML = watchlistRow.average60;
        cell4.className = "watchlist_average60";
        cell4.id = "watchlist_average60_" + watchlistRow.symbol;

        cell5.innerHTML = watchlistRow.average30;
        cell5.className = "watchlist_average30";
        cell5.id = "watchlist_average30_" + watchlistRow.symbol;

        cell6.innerHTML = watchlistRow.average15;
        cell6.className = "watchlist_average15";
        cell6.id = "watchlist_average15_" + watchlistRow.symbol;

        cell7.innerHTML = watchlistRow.average05;
        cell7.className = "watchlist_average05";
        cell7.id = "watchlist_average05_" + watchlistRow.symbol;

        cell8.innerHTML = watchlistRow.swings60;
        cell8.className = "watchlist_swings60";
        cell8.id = "watchlist_swings60_" + watchlistRow.symbol;

        cell9.innerHTML = watchlistRow.swings45;
        cell9.className = "watchlist_swings45";
        cell9.id = "watchlist_swings45_" + watchlistRow.symbol;

        cell10.innerHTML = watchlistRow.swings30;
        cell10.className = "watchlist_swings30";
        cell10.id = "watchlist_swings30_" + watchlistRow.symbol;

        cell11.innerHTML = watchlistRow.swings15;
        cell11.className = "watchlist_swings15";
        cell11.id = "watchlist_swings15_" + watchlistRow.symbol;

        cell12.innerHTML = watchlistRow.swings05;
        cell12.className = "watchlist_swings05";
        cell12.id = "watchlist_swings05_" + watchlistRow.symbol;

        cell13.innerHTML = watchlistRow.rsi01;
        cell13.className = "watchlist_rsi01";
        cell13.id = "watchlist_rsi01_" + watchlistRow.symbol;

        cell14.innerHTML = watchlistRow.rsi15;
        cell14.className = "watchlist_rsi15";
        cell14.id = "watchlist_rsi15_" + watchlistRow.symbol;
    }
}

    //  <td class="buttons" id="buttons"><button onclick="triggerBuy('BTCUSDT')">buy BTC</button></td>



function calculateAverages(wsdata){

    symbol = wsdata.symbol;
    watchlistRow = watchlist.find(row => row.symbol === symbol);

    tempCandle = wsdata.kline;
    candles = watchlistRow.candles;
    candleKeys = Object.keys(candles);

    // console.log("rsi candleKeys=>" + candleKeys);

    changeUp = 0;
    changeDown = 0;
    smaUp = 0;
    smaDown = 0;
    smmaUp = 0;
    smmaDown = 0;
    rs = 0;
    rsi = 0;

    tempOpen = parseFloat(tempCandle.open);
    tempClose = parseFloat(tempCandle.close);

    if (tempOpen > tempClose){
        changeUp = 0;
        changeDown = tempOpen - tempClose;
    } else if (tempOpen < tempClose){
        changeUp = tempClose - tempOpen;
        changeDown = 0;
    } else {
        changeUp = 0;
        changeDown = 0;
        console.log('No price change.');
    }

    //console.log("rsi JSON candles[candleKeys[0]]=>" + JSON.stringify(candles[candleKeys[0]]));
        
    if (candles[candleKeys[0]] != null){
        // console.log("rsi candles[candleKeys[0]].smmaUp=>" + candles[candleKeys[0]].smmaUp);
        // console.log("rsi candles[candleKeys[0]].smmaDown=>" + candles[candleKeys[0]].smmaDown);

        smmaUp = ((candles[candleKeys[0]].smmaUp * (rsiPeriod-1)) + changeUp) / rsiPeriod;
        smmaDown = ((candles[candleKeys[0]].smmaDown * (rsiPeriod-1)) + changeDown) / rsiPeriod;
    }
    
    // calculate RS
    rs = smmaUp / smmaDown; 
    
    // calculate RSI
    rsi = 100.0 - 100.0 / (1.0 + rs);
    
    tempKline = {
        // fix the attributes so that REST matches WebSocket
        close: tempCandle.close,
        changeUp: changeUp,
        changeDown: changeDown,
        smaUp: smaUp,
        smaDown: smaDown,
        smmaUp: smmaUp,
        smmaDown: smmaDown,
        rs: rs.toFixed(4),
        rsi: rsi.toFixed(2),
        startTime: tempCandle.openTime,
        endTime: tempCandle.closeTime,
        symbol: symbol,
        interval: "1m",
        firstTradeId: null,
        final: tempCandle.final,
        high: tempCandle.high,
        ignored: tempCandle.ignored,
        lastTradeId: null,
        low: tempCandle.low,
        open: tempCandle.open,
        quoteVolume: null,
        quoteVolumeActive: null,
        trades: tempCandle.trades,
        volume: tempCandle.volume,
        volumeActive: null
    }
    
    finalCandle = wsdata.kline.final;

    if(finalCandle){
        candles.unshift(tempKline);
    }
    
    priceNow = parseFloat(wsdata.kline.close);
    candleKeys = Object.keys(candles);
//    console.log(elementType, ` candles ==>`,  candles);  
    
    if(sizeObj(candles) > 4){
        // calculate 5 min % change
        price05 = parseFloat(candles[candleKeys[4]].open);
        difference05 = price05 - priceNow;
        average05 = difference05 / price05 * 100;
//        console.log("average05 =>", average05);
        watchlistRow.average05 = average05.toFixed(2);
    }

    if(sizeObj(candles) > 14){
        price15 = parseFloat(candles[candleKeys[14]].open);
        difference15 = price15 - priceNow;
        average15 = difference15 / price15 * 100;
//        console.log("average15 =>", average15);
        watchlistRow.average15 = average15.toFixed(2);
    }

    if(sizeObj(candles) > 29){
        price30 = parseFloat(candles[candleKeys[29]].open);
        difference30 = price30 - priceNow;
        average30 = difference30 / price30 * 100;
//        console.log("average30 =>", average30);
        watchlistRow.average30 = average30.toFixed(2);
    }

    if(sizeObj(candles) > 59){
        price60 = parseFloat(candles[candleKeys[59]].open);
        difference60 = price60 - priceNow;
        average60 = difference60 / price60 * 100;
//        console.log("average60 =>", average60);
        watchlistRow.average60 = average60.toFixed(2);
    }
    
    candles.length = 61;

    swing05 = getMaxSwing(candles, 4);
    if (swing05 != null){
        watchlistRow.swing05 = swing05;
    }
    swing15 = getMaxSwing(candles, 14);
    if (swing15 != null){
        watchlistRow.swing15 = swing15;
    }
    swing30 = getMaxSwing(candles, 29);
    if (swing30 != null){
        watchlistRow.swing30 = swing30;
    }
    swing45 = getMaxSwing(candles, 44);
    if (swing45 != null){
        watchlistRow.swing45 = swing45;
    }
    swing60 = getMaxSwing(candles, 59);
    if (swing60 != null){
        watchlistRow.swing60 = swing60;
    }
};




function getMaxSwing(candles, range){

    maxSwing = 0.001;

    if (sizeObj(candles) >= range) {
        
        for ( i = 0; i < sizeObj(candles) - 1; i++) {

            // price at start of candle
            price = parseFloat(candles[i].open);

            // get highest within a minute range
            if ( parseFloat(candles[i].high) > parseFloat(candles[i+1].high) ) {
                highestPrice = parseFloat(candles[i].high);
            } else {
                highestPrice = parseFloat(candles[i+1].high);
            }

            // get lowest within a minute range
            if ( parseFloat(candles[i].low) < parseFloat(candles[i].low) ) {
                lowestPrice = parseFloat(candles[i].low);
            } else {
                lowestPrice = parseFloat(candles[i+1].low);
            }

            // calculate range
            priceRange = highestPrice - lowestPrice;
            priceRangePercent = (priceRange / price) * 100;

            // compare for highest swing
            if (priceRangePercent > maxSwing) {
                maxSwing = priceRangePercent;
            }

            // freeze the variables for display
            if (i == range) {
                return maxSwing.toFixed(3);
            }

        }
    }

}

function triggerBuy(symbol){

    if (symbol == 'BTCUSDT'){
        tempPriceNow = btcPriceNow;
        tempTradePrecision = btcTradePrecision;
    } else if (symbol == 'BTCUPUSDT') {
        tempPriceNow = btcupPriceNow;
        tempTradePrecision = btcupTradePrecision;
    } else if (symbol == 'ETHUSDT') {
        tempPriceNow = ethPriceNow;
        tempTradePrecision = ethTradePrecision;
    } else if (symbol == 'NEOUSDT') {
        tempPriceNow = neoPriceNow;
        tempTradePrecision = neoTradePrecision;
    } else if (symbol == 'LTCUSDT') {
        tempPriceNow = ltcPriceNow;
        tempTradePrecision = ltcTradePrecision;
    } else if (symbol == 'BNBUSDT') {
        tempPriceNow = bnbPriceNow;
        tempTradePrecision = bnbTradePrecision;
    } else if (symbol == 'ADAUSDT') {
        tempPriceNow = adaPriceNow;
        tempTradePrecision = adaTradePrecision;
    } else if (symbol == 'KAVAUSDT') {
        tempPriceNow = kavaPriceNow;
        tempTradePrecision = kavaTradePrecision;
    } else if (symbol == 'EOSUSDT') {
        tempPriceNow = eosPriceNow;
        tempTradePrecision = eosTradePrecision;
    } else if (symbol == 'TRXUSDT') {
        tempPriceNow = trxPriceNow;
        tempTradePrecision = trxTradePrecision;
    } else if (symbol == 'KNCUSDT') {
        tempPriceNow = kncPriceNow;
        tempTradePrecision = kncTradePrecision;
    } 


    spendAmount = parseFloat(document.getElementById("target-spend-var").value);
    buyQuantity = spendAmount / tempPriceNow;
//    console.log('buyQuantity =>', buyQuantity);

    buyQuantity = buyQuantity.toFixed(tempTradePrecision);

    console.log('buyAtMarket(symbol, buyQuantity) =>', symbol, buyQuantity);
     
    buyAtMarket(curTrades, symbol, buyQuantity);

};


/*
    {   symbol: "BTCUSDT", 
        orderId: 3252763163, 
        orderListId: -1, 
        clientOrderId: "qEz87fGIcgg1wRfibknaPp", 
        transactTime: 1600705145706, …}
            clientOrderId: "qEz87fGIcgg1wRfibknaPp"
            cummulativeQuoteQty: "15.00053478"
            executedQty: "0.00144200"
            fills: Array(1)
                0:
                    commission: "0.00048384"
                    commissionAsset: "BNB"
                    price: "10402.59000000"
                    qty: "0.00144200"
                    tradeId: 419748825
                __proto__: Object
                length: 1
            __proto__: Array(0)
            orderId: 3252763163
            orderListId: -1
            origQty: "0.00144200"
            price: "0.00000000"
            side: "BUY"
            status: "FILLED"
            symbol: "BTCUSDT"
            timeInForce: "GTC"
            transactTime: 1600705145706
            type: "MARKET"
*/

/**
 * buy at market price
 **/
const buyAtMarket = ( curTrades, symbol, buyQuantity ) => {

    binanceRest.newOrder({
        symbol: symbol,
        side: 'BUY',
        type: 'MARKET',
        quantity: buyQuantity
    })
    .then(data => {
        console.log(data);

        fills = data.fills;
        total_cost = 0.00;
        total_commission = 0.00;
        realQuantity = 0.00;
        commission_asset = 'NA';
        for(i = 0; i < sizeObj(fills); i++){
            //todo proper price for all fills.
            price = parseFloat(fills[i].price);
            temp_cost = price * parseFloat(fills[i].qty);
            //console.log('temp_cost =>', temp_cost);
            total_cost =  total_cost + temp_cost;
            total_commission = total_commission + parseFloat(fills[i].commission);
            commission_asset = fills[i].commissionAsset;
        }

        // subtract commission from asset if not using BNB
        if (data.symbol.startsWith(commission_asset)){
            realQuantity = parseFloat(data.origQty) - total_commission;
            console.log('Real quantity after commission subtracted: ', realQuantity);
        }

        newTrade = {
            symbol:             data.symbol,
            trade_id:           data.orderId,
            order_id:           data.orderId,
            transaction_time:   data.transactTime,
            price:              price,
            orig_qty:           parseFloat(data.origQty),
            executed_qty:       realQuantity,
            status:             data.status,
            time_in_force:      data.timeInForce,
            type:               data.type,
            side:               data.side, 
            trade_status:       'open',
            total_commission:   total_commission,
            commission_asset:   commission_asset,
            cost:               total_cost
        }



        console.log('newTrade =>', newTrade);
        trade.addTrade(newTrade, (err, results)=>{
            if(err){
               console.log(err);
             }
//             console.log('added trade to db =>', results)
        });

        console.log('startNewTrade(newTrade) =>', newTrade);
        startNewTrade(newTrade);
  

    })
    .catch(err => {
        console.error(err);
        newTrade = {
            symbol:             symbol,
            orig_qty:           quantity,
            status:             'failed',
            trade_status:       'failed',
            total_commission:   0,
            commission_asset:   'NA',
            cost:               0
        }
        curTrades.unshift(newTrade);
    });
};


/*
        newTrade = {
            symbol:             data.symbol,
            order_id:           data.orderId,
            transaction_time:   data.transactTime,
            price:              price,
            orig_qty:           parseFloat(data.origQty),
            executed_qty:       realQuantity,
            status:             data.status,
            time_in_force:      data.timeInForce,
            type:               data.type,
            side:               data.side, 
            trade_status:       'open',
            total_commission:   total_commission,
            commission_asset:   commission_asset,
            cost:               total_cost
*/

// function to add a new trade to the array
function startNewTrade( newTrade ){

    // calculate missing values like target sell, and stop loss
    // get stop-loss & target price variables
    stopPriceVar = document.getElementById("stop-price-var").value;
    targetPriceVar = document.getElementById("target-price-var").value;

    // calculate target price for profit
    targetPrice = newTrade.price * targetPriceVar;
    targetPrice = targetPrice.toFixed(2);
    newTrade.profit_price = targetPrice;

    // calculate stop loss price to prevent pain
    stopPrice = newTrade.price * stopPriceVar;
    stopPrice = stopPrice.toFixed(2);
    newTrade.stop_price = stopPrice;

    newTrade.trade_status = 'open';
    
    // update the page
    var table = document.getElementById("orders");


    // Create an empty <tr> element and add it to the 1st position of the table:
    var row = table.insertRow(2);
    row.id = "trade_row_" + newTrade.trade_Id;

    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
    var cell1 = row.insertCell(0);    // <th>  <td> Trade Id </td>
    var cell2 = row.insertCell(1);    //       <td> Pair </td>
    var cell3 = row.insertCell(2);    //       <td> Quantity </td>
    var cell4 = row.insertCell(3);    //       <td> Price </td>
    var cell5 = row.insertCell(4);    //       <td> Remaining Quantity </td>
    var cell6 = row.insertCell(5);    //       <td> Stop </td>
    var cell7 = row.insertCell(6);    //       <td> Current Price </td>
    var cell8 = row.insertCell(7);    //       <td> Target </td>
    var cell9 = row.insertCell(8);    //       <td> Progress< /td>
    var cell10 = row.insertCell(9);   //       <td> Status </td>
    var cell11 = row.insertCell(10);   //       <td> Profit </td>   </th>

    // Add some text to the new cells:
    cell1.innerHTML = newTrade.trade_id;
    cell1.className = "trade_id";
    cell1.id        = "trade_id_" + newTrade.trade_id;
    
    cell2.innerHTML = newTrade.symbol;
    cell2.className = "trade_symbol";
    cell2.id = "trade_symbol_" + newTrade.trade_id;

    cell3.innerHTML = newTrade.orig_qty;
    cell3.className = "trade_orig_quantity";
    cell3.id = "trade_orig_quantity_" + newTrade.trade_id;

    cell4.innerHTML = newTrade.price;
    cell4.className = "trade_price";
    cell4.id = "trade_price_" + newTrade.trade_id;

    cell5.innerHTML = newTrade.executed_qty.toFixed(6);
    cell5.className = "trade_quantity";
    cell5.id = "trade_quantity_" + newTrade.trade_id;

    cell6.innerHTML = newTrade.stop_price;
    cell6.className = "trade_stop";
    cell6.id = "trade_stop_" + newTrade.trade_id;

    cell7.innerHTML = newTrade.price;
    cell7.className = "trade_current_price";
    cell7.id = "trade_current_price_" + newTrade.trade_id;

    cell8.innerHTML = newTrade.profit_price;
    cell8.className = "trade_target";
    cell8.id = 'trade_target_' + newTrade.trade_id;

    cell9.innerHTML = '[---------------------]';
    cell9.className = "trade_progress";
    cell9.id = "trade_progress_" + newTrade.trade_id;

    cell10.innerHTML = newTrade.trade_status;
    cell10.className = "trade_status";
    cell10.id = "trade_status_" + newTrade.trade_id;

    cell11.innerHTML = 0.00;
    cell11.className = "trade_profit";
    cell11.id = "trade_profit_" + newTrade.trade_id;

    // add the trade to global array
    curTrades.unshift( newTrade );

}


// function to check the array for necessary sell orders
function monitorCurrTrades(){

    if (sizeObj(curTrades) > 0){

        for(i = 0; i <sizeObj(curTrades); i++){

            tempTrade = curTrades[i];

            if (tempTrade.trade_status == 'open'){

                if (tempTrade.symbol == 'BTCUSDT'){
                    tempPrice = btcPriceNow;
                } else if (tempTrade.symbol == 'BTCUPUSDT') {
                    tempPrice = btcupPriceNow;
                } else if (tempTrade.symbol == 'ETHUSDT') {
                    tempPrice = ethPriceNow;
                } else if (tempTrade.symbol == 'NEOUSDT') {
                    tempPrice = neoPriceNow;
                } else if (tempTrade.symbol == 'LTCUSDT') {
                    tempPrice = ltcPriceNow;
                } else if (tempTrade.symbol == 'BNBUSDT') {
                    tempPrice = bnbPriceNow;
                } else if (tempTrade.symbol == 'ADAUSDT') {
                    tempPrice = adaPriceNow;
                } else if (tempTrade.symbol == 'KAVAUSDT') {
                    tempPrice = kavaPriceNow;
                } else if (tempTrade.symbol == 'EOSUSDT') {
                    tempPrice = eosPriceNow;
                } else if (tempTrade.symbol == 'TRXUSDT') {
                    tempPrice = trxPriceNow;
                } else if (tempTrade.symbol == 'KNCUSDT') {
                    tempPrice = kncPriceNow;
                } 

                if (tempPrice != 0){
                    if (tempPrice >= tempTrade.profit_price){
                        console.log('sell at profit detected');
                        console.log('tempPrice=', tempPrice, ', tempTrade.profit_price=', tempTrade.profit_price);
                        // sell
                        closeTrade( curTrades, tempTrade.trade_id, true );

                        // update database
                        trade.updateTradeProfit(tempTrade.trade_id, 'monitoring', (err, results)=>{
                            if(err){
                                console.log(err);
                            }
                            console.log('updateTradeProfit =>', results);
                        });
                    }

                    if (tempPrice <= tempTrade.stop_price){
                        console.log('sell at loss detected');
                        console.log('tempPrice=', tempPrice, ', tempTrade.stop_price=', tempTrade.stop_price);
                        // sell
                        closeTrade( curTrades, tempTrade.trade_id, tempTrade.stop_price, false );

                        // update datebase
                        trade.updateTradeLoss(tempTrade.trade_id, 'monitoring', (err, results)=>{
                            if(err){
                                console.log(err);
                            }
                            console.log('updateTradeLoss =>', results);
                        });
                    }
                }

                // assume:                      then:
                //      btc = 10712.58              
                //      target spend = 15           quantity:       0.001400
                //      stop loss = 0.9980          stop price:     10,691.15
                //      profit = 1.0035             target price:   10,750.07
                // loss remainder -\- loss amount -\- start -/- profit amount -/- profit remainder //
                // 
                //      new BTC price: 10,725.78
                //
                //      cost: 14.997612
                //      tempProfitAmount: 0.01848
                tempProfitAmount = (tempTrade.executed_qty * tempPrice) - tempTrade.cost;
                //console.log('tempProfitAmount=>', tempProfitAmount);   

                //      tradeRange = 58.92
                //tradeRange = tempTrade.profit_price - tempTrade.stop_price;
                //tradeRange = tradeRange - tempTrade.cost;
                //      tradeRange = 43.922388
                
                // potentialProfit = 0.052498
                potentialProfit = (tempTrade.executed_qty * tempTrade.profit_price) - tempTrade.cost;
                //console.log('potentialProfit=>', potentialProfit);            
                
                potentialLoss = (tempTrade.executed_qty * tempTrade.stop_price) - tempTrade.cost;
                //console.log('potentialLoss=>', potentialLoss);
                potentialLoss = Math.abs(potentialLoss);
                //console.log('potentialLoss=>', potentialLoss);

                // sanity check potentialProfit + potentialLoss = tradeRange.
                // tradeRange = 0.082488 
                tradeRange = potentialProfit + potentialLoss;
                //console.log('tradeRange=>', tradeRange);

                profitAmount = 0;

                // Calculate:
                // loss remainder -\- loss amount -\- start -/- profit amount -/- profit remainder //
                if (tempProfitAmount < 0){

                    // current price is negative, so flip it.
                    lossAmount = Math.abs(tempProfitAmount);
                    //console.log('lossAmount=>', lossAmount);

                    // first part of status bar is loss remainder.
                    // lossRemainder = potentialLoss = -0.02999 - tempProfitAmount: 0.01848
                    lossRemainder = potentialLoss - lossAmount;
                    //console.log('lossRemainder=>', lossRemainder);

                    // on the side of loss, so no profit.
                    profitAmount = 0;

                    // potentialProfit = 0.052498
                    profitRemainder = potentialProfit;
                    //console.log('profitRemainder=>', profitRemainder);

                    tradingAtLoss = true;
                } else if (tempProfitAmount >= 0){

                    // profitAmount = tempProfitAmount: 0.01848
                    profitAmount = tempProfitAmount;
                    //console.log('profitAmount=>', profitAmount);

                    // profitRemainder = potentialProfit: 0.052498 - tempProfitAmount: 0.01848 = 0.034018
                    profitRemainder = potentialProfit - tempProfitAmount;
                    //console.log('profitRemainder=>', profitRemainder);

                    lossAmount = 0;
                    lossRemainder = potentialLoss;
                    //console.log('lossRemainder=>', lossRemainder);

                    tradingAtLoss = false;
                } else {
                    console.log('ERROR : how did we get here?');
                }


                // get it on a scale of 20, so turn it into %

                // profitAmount = 0.01848 / tradeRange = 0.082488 = 0.224032586
                profitAmount = profitAmount / tradeRange;
                //console.log('profitAmount=>', profitAmount);
                // profitAmount = 0.224032586 * 20 = 4.4806517
                profitAmount = Math.round(profitAmount * 20);
                //console.log('profitAmount=>', profitAmount);

                profitRemainder = profitRemainder / tradeRange;
                //console.log('profitRemainder=>', profitRemainder);
                profitRemainder = Math.round(profitRemainder * 20);
                //console.log('profitRemainder=>', profitRemainder);

                
                lossAmount = lossAmount / tradeRange;
                //console.log('lossAmount=>', lossAmount);
                lossAmount = Math.round(lossAmount * 20);
                //console.log('lossAmount=>', lossAmount);

                
                lossRemainder = lossRemainder / tradeRange;
                //console.log('lossRemainder=>', lossRemainder);
                lossRemainder = Math.round(lossRemainder * 20);
                //console.log('lossRemainder=>', lossRemainder);

                progressString = '[';


                for(j = 1; j < lossRemainder; j++){
                    progressString = progressString + '-';
                }

                if(tradingAtLoss){
                    progressString = progressString + '<font color=red><';
                }

                for(k = 0; k < lossAmount; k++){
                    progressString = progressString + '=';
                }

                if(tradingAtLoss){
                    progressString = progressString + '</font>';
                }

                progressString = progressString + '|';

                if(!tradingAtLoss){
                    progressString = progressString + '<font color=green>';
                }

                for(l = 0; l < profitAmount; l++){
                    progressString = progressString + '=';
                }

                if(!tradingAtLoss){
                    progressString = progressString + '></font>';
                }

                for(m = 0; m < profitRemainder; m++){
                    progressString = progressString + '-';
                }

                progressString = progressString + ']';

                tempProfitAmount = tempProfitAmount.toFixed(2);

                //
                //[-------<=======|----]
                //[-----------<===|----]	
                //[---------------|==>--]	
                //[---------------|====>]
                //
                //[-------<|------------]
                //[------<=|------------]
                //[-------|=>-----------]
                //[-------<|------------]
                //[-------|=>-----------]	
                //[-------|===>---------]	
                //
                //[----<===|------------]	

                document.getElementById("trade_current_price_" + tempTrade.trade_id).innerHTML = tempPrice;
                document.getElementById("trade_progress_" + tempTrade.trade_id).innerHTML = progressString;
                document.getElementById("trade_profit_" + tempTrade.trade_id).innerHTML = tempProfitAmount;
            }
        }
    } else {
        //console.log('no trades to monitor');
    }

}



// function to sell a trade at a loss or profit
function closeTrade( curTrades, tradeId, price, profitInd ){

    // sell the trade
    // handle both profit and loss
    //find the trade to close
    objIndex = curTrades.findIndex(obj => obj.trade_id === tradeId);
    symbol = curTrades[objIndex].symbol;

    if (symbol == 'BTCUSDT'){
        tempTradePrecision = btcTradePrecision;
    } else if (symbol == 'BTCUPUSDT') {
        tempTradePrecision = btcupTradePrecision;
    } else if (symbol == 'ETHUSDT') {
        tempTradePrecision = ethTradePrecision;
    } else if (symbol == 'NEOUSDT') {
        tempTradePrecision = neoTradePrecision;
    } else if (symbol == 'LTCUSDT') {
        tempTradePrecision = ltcTradePrecision;
    } else if (symbol == 'BNBUSDT') {
        tempTradePrecision = bnbTradePrecision;
    } else if (symbol == 'ADAUSDT') {
        tempTradePrecision = adaTradePrecision;
    } else if (symbol == 'KAVAUSDT') {
        tempTradePrecision = kavaTradePrecision;
    } else if (symbol == 'EOSUSDT') {
        tempTradePrecision = eosTradePrecision;
    } else if (symbol == 'TRXUSDT') {
        tempTradePrecision = trxTradePrecision;
    } else if (symbol == 'KNCUSDT') {
        tempTradePrecision = kncTradePrecision;
    } 


    sellQuantity = curTrades[objIndex].executed_qty;
    sellQuantity = sellQuantity.toFixed(tempTradePrecision);


    //symbol, sellPrice, quantity, orderId, profitInd
    sellAtMarket(curTrades, symbol, sellQuantity, tradeId, profitInd);

    //update the trade to reflect as closed
    curTrades[objIndex].trade_status = 'closing';

    //update the UI
    document.getElementById(`trade_status_${tradeId}`).innerHTML = 'closing';

}





/**
 * LIMIT SELL order with callback
 **/
const sellAtLimit = (symbol, sellPrice, quantity, orderId, profitInd) => {

    binanceRest.newOrder({
        symbol: symbol,
        side: 'SELL',
        type: 'LIMIT',
        timeInForce: 'GTC',
        quantity: quantity,
        price: sellPrice
    })
    .then(data => {
        console.info("Limit Sell response =>", data);

        fills = data.fills;
        total_cost = 0.00;
        total_commission = 0.00;
        commission_asset = 'NA';

        for(i = 0; i < sizeObj(fills); i++){
            //todo proper price for all fills.
            price = parseFloat(fills[i].price);
            temp_profit = price * parseFloat(fills[i].qty);
            //console.log('temp_cost =>', temp_cost);
            total_profit =  total_profit + temp_profit;
            total_commission = total_commission + parseFloat(fills[i].commission);
            commission_asset = fills[i].commission_asset;
        }

        closeTrade = {
            order_id:           orderId,
            stop_price:         0.00,
            profit_price:       0.00,
            sold_qty:           data.quantity,
            trade_status:       'closed',
            total_commission:   data.total_commission,
            cost:               data.commission_asset }

            if (profitInd){
                closeTrade.profit_price = total_profit;
            } else {
                closeTrade.stop_price = total_profit;
            }

        //add trade response to database
        response = trade.updateTrade(closeTrade);
        console.info('response from trade.updateTrade =>', response);

    })
    .catch(err => {
        console.error(err);
        newTrade = {
            symbol:             symbol,
            orig_qty:           quantity,
            status:             'failed',
            trade_status:       'failed',
            total_commission:   0,
            commission_asset:   'NA',
            cost:               0
        }
        curTrades.unshift(newTrade);

    });


};

/**
 * Market SELL order with callback
 **/
const sellAtMarket = (curTrades, symbol, sellQuantity, orderId, profitInd) => {

    binanceRest.newOrder({
        symbol: symbol,
        side: 'SELL',
        type: 'MARKET',
        quantity: sellQuantity
    })
    .then(data => {
        console.info("Market Sell response =>", data);

        objIndex = curTrades.findIndex(obj => obj.trade_id === orderId);    
        total_commission = curTrades[objIndex].total_commission;

        total_profit = 0.00;
        sold_qty = 0.00;
        commission_asset = 'NA';

        fills = data.fills;

        for(i = 0; i < sizeObj(fills); i++){
            //todo proper price for all fills.
            price = parseFloat(fills[i].price);
            temp_profit = price * parseFloat(fills[i].qty);
            //console.log('temp_cost =>', temp_cost);
            total_profit =  total_profit + temp_profit;
            total_commission = total_commission + parseFloat(fills[i].commission);
            commission_asset = fills[i].commission_asset;
            sold_qty = sold_qty + fills[i].qty;
            
            //subtract commission from quantity? not necessary because price reflects it
        }

        if (profitInd){
            tempProfitPrice = price;
            tempStopPrice = 0.00;
        } else {
            tempProfitPrice = 0.00;
            tempStopPrice = price;
        }

        closeTrade = {
            order_id:           orderId,
            stop_price:         tempStopPrice,
            profit_price:       tempProfitPrice,
            sold_qty:           sold_qty,
            trade_status:       'closed',
            total_commission:   total_commission,
            sell_return:        total_profit,
            sell_time:          data.transactTime }

        //add trade response to database

        console.log('closeTrade =>', closeTrade);
        trade.updateTrade(closeTrade, (err, results)=>{
            if(err){
               console.log(err);
             }
             //console.log('added trade to db =>', results)
        });

        document.getElementById('trade_status_', orderId).innerHTML = 'closed';


    })
    .catch(err => {
        console.error(err);
        newTrade = {
            symbol:             symbol,
            orig_qty:           sellQuantity,
            status:             'failed',
            trade_status:       'failed',
            total_commission:   0,
            commission_asset:   'NA',
            cost:               0
        }
    });


};


function sizeObj(obj) {
    return Object.keys(obj).length;
};

//fetch24hrChange();

jq(document).ready(function() {


    setInterval(function() { fetch24hrChange("BTCUSDT", btcAcronym); }, 3500);
/*    setInterval(function() { fetch24hrChange("BTCUPUSDT", btcupAcronym); }, 7000);
    setInterval(function() { fetch24hrChange("ETHUSDT", ethAcronym); }, 3500);
    setInterval(function() { fetch24hrChange("LTCUSDT", ltcAcronym); }, 3500);
    setInterval(function() { fetch24hrChange("NEOUSDT", neoAcronym); }, 3500);
    setInterval(function() { fetch24hrChange("BNBUSDT", bnbAcronym); }, 3500);
    setInterval(function() { fetch24hrChange("KAVAUSDT", kavaAcronym); }, 3500);
    setInterval(function() { fetch24hrChange("KNCUSDT", kncAcronym); }, 3500);
    setInterval(function() { fetch24hrChange("ADAUSDT", adaAcronym); }, 3500);
    setInterval(function() { fetch24hrChange("EOSUSDT", eosAcronym); }, 3500);
    setInterval(function() { fetch24hrChange("TRXUSDT", trxAcronym); }, 3500); */

    setInterval(function() { monitorCurrTrades(); }, 2000);

    fetchCandles("BTCUSDT",btcCandles,60);
/*    fetchCandles("BTCUPUSDT",btcupCandles,60);
    fetchCandles("ETHUSDT",ethCandles,60);
    fetchCandles("LTCUSDT",ltcCandles,60);
    fetchCandles("NEOUSDT",neoCandles,60);
    fetchCandles("BNBUSDT",bnbCandles,60);
    fetchCandles("KAVAUSDT",kavaCandles,60);
    fetchCandles("KNCUSDT",kncCandles,60);
    fetchCandles("ADAUSDT",adaCandles,60);
    fetchCandles("TRXUSDT",trxCandles,60);
    fetchCandles("EOSUSDT",eosCandles,60); */

    //setInterval(function() { fetchRSI(btcCandles, 14); }, 2000);

});
