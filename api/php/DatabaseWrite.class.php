<?php

Class DatabaseWrite{
	
	private $hostname;
	private $username;
	private $password;
	private $database;
	private $mysqli;
	
	public function __construct($hostname = 'localhost', $username = 'root', $password = 'root', $database = 'mliq'){
		$this->hostname = $hostname;
		$this->username = $username;
		$this->password = $password;
		$this->database = $database;
		
		$this->mysqli = new mysqli($hostname, $username, $password, $database);
		if($this->mysqli->errno){
			//error handling with $this->mysqli->error;
		}else{
			return true;
		}
		
		//return error object if failed, return true if success
		
	}
	
	public function setPost($postComment){
		//SANITIZE INPUTS!!
		$postComment = sanitizeContent($postComment);
		
		$result = $this->mysqli->query("INSERT
					INTO posts(
						user_id,
						content)
					VALUES
						(1,
						'".$postComment."')"); //CHANGE THIS
							
		if(!$result){
			//error handling
			return false;
		}else{
			
			
			
		}
	
		//return array
		return $post;
	}
	
	public function setComment($commentObj){
		$result = $this->mysqli->query("");
		
		return $comment;
		
	}
	
}

function sanitizeContent($post){

	$post = mysql_real_escape_string($post);
	$needle = array('&', '"', "'", '<', '>');
	$replace = array('&amp;', '&quot;', '&apos;', '&lt;', '&gt;');
	$post = str_replace($needle, $replace, $post);	

	return $post;
}

?>