/*
* This class will be used every time XML is sent to the client.
* Data will be passed into it. Once all the data is put in, getXML()
* will be called to get the formatted XML for that collection of data
*/
Class XML{
	
	//Array that holds the posts to be sent
	var $postArr = array();

	//Add a post to the postArr array
	function addPost($post){
		$This->postArr[] = $post;
	}
	
	//Returns the XML for the current data in the object
	function getXML(){
		$temp = '';
	}
}