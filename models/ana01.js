'use strict';

const mysql = require('../connections/mysql');

/**
 * Returns top ana01 patterns
 */
module.exports.getTopAna01Patterns = function(callback){
    const query = `Select 
                    min_01_ind, min_02_ind, min_03_ind, min_04_ind, min_05_ind, 
                    min_06_ind, min_07_ind, min_08_ind, min_09_ind, min_10_ind, 
                    min_11_ind, min_12_ind, min_13_ind, min_14_ind, min_15_ind, occurance
                    from ana01 
                    order by occurance desc 
                    limit 10`;
    const params = [];
    mysql.pool.query(query, params, (err, rows)=>{
        if(err){
            return callback(err);
        }
        console.log(`result==>`, rows);        
        callback(null, rows);
    });
}