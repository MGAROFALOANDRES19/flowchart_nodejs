$(function() {
    
    
   
    
    var data = JSON.parse(localStorage.getItem("users"));
       
    function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}    
    /* carga el user*/
    console.log(getQueryVariable("username"));
    $('#username').text(getQueryVariable("username"));
    /*$('#loadDiagram').attr('href',$('#loadDiagram').attr('href')+getQueryVariable("username"));
    console.log($('#loadDiagram').attr('href'));*/
    /*carga los draws*/
        $.each(data, function(i, item) {
            console.log(getQueryVariable("username"));
            if(item.username == getQueryVariable("username")){
            if(i = "flowcharts"){
                $.each(item.flowcharts, function(i2, item2) {
                    
                   
                    try {
                        console.log(item2.title);
                        if(item2.title != ""){
                            console.log("yes");
                            $('#mydraws').append('<div class="col-xs-12 col-sm-6 col-md-3"><a href="draw?title='+ item2.title +'&username='+ getQueryVariable("username") +'"><div class="panel panel-default"><div class="panel-heading">'+ item2.title +'</div> <div class="panel-image"><img src="/img/powerpoint-flowchart.png" class="panel-image-preview" /></div><div class="panel-body"><h4>Creado el</h4></div></a></div></div>');
                        }
                    }
catch(err) {
    console.log("there is not title");
}
                    $('#mySavedModel').val(JSON.stringify(item2.model));
                });
               }
            }
        });
       
       /*carga el titulo*/ 
       $.each(data, function(i, item) {
            if(i = "flowcharts"){
                $.each(item.flowcharts, function(i2, item2) {
                    
                   
                    try {
    item2.title = getQueryVariable("title");
}
catch(err) {
    console.log("there is not title");
}
                    $('#mySavedModel').val(JSON.stringify(item2.model));
                });
               }
        });
        
    
    $('.panel-image img.panel-image-preview').on('click', function(e) {
        $(this).closest('.panel-image').toggleClass('hide-panel-body');
    });
    
    var myJSON = "";
    var users = [];
    
    
    class User {
        constructor(username, email, password){
            this.username = username;
            this.email = email;
            this.password = password;
        }
    }
    
    $('#login-form-link').click(function(e) {
		$("#login-form").delay(100).fadeIn(100);
 		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#register-form-link').click(function(e) {
		$("#register-form").delay(100).fadeIn(100);
 		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
    
    // validate signup form on keyup and submit
		$("#register-form").validate({
			rules: {
				username_r: {
					required: true,
					minlength: 2
				},
				password_r: {
					required: true,
					minlength: 5
				},
				confirm_password: {
					required: true,
					minlength: 5,
					equalTo: "#password_r"
				},
				email: {
					required: true,
					email: true
				}
			},
			messages: {
				username: {
					required: "Please enter a username",
					minlength: "Your username must consist of at least 2 characters"
				},
				password: {
					required: "Please provide a password",
					minlength: "Your password must be at least 5 characters long"
				},
				confirm_password: {
					required: "Please provide a password",
					minlength: "Your password must be at least 5 characters long",
					equalTo: "Please enter the same password as above"
				},
				email: "Please enter a valid email address"
			}
		});
    
    
    $('#register-submit').click(function(){
        
        window.location.href = "login"
        
    });
    
    $('#login-submit').click(function(){
        
       window.location.href = "mydraws"
        
    });
    
    $('#new').click(function(){
        
        /*window.location.href = "draw?title="+$('#title').val()+;*/
        $('#newForm').attr('action','draw?username='+getQueryVariable("username"));
        $('#newForm').submit();
    });
    
    $('#SaveButton').click(function(){
        $('#saveLoad').attr('action','save?title='+ getQueryVariable("title") +'&username='+getQueryVariable("username"));
        $('#saveLoad').submit();
    })
    
    /*$('#SaveButton').click(function(){
        
    })*/
    
 

});


/*$('#loadDiagram').click(function(){
     window.location.href = '/draw?title='+ getQueryVariable("title") +'&username='+getQueryVariable("username");
})*/