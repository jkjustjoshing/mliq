CREATE DATABASE mliq;

USE mliq;

CREATE TABLE IF NOT EXISTS users (
	user_id INT NOT NULL AUTO_INCREMENT,
	PRIMARY KEY(user_id),
	username VARCHAR(20),
	email VARCHAR(255),
	-- password  --salt of 32 characters included 
	tempPassword TINYINT(1),
	lastLogin TIMESTAMP
	-- Possible user permissions/roles?
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
	post_id INT NOT NULL,
	user_id INT NOT NULL,
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

