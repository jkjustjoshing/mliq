<?php

Class Post{
	private $id;
	private $postTime;
	private $content;
	private $voteUp;
	private $voteDown;
	private $comments = array();
	
	public function __construct($id = 0, $postTime = 0, $content = '', $voteUp = 0, $voteDown = 0){
		$this->id = $id;
		$this->postTime = $postTime;
		$this->content = $content;
		$this->voteUp = $voteUp;
		$this->voteDown = $voteDown;
	}
	
	public function getId(){
		return $this->id;
	}
	
	public function getPostTime(){
		return $this->postTime;	
	}
	
	public function getContent(){
		return $this->content;
	}
	
	public function getVoteUp(){
		return $this->voteUp;
	}
	
	public function getVoteDown(){
		return $this->voteDown;
	}
	
	public function setVoteUp($vu){
		$this->voteUp = $vu;
	}
	
	public function setVoteDown($vd){
		$this->voteDown = $vd;
	}
	
	
	public function addComment($comment){
		$this->comments[] = $comment;
	}
	
	public function addCommentArr($comments){
		foreach($comments as $comment){
			$this->comments[] = $comment;
		}
	}
	
	public function getComments(){
		return $this->comments;
	}
}

?>