function ajax(params){

	$.ajax({
			type: params.type,
			async: true,
			cache: false,
			url: params.url,
			data: params.data,
			dataType: 'xml',
			success: params.success
		});	
}

$(document).ready(function(){
	//setInterval(updateTimes, 120000);
	postlistee = new PostList($('#postContainer'));

	//test to see what the hash is on page load
$(window).hashchange();

});

function updateTimes(){

	ajax({
		type:'get',
		url:'api/read.php',
		data:{},
		success:function(data){
			var currentTime = $(data).find('mliq').attr('timestamp');
			
			$('.date').children('a').each(function(){
				var postTime = parseInt($(this).parent().attr('title'));
				if(postTime > 0)
					$(this).text(getTimeString(postTime, currentTime));
			});
			
		}
	});

}

function getTimeString(postTime, currentTime){
	var secondsSince = currentTime - postTime;
	
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
	var jsDate = new Date(postTime*1000);
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
