$(function() {
    /* OBJETOS */
    /* Objeto USUARIO */    
    class User {
        constructor(username, email, password){
            this.username = username;
            this.email = email;
            this.password = password;
        }
    }
    
    
    /* FUNCIONES PARA SU FUTURO USO */
    /* FUNCION PARA OBTENER QUERYS DE LA URL   */  
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
    
    /* ANIMACIONES Y CARGOS A LA URL */
    /* carga el nombre de usuario en el saludo "BIENVENIDO" o en el Regresar*/

    $('#username').text(getQueryVariable("username"));
    $('#regresar').attr('href',$('#regresar').attr('href')+getQueryVariable("username"));
    $('#new').click(function(){
        
        /*window.location.href = "draw?title="+$('#title').val()+;*/
        $('#newForm').attr('action','draw?username='+getQueryVariable("username"));
        $('#newForm').submit();
    });
    
    $('#color1').click(function(){
       $('#myDiagramDiv').css('background-color', '#b8ecdd');
    });
    
    $('#color2').click(function(){
       $('#myDiagramDiv').css('background-color', '#f4cc83');
    });
    
    $('#color3').click(function(){
       $('#myDiagramDiv').css('background-color', '#d9c9e3');
    });
    
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
    
    // VALIDACIONES DE FORMULARIOS
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
    
    
    
    $('#SaveButton').click(function(){
        $('#saveLoad').attr('action','save?title='+ getQueryVariable("title") +'&username='+getQueryVariable("username")+'&color='+$('#myDiagramDiv').css("background-color"));
        console.log($('#myDiagramDiv').css("background-color"));
        $('#saveLoad').submit();
    })
    
});

