<?php

Class User{

	private $username;
	private $id;
	
	public function __construct(){
		session_start();
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
			$_SESSION['username'] = '';
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
	
	public function getId(){
		return $this->id;
	}
	
	public function getUsername(){
		return $this->username;
	}
	
	
}


?>