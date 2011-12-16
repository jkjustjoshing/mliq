/*
Objects
post - each post is an object, with a reference to the element on the page
	and the data and functions associated with it (eg updating the time on 
	permalink, etc)
postlist - stores reference to each post object, adds new posts to page, 



*/

function Post(postJQueryXML){

	this.ele;
	this.user = postJQueryXML.find('user').text();
	this.id = postJQueryXML.attr('id');
	this.postTime = postJQueryXML.attr('time');
	this.content = postJQueryXML.find('content').text();
	this.voteUp = postJQueryXML.find('votes').attr('up');
	this.voteDown = postJQueryXML.find('votes').attr('down');
	
	//construct the element
	this.constructPostEle();

	//have the times update themselves
	var which = this;
	setInterval(function(){
			which.ele.children('.date').children('a').text(
				which.getTimeString()
			);
		}, 
		secondsBetweenRefreshingPermalinkTime*1000
	);
}

Post.prototype.getEle = function(){
	return this.ele;
}

Post.prototype.constructPostEle = function(){
	this.ele = $('<div class="post"></div>');
	this.ele.attr('id', 'post'+this.id);
	this.ele.append('<div class="content"></div>')
			.append('<div class="date"></div>')
			.append('<div class="user"></div>')
			.append('<div class="voting"></div>');
	
	//put content into element
	this.ele.children('.content').text(this.content);
	
	//add date and permalink
	this.ele.children('.date').append('<a></a>')
			.children('a').attr('href', this.permalink())
			.text(this.getTimeString());
	
	this.ele.children('.user').append(this.user);
	
	//add voting 
	this.ele.children('.voting').text('up '+this.voteUp+', down '+this.voteDown);
}

Post.prototype.getTimeString = function(){
	var secondsSince = CurrentTime.getCurrentTime() - this.postTime;

	//print seconds ago
	if(secondsSince < 5)
		return 'moments ago';
	if(secondsSince < 60)
		return secondsSince + ' seconds ago';
	
	//print minutes ago
	var minutesSince = Math.round(secondsSince/60);
	if(minutesSince == 1)
		return '1 minute ago';
	if(minutesSince < 60)
		return minutesSince + ' minutes ago';
	
	//print hours ago
	var hoursSince = Math.round(minutesSince/60);
	if(hoursSince == 1)
		return '1 hour ogo';
	if(hoursSince < 12)
		return hoursSince + ' hours ago';
	
	//print more than that
	var jsDate = new Date(this.postTime*1000);
	var daysSince = Math.round(hoursSince/24);
	if(daysSince == 1)
		var str = 'Yesterday at ';
	else if(daysSince == 2)
		var str = '2 days ago at ';
	else{
		var month = ['Jan','Feb','March','April','May','June','July','Aug','Sept','Oct','Nov','Dec'];
		var str = month[jsDate.getMonth()] + ' ' + jsDate.getDate();
		str += ', ' + jsDate.getFullYear() + ' at ';
	}
	var hours = jsDate.getHours()%12;
	if(hours == 0)
		hours = 12;
	str += hours + ':'+ ((jsDate.getMinutes() < 10) ? ('0'+jsDate.getMinutes()) : jsDate.getMinutes()) + ' ';
	str += (jsDate.getHours() < 12)? 'am' : 'pm' ;
	
	return str;
}


//this will eventually generate a link 
//that will point to the post alone on a page
Post.prototype.permalink = function(){
	return '#/post/'+this.id;
}


