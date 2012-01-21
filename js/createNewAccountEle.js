function createNewAccountEle(){
	var createEle = $('<div id="createNewAccount"></div>');
	
	//TEMPORARY STYLE
	createEle.css({'position':'relative', 'top':'100px', 'left':'20px'});
	
	var form = $('<form></form>');
	
	form.attr('method', 'get').submit(function(){
		
		return false;
	});
	
	var formElements = {
		email: $('<input type="text" id="newEmail" />'),
		username: $('<input type="text" id="newUsername" />'),
		password: $('<input type="password" id="newPassword" />'),
		password2: $('<input type="password" id="newPassword2" />')
	};
	form.append('<label for="newEmail">Email: </label>').append(formElements.email);
	form.append('<label for="newUsername">Username: </label>').append(formElements.username)
		.append('<span class="error_message too_short_message">Too short</span>')
		.append('<span class="error_message too_long_message">Too long</span>')
		.append('<span class="error_message unavailable_message">Username already taken</span>')
		.append('<span class="error_message valid_message"style="color:green;">Valid Username</span>')
		.append('<span class="error_message loading_gif"><img alt="Loading..." src="loading.gif" /></span>');

	form.append('<label for="newPassword">Password: </label>').append(formElements.password);
	form.append('<label for="newPassword2">Retype password: </label>').append(formElements.password2);
	
	form.children('input').css('float','left');
	
	formElements.email.blur(function(){
		var regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
		if(!regex.test(this.value))
			this.style.background = 'red';
		else
			this.style.background = 'white';
	})
	.keyup(function(){
		var regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
		if(regex.test(this.value))
			this.style.background = 'white';
	});
	
	
	formElements.username.keyup(function(event){
		$(this).parent().children('span').css('display','none').css('opacity','1');
		
		var val = $(this).val();
		if(val.length < 3){
			clearTimeout(window.delay);
			$(this).parent().children('.too_short_message').css('display', 'inline');
		} else if(val.length > 20){
			clearTimeout(window.delay);
			$(this).parent().children('.too_long_message').css('display', 'inline');
		}else{
			$(this).parent().children('.loading_gif').css('display', 'inline');
			if(window.delay === undefined)
				window.delay = setTimeout(function(){usernameCheck(event);}, 500);
			else{
				clearTimeout(window.delay);
				window.delay = setTimeout(function(){usernameCheck(event);}, 500);
			}
		}
	});
	
	
	var usernameCheck = function(event){
		var dataObj = {'valid':'', 'username':event.target.value};

		$.ajax({
			type: 'get',
			async: true,
			cache: false,
			url: 'api/user.php',
			dataType: 'text',
			data:dataObj,
			success: function(data, success){
			$(event.target).parent().children('span').css('display','none');
				if(parseInt(data) == -4)
					$(event.target).parent().children('.unavailable_message').css('display','inline');
				else
					$(event.target).parent().children('.valid_message').css('display','inline');
			}
		});
	
	};
	
	
	
	createEle.append(form);
	
	return createEle;
}