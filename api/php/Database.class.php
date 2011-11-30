<?php
require_once('Post.class.php');


Class Database{
	
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
						UNIX_TIMESTAMP(posts.date),
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
				$post = new Post($row->post_id, 20/*$row->date*/, $row->content);
				
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
		$commentQuery = $this->mysqli->query("
						SELECT * FROM comments
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

			$query = $this->mysqli->query("
						SELECT * FROM comments
						WHERE post_id=".$postId."
						AND replied_comment_id=".$comment->comment_id);
			$commentObj->addSubCommentArr(
				$this->commentFetchRecursive($query, 
				$postId));
			$commentArr[] = $commentObj;
		}
		
		
		return $commentArr;
	}
	
}

echo '<pre>';
$foo = new Database('localhost', 'root','root','mliq');
$bar = $foo->getPosts(0,1);
print_r($bar);
echo '</pre>';

?>