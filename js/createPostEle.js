function createPostEle(){

	//Don't let user post without logging in
	if(!window.user.isLoggedIn()){
		return false;
	}
	
	
	var createEle = $('<div id="createPost"></div>');

	
	var form = $('<form></form>');
	
	form.attr('method', 'get').attr('action', '#');
	
	var textareaDiv = $('<div class="textarea"></div>');
	var textarea = $('<textarea id="newPost"></textarea>').appendTo(textareaDiv);
	
	form.append('<div id="createPostTitle">Why is your life Quidditch . . .</div>')
		.append(textareaDiv);
	form.append('<div id="recaptcha_div"></div>');
	//Recaptcha must be added when item is being put on page
	
	form.append('<div class="button">Submit</div>')
		.append('<div class="error_message"></div>')
		.append('<div style="clear:both"></div>');
	form.children('.button').click(function(){
		form.submit();
	});
	
	form.submit(function(){
		
		var willNotValidate = checkNewPost(form);
		if(willNotValidate){
			$('#createPost').find('.error_message')
						.text(willNotValidate)
						.css('opacity', '1.0')
						.delay(1000)
						.animate({ opacity: 0 });
			return false;
		}
		
		var contents = textarea.val();
		var captchaResponse = form.find('#recaptcha_response_field').val();
		var captchaChallenge = form.find('#recaptcha_challenge_field').val();
		var data = {
			content: contents,
			captchaChallenge : captchaChallenge,
			captchaResponse : captchaResponse
		};
		$.ajax({
			type: 'post',
			async: true,
			cache: false,
			data: data,
			url: 'api/write.php',
			dataType: 'xml',
			success: function(data, success){
				var error = $(data).find('error');
				if(error.length){
					var errorMessage = error.text();
					
					if(error.attr('code') == '-4')
						Recaptcha.reload()
					
					$('#createPost').find('.error_message')
						.text(errorMessage)
						.css('opacity', '1.0')
						.delay(1000)
						.animate({ opacity: 0 });
				}else{
					$('#createPost').empty().html(
						'Post successful'
					)
					setTimeout(function(){
						window.hash.back();
					}, 1000);
				}
			}
		});
		
		return false;
	});
	
	createEle.append(form);

	return createEle;
}

function checkNewPost(formEle){
	createEle = $('#createPost');

	if(createEle.find('textarea#newPost').val().length == 0)
		return 'Please enter post content';
	
	if(createEle.find('#recaptcha_response_field').val().length == 0)
		return 'Please complete the captcha';
	
	return false;
}