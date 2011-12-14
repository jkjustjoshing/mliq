function PostList(postsPerPage){
	this.pastsPerPage = postsPerPage
	if(this.postsPerPage === undefined || this.postsPerPage <= 0)
		this.postPerPage = 10;
		
	this.containerEle = '<div id="postList"></div>';
	this.posts = [];
}

//Get one post by id
PostList.prototype.getPost = function(id){
	this.postAjax(0,0,id);
}

//postsPerPage optional - defaults to 10
PostList.prototype.getPosts = function(pageNumber){ 
	if(pageNumber <= 0)
		pageNumber = 1;
		
	var thisObj = this;
	
	var from = (pageNumber-1) * this.postsPerPage;
	var to = from + this.postsPerPage;
	
	this.postAjax(to, from, 0);
	
}

PostList.prototype.postAjax = function(to, from, id){
	var data = {};
	if(to == 0 && from == 0)
		data = {id:id};
	else if(id == 0)
		data = {to:to,from:from};
	var thisObj = this;
	$.ajax({
		type: 'get',
		async: true,
		cache: false,
		url: 'api/read.php',
		data: data,
		dataType: 'xml',
		success: function(data, success){
			CurrentTime.updateServerTime($(data).find('mliq').attr('timestamp'));
			
			var tempPostArr = new Array();
			$(data).find('post').each(function(index){
				thisObj.posts[index] = new Post($(this));
			});
			
			thisObj.showPosts();
			
		}
	});
}

PostList.prototype.showPosts = function(){
		if(this.containerEle.empty)
			this.containerEle.empty();
		else
			$(this.containerEle).empty();
			
		var eleArr;
		for(var i=0;i<this.posts.length;i++){
			eleArr[i] = this.posts[i].getEle();
		}
		
		this.containerEle.append(eleArr);
}

PostList.prototype.getEle = function(){
	return this.containerEle;
}