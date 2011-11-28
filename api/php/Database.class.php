Class Database{
	
	private $hostname;
	private $username;
	private $password;
	private $database;
	private $mysqli;
	
	public function __construct($hostname = 'localhost', $username = 'root', $password = 'root', $database = 'mliq'){
		$this->hostname = $hostname;
		$this->username = $username;
		$this->password = $possward;
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
	
	
}