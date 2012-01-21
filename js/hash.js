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
	var hashHistory = [];
	var titlePrefix = "MLIQ";
	
	this.hashUpdate = function(){
		//called on every hash change
		hashHistory.push(window.location.hash);
		
		hashData = parseHash();
		if(!hashData)
			return; //hash was changed - cancel because hash function will re-fire

		selectCommand();		
	}
	
	this.back = function(){
		if(hashHistory.length > 1){
			hashHistory.pop();
			window.location.hash = hashHistory[hashHistory.length-1];
		}else{
			hashHistory.pop();
			window.location.hash = '#/';
		}
	}
	
	
	var parseHash = function(){
		//if the first slash was forgotten, add it
		if(window.location.hash.indexOf('/') != 1 && window.location.hash.indexOf('#') == 0){
			window.location.hash = '#/'+hash;
			return false;
		}
		
		//split data into array (after chopping off again the first slash)
		var hashData = window.location.hash.slice(2).split('/');
		
		if(hashData[0] == ''){
			hashData[0] = 'page';
			hashData[1] = '1';
		}
		
		for(var i = 0; i < hashData.length; i++){
			if(hashData[i] == ''){
				hashData[i] = undefined;
			}
		}
		
		return hashData;
	}

	
	var selectCommand = function(){
		var returnVal;
		var title = titlePrefix + ' - ';
		//reset page
		pageView.clearPage(hashData[0]);
		
		//do stuff with the data
		switch(hashData[0]){
			case 'post':
				returnVal = post();
				title += 'Post number ' + hashData[1];
				break;
			case 'page':
				returnVal = page();
				title += 'Main Pitch, page ' + hashData[1];
				break;
			case 'random':
				returnVal = random();
				break;
			case 'user':
				returnVal = user();
				title += hashData[1];
				break;
			case 'login':
				returnVal = login();
				title += 'Login';
				break;
			case 'createNewAccount':
				returnVal = createAccount();
				title += 'Create a New Account';
				break;
			case 'createPost':
				returnVal = newPost();
				title += 'Write a Post';
				break;
			case 'about':
				returnVal = about();
				title += 'About Us';
				break;
			default:
				//page type wasn't found
				//bring home
				returnVal = false;
		}
		
		if(returnVal === false){
			alert('404');
		}else{
			$('title').text(title);
		}
			//404?
			
		return returnVal;
		
	}
		
	var post = function(hide){
		if(hashData[2] !== undefined)
			return false;
		if(!validatePositiveNumber(hashData[1]))
			return false;
		
		//safe, go to post page for this ID
		pageView.showId(hashData[1]);
	}
	
	
	var page = function(){
		if(hashData[2] !== undefined)
			return false;
		if(!validatePositiveNumber(hashData[1]))
			return false;
		if(hashData[1] > pageView.getMaxPage())
			return false;

		//safe, go to proper page
		pageView.showPage(hashData[1]);
	
	}
	
	var login = function(hide){
		
		if(hashData[2] !== undefined)
			return false;
		
		pageView.showLogin('show', hashData[1]);
	}
	
	
	var random = function(){
		if(hashData[2] !== undefined)
			return false;
	
	}
	
	
	var user = function(){
		if(hashData[2] !== undefined)
			return false;
	
		pageView.showUser("show", hashData[1]);
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
	
	
	var createAccount = function(){
		if(hashData[1] !== undefined)
			return false;
		
		pageView.createNewAccount();
	}

	var newPost = function(){
		if(hashData[1] !== undefined)
			return false;
		
		pageView.showCreatePost();
	}
	
	var about = function(){
		if(hashData[1] !== undefined)
			return false;
		
		pageView.showAbout();
	}
	
}
