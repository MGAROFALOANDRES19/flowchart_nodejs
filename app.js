var express = require('express')
var router = express.Router();
var bodyParser = require('body-parser')


var app = express()
 
var flowcharts = require('./routes/flowcharts');



app.use(express.static('public')) //seteo la ruta de mis archivos estaticos

//add handlebars view engine
var handlebars = require('express-handlebars')
	.create({defaultLayout: 'main'});  //default handlebars layout page

app.engine('handlebars', handlebars.engine); //motor de vistas
app.set('view engine', 'handlebars'); //sets express view engine to handlebars


app.use(bodyParser.urlencoded({ extended: false }));


app.use('/', flowcharts);


app.use(function(req,res){
  res.status(404);
  res.render('404');
});

 



app.set('port',process.env.PORT || 3000,  process.env.IP || '0.0.0.0', function(){
    console.log(app.get('port'));
    
  console.log('Example app listening on port 3000!')
});

app.listen(app.get('port'), function () {
    console.log(app.get('port'));
  console.log('Example app listening on port 3000!')
});

module.exports = app;