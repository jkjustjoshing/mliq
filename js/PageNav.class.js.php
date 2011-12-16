<?php
	header("Content-type: text/javascript");
	
	include("../api/php/Database.class.php");
	$database = new Database();
	$maxPage = $database->getMaxPage();
	
?>
/*
	The nav will look like:
	
	
		< 1 ... 33 34 35 36 37 ... 4444 >
		
	where the current page is 35 and the total number of pages is 4444


	Eventually want visual indicator of which page you are on

*/

function PageNav(currentPageArg){
	var postsPerPage = 10;
	var maxPage = <?php echo $maxPage; ?>;
	var pause = false;
	var currentPage = 1; //One based index!
	if(currentPageArg !== undefined)
		currentPage = currentPageArg;
	this.ele = $('<div class="pageNumContainer"></div>');
	maxPage = Math.ceil(maxPage/postsPerPage);
	
	this.setPage = function(page){
		if(parseInt(page) <= maxPage){
			currentPage = parseInt(page);
			this.ele.empty().append(getInnerElement());
			return true;
		}else{
			return false;
		}
	}
	
	this.getEle = function(){
		return this.ele;
	
	}
	
	this.getMaxPage = function(){
		return maxPage;
	}
	
	var updateMaxPages = function(callback){
			pause = true;
			$.ajax({
				type: 'get',
				async: true,
				cache: false,
				url: 'api/read.php?postCount',
				data: {},
				dataType: 'text',
				success: function(data){
					maxPage = Math.ceil(parseInt(data)/postsPerPage);
					pause = false;
					if(typeof(callback) == "function")
						callback();
				}
			});
		}
	
	this.setPostsPerPage = function(arg){
		postsPerPage = arg;
	}
	
	
	var getInnerElement = function(){
		var ele = '';
		//Wrapper div for page navigation
		
		//If you aren't on the first page, show the ability to go back one page
		if(currentPage > 1)
			ele += getPageEle(currentPage-1, '&lt;');
			
		//Show page 1 on the navigation
		ele += getPageEle(1);
		
		//If we are sufficiently not near page one, show first ellipsis
		if(currentPage >= 6){
			ele += '<div class="ellipsis">...</div>';
		}
		
		//Show 2 pages before, the current page, and 2 pages after IF necessary
		for(var i = -3; i <= 3; i++){
			if((currentPage+i) > 1 && (currentPage+i) < maxPage)
				ele += getPageEle(currentPage+i);
		}
				
		//If we are sufficiently not near the last page, show the last ellipsis
		if(currentPage <= (maxPage-5)){
			ele += '<div class="ellipsis">...</div>';
		}
		
		//Show the last page on the navigation
		ele += getPageEle(maxPage);
		
		//If you aren't on the last page, show the ability to go one page in advance
		if(currentPage < maxPage)
			ele += getPageEle(currentPage+1, '&gt;');
		
		//Styling div, and closing wrapper div
		ele += '<div style="clear:both;"></div>';
		
		return ele;
	
	}
	
	var getPageEle = function(linkPage, showPage){
		if(showPage === undefined)
			showPage = linkPage;
			
		return '<div class="pageNum" onclick="window.location.hash=\'#/page/'+linkPage+'\';">'+showPage+'</div>';	
	
	}
	
	
}
