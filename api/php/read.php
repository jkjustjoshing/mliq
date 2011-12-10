<?php

	//require_once("php/required_files.php");
	require_once("required_files.php"); //same directory as file. change according to location


	$database = new Database();
	$posts = $database->getPosts(0,1);
	$xml = new XML();
	$xml->addPosts($posts);
	$xml->sendHeaders();
	echo $xml->getXML();
?>