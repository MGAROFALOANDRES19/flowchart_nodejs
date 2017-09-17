//mysql 
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 100, //focus it
    host : 'localhost',
    user : 'marco77713',
    password : '',
    database : 'flowcharts'
});
module.exports=pool;
