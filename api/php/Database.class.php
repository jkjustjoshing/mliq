<?php

Class Database{
	
	private $hostname;
	private $username;
	private $password;
	private $database;
	private $mysqli;
	private $dbConnectSuccess;
	
	public function __construct($hostname = '', $username = '', $password = '', $database = ''){
		if($hostname == ''){
			require('connection_data.php');
		}
		
		$this->hostname = $hostname;
		$this->username = $username;
		$this->password = $password;
		$this->database = $database;
		
		$this->mysqli = new mysqli($hostname, $username, $password, $database);
		if($this->mysqli->errno){
			//error handling with $this->mysqli->error;
			$this->dbConnectSuccess = false;
		}else{
			$this->dbConnectSuccess = true;
			return true;
		}
		
		//return error object if failed, return true if success
	}
	
	public function successfulConnect(){
		return $this->dbConnectSuccess;
	}
	
	public function close(){
		$this->mysqli->close();
	}
	
	public function query($query){
		return $this->mysqli->query($query);
	}
	
	public function checkUser($username, $password){
		//check the username and password. return error object if failed, 
		//return user object if success 
	}
	
	//zero based range, starting from most recent
	//first number is inclusive, last isn't
	//eg page 1 w/ 10 posts would be getPosts(0,10)
	public function getPosts($recentCount, $distantCount){
		$result = $this->mysqli->query("SELECT 
						posts.post_id, 
						users.username,
						UNIX_TIMESTAMP(posts.date) as date,
						posts.content
						FROM posts LEFT JOIN users ON posts.user_id = users.user_id
						WHERE approved = 1
						ORDER BY posts.date DESC
						LIMIT ".$distantCount);
							
		if(!$result){
			//error handling
			return false;
		}
		//array of posts
		$posts = array();
		
		//package into array
		for($i = 0; $row = $result->fetch_object(); $i++){
			//strip away previous posts
			if ($i >= $recentCount){
				//Get data besides votes
				$post = new Post($row->post_id, $row->date, $row->content);
				
				//Get votes
		
				$votes = $this->mysqli->query("SELECT
						value, COUNT(user_id) AS count FROM votes
						WHERE post_id=20
						GROUP BY value
						");
				
				$votesDown = $votes->fetch_object();
				$votesUp = $votes->fetch_object();
				
				$post->setVoteUp($votesUp->count);
				$post->setVoteDown($votesDown->count);
				
				$post->addCommentArr($this->getComments($row->post_id));
				
				//Put post in the $posts array
				$posts[] = $post;
			}
		}
	
	
		//return array
		return $posts;
	}
	
	public function getComments($postId){
		$commentQuery = $this->mysqli->query("SELECT 
						comment_id,
						UNIX_TIMESTAMP(date) as date,
						content
						
						
						FROM comments
						WHERE post_id=".$postId."
						AND replied_comment_id=0");
		
		return $this->commentFetchRecursive($commentQuery, $postId);
		
	}
	
	//called recursively to get all comments and subcomments of a Comment SQL 
	//query. Returns an array of Comment objects
	private function commentFetchRecursive($cQ, $postId){//cQ -> commentQuery
		$commentArr = array();
		while($comment = $cQ->fetch_object()){
			$commentObj = new Comment($comment->comment_id, $comment->date, $comment->content);

			$query = $this->mysqli->query("SELECT 
						comment_id,
						UNIX_TIMESTAMP(date) as date,
						content
						FROM comments
						WHERE post_id=".$postId."
						AND replied_comment_id=".$comment->comment_id);
			$commentObj->addSubCommentArr(
				$this->commentFetchRecursive($query, 
				$postId));
			$commentArr[] = $commentObj;
		}
		
		
		return $commentArr;
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