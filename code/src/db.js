// 连接配置文件
var mysql = require('mysql');

// 连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'yzy221229',
  database: 'authentic_sys'
});

module.exports = pool;