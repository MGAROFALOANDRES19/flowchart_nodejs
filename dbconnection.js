//mysql 
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 100, //focus it
    host : 'localhost',
    user : '',
    password : '',
    database : 'flowcharts'
    
    
});
module.exports=pool;
