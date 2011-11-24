var statusCodeArr = new Array();
statusCodeArr[0] = 'Currently logged in';
statusCodeArr[1] = 'Login Successful';
statusCodeArr[2] = 'Please log in below';
statusCodeArr[3] = 'Invalid username or password';

function createLogIn(statusCode){
	var ele = $('<div></div>');
	
	ele.append('<div class="close">X</div>');
	
	ele.append('<div>'+statusCodeArr[statusCode]+'</div>');	
	ele.append('<label for="login_username">Username:</label>')
		.append('<input type="text" id="login_username" name="username" />')
		.append('<label for="login_password">Password:</label>')
		.append('<input type="password" id="login_password" name="password" />')
		.append('<div style="clear:both;"></div>')
		.append('<input type="button" class="button" value="Log in" />')
		.append('<div style="clear:both"></div>');
		
	ele.children('.button').click(function(){
		//submit login
		var sendData = {username: $(this).parent().children('.username').val(),
						password: $(this).parent().children('.password').val()
						};

		onCreateNewForm(sendData);
		
	});
	
	return ele.children();
}

function userValidate(cred, callback){
	if (cred == null){
		cred = {};
	}
	
	var username;
	
	ajax({
		type: 'post',
		url: 'api/user.php',
		data: cred,
		success: function(data, success){
			var username = '';
			var errorCode;
			if($(data).find('error').length){
				username = null;
				errorCode = $(data).find('error').attr('errorcode');
			}
			else {
				username = $(data).find('user').find('username').text();
				errorCode = 0;
			}
			
			callback(username, errorCode);
		}
	});
	
	
}
