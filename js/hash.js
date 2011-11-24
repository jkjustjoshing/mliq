$(window).hashchange(function(){
	onHashChange();
});

/*
Hashes will have the form
mylifeisquidditch.com/#/page/data/data

*/

function onHashChange(){
	
	var hash = window.location.hash.slice(1);
	if(hash.indexOf('/') != 0){
		window.location.hash = '#/'+hash;
	}
	else{
		var hashData = hash.slice(1).split('/');
		if(hashData[0] == 'permalink'){
			var postId = parseInt(hashData[1]);
			if(!isNaN(postId)){
				alert('finding post id '+postId);
			}
			else {
				window.location.hash = '';
			}
		}
	}	
	
}
