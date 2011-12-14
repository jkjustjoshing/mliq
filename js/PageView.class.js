<<<<<<< HEAD
function PageView(currentPageArg, containerEleArg){
	var currentPage;
	var containerEle;
=======
function PageView(containerEleArg, currentPageArg){
	var currentPage = 1;
	var containerEle = containerEleArg;
>>>>>>> Pagination
	var pageNav = [];
	var postList;
	
	if(currentPageArg !== undefined)
		currentPage = currentPageArg;
<<<<<<< HEAD
	if(containerEleArg !== undefined)
		containerEle = containerEleArg;
	
	//initialize stuff
	pageNav[0] = new PageNav();
	pageNav[1] = new PageNav();
	postList = new PostList();
	
=======
	
	//initialize stuff
	pageNav[0] = new PageNav(currentPage);
	pageNav[1] = new PageNav(currentPage);
	postList = new PostList();
>>>>>>> Pagination
	//convert to jQuery object
	if(!containerEle.css) 
		containerEle = $(containerEle);

	containerEle.empty().append(pageNav[0].getEle())
		.append(postList.getEle())
		.append(pageNav[1].getEle());
	
<<<<<<< HEAD
=======
	postList.getPosts(1);

>>>>>>> Pagination
//Methods
	this.getCurrentPage = function(){
		return currentPage;
	}
<<<<<<< HEAD
	
	this.setCurrentPage = function(currentPageArg){
		currentPage = currentPageArg;
	}
=======
>>>>>>> Pagination

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
<<<<<<< HEAD
	var pageView = new PageView(1, $('#postContainer'));
=======
	var pageView = new PageView('#postContainer');
	setTimeout(function(){
		alert('t');
		pageView.updatePage(2);
	}, 3000);
>>>>>>> Pagination
});

/*

	Paginate.go('previous'); will bring the page list to the previous page
	Paginate.go('next'); go to next page
	Paginate.go(3434); go to page 3434
*/