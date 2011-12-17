CREATE DATABASE mliq;

USE mliq;

CREATE TABLE IF NOT EXISTS users (
	user_id INT NOT NULL AUTO_INCREMENT,
	PRIMARY KEY(user_id),
	username VARCHAR(20),
	email VARCHAR(255),
	password CHAR(128) --salt included 
	tempPassword TINYINT(1) DEFAULT '0',
	lastAttempt TIME,
	lastLogin TIMESTAMP,
);

CREATE TABLE IF NOT EXISTS phones (
	phone_id INT NOT NULL AUTO_INCREMENT,
	PRIMARY KEY(phone_id),
	user_id INT,
	confirmationCode CHAR(5),
	confirmed TINYINT(1)
);


CREATE TABLE IF NOT EXISTS posts (
	post_id INT NOT NULL AUTO_INCREMENT,
	PRIMARY KEY(post_id),
	user_id INT NOT NULL,
	date TIMESTAMP,
	content VARCHAR(500),
	approved TINYINT(1)
);

CREATE TABLE IF NOT EXISTS votes (
	content_id INT NOT NULL,
	user_id INT NOT NULL,
	is_post_vote TINYINT(1) DEFAULT 1;
	PRIMARY KEY(post_id, user_id),
	value TINYINT(1),
	date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS moderation (
	post_id INT,
	user_id INT,
	PRIMARY KEY(post_id, user_id),
	value TINYINT(1),
	date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
	comment_id INT NOT NULL,
	PRIMARY KEY(comment_id),
	post_id INT NOT NULL,
	user_id INT NOT NULL,
	replied_comment_id INT,
	content VARCHAR(500),
	date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions {
	id VARCHAR	
	
);