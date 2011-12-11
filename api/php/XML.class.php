<?php
/*
* This class will be used every time XML is sent to the client.
* Data will be passed into it. Once all the data is put in, getXML()
* will be called to get the formatted XML for that collection of data
*/


Class XML{
	
	
	private $postArr = array(); //Array that holds the posts to be sent
	private $user; //Variable that holds the logged in user
	private $error = array(); //Array that holds the error code and the message
	private $sentXMLheader = false; //Test to see if XML version and header were sent
	
	public function sendHeaders(){
		if(!$this->sentXMLheader){
			header("Content-type: text/xml");
			echo '<?xml version="1.0" ?>';
		}
	}
	
	//Add a post to the postArr array
	public function addPost($post){
		$this->postArr[] = $post;
	}
	
	//Add a post array to the postArr array
	public function addPosts($postArr){
		foreach($postArr as $post){
			$this->postArr[] = $post;
		}
	}
	
	//Store the user
	public function addUser($user){
		$this->user = $user;
	}
	
	//Store the error
	public function addError($errorCode, $errorMessage){
		$this->error['code'] = $errorCode;
		$this->error['message'] = $errorMessage;
	}
	
	private function postXML(){
		$temp = '';
		foreach($this->postArr as $post){
			$temp .= '<post id="'.$post->getId().'" time="'.$post->getTime().'">';
			$temp .= '<user>'.$post->getUsername().'</user>';
			$temp .= '<content>'.$post->getContent().'</content>';
			$temp .= '<votes up="'.$post->getVoteUp().'" down="'.$post->getVoteDown().'"';
			if($post->getUserVote() != -1)
				$temp .= ' currentUser="'.($post->getUserVote() ? 'up' : 'down').'"';
			$temp .= ' />';
			$temp .= $this->commentXML($post);
			$temp .= '</post>';
		}
		
		return $temp;
	}
	
	private function commentXML($obj){
		$str = '';
		$commentsArr = $obj->getComments();
		foreach($commentsArr as $comment){
			$str .= '<comment time="'.$comment->getTime().'">';
			$str .= '<user>'.$comment->getUsername().'</user>';
			$str .= '<content>'.$comment->getContent().'</content>';
			$str .= $this->commentXML($comment);
			$str .= '</comment>';
		}
		
		return $str;
	}
	
	private function userXML(){
		$temp = '';
		if(isset($this->user) && $this->user->getUsername() != '-1'){
			$temp .= '<user>';
			
			$temp .= '<username>'.$this->user->getUsername().'</username>';
			
			$temp .= '</user>';
		}
		
		return $temp;
	}
	
	private function errorXML(){
		$temp = '';
		if(isset($this->error['code'])){
			$temp .= '<error code="'.$this->error['code'].'">';
			$temp .= $this->error['message'];
			$temp .= '</error>';
		}
		return $temp;
	}
	
	//Returns the XML for the current data in the object
	public function sendXML(){
		$temp = '';
		
		$temp .= '<mliq timestamp="'.time().'">';
		$temp .= $this->errorXML();
		$temp .= $this->userXML();
		$temp .= $this->postXML();
		$temp .= '</mliq>';
		
		echo $temp;
	}
}

?>