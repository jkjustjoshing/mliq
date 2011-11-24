function getPosts(sort, last_post, posts_per_page, page_number){
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
			var currentTime = $(data).find('mliq').attr('timestamp');
			
			var lastPost = $('#main_content .post').eq(1);
			$(data).find('post').each(function(){
				var postObj = new Post($(this), currentTime);
				lastPost.before(postObj.getEle());
			
			});
		}
	});
}
