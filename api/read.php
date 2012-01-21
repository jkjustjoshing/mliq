<?php

/*
	Inputs
		$_GET[]
			postCount - how many posts are there, put this alone in query
			from=0
			to=10   //this from and to combo would be page 1 with 10 posts
			
			id=1242 //this gets post id number 1242
			user=joshiek1990 //get posts from user 'joshiek1990'
			
*/
	
	require_once("php/required_files.php"); //same directory as file. change according to location

	$user = new User();

	if(isset($_GET['postCount'])){
		$database = new Database();
		echo $database->getMaxPage();
	
	}else if (isset($_GET['time'])){
		$xml = new XML();
		$xml->addUser($user);
		$xml->sendHeaders();
		$xml->sendXML();
	}else if (isset($_GET['user'])){
		$xml = new XML();
	
		$database = new Database();
		$posts = $database->getPosts($_GET['user']);
		
		$xml->addPosts($posts);
		$xml->addUser($user);
		$xml->sendHeaders();
		$xml->sendXML();
	}else{

		if(isset($_GET['from'])){
			$from = intval($_GET['from'], 10);
			$from = $from > 0  ? $from : 0;
		}
		if(isset($_GET['to'])){
			$to = intval($_GET['to'], 10);
			$to = $to > 0  ? $to : 0;
		}
		if(isset($_GET['id'])){
			$id = intval($_GET['id'], 10);
			$id = $id > -1  ? $id : -1;
		}
		
		$database = new Database();
		if(isset($_GET['id']))
			$posts = $database->getPost($id); //true implied - want comments
		else if(isset($_GET['from']) && isset($_GET['to']))
			$posts = $database->getPosts($from, $to); //getPosts(0, 1, false) implied - false for getting comments

		$xml = new XML();
		if(isset($posts))
			$xml->addPosts($posts);
		$xml->addUser($user);
		$xml->sendHeaders();
		$xml->sendXML();
	}
?>