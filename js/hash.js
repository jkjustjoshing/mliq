var hash;

$(window).hashchange(function(){
	hash.hashUpdate();
});

$(document).ready(function(){
	var pageView = new PageView('#postContainer');
	
	hash = new Hash(pageView);
	
	$(window).hashchange();
	
});

/*
Hashes will have the form
mylifeisquidditch.com/#/page/data(/sorting)

pages
	post/125 (where 125 referrs to the id of the post, a permalink)
	page/5 (where 5 is the page number)
	user/jkjustjoshing (where jkjustjoshing is a user)
	random/ or random/24 (first will redirect to second. 
		second same as permalink/24 but with more prominent random link)
sorting
	popularity
	date (explicitly stating unneccesary - will be implied)
*/


function Hash(pageViewArg){
	var hashData;
	var pageView = pageViewArg;
	
	this.hashUpdate = function(){
		//called on every hash change
		
		hashData = parseHash();
		if(!hashData)
			return; //hash was changed - cancel because hash function will re-fire

		selectCommand();
		
	}
	
	
	var parseHash = function(){
		//if the first slash was forgotten, add it
		if(window.location.hash.indexOf('/') != 1 && window.location.hash.indexOf('#') == 0){
			window.location.hash = '#/'+hash;
			return false;
		}
		
		//split data into array (after chopping off again the first slash)
		var hashData = window.location.hash.slice(2).split('/');

		if(hashData[1] === undefined){
			hashData[0] = 'page';
			hashData[1] = '1';
		}
		return hashData;
	}

	
	var selectCommand = function(){
		var returnVal;
		//do stuff with the data
		switch(hashData[0]){
			case 'post':
				returnVal = post();
				break;
			case 'page':
				returnVal = page();
				break;
			case 'random':
				returnVal = random();
				break;
			case 'user':
				returnVal = user();
				break;
			default:
				//page type wasn't found
				//bring home
				window.location.hash = '#/';
				returnVal = false;
		}
		
		if(returnVal === false){}
			//404?
			
		return returnVal;
		
	}
		
	var post = function(){
		if(hashData[2] !== undefined)
			return false;
		if(!validatePositiveNumber(hashData[1]))
			return false;
		
		//safe, go to post page for this ID
		pageView.updateId(hashData[1]);
	}
	
	
	var page = function(){
		if(hashData[2] !== undefined)
			return false;
		if(!validatePositiveNumber(hashData[1]))
			return false;
		if(hashData[1] > pageView.getMaxPage())
			return false;

		//safe, go to proper page
		pageView.updatePage(hashData[1]);
	
	}
	
	
	var random = function(){
		if(hashData[2] !== undefined)
			return false;
	
	}
	
	
	var user = function(){
		if(hashData[2] !== undefined)
			return false;
	
	}


	var validatePositiveNumber = function(string){
		//test data variable for integerness (including for a 
		//partial non-nnumber that will evaluate to an integer)
		if(string === undefined){
			var number = parseInt(hashData[1]);
			string = hashData[1];
		}else{
			var number = parseInt(string);
		}
		
		if((number+'') == string && number > 0){ //if number pareses exactly to an int, not just approximately
			return number;
		}else{
			window.location.hash = '#/';
			return false;
		}
	
	}


	
}
