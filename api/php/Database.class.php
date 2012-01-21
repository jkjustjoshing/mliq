<?php

Class Database{
	
	private $hostname;
	private $username;
	private $password;
	private $database;
	private $mysqli;
	static $dbConnectSuccess;
	static $persistentMysqli;
	
	public function __construct($hostname = 'localhost', $username = 'root', $password = 'root', $database = 'mliq'){
		if($hostname == ''){
			require('connection_data.php');
		}
		
		$this->hostname = $hostname;
		$this->username = $username;
		$this->password = $password;
		$this->database = $database;
		
		if(self::$dbConnectSuccess == true){
			$this->mysqli = self::$persistentMysqli;
		}else{
			$this->mysqli = new mysqli($hostname, $username, $password, $database);
			if($this->mysqli->errno){
				//error handling with $this->mysqli->error;
				self::$dbConnectSuccess = false;
			}else{
				self::$persistentMysqli = $this->mysqli;
				self::$dbConnectSuccess = true;
			}
		}			
		//return error object if failed, return true if success
	}
	
	public function successfulConnect(){
		return self::$dbConnectSuccess;
	}
	
	public function query($query){
		return $this->mysqli->query($query);
	}
	
	public function real_escape_string($string){
		return $this->mysqli->real_escape_string($string);
	}
	
	public function checkUser($username, $password){
		//check the username and password. return error object if failed, 
		//return user object if success 
	}
	
	//zero based range, starting from most recent
	//first number is inclusive, last isn't
	//eg page 1 w/ 10 posts would be getPosts(0,10)
	public function getPosts($recentCount, $distantCount, $comments = false){
		if(is_string($recentCount)){
			$username = $recentCount;
			$recentCount = 0;
			
		
			$result = $this->mysqli->query("SELECT 
							posts.post_id, 
							users.username,
							UNIX_TIMESTAMP(posts.date) as date,
							posts.content
							FROM posts LEFT JOIN users ON posts.user_id = users.user_id
							WHERE approved = 1 AND users.username = '".$username."'
							ORDER BY posts.date DESC");
		} else {					
			$result = $this->mysqli->query("SELECT 
							posts.post_id, 
							users.username,
							UNIX_TIMESTAMP(posts.date) as date,
							posts.content
							FROM posts LEFT JOIN users ON posts.user_id = users.user_id
							WHERE approved = 1
							ORDER BY posts.date DESC
							LIMIT ".$distantCount);
		}
		
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
				$post->setUsername($row->username);
				//Get votes
		
				$votes = $this->mysqli->query("SELECT
						value, COUNT(user_id) AS count FROM votes
						WHERE content_id=".$row->post_id." AND is_post_vote=1
						GROUP BY value
						");
				
				$post->setVoteUp(0);
				$post->setVoteDown(0);
				while($voteResults = $votes->fetch_object()){
					if($voteResults->value) //votes up
						$post->setVoteUp($voteResults->count);
					else //votes down
						$post->setVoteDown($voteResults->count);
				}

				//Get if this user voted
				if(isset($user->id)){
					$userVoteQuery = $this->mysqli->query("SELECT
							value FROM votes
							WHERE content_id=".$row->post_id." AND is_post_vote=1
							AND user_id=".$user->id);
					if($userVote = $userVoteQuery->fetch_object()){
						//User voted
						if($userVote->value == 1){
							$post->setUserVote(1);
						}else{
							$post->setUserVote(0);
						}
					}else{
						//User didn't vote
						$post->setUserVote(-1);
					}
				}
				
				//Add comments to object
				if($comments)
					$post->addCommentArr($this->getComments($row->post_id));
				//Put post in the $posts array
				$posts[] = $post;
			}
		}
	
	
		//return array
		return $posts;
	}
	
	//Get one post based on id
	public function getPost($id, $comments = true){
		$result = $this->mysqli->query("SELECT 
						posts.post_id, 
						users.username,
						UNIX_TIMESTAMP(posts.date) as date,
						posts.content
						FROM posts LEFT JOIN users ON posts.user_id = users.user_id
						WHERE approved = 1
						AND posts.post_id = ".$id."
						LIMIT 1");

		if(!$result || $result->num_rows == 0){
			//error handling
			return false;
		}
		
		//array of posts
		$posts = array();
		
		if(!($row = $result->fetch_object())){
			return false;
		}
		$post = new Post($row->post_id, $row->date, $row->content);
		$post->setUsername($row->username);
		//Get votes

		$votes = $this->mysqli->query("SELECT
				value, COUNT(user_id) AS count FROM votes
				WHERE content_id=".$row->post_id." AND is_post_vote=1
				GROUP BY value
				");
		
		$post->setVoteUp(0);
		$post->setVoteDown(0);
		while($voteResults = $votes->fetch_object()){
			if($voteResults->value) //votes up
				$post->setVoteUp($voteResults->count);
			else //votes down
				$post->setVoteDown($voteResults->count);
		}
		
		//Get if this user voted
		if(isset($user->id)){
			$userVoteQuery = $this->mysqli->query("SELECT
					value FROM votes
					WHERE content_id=".$row->post_id." AND is_post_vote=1
					AND user_id=".$user->id);
			if($userVote = $userVoteQuery->fetch_object()){
				//User voted
				if($userVote->value == 1){
					$post->setUserVote(1);
				}else{
					$post->setUserVote(0);
				}
			}else{
				//User didn't vote
				$post->setUserVote(-1);
			}
		}
		
		//Add comments to object
		if($comments)
			$post->addCommentArr($this->getComments($row->post_id));
		//Put post in the $posts array	
	
		//return array
		return $post;
	}
	
	
	//Recursively calls itself to get all the nested comments
	public function getComments($postId, $parentCommentId = 0){
		$commentQuery = $this->mysqli->query("SELECT 
						comments.comment_id,
						UNIX_TIMESTAMP(comments.date) as date,
						comments.content, 
						users.username
						FROM comments LEFT JOIN users ON comments.user_id = users.user_id
						WHERE post_id=".$postId."
						AND replied_comment_id=".$parentCommentId);
		
		$commentArr = array();
		
		while($comment = $commentQuery->fetch_object()){
			$commentObj = new Comment($comment->comment_id, $comment->date, $comment->content);
			$commentObj->setUsername($comment->username);
			
			//Get the comment's votes
			$votes = $this->mysqli->query("SELECT
					value, COUNT(user_id) AS count FROM votes
					WHERE content_id=".$comment->comment_id." AND is_post_vote=0
					GROUP BY value
					");
			if($votesDown = $votes->fetch_object()){
				$votesDown = $votesDown->count;
			}else{
				$votesDown = 0;
			}
			$commentObj->setVoteDown($votesDown);
			
			if($votesUp = $votes->fetch_object()){
				$votesUp = $votesUp->count;
			}else{
				$votesUp = 0;
			}
			$commentObj->setVoteUp($votesUp);
			
			$commentObj->addCommentArr($this->getComments($postId, $commentObj->getId()));
			$commentArr[] = $commentObj;
		}
		
		return $commentArr;
		
	}
	
	
	public function setPost($postContent, $user){
		if($postContent == ''){
			//Empty submission
			return -1;
		}

		//SANITIZE INPUTS!!
		$postContent = sanitize($postContent);
		if($user->getUsername() != '-1'){
			$result = $this->mysqli->query("INSERT
						INTO posts(
							user_id,
							content,
							approved)
						VALUES
							(".$user->getId().",
							'".$postContent."',
							1)"); //Automatically approving posts
		}else{
			return -2;
		}
		if(!$result){
			//error handling
			return -3;
		}else{
			return 1;
		}
	
	}
	
	public function setComment($commentObj){
		if($postComment == ''){
			//Empty submission
			return false;
		}
		
		//SANITIZE INPUTS!!
		$postComment = sanitize($postComment);
		$result = $this->mysqli->query("INSERT
					INTO posts(
						user_id,
						content,
						approved)
					VALUES
						(".$user->id.",
						'".$postComment."',
						1)"); //Automatically approving posts
							
		if(!$result){
			//error handling
			return false;
		}else{
			return true;
		}
		
	}
	

	public function getMaxPage(){
		$query = $this->mysqli->query("SELECT COUNT(*) as count FROM posts");// WHERE approved=1
		$data = $query->fetch_object();
		return $data->count;
	}
	
}


function sanitize($post){

	
	$needle = array('\\\'', '\\\"', '\\\\');
	$replace = array("'", '"', '\\');
	$post = str_replace($needle, $replace, $post);
	
	$post = mysql_real_escape_string($post);
	
	//Allow client side sanitation - if it was sanitized, 
	//unsanitize, then re-sanitize. This also might let users enter
	//these characters, but that may or may not happen
	$replace = array('&', '"', "'", '<', '>');
	$needle = array('&amp;', '&quot;', '&apos;', '&lt;', '&gt;');
	$post = str_replace($needle, $replace, $post);
	
	$needle = array('&', '"', "'", '<', '>');
	$replace = array('&amp;', '&quot;', '&apos;', '&lt;', '&gt;');
	$post = str_replace($needle, $replace, $post);

	return $post;
}

?>