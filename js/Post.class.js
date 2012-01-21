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
	this.userVoteText = postJQueryXML.find('votes').attr('currentUser');
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
	this.voting(this.ele.children('.voting'));
	
	//add voting 
	//this.ele.children('.voting').text('up '+this.voteUp+', down '+this.voteDown);
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

Post.prototype.voting = function(ele){
	//Has user already voted?
	if(this.userVoteText == 'up')
		this.userVote = 1;
	else if(this.userVoteText == 'down')
		this.userVote = 0;
	else
		this.userVote = -1;
	
	var upLink = [
					$('<a class="upLink" id="upLink'+this.id+'" href="javascript://">brooms up</a>'),
					$('<span class="upLink" id="upLink'+this.id+'">brooms up</a>')
				];
	
	var downLink = [
					$('<a class="downLink" id="downLink'+this.id+'" href="javascript://">beat</a>'),
					$('<span class="downLink" id="downLink'+this.id+'">beat</a>')
				];
				
	var upText = $('<span class="upText">' + this.voteUp + '</span>');
	var downText = $('<span class="downText">' + this.voteDown + '</span>');			
	
	var upIndex = this.userVote == 1 ? 1 : 0;
	var downIndex = this.userVote == 0 ? 1 : 0;
	
	var thisObj = this;
	
	var callback = function(){
		if(this.nodeName.toLowerCase() == 'a'){
			if($(this).attr('class') == 'downLink'){
				var val = 0;
				var substr = 8;
			}else{
				var val = 1;
				var substr = 6;
			}
			
			$.get('api/write.php?vote&value='+val+'&post=1&id='+$(this).attr('id').substring(substr), function(data){
				var xmlEle = $(data).find('votes');
				upText.html(xmlEle.attr('up'));
				downText.html(xmlEle.attr('down'));
				
				if(xmlEle.attr('currentUser') == 'up'){
					upLink[upIndex].swap(upLink[1]);
					if(thisObj.userVoteText == 'down'){
						downLink[downIndex].swap(downLink[0]);
						downIndex = (downIndex+1)%2;
					}
					upIndex = (upIndex+1)%2;
					
				}else{
					downLink[downIndex].swap(downLink[1]);
					if(thisObj.userVoteText == 'up'){
						upLink[upIndex].swap(upLink[0]);
						upIndex = (upIndex+1)%2;
					}
					downIndex = (downIndex+1)%2;
				}
				thisObj.userVoteText = xmlEle.attr('currentUser');
				
			}, 'xml');
		}
	};
	
	upLink[0].click(callback);
	downLink[0].click(callback);
	
	
	ele.append(upLink[upIndex]).append(upText).append(downLink[downIndex]).append(downText);
	

}
