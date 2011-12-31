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
		echo '$("#user").css("display", "none");';
	} else {
		echo '$("#loginWindow").css("display", "none");';
		echo '$("#user").css("display", "inline")
				.children("a").attr("href", "#/user/'.$username.'").text("'.$username.'");';
		
	}
		
		
?>
	
});
