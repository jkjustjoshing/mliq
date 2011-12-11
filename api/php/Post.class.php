<?php

Class Post{
	private $id;
	private $username;
	private $time;
	private $content;
	private $voteUp;
	private $voteDown;
	private $userVote;
	private $comments = array();
	
	public function __construct($id = 0, $time = 0, $content = ''){
		$this->id = $id;
		$this->time = $time;
		$this->content = $content;
		$this->userVote = -1;
	}
	
	public function getId(){
		return $this->id;
	}
	
	public function getTime(){
		return $this->time;	
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

	
	//1=user voted up
	//0=user voted down
	//-1=user didn't vote
	public function setUserVote($value){
		$this->userVote = $value;
	}
	
	public function getUserVote(){
		return $this->userVote;
	}
	
	public function setUsername($username){
		$this->username = $username;
	}
	
	public function getUsername(){
		return $this->username;
	}
	
	
}

?>