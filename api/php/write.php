<?php

/*
	Send these values:
		$_POST[]
			content="My awesome post!" 
	
	
*/


	//require_once("php/required_files.php");
	require_once("required_files.php"); //same directory as file. change according to location

	//Initialize objects
	$user = new User();
	$database = new Database();
	$xml = new XML();
	
	//This method currently automatically approves posts
	if($database->setPost($_GET['content'], $user)){
		$post = $database->getPosts(0,1);
		$xml->addPosts($post);
	}else{
		$xml->addError('123', 'Post not saved. Please try again.');
	}
	
	
	$xml->sendHeaders();
	$xml->sendXML();
?>