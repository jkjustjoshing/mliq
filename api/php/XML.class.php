/*
* This class will be used every time XML is sent to the client.
* Data will be passed into it. Once all the data is put in, getXML()
* will be called to get the formatted XML for that collection of data
*/
Class XML{
	
	//Array that holds the posts to be sent
	private $postArr = array();

	//Variable that holds the logged in user
	private $user;

	//Array that holds the error code and the message
	private $error = array();
	
	//Add a post to the postArr array
	public function addPost($post){
		$this->postArr[] = $post;
	}
	
	//Store the user
	public function addUser($user){
		$this->user = $user;
	}
	
	//Store the error
	public function addError($errorCode, $errorMessage){
		$this->error[code] = $errorCode;
		$this->error[message] = $errorMessage;
	}
	
	private function postXML(){
		$temp = '';
		foreach($this->postArr as $post){
			$temp .= '<post id="'.$post->getId().'" time="'.$post->getPostTime().'">';
			$temp .= '<content>'.$post->getContent().'</content>';
			$temp .= '<votes up="'.$post->getVoteUp().'" down="'.$post->getVoteDown().'" />';
			$temp .= '</post>';
		}
		
		return $temp;
	}
	
	private function userXML(){
		$temp = '';
		if(isset($this->user)){
			$temp .= '<user>';
			
			$temp .= '<username>'.$this->user->getUsername().'</username>';
			
			$temp .= '</user>';
		}
	}
	
	private function errorXML(){
		$temp = '';
		if(isset($this->error[code])){
			$temp .= '<error code="'.$this->error[code].'">';
			$temp .= $this->error[message];
			$temp .= '</error>';
		}
		return $temp;
	}
	
	//Returns the XML for the current data in the object
	public function getXML(){
		$temp = '';
		
		$temp .= '<mliq timestamp="'.time().'">';
		$temp .= $this->errorXML();
		$temp .= $this->userXML();
		$temp .= $this->postXML();
		$temp .= '</mliq>';
		
		return $temp;
	}
}