-- ## SQL Queries:

-- BOOK Table
CREATE TABLE `library_db`.`book` (
  `book_id` INT NOT NULL,
  `title` VARCHAR(45) NULL,
  `authorFname` VARCHAR(45) NULL,
  `authorLname` VARCHAR(45) NULL,
  `branch_id` VARCHAR(45) NULL,
  `no_of_copies` INT NULL,
  PRIMARY KEY (`book_id`));

-- INSERT Query To Insert the Books data -->
INSERT INTO `library_db`.`book` (`book_id`, `title`, `authorFname`, `authorLname`, `branch_id`, `no_of_copies`) VALUES ('1', 'WPL', 'Nurcan', 'Yuruk', 'A1', '5');
INSERT INTO `library_db`.`book` (`book_id`, `title`, `authorFname`, `authorLname`, `branch_id`, `no_of_copies`) VALUES ('2', 'ML', 'Andrew', 'Ng', 'A2', '19');

-- BOOK borrower
CREATE TABLE `library_db`.`borrower` (
  `fname` VARCHAR(45) NULL,
  `lname` VARCHAR(45) NULL,
  `email` VARCHAR(45) NOT NULL,
  `address` VARCHAR(45) NULL,
  `phone` VARCHAR(45) NULL,
  PRIMARY KEY (`email`));

-- To Insert the borrower data -->

-- BOOK borrower
CREATE TABLE `library_db`.`book_loans` (
  `book_id` VARCHAR(45) NOT NULL,
  `branch_id` VARCHAR(45) NULL,
  `loan_id` VARCHAR(45) NULL,
  `card_no` VARCHAR(45) NULL,
  `date_out` DATE NULL,
  `due_date` DATE NULL,
  `date_in` DATE NULL,
  PRIMARY KEY (`book_id`));

-- To Insert the book_loans data -->


-- BOOK book_copies
CREATE TABLE `library_db`.`book_copies` (
  `book_id` VARCHAR(45) NOT NULL,
  `branch_id` VARCHAR(45) NULL,
  `no_of_copies` VARCHAR(45) NULL,
  PRIMARY KEY (`book_id`));
-- INSERT Query to Insert the book_copies data -->


-- BOOK fines
CREATE TABLE `library_db`.`fines` (
  `loan_id` VARCHAR(45) NOT NULL,
  `fine_amt` FLOAT NULL,
  `paid` TINYINT(1) NULL,
  PRIMARY KEY (`loan_id`));

-- To Insert the fines data -->

