<?php
	header("Content-type: text/javascript");
	
	include("../api/php/Database.class.php");
	include("../api/php/User.class.php");
	
	$database = new Database();
	
	$user = new User();
	$username = $user->getUsername();
	
?>

var hash;
var user;

$(window).hashchange(function(){
	hash.hashUpdate();
});

$(document).ready(function(){
	var pageView = new PageView('#postContainer');
	
	hash = new Hash(pageView);
	user = new User(<?php
		if($username != '-1')
			echo '"override", "'.$username.'"'; 
		?>);
	$(window).hashchange();
	
<?php
	if($username == '-1'){
		//logged in
		echo '$("#loginWindow").css("display", "inline");';
		echo '$("#user").hide();';
	} else {
		echo '$("#loginWindow").hide();';
		echo '$("#user").css("display", "inline");';
		
	}
		
		
?>
	
});


function popupWindow(ele){
	var blackoutDiv = $('<div class="blackoutDiv"></div>');
	
	$('body').click(function(){
		$('body').unbind('click');
		blackoutDiv.remove();
		ele.remove();
		window.hash.back();
	});
	
	if(!ele.css)
		ele = $(ele);
	
	ele.css({
		'position':'absolute',
		'top':'30px',
		'left':'25%',
		'width':'50%',
		'min-width':'400px'
	});
	ele.bind('click', function(){}, false);	
	$('body').append(blackoutDiv);
		blackoutDiv.after(ele);

}

jQuery.fn.isChildOf = function(b){ 
    return (this.parents(b).length > 0); 
};

//Used in Post->voting
jQuery.fn.swap = function(b){ 
    b = jQuery(b)[0]; 
    var a = this[0]; 
    var t = a.parentNode.insertBefore(document.createTextNode(''), a); 
    b.parentNode.insertBefore(a, b); 
    t.parentNode.insertBefore(b, t); 
    t.parentNode.removeChild(t); 
    return this; 
};
