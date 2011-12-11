<?php

/*
	Inputs
		$_GET[]
			from=0
			to=10   //this from and to combo would be page 1 with 10 posts
			
			id=1242 //this gets post id number 1242
			
*/

	$from = @intval($_GET['from'], 10);
	$to = @intval($_GET['to'], 10);
	$id = @intval($_GET['id'], 10);

	//Anything negative, set to 0
	$from = $from > 0  ? $from : 0;
	$to =   $to > 0    ? $to   : 0;
	$id =   $id > -1   ? $id   : -1;

	//require_once("php/required_files.php");
	require_once("required_files.php"); //same directory as file. change according to location

	$user = new User();
	
	$database = new Database();
	if($id != -1)
		$posts = $database->getPost($id); //true implied - want comments
	else
		$posts = $database->getPosts($from, $to); //getPosts(0, 1, false) implied - false for getting comments
	$xml = new XML();
	$xml->addPosts($posts);
	$xml->addUser($user);
	$xml->sendHeaders();
	$xml->sendXML();
?>