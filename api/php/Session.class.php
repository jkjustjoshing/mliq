<?php

Class Session {
	
	public function open($savepath, $sessionId){
		session_start();
	}
	
	public function read($sessionId, $index){
		return $_SESSION[$index];
	}
	
	public function write($sessionId, $index, $value){
		$_SESSION[$index] = $value;
	}
	
	public function destroy($sessionId){
		unset($_SESSION);
	}
	
}




/* Implement database sessions next version

Class Session {

	private $database;
	
	public function __construct(){
		session_set_save_handler(
			array($this, "open"),
			array($this, "close"),
			array($this, "read"),
			array($this, "write"),
			array($this, "destroy"),
			array($this, "gc"));
		
		ini_set('session.name', 'mliq_session');
		ini_set('session.auto_start', true);
		//ini_set('session.gc_maxlifetime', 60*60*24*14); //2 weeks
		ini_set('session.cookie_lifetime', 60*60*24*14); //2 weeks
		ini_set('session.cookie_httponly', true); //No javascript access, supported browsers only
		ini_set('session.hash_function', 1); //SHA-1 instead of MD5
	
		
		session_start();
	}
	
	public function open($savePath_unneeded, $sessionID){
		//Connect to Database
		$this->database = new Database();
		return $this->database->successfulConnect();
	}
	
	public function close(){
		$this->database->close();
	}
	
	public function read($sessionID){
	
	}
	
	public function write($sessionID, $data){
	
	}
	
	public function destroy($sessionID){
		//Delete the entry in the database 
		$query = "DELETE FROM sessions 
					WHERE id='".mysql_real_escape_string($sessionID)."'";
	
		$result = $this->database->query($query);
		if($result) return true;
		else return false;
	}
	
	public function gc(){
		
	}

}
*/
?>