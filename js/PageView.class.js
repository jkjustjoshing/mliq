function PageView(containerEleArg, currentPageArg){
	var currentPage = 1;
	var containerEle = containerEleArg;
	var pageNav = [];
	var postList;
	


	if(currentPageArg !== undefined)
		currentPage = currentPageArg;

	if(containerEleArg !== undefined)
		containerEle = containerEleArg;

	//initialize stuff
	pageNav[0] = new PageNav(currentPage);
	pageNav[1] = new PageNav(currentPage);
	postList = new PostList();

	//convert to jQuery object
	if(!containerEle.css) 
		containerEle = $(containerEle);

	containerEle.empty().append(pageNav[0].getEle())
		.append(postList.getEle())
		.append(pageNav[1].getEle());



//Methods
	this.setCurrentPage = function(currentPageArg){
		currentPage = currentPageArg;
	}


	this.updatePage = function(pageNumber){
		if(pageNumber !== undefined)
			this.currentPage = pageNumber;


		//Update both pageNav objects
		for(var i = 0; i < 2; i++){
			pageNav[i].setPage(this.currentPage);

		}
		
		//update postList
		postList.getPosts(this.currentPage);
	}
	

	this.updateId = function(id){
		if(id === undefined){
			window.location.hash = '#/';
			return false;
		}
		
		for(var i = 0; i < 2; i++){
			pageNav[i].getEle().css('display', 'none');
		}

		postList.getPost(id);
	}

	//for Hash class, to tell if someone is trying to go to a non-existant page
	this.getMaxPage = function(){
		return pageNav[0].getMaxPage();
	}
	

}

