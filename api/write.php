<?php

/*
	Send these values:
		$_POST[]
			content="My awesome post!" 
			captchaChallenge = unique key
			captchaResponse = typed text
	
		$_GET['vote']
			id=88
			vote=1/0
			post=0/1
	
*/


	//require_once("php/required_files.php");
	require_once("php/required_files.php"); //same directory as file. change according to location

	//Initialize objects
	$user = new User();
	$database = new Database();
	$xml = new XML();


	if(isset($_GET['vote'])){
		$id = intval(mysql_real_escape_string($_GET['id']));
		if(isset($_GET['value']) && $_GET['value'] == '0')
			$vote = 0;
		else
			$vote = 1;
			
		if(isset($_GET['post']) && $_GET['post'] == '0')
			$post = 0;
		else
			$post = 1;
		
	
		$result = $database->query("REPLACE INTO votes
			(content_id, user_id, is_post_vote, value)
			VALUES (".$id.", ".$user->getId().", ".$post.", ".$vote.")");
		
		$xml->addPost($database->getPost($id));
		$xml->wantVotes(true);
		
	} else {
		$privatekey = "6LcD6MsSAAAAAJwcxA6n7LQrHaZ-WnwZXJBfEHhw";	
		$resp = recaptcha_check_answer ($privatekey,
									$_SERVER["REMOTE_ADDR"],
									$_POST["captchaChallenge"],
									$_POST["captchaResponse"]);
		
		if (!$resp->is_valid) {
			$xml->addError('-4', "Incorrect Captcha");
		}else{
			//This method currently automatically approves posts
			$setResult = $database->setPost($_POST['content'], $user);
			if($setResult > 0){
				$post = $database->getPosts(0,1);
				$xml->addPosts($post);
			}else{
				if($setResult == -1)
					$xml->addError('-1', 'No content received. If you weren\'t messing with the javascript (you sneaky hacker you :) ) please report this');
				else if($setResult == -2)
					$xml->addError('-2', "You aren't logged in. Please log in and try again");
				else if($setResult == -3)
					$xml->addError('-3', "There was a database error. Please try again.");
			}
		}	
	
	}		
	
	$xml->sendHeaders();
	$xml->sendXML();
?>