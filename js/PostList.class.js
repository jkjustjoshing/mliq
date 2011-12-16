function PostList(postsPerPageArg){
	var postsPerPage = postsPerPageArg;
	if(postsPerPageArg === undefined || postsPerPageArg <= 0)
		postsPerPage = 10;

	var containerEle = $('<div id="postList"></div>');
	var posts = [];
	
	this.getEle = function(){
		return containerEle;
	}
	
	//Get one post by id
	this.getPost = function(id){
		postAjax(0,0,id);
	}
	
	//postsPerPage optional - defaults to 10
	this.getPosts = function(pageNumber){ 
		if(pageNumber <= 0)
			pageNumber = 1;
			
		var from = (pageNumber-1) * postsPerPage;
		var to = from + postsPerPage;


		postAjax(to, from, 0);
		
	}
	
	var postAjax = function(to, from, id){
		//remove previous posts
		posts.length = 0;
		
		var data = new Object();
		if(to == 0 && from == 0)
			data = {id:id};
		else if(id == 0)
			data = {to:to,from:from};

		$.ajax({
			type: 'get',
			async: true,
			cache: false,
			url: 'api/read.php',
			data: data,
			dataType: 'xml',
			success: function(data, success){
				CurrentTime.updateServerTime($(data).find('mliq').attr('timestamp'));
				$(data).find('post').each(function(index){
					posts[index] = new Post($(this));
				});
				
				showPosts();
				
			}
		});
	}
	
	var showPosts = function(){
		if(containerEle.empty)
			containerEle.empty();
		else
			$(containerEle).empty();
				
		for(var i = 0; i < posts.length; i++){
			containerEle.append(posts[i].getEle());
		}
		
	}
	
}