### Tables required for Online Library DB(DB Name:  database: "library_db"):
## Table Name: Attributes

book : book_id (INT), title(VARCHAR), authorFname(VARCHAR), authorLname(VARCHAR), branch_id(VARCHAR), no_of_copies(INT)
book_loans: book_id, branch_id, loan_id, card_no, date_out, due_date, date_in
fines:     loan_id, fine_amt, paid
borrower: fname, lname, email, address, phone, card_no
book_copies: book_id, branch_id, no_of_copies



<!-- /bookList/:book_id/:title/:authorFname/:authorFname
/bookLoanList/:card_no/:book_id/:fname/:lname
/fetchTotalFineAmt/:cardNo/' -->

## SQL Queries:

CREATE TABLE `library_db`.`book` (
  `book_id` INT NOT NULL,
  `title` VARCHAR(45) NULL,
  `authorFname` VARCHAR(45) NULL,
  `authorLname` VARCHAR(45) NULL,
  `branch_id` VARCHAR(45) NULL,
  `no_of_copies` INT NULL,
  PRIMARY KEY (`book_id`));

<!-- To Insert the Books data -->
INSERT INTO `library_db`.`book` (`book_id`, `title`, `authorFname`, `authorLname`, `branch_id`, `no_of_copies`) VALUES ('1', 'WPL', 'Nurcan', 'Yuruk', 'A1', '5');
INSERT INTO `library_db`.`book` (`book_id`, `title`, `authorFname`, `authorLname`, `branch_id`, `no_of_copies`) VALUES ('2', 'ML', 'Andrew', 'Ng', 'A2', '19');

CREATE TABLE `library_db`.`borrower` (
  `fname` VARCHAR(45) NULL,
  `lname` VARCHAR(45) NULL,
  `email` VARCHAR(45) NOT NULL,
  `address` VARCHAR(45) NULL,
  `phone` VARCHAR(45) NULL,
  PRIMARY KEY (`email`));

CREATE TABLE `library_db`.`book_loans` (
  `book_id` VARCHAR(45) NOT NULL,
  `branch_id` VARCHAR(45) NULL,
  `loan_id` VARCHAR(45) NULL,
  `card_no` VARCHAR(45) NULL,
  `date_out` DATE NULL,
  `due_date` DATE NULL,
  `date_in` DATE NULL,
  PRIMARY KEY (`book_id`));

CREATE TABLE `library_db`.`book_copies` (
  `book_id` VARCHAR(45) NOT NULL,
  `branch_id` VARCHAR(45) NULL,
  `no_of_copies` VARCHAR(45) NULL,
  PRIMARY KEY (`book_id`));


CREATE TABLE `library_db`.`fines` (
  `loan_id` VARCHAR(45) NOT NULL,
  `fine_amt` FLOAT NULL,
  `paid` TINYINT(1) NULL,
  PRIMARY KEY (`loan_id`));

