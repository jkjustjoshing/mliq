function CurrentTimeClass(){
	this.currentTime;
	
	this.getCurrentTime = function(){
		return this.currentTime;
	}
	
	this.maintainCurrentTime = function(){		
		this.currentTime++;
		this.secondsSinceLastServerCount++;
		if(this.secondsSinceLastServerCount > 3600){
			this.getServerTime();
		}
	}
	
	this.getServerTime = function(){
		this.secondsSinceLastServerCount = 0;
		var thisObj = this;
		$.ajax({
			type: 'get',
			async: true,
			cache: false,
			url: 'api/read.php?time',
			data: {},
			dataType: 'xml',
			success: function(data, success){
				var currentTime = $(data).find('mliq').attr('timestamp');
				thisObj.updateServerTime(currentTime);
			}
		});
	}
	
	this.updateServerTime = function(serverTime){
		this.secondsSinceLastServerCount = 0;
		this.currentTime = parseInt(serverTime);
		if(this.intervalReference == undefined){
			//start the interval
			var which = this;
			this.intervalReference = setInterval(function(){which.maintainCurrentTime();}, 1000);
		}
	}
	
}


CurrentTime = new CurrentTimeClass();
CurrentTime.getServerTime();