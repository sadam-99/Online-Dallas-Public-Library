--CREATE TABLE STATEMENTS

--USERS
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(300) NOT NULL,
  `phone` varchar(11) NOT NULL,
  `email` varchar(300) NOT NULL,
  `is_admin` tinyint(1) NOT NULL,
  `password` varchar(300) NOT NULL,
  `address` varchar(300) NOT NULL,
  `gender` varchar(300) NOT NULL,
  `soft_delete` varchar(10) DEFAULT '0',
  `image` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--BOOKS
CREATE TABLE `books` (
  `book_id` int NOT NULL AUTO_INCREMENT,
  `genre` varchar(300) NOT NULL,
  `title` varchar(300) NOT NULL,
  `author` varchar(300) NOT NULL,
  `publisher` varchar(300) NOT NULL,
  `edition` int NOT NULL,
  `isbn` varchar(100) NOT NULL,
  `pages` int NOT NULL,
  `date_added` date DEFAULT NULL,
  `soft_delete` varchar(45) NOT NULL DEFAULT '0',
  `no_copies` int NOT NULL DEFAULT '100',
  `image` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`book_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--BOOKS_REQUEST
CREATE TABLE `books_request` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `genre` varchar(300) NOT NULL,
  `title` varchar(300) NOT NULL,
  `author` varchar(300) NOT NULL,
  `edition` int NOT NULL,
  `isbn` varchar(100) NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`request_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--CART
CREATE TABLE `cart` (
  `user_id` int NOT NULL,
  `book_id` int NOT NULL,
  `date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`,`book_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--ISSUE_BOOKS
CREATE TABLE `issue_books` (
  `issue_id` int NOT NULL AUTO_INCREMENT,
  `book_id` int NOT NULL,
  `user_id` int NOT NULL,
  `issue_date` varchar(40) DEFAULT NULL,
  `due_date` varchar(40) DEFAULT NULL,
  `is_return` varchar(10) DEFAULT 'False',
  PRIMARY KEY (`issue_id`,`user_id`,`book_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--FINE 
CREATE TABLE `fine` (
  `issue_id` int NOT NULL,
  `book_id` int NOT NULL,
  `user_id` int NOT NULL,
  `return_date` varchar(40) DEFAULT NULL,
  `fine_amt` decimal(10,3) DEFAULT NULL,
  PRIMARY KEY (`issue_id`,`user_id`,`book_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--INSERT Queries:

--BOOKS

INSERT INTO books
(`book_id`,`user_id`, `genre`, `title`, `author`, `publisher`,`edition`, `isbn`,`pages`, `date_added`, `soft_delete`,`no_copies` , `image`)
VALUES(13,2, 'Mystery', 'The Mysterious Affair at Styles', 'Agatha Christie', 'Agatha Publications', 2, 'zgdhdv2dfh81v31sdgj', 669, '2018-07-11', 0, 3, 'The Mysterious Affair at Styles.jpeg');

--USERS

INSERT INTO users
(`user_id`,`name`,`phone`,`email`,`is_admin`,`password`,`address`,`gender`,`soft_delete`,`image`)
VALUES(18, 'John Chang', '11711568524', 'john12@gmail.com', 0, 'orange','Marquis at waterview, Dallas', 'Male', 0, '1_John.jpeg' );

