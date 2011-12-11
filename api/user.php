<?php
/*header("Content-type: text/xml");

echo '<?xml version="1.0" ?>';
?>

<mliq>
	<user>
		<username>jkjustjoshing</username>
		<email>joshiek1990@gmail.com</email>
	</user>
</mliq>

*/

Class Josh{
	static $foo = 0;
	private $bar;
	public $josh;
	
	public function __construct(){
		//do nothing
	}
	
	public function josh($var){
		echo "foo = ".self::$foo.", ";
		self::$foo = $var;
		echo "foo = ".self::$foo.", ";
	}
}

$a = new Josh();
$b = new Josh();
$c = new Josh();
$a->josh(23);
$b->josh(100);
$c->josh(10000000);


?>