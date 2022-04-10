'use strict';

const mysql = require('../connections/mysql');




module.exports.addTrade = function(data, callback){
    const query = `INSERT into trade (
                    symbol,     
                    order_id,       
                    transaction_time,   
                    price, 
                    orig_qty,
                    executed_qty,
                    status,     
                    time_in_force,  
                    type,               
                    side, 
                    trade_status,       
                    total_commission, 
                    commission_asset, 
                    cost)
                    VALUES (
                        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [    data.symbol,        
                        data.order_id,      
                        data.transaction_time,   
                        data.price, 
                        data.orig_qty,  
                        data.executed_qty,
                        data.status,        
                        data.time_in_force, 
                        data.type,               
                        data.side, 
                        data.trade_status,       
                        data.total_commission, 
                        data.commission_asset, 
                        data.cost ];
    console.log('query =>', query);
    console.log('params =>', params);

    mysql.pool.query(query, params, (err, result)=>{
        if(err){
            return callback(err);
        }
        console.log(`addTrade mysql result =>`, result);        
        callback(null, result);
    });
}

/**
 * Updates book stock
 */
module.exports.updateTrade = function(data, callback){
    const query = `UPDATE trade 
                    SET
                        symbol = ?,
                        transaction_time = ?,
                        price = ?, 
                        orig_qty = ?,
                        status = ?,
                        time_in_force = ?,
                        type = ?,
                        side = ?,
                        trade_status = ?,
                        total_commission = ?,
                        commission_asset = ?,
                        cost = ?,
                        sell_return = ?,
                        sell_time = ? 
                        where order_id = ?`;
    const params = [data.symbol, data.transaction_time, 
        data.price, data.orig_qty, data.status, data.time_in_force, 
        data.type, side, data.trade_status, data.total_commission, 
        data.commission_asset, data.cost, data.sell_return, data.sell_time, data.order_id];
    mysql.pool.query(query, params, (err, result)=>{
        if(err){
            return callback(err);
        }
        console.log(`updateTrade mysql result =>`, result);        
        callback(null, result);
    });
}

/**
 * Updates book stock
 */
module.exports.updateTradeStatus = function(order_id, status, callback){
    const query = `UPDATE trade 
                    SET trade_status = ?
                    WHERE id = ?`;
    const params = [ status, order_id] ;
    mysql.pool.query(query, params, (err, result)=>{
        if(err){
            return callback(err);
        }
        console.log(`updateTradeStatus result =>`, result);        
        callback(null, result);
    });
}

/**
 * Updates book stock
 */
module.exports.updateTradeLoss = function(data, callback){
    const query = `UPDATE trade 
                    SET 
                        stop_price = ?,
                        sold_qty = ?,
                        trade_status = ?
                        total_commission += ?
                    WHERE id = ?`;
    const params = [ data.stop_price, data.sold_qty, data.trade_status, 
                    data.total_commission, data.order_id] ;
    mysql.pool.query(query, params, (err, result)=>{
        if(err){
            return callback(err);
        }
        console.log(`updateTradeLoss result =>`, result);        
        callback(null, result);
    });
}

/**
 * Updates book stock
 */
module.exports.updateTradeProfit = function(data, callback){
    const query = `UPDATE trade 
                    SET 
                        profit_price = ?,
                        sold_qty = ?,
                        trade_status = ?
                        total_commission += ?
                    WHERE id = ?`;
    const params = [ data.profit_price, data.sold_qty, data.trade_status, 
                    data.total_commission, data.order_id] ;
    mysql.pool.query(query, params, (err, result)=>{
        if(err){
            return callback(err);
        }
        console.log(`updateTradeProfit result =>`, result);        
        callback(null, result);
    });
}

/**
 * Returns top ana01 patterns
 */
module.exports.getTrades = function(callback){
    const query = `SELECT 
                    id,         symbol,     order_id,       transaction_time,   price, 
                    orig_qty,   status,     time_in_force,  type,               side, 
                    stop_price, profit_price, sold_qty,     trade_status,       total_commission, 
                    commission_asset, cost
                    FROM trade 
                    WHERE trade_status is NULL
                    ORDER BY transaction_time DESC`;
    const params = [];
    mysql.pool.query(query, params, (err, rows)=>{
        if(err){
            return callback(err);
        }
        console.log(`getTrades results ==>`, rows);        
        callback(null, rows);
    });
}

