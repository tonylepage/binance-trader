'use strict';

const mysql = require('mysql');

class MySql{
    constructor(){
        this.pool = mysql.createPool({
            connectionLimit: 50,
            connectTimeout: 60 * 60 * 1000,
            aquireTimeout: 60 * 60 * 1000,
            timeout: 60 * 60 * 1000,
            host: 'localhost',
            user: 'USER',
            password: 'PASSWORD',
            database: 'DATABASE'
        });
    }
}

module.exports = new MySql();