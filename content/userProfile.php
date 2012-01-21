<?php
	require_once("../api/php/required_files.php");
	
	$currentUser = new User();
	$requestedUser = mysql_real_escape_string($_GET['username']);
	
	$database = new Database();
	if($currentUser->validUsername($requestedUser) != -4){
		//User doesn't exist
		$requestedUser = false;
	}
	
?>

<div id="userHeader">
	User <?php 
		if(!$requestedUser){
			echo "doesn't exist";
			echo "</div>";
			return;
		} ?>
		<?php echo $requestedUser; ?>
		
	
</div>
<div id="userSidebar">

</div>
<div id="userPosts">

</div>