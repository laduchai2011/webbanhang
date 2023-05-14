require('dotenv').config();

const sqlParameter = {
    user: process.env.SQLCONFIG_USER,
    password: process.env.SQLCONFIG_PASSWORD,
    database: process.env.SQLCONFIG_DATABASE,
    server: process.env.SQLCONFIG_SERVER,
    port: Number(process.env.SQLCONFIG_PORT)
}

const redisParameter = {
    user: process.env.REDISCONFIG_USER,
    password: process.env.REDISCONFIG_PASSWORD,
    server: process.env.REDISCONFIG_SERVER,
    port: Number(process.env.REDISCONFIG_PORT)
}

module.exports = { sqlParameter, redisParameter }