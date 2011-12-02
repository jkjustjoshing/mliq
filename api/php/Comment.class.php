<?php

Class Comment{
	private $id;
	private $commentTime;
	private $content;
	private $comments = array();
	
	public function __construct($id = 0, $commentTime = 0, $content = ''){
		$this->id = $id;
		$this->commentTime = $commentTime;
		$this->content = $content;
	}
	
	public function addSubComment($comment){
		$this->comments[] = $comment;
	}
	
	public function addSubCommentArr($comments){
		foreach($comments as $comment){
			$this->comments[] = $comment;
		}
	}
	
	public function getCommentTime(){
		return $this->commentTime;
	}
	
	public function getContent(){
		return $this->content;
	}
	
	public function getComments(){
		return $this->comments;
	}
		
}

?>