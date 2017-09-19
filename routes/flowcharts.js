var express = require('express');
var router = express.Router();
var pool = require('../dbconnection');
var auth = false;

/* GET users listing. */

////----******* POST LOGIN ***********----- envia informacion////
router.post('/login', function(req,res){
    
   pool.getConnection(function(error,conn){
       
       var queryString = "insert into users(username,email,password) values('"+req.body.username_r+"','"+req.body.email+"','"+req.body.password_r+"')";
       
       conn.query(queryString,function(error,results){
           if(error)
               {
                   throw error;
               }
           else 
               {
                 auth=false;
                 res.render('login', {sesion:'Login'});
               }
           
       });
    
       conn.release();
   }); 
    
});

////----******* GET LOGIN ***********-----/ trae la informacion///

router.get('/login', function(req,res){
    auth=false;
  res.render('login', {sesion:'Login'});
});

////----******* POST MYDRAWS ***********-----////
router.post('/mydraws', function(req,res){

   pool.getConnection(function(error,conn){
       var queryString = "SELECT count(*) FROM users WHERE (username='"+req.body.username+"') AND (password='"+req.body.password+"')";
       conn.query(queryString,function(error,results){
           if(error)
               {
                   throw error;
               }
           else 
               {
                
                 if(results.length > 0 && results.length < 2){                 
                     auth = true;
                     res.redirect('mydraws?username=' + req.body.username);
                 }
                 else{
                     res.redirect('login');
                 }
               }
       });
       conn.release();
   });
});

////----******* GET MYDRWAS***********-----////
router.get('/mydraws', isAuthenticated ,function(req,res){
    pool.getConnection(function(error,conn){
       var queryString = "select * from flowcharts where users_username = '"+req.query.username+"'";
       conn.query(queryString,function(error,results){
           if(error)
               {
                   throw error;
               }
           else 
               {
                   
                   res.render('mydraws',{data:results,sesion:'Logout',error:null});
                 
               }
       });
       conn.release();
   });
})

////----******* POST DRAW ***********-----////
router.post('/draw', isAuthenticated, function(req,res){
    var data = '{"class":"go.GraphLinksModel","linkFromPortIdProperty":"fromPort","linkToPortIdProperty":"toPort","nodeDataArray":[],"linkDataArray":[]}'; //crea un modelo vacio
    
   pool.getConnection(function(error,conn){
       
       var queryString = "insert into flowcharts(title,users_username, model) values('"+req.body.title+"', '"+ req.query.username +"', '"+ data +"')";
       
       conn.query(queryString,function(error,results){
           if(error)
               {
                   throw error;
               }
           else 
               {
                 res.redirect('draw?title='+req.body.title+'&username='+req.query.username);
               }
           
       });
    
       conn.release();
   }); 
    
});
////----******* GET DRAWS ***********-----////
router.get('/draw', isAuthenticated, function(req,res){
    pool.getConnection(function(error,conn){
       
       var queryString = "select * from flowcharts where users_username = '"+req.query.username+"' and title='"+req.query.title+"'";
       
       conn.query(queryString,function(error,results){
           if(error)
               {
                   throw error;
               }
           else 
               {
                   
                   res.render('draw',{data:results,regresar:'Atras',sesion:'Logout', onload: 'onload="init()"' ,error:null});
                 //res.render('mydraws');
               }
           
       });
    
       conn.release();
   });
  
});


router.get('/', function(req,res){
  res.render('home', {sesion:'Login'});
});

router.post('/save', isAuthenticated, function(req,res){
     pool.getConnection(function(error,conn){
         
       console.log(req.query.color);
       var queryString = "update flowcharts set model='"+ req.body.mySavedModel +"', color='"+ req.query.color +"' where title='"+ req.query.title +"' and users_username='"+ req.query.username +"'";
       
       conn.query(queryString,function(error,results){
           if(error)
               {
                   throw error;
               }
           else 
               {
                 res.redirect('draw?title='+req.query.title+'&username='+req.query.username);//te redirecciona a una nueva url
               }
           
       });
    
       conn.release();
   }); 
    
});


////////////////////////////////**************************REST**************************////////////////////
router.get('/flowcharts/:title',function(req,res,next){

if(req.params.title){
    
    pool.query("select * from flowcharts where title='"+ req.params.title +"'",function(err,rows){

        if(err)
        {
            res.json(err);
        }
        else{
            res.json(rows);
        }
    });
}
});
router.post('/flowcharts/:title/:users_username/:models',function(req,res,next){

if(req.params){
    
    pool.query("insert into flowcharts(title,users_username, model) values('"+ req.params.title +"', '"+ req.params.users_username +"', '"+ req.params.models+"')",function(err,rows){

        if(err)
        {
            res.json(err);
        }
        else{
            res.json(rows);
        }
    });
}
});

router.delete('/flowcharts/:title',function(req,res,next){

if(req.params.title){
    
    pool.query("delete from flowcharts where title='"+ req.params.title +"'",function(err,rows){
        if(err)
        {
            res.json(err);
        }
        else{
            res.json(rows);
        }
    });
}
});

router.put('/flowcharts/:title/:users_username/:models',function(req,res,next){

if(req.params){
    
    pool.query("update flowcharts set users_username='"+req.params.users_username+"', model='"+ req.params.models+"' where  title='" +  req.params.title +"'",function(err,rows){

        if(err)
        {
            res.json(err);
        }
        else{
            res.json(rows);
        }
    });
}
});






router.get('/flowcharts',function(req,res,next){


    pool.query("select * from flowcharts",function(err,rows){

        if(err)
        {
            res.json(err);
        }
        else{
            res.json(rows);
        }
    });

});

escape = function (str) {
  return str
    .replace(/[\/n]/g, '')
    .replace(/[\r]/g, '')
    .replace(/[\/r]/g, 'r')
    .replace(/[\n]/g, '')
    
    .replace(/[\\]/g, '')
    .replace(/[\/]/g, '')
    .replace(/[\b]/g, '')
    .replace(/[\f]/g, '')
    .replace(/[\t]/g, '');
};

router.get('/colors',function(req,res,next){


    pool.getConnection(function(error,conn){
       
       var queryString = "select model from flowcharts";
       
       conn.query(queryString,function(error,results){
           if(error)
               {
                   throw error;
               }
           else 
               {
                   str = "";
                   str2 = ""
                   for (var i in results){
                       str = str+escape(JSON.stringify(results[i].model));
                   }
                   if(str.search("blue")){
                       str2 += "blue, ";
                   }
                   
                   if(str.search("red")){
                       str2 += "red, ";
                   }
                   
                   if(str.search("green")){
                       str2 += "green, ";
                   }
                   
                  if(str.search("white") > 0){
                       str2 += "white,";
                   }
                   
                   if(str.search("#ff0099")){
                       str2 += "#ff0099";
                   }
                       
                       //obj = JSON.parse(str.slice(1, -1));
                       res.send(str2);
                   
                   
                 //res.render('mydraws');
               }
           
       });
    
       conn.release();
   });

});


function isAuthenticated(req, res, next) {

    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    if (auth == true)
        return next();

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/login');
}


module.exports = router;

