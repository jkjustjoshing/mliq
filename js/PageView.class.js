function PageView(currentPageArg, containerEleArg){
	var currentPage;
	var containerEle;
	var pageNav = [];
	var postList;
	
	if(currentPageArg !== undefined)
		currentPage = currentPageArg;
	if(containerEleArg !== undefined)
		containerEle = containerEleArg;
	
	//initialize stuff
	pageNav[0] = new PageNav();
	pageNav[1] = new PageNav();
	postList = new PostList();
	
	//convert to jQuery object
	if(!containerEle.css) 
		containerEle = $(containerEle);

	containerEle.empty().append(pageNav[0].getEle())
		.append(postList.getEle())
		.append(pageNav[1].getEle());
	
//Methods
	this.getCurrentPage = function(){
		return currentPage;
	}
	
	this.setCurrentPage = function(currentPageArg){
		currentPage = currentPageArg;
	}

	this.updatePage = function(pageNumber){
		if(pageNumber !== undefined)
			this.currentPage = pageNumber;
		
		//Update both pageNav objects
		for(var i = 0; i < 2; i++){
			pageNav[i].updateCurrentPage(this.currentPage);
		}
		
		//update postList
		postList.getPosts(this.currentPage);
	}
	

}




$(document).ready(function(){
	var pageView = new PageView(1, $('#postContainer'));
});

/*

	Paginate.go('previous'); will bring the page list to the previous page
	Paginate.go('next'); go to next page
	Paginate.go(3434); go to page 3434
*/