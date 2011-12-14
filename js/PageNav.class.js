
/*
	The nav will look like:
	
	
		< 1 ... 33 34 35 36 37 ... 4444 >
		
	where the current page is 35 and the total number of pages is 4444


	Eventually want visual indicator of which page you are on

*/


function PageNav(){
	this.maxPage = 0;
	this.pause = false;
	this.currentPage = 1; //One based index!
	this.ele = $('<div class="pageNumContainer"></div>');
	
}

PageNav.prototype.updateMaxPages = function(callback){
alert('foo');
		var thisObj = this;
		this.pause = true;
		$.ajax({
			type: 'get',
			async: true,
			cache: false,
			url: 'api/read.php?postCount',
			data: {},
			dataType: 'text',
			success: function(data){
				thisObj.maxPage = parseInt(data);
				alert(data);
				thisObj.pause = false;
				if(typeof(callback) == "function")
					callback;
			}
		});
	}

PageNav.prototype.updateCurrentPage = function(page){
	if(parseInt(page) <= this.maxPage){
		this.currentPage = parseInt(page);
		this.ele.empty().append(this.getInnerElement);
		return true;
	}else{
		return false;
	}
}

PageNav.prototype.getEle = function(){

	if(this.maxPage == 0){
		this.ele.append(this.getPageEle(1, 'Loading page nav...'));
		
		var thisObj = this;
		this.updateMaxPages(function(){
			thisObj.ele.remove().append(thisObj.getInnerElement);
		});
		
	}else{
		this.ele.remove().append(this.getInnerElement);
	}

	return this.ele;

}

PageNav.prototype.getInnerElement = function(){
	var ele = '';
	//Wrapper div for page navigation
	
	//If you aren't on the first page, show the ability to go back one page
	if(this.currentPage > 1)
		ele += this.getPageEle(this.currentPage-1, '&lt;');
		
	//Show page 1 on the navigation
	ele += this.getPageEle(1);
	
	//If we are sufficiently not near page one, show first ellipsis
	if(this.currentPage >= 6){
		ele += '<div class="ellipsis">...</div>';
	}
	
	//Show 2 pages before, the current page, and 2 pages after IF necessary
	for(var i = -3; i <= 3; i++){
		if((this.currentPage+i) > 1 && (this.currentPage+i) < this.maxPage)
			ele += this.getPageEle(this.currentPage+i);
	}
			
	//If we are sufficiently not near the last page, show the last ellipsis
	if(this.currentPage <= (this.maxPage-5)){
		ele += '<div class="ellipsis">...</div>';
	}
	
	//Show the last page on the navigation
	ele += this.getPageEle(this.maxPage);
	
	//If you aren't on the last page, show the ability to go one page in advance
	if(this.currentPage < this.maxPage)
		ele += this.getPageEle(this.currentPage+1, '&gt;');
	
	//Styling div, and closing wrapper div
	ele += '<div style="clear:both;"></div>';
	
	return ele;

}

PageNav.prototype.getPageEle = function(linkPage, showPage){
	if(showPage === undefined)
		showPage = linkPage;
		
	return '<div class="pageNum" onclick="window.location.hash=\'#/page/'+linkPage+'\';">'+showPage+'</div>';	

}