<?php

//LOG IP ADDRESSES
// RIT OWNS BLOCK 129.21.xxx.xxx

/*
	Username requirements
		at least 3 characters, no more than 20
		numbers, letters, underscore, period
		
	
	
*/

Class User{

	private $username;
	private $id;
	static $votes = null;
	
	public function __construct(){
		$this->callConstructor();
	}
	
	
	public function loggedIn(){
		if($this->username == '-1')
			return false;
		else
			return true;
	}

	public function logout(){
		unset($_SESSION['username']);
		unset($_SESSION['id']);	
		$this->callConstructor();
	}
	
	public function getId(){
		return $this->id;
	}
	
	public function getUsername(){
		return $this->username;
	}
	
	
	public function updatePassword($password){
		$salt = substr(uniqid(mt_rand(), true), 0, 32);
		$salt .= substr(uniqid(mt_rand(), true), 0, 32);
		
		$forDatabase = hash("sha256", $password.$salt).$salt;
		
		$database = new Database();
		$query = $database->query("
			UPDATE users
			SET password='".$forDatabase."'
			WHERE user_id=".$this->id."
		");
		
	}
	
	public function updateUsername($username){
		//check to see if it already exists
		//FUTURE - CHECK TO SEE IF IT MEETS USERNAME REQUIREMENTS
		//SANITIZE INPUTS
		if($this->validUsername($username) == 1){
			$database = new Database();
			
			//Put their username into the database
			$database->query("
				UPDATE users
				SET username='".$database->real_escape_string($username)."'
				WHERE user_id=".$this->id."
			");
			
			//Update it in the object
			$_SESSION['username'] = $username;
			$this->username = $username;
		}
	}
	
	public function updateEmail($email){
		//check to see if it already exists and conforms to formatting
		if(preg_match('/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i', $email) == 0)
			return -3;
		
		
		$database = new Database();
		$query = $database->query("
			SELECT user_id
			FROM users
			WHERE email='".$email."' 
			AND user_id!=".$this->id."
		");
		
		if($query->num_rows != 0)
			return -4; //already exists
		
		//Put their email into the database
		$database->query("
			UPDATE users
			SET email='".$database->real_escape_string($email)."'
			WHERE user_id=".$this->id."
		");
		
		return 1;
		
	}
	
	public function checkCredentials($username, $password){

		if($username == '-1' || $this->username != '-1')
			return false;
		
		$database = new Database();
		$username = $database->real_escape_string($username);
		/*
			Password will be hashed before entering database
			therefore no need to escape
		*/
		
		$database = new Database();
		$results = $database->query("
			SELECT user_id, password, lastAttempt
			FROM users
			WHERE username='".$username."'
		");

		if($results->num_rows == 0)
			return false;

		$data = $results->fetch_object();

		if(strtotime($data->lastAttempt)+1 >= time() && strtotime($data->lastAttempt)<=time())
			//last login attempt was less than 2 seconds ago - fail
			return false;
		else
			//update last attempted login time
			$foo = $database->query("
				UPDATE users
				SET lastAttempt=NOW()
				WHERE user_id=".$data->user_id."
			");

		if($this->checkPassword($password, $data->password)){
			//user is validated!
			//merge anonymous and logged in records
			//	update votes table
			$database->query("
				UPDATE votes
				SET user_id=".$data->user_id."
				WHERE user_id=".$this->id."
			");
			
			//	update entries table (precaution - not needed if must be logged in to post
			$database->query("
				UPDATE posts
				SET user_id=".$data->user_id."
				WHERE user_id=".$this->id."
			");
			
			//	delete anonymous entry into database
			$database->query("
				DELETE FROM users
				WHERE user_id=".$this->id."
				AND username='-1'
			");
			
			//	update User object
			$_SESSION['username'] = $username;
			$this->username = $username;
			$_SESSION['id'] = $data->user_id;
			$this->id = $data->user_id;
			
			//	update last login time for user
			$database->query("
				UPDATE users
				SET lastLogin=NOW()
				WHERE user_id=".$data->user_id."
			");
			
			
			return true;
		}else{
			return false;
		}
		
	}
	
	public function newUser($username, $password, $email, $phone=null){
	if(!$this->validUsername($username) == 1)
			return false;
		if(strlen($password) < 6)
			return false;
		if($this->username != '-1') //you're already logged in!
			return false;
			
		$this->updateUsername($username);
		$this->updatePassword($password);
		$this->updateEmail($email);
		//if($phone !== null)
			//$this->updatePhone()
		
	}
	
	private function checkPassword($password, $fromDB){
		
		
		$salt = substr($fromDB, 64);
		$hash = substr($fromDB, 0, 64);
		//get a last attempted login time, only allow relogin one second after
		$check = hash("sha256", $password.$salt).$salt;
		
		if($fromDB == $check)
			return true;
		else
			return false;
		
	}
	
	private function callConstructor(){
		if(session_id() == '')
			session_start(); //only call if session doesn't already exist
		$database = new Database();
		if(!isset($_SESSION['id'])){
			$results = $database->query("INSERT INTO users
							(username)
							VALUES
							('-1')");
			if($results){
				$query = $database->query("SELECT user_id
							FROM users
							ORDER BY user_id DESC
							LIMIT 1");
				$idObj = $query->fetch_object();
				$this->id = $idObj->user_id;
			}
			
			$_SESSION['id'] = $this->id;
			$_SESSION['username'] = '-1';
		} else {
			$this->id = $_SESSION['id'];
			$query = $database->query("SELECT username
							FROM users
							WHERE user_id=".$this->id."
							LIMIT 1");
			if($data = $query->fetch_object())
				$_SESSION['username'] = $data->username;
		}
		
		$this->username = $_SESSION['username'];
	}
	
	/*
		Username requirements
			at least 3 characters, no more than 20
			numbers, letters, underscore, period
	*/
	public function validUsername($username){
		if(strlen($username) < 3)
			return -1; //too short
	
		if(strlen($username) > 20)
			return -2; //too long
		
		$username = $database->real_escape_string($username);
		if(preg_match('/^[A-Za-z0-9_-]+$/', $username) == 0) //length doesn't matter because it was already checked for
			return -3; //improperly formatted
		
		$database = new Database();
		$query = $database->query("
			SELECT username
			FROM users
			WHERE username='".$username."'
		");
		
		if($query->num_rows != 0)
			return -4; //already exists
			
		//everything checked out, valid username!
		return 1;
	}

	public function voteForPostId($id){
		if(self::$votes === null){
			//Populate array
			self::$votes = array();
			
			$database = new Database();
			$result = $database->query("SELECT content_id, value FROM votes
										WHERE user_id=".$this->id."
										AND is_post_vote=1");
			while($row = $result->fetch_object()){
				self::$votes[$row->content_id] = $row->value;
			}
		}
		
		if(array_key_exists($id, self::$votes))
			return self::$votes[$id];
		else
			return -1;
		
	}
}
?>