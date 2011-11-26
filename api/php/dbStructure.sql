CREATE DATABASE mliq

CREATE TABLE users (
	id INTEGER NOT NULL AUTO_INCREMENT,
	PRIMARY KEY(id),
	username VARCHAR(20),
	email VARCHAR(255),
	-- password  --salt of 32 characters included 
	tempPassword TINYINT(1)
	
	-- Possible user permissions/roles?
);

CREATE TABLE posts (
	id INTEGER NOT NULL AUTO_INCREMENT,
	PRIMARY KEY(id),
	user_id INTEGER NOT NULL,
	date TIMESTAMP,
	content VARCHAR(500),
	approved TINYINT(1)
	
);

CREATE TABLE votes (
	post_id
	user_id
	value
);

CREATE TABLE moderation (
	post_id
	user_id
	value
);

CREATE TABLE comments (
	post_id
	user_id
	
);

