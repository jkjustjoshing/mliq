function onCreateNewForm(userCredentials){
	var which = $('#new_post');
	which.children('a').unbind('click');
	which.css('cursor', 'default');
	
	//test here to see if they are allowed to fill 
	//out form (cookie, logged in)
	//if not, give log-in box
	//if yes, give form	
	userValidate(userCredentials, function(username, statusCode){
		if(statusCode != 0)
			which.html('').append(createLogIn(statusCode));
		else
			which.html('').append(createNewPostForm());
			
		$('.close').click(function(){
			$(this).parent().html('').append('<a href="#">Create a post...</a>')
				.children('a').css('cursor', 'pointer')
				.click(function(){
					onCreateNewForm();
				});
	});
	});

}

function createNewPostForm(){
	var ele = $('<div></div>');
	ele.append('<div class="close">X</div>');
	ele.append('<textarea>')
		.children('textarea')
			.attr('name', 'new_post_text')
			.attr('id', 'new_post_text')
			.text("Why is your life Quidditch?");
	ele.append('<input type="button" />')
		.children('input')
			.attr('class', 'button')
			.attr('value', 'Post This')
			.click(function(){submitNewPost($(this));});
	ele.append('<div style="clear:both;"></div>');
	
	//Helper text appearing and dissapearing
	ele.children('#new_post_text').focus(function(){
		if($(this).val() == 'Why is your life Quidditch?'){
			$(this).val('');
		}
	}).blur(function(){
		if($(this).val() == ''){
			$(this).val('Why is your life Quidditch?');
		}
	});
	
	return ele.children();
	
}

function submitNewPost(which){
	//submit new post
	var sendData = {content:which.parent().children('textarea').val()};
	ajax({
		type: 'post',
		url: 'api/write.php',
		data: sendData,
		success: function(data, success){
			if ($(data).find('error').length) {
				alert($(data).find('error').text());
			}
			else {
				var timestamp = $(data).find('mliq').attr('timestamp');
				
				$('#main_content .post').eq(1).before(
					createPostElement($(data).find('post'), timestamp)
				);
			}
		}
	});
}


