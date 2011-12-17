<?php

/*
	Inputs
		$_POST[]
			GET - login - is defined if trying to log in
				username - username trying to login
				password - password trying to login
			GET - logout - is defined if logging out
			GET - create - is defined if creating account
				username
				password
				email
				phone - optional, may not be set or be empty string
			GET edit - is defined if changing entry - all following optional (undefined or empty string)
				username
				password
				email
				phone
			GET valid - test to see if a specific username can be used (tests formatting and if it's taken
				GET - username
*/

	require_once("php/required_files.php"); //same directory as file. change according to location


	$user = new User();
	
	if(isset($_GET['valid'])){
	
		//test to see if $_GET['username'] is valid username, and if it's in the database
		echo $valid = $user->validUsername();
			
		return true;
		
	}else if(isset($_GET['login'])){		
	
		if(!isset($_POST['username']) || !isset($_POST['password']) )
			return false;
		if($_POST['username'] == '' || $_POST['password'] == '')
			return false;
		
		$user->checkCredentials($_POST['username'], $_POST['password']);	
	
	
	}else if(isset($_GET['logout'])){
	
		$user->logout();
	
	
	}else if(isset($_GET['create'])){
	
		if(!isset($_POST['username']) || !isset($_POST['password']) || !isset($_POST['email']))
			return false;
		if($_POST['username'] == '' || $_POST['password'] == ''|| $_POST['email'] == '')
			return false;
		if(!isset($_POST['phone']))
			$_POST['phone'] = null;
		
		$user->newUser($_POST['username'],$_POST['password'],$_POST['email'],$_POST['phone']);
	
	}else if(isset($_GET['edit'])){



	}
	
	
	$xml = new XML();
	$xml->addUser($user);
	$xml->sendHeaders();
	$xml->sendXML();
	
?>