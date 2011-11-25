$(window).hashchange(function(){
	onHashChange();
});

$(document).ready(function(){
	$(window).hashchange();
});

/*
Hashes will have the form
mylifeisquidditch.com/#/page/data(/sorting)

pages
	permalink/125 (where 125 referrs to the id of the post)
	page/5 (where 5 is the page number)
	user/jkjustjoshing (where jkjustjoshing is a user)

serting
	popularity
	date (explicitly stating unneccesary - will be implied)
*/


function onHashChange(){
	//validate hash syntax and extract data
	var hashData = validateHashSyntax();
	if(!hashData)
		return;
		
	//do stuff with the data
	//whaaaa????
}


function validateHashSyntax(){
	//get hash without the hash symbol
	var hash = window.location.hash.slice(1);
	
	//if the first slash was forgotten, add it
	if(hash.indexOf('/') != 0){
		window.location.hash = '#/'+hash;
		return false;
	}
	
	//split data into array (after chopping off again the first slash)
	var hashData = hash.slice(1).split('/');
	
	//test data variable for integerness (including for a 
	//partial non-nnumber that will evaluate to an integer)
	var number = parseInt(hashData[1]);
	if((number+'') == hashData[1]){
		hashData[1] = number;
	}else{
		number = parseInt('hello'); //something that will definitely return NaN
	}
	
	//if the number is not a number (and should be), go home
	if(isNaN(number) && hashData[0] != ''){
		window.location.hash = '#/';
		return false;
	}
	
	return hashData;
}