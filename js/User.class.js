function User(override, usernameArg){
	var username = null;
	var postList = null;

	var userDropdown = function(){
		//If this function hasn't been called yet
		$('#loginWindow').hide();
		$('#user').css('display', 'inline');
		$('#userDropdown').css('display', 'none');
		if($('#user > a').text() != username){
			$('#user > a').text(username)
				.click(function(){
					if($('#userDropdown').css('display') == 'none'){
						$('#userDropdown').css('display', 'block');	
					}else{
						$('#userDropdown').css('display', 'none');
					}
				});
		}
	}

	this.loginWindow = function(type, error){
		if(type == 'show' && username == null){
			$('#loginWindow form').css('display', 'block');
			$('#loginWindow > a').attr('href', 'javascript:window.hash.back()');
			if(error !== undefined)
				this.loginWindowError(error);
		} else if (type == 'hide'){
			$('#loginWindow > a').attr('href', '#/login');
			$('#loginWindow form').hide();
			$('#loginWindow form').children('.username').val('');
			$('#loginWindow form').children('.password').val('');
			if(username !== null){
				userDropdown();
			}
			
		} else {
			window.location.hash = '#/user/'+window.user.getUsername();
			return;
		}
	}
	
	this.loginWindowError = function(error){
		if($('#loginWindow form').css('display') == 'block'){
			var text = $('#loginWindow form').children('.error_message').text();
			$('#loginWindow form').children('.error_message').text(error);
			$('#loginWindow form').children('.error_message').css('opacity', '1.0').delay(1000).animate({ opacity: 0 }, {complete:function(){
					$('#loginWindow form').children('.error_message').text(text)
				}
			});
		}
	}
	
	//Initialize
	if(override == 'override'){
		username = usernameArg
		this.loginWindow('hide');
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
		thisObj = this;
		$.ajax({
			type: 'post',
			async: true,
			cache: false,
			url: 'api/user.php?login',
			data: {username:usernameArg,password:passwordArg},
			dataType: 'xml',
			success: function(data, success){
				if($(data).find('username').text() == usernameArg){
					username = usernameArg
					window.hash.back();
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
					$('#user').css('display', 'none');
					window.hash.hashUpdate();
					
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
	
	this.userProfile = function(){
		var ele = $('<div></div>');
		postList = new PostList();
		
		ele.append(postList.getEle());
		postList.getPosts(username);
		
		return ele.html();
	}
	
}