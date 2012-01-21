function PageView(containerEleArg){
	var containerEle = containerEleArg;
	var pageNav = [];
	var postList;


	if(containerEleArg !== undefined)
		containerEle = containerEleArg;
	
	//convert to jQuery object
	if(!containerEle.css) 
		containerEle = $(containerEle);
		

//Methods
	//for Hash class, to tell if someone is trying to go to a non-existant page
	this.getMaxPage = function(){
		if(pageNav[0] === undefined){
			pageNav[0] = new PageNav();
			pageNav[1] = new PageNav();
		}
		return pageNav[0].getMaxPage();
	}
	
	this.clearPage = function(currentPageType){
		//put over current page
		if(currentPageType == 'login')
			return;
		else
			this.showLogin('hide');
		
		if(currentPageType == 'createPost')
			return;
		else
			this.showCreatePost('hide');
		
		if(currentPageType == 'createNewAccount')
			return;
		
		
		//don't keep previous page
		if(currentPageType != 'page')
			this.showPage('hide');
		if(currentPageType != 'post')
			this.showId('hide');
		if(currentPageType != 'about')
			this.showAbout('hide');
		if(currentPageType != 'user'){
			this.showUser('hide');
		}
		
	}
	
	this.showPage = function(pageNumber){
		
		if(pageNumber == 'hide'){
			if(pageNav[0] !== undefined)
				pageNav[0].getEle().css('display', 'none');
			if(postList !== undefined)
				postList.getEle().css('display', 'none');
			if(pageNav[1] !== undefined)
				pageNav[1].getEle().css('display', 'none');
		}else{
			
			if(pageNav[0] === undefined){
				pageNav[0] = new PageNav();
				pageNav[1] = new PageNav();
			}
			if(postList === undefined){
				postList = new PostList();
			}
			
			
			if(!postList.getEle().isChildOf(containerEle))
				containerEle.append(postList.getEle());
			if(!pageNav[0].getEle().isChildOf(containerEle))
				pageNav[0].getEle().insertBefore(postList.getEle());
			if(!pageNav[1].getEle().isChildOf(containerEle))
				containerEle.append(pageNav[1].getEle());
			
	
			//Update both pageNav objects
			for(var i = 0; i < 2; i++){
				pageNav[i].setPage(pageNumber);
				pageNav[i].getEle().css('display', '');
			}
			postList.getEle().css('display', '');
			
			//update postList
			postList.getPosts(parseInt(pageNumber));
		}
	}
	

	this.showId = function(id){
		if(id == 'hide' && postList !== undefined){
			postList.getEle().css('display', 'none');	
		}else{
			if(postList === undefined){
				postList = new PostList();
			}
			
			if(!postList.getEle().isChildOf(containerEle))
				containerEle.append(postList.getEle());
			
			postList.getEle().css('display', '');
			postList.getPost(id);
		}
	}

	this.showLogin = function(hide, error){
		if(hide == 'hide')
			window.user.loginWindow('hide');
		else{
			if(error !== undefined)
				while(error.indexOf('+') != -1){
					error = error.substring(0,error.indexOf('+'))
							+ ' '
							+ error.substring(error.indexOf('+')+1);
				}
			window.user.loginWindow('show', error);
		}
	}
	
	this.createNewAccount = function(){
		
		popupWindow(createNewAccountEle());
		
	}
	
	this.showCreatePost = function(hide){
		if(hide == 'hide'){
			$('body').trigger('click'); //simulate clicking away from the window
		}else{
			var createEle = window.createPostEle();
			if(!createEle){
				window.location.hash = '#/login/To+post+you+must+be+logged+in';
				return false;
			}
			popupWindow(createEle);
			Recaptcha.create("6LcD6MsSAAAAABQD9ioKKlGmHXAVALvJg80mSUl9",
				"recaptcha_div",
				{
					theme: "red",
					callback: Recaptcha.focus_response_field
				}
			);
			
			window.interval = setInterval(function(){
				var count = 0;
				if($('#recaptcha_reload_btn')){
					$('#recaptcha_reload_btn').attr('href', 'javascript://')
					.click(function(){
						Recaptcha.reload();
					});
					count++;
				}
				
				if($('#recaptcha_switch_audio_btn')){
					$('#recaptcha_switch_audio_btn').attr('href', 'javascript://')
					.click(function(){
						Recaptcha.switch_type('audio');
					});
					count++
				}
				
				if($('#recaptcha_switch_img_btn')){
					$('#recaptcha_switch_img_btn').attr('href', 'javascript://')
					.click(function(){
						Recaptcha.switch_type('image');
					});
					count++
				}
				
				if(count == 3){
					clearInterval(window.interval);
				}
			}, 200);
		}
	}

	this.showAbout = function(hide){
		if(hide == 'hide')
			containerEle.children('#about').remove();
		else{
			if(containerEle.children('#about').length == 0)
				$.get('content/about.html', function(data){
					containerEle.append(data);
				});
		}
	}

	this.showUser = function(hide, username){
		if(hide == 'hide'){
			containerEle.children('#userProfile').empty();
		} else {
			if(containerEle.children('#userProfile').length == 0)
				containerEle.append($('<div id="userProfile"></div>'));
			
			$.get('content/userProfile.php?username='+username, function(data){
				containerEle.children('#userProfile').html(data);
			});
		}
	}
	
}