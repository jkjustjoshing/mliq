Class Post{
	private $id;
	private $postTime;
	private $content;
	private $voteUp;
	private $voteDown;
	
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
}