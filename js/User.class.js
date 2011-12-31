function User(override, usernameArg){
	var username = null;

	this.loginWindow = function(type, usernameArg){
		if(type == 'show' && username == null){
			$('#loginWindow form').css('display', 'block');
		} else if (type == 'hide'){
			$('#loginWindow form').css('display', 'none');
			$('#loginWindow form').children('.username').val('');
			$('#loginWindow form').children('.password').val('');
			
			if(usernameArg !== undefined){
				username = usernameArg;
				$('#user').append('<a></a>').children('a')
					.attr('href', '#/user/'+username).text(username);
				window.hash.back();
			}
			
			if(username !== null){
				//display username with a "settings" and a "logout" button
				$('#loginWindow').css('display', 'none');
				$('#user').css('display', 'inline');
			}
		}
	}
	
	//Initialize
	if(override == 'override'){
		this.loginWindow('hide', usernameArg);
	} else {
		$.ajax({
			type: 'get',
			async: true,
			cache: false,
			url: 'api/user.php',
			dataType: 'xml',
			success: function(data, success){
				if($(data).find('user').find('username').text()){
					window.user.loginWindow('hide', $(data).find('user').find('username').text());
				} else{
					username = null;
				}
			}
		});
	}
	
	this.login = function(usernameArg, passwordArg){
		//check to see if user is logged in
		$.ajax({
			type: 'post',
			async: true,
			cache: false,
			url: 'api/user.php?login',
			data: {username:usernameArg,password:passwordArg},
			dataType: 'xml',
			success: function(data, success){
				if($(data).find('username').text() == usernameArg){
					window.user.loginWindow('hide', usernameArg);
				} else {
					//do something to show unsuccessful login
					$('#loginWindow form').children('.error_message').css('opacity', '1.0').delay(1000).animate({ opacity: 0 });
				}
			}
		});
	}
	
	this.logout = function(){
		$.ajax({
			type: 'get',
			async: true,
			cache: false,
			url: 'api/user.php?logout',
			dataType: 'xml',
			success: function(data, success){
				if(!$(data).find('user').find('username').text()){
					username = null;
					$('#loginWindow').css('display', 'inline');
					$('#user').css('display', 'none').empty();
					
				}
			}
		});
	}
	
	this.resetPassword = function(){
		
	}
	
	
	this.isLoggedIn = function(){
		if(username === null)
			return false;
		else
			return true;
	}
	
	this.getUsername = function(){
		return username;
	}
}