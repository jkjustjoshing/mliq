function PostList(containerEle){
	this.containerEle = containerEle;
	this.posts = [];
}

PostList.prototype.getPosts = 
function(sort, last_post, posts_per_page, page_number){
	var thisObj = this;
	if(last_post >=0){
		var data = {last_post: last_post};
	} 
	else if(posts_per_page > 0){
		var sendData = {posts_per_page: posts_per_page, page_number: page_number};
	}
	$.ajax({
		type: 'get',
		async: true,
		cache: false,
		url: 'api/read.php',
		data: sendData,
		dataType: 'xml',
		success: function(data, success){
			CurrentTime.updateServerTime($(data).find('mliq').attr('timestamp'));
			
			var tempPostArr = new Array();
			$(data).find('post').each(function(index){
				tempPostArr[index] = new Post($(this));
			});
			
			thisObj.addMultiplePosts(tempPostArr);
			
		}
	});
}

PostList.prototype.addMultiplePosts = function(postObjArr){
		for(var i = postObjArr.length - 1; i >= 0; i--){
			this.addPost(postObjArr[i]);			
		}
}

PostList.prototype.addPost = function(postObj){	
	//update the array
	this.posts.push(postObj);
	//update the page element
	this.containerEle.prepend(postObj.getEle());
}

