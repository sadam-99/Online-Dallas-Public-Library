var db = require.main.require('./models/config');

var getUserRooms = (callback) => {
    var sql = "SELECT * FROM study_rooms";
    db.executeQuery(sql, null, function(result) {
        callback(result);
    });
};

module.exports = {
    getUserRooms}
    // searchBy,
    // createBook,
    // getBook,
    // updateBook,
    // deleteBook,
    // issueBook,
    // unissueBook,
    // getIssuedBooks,
    // getUnborrowedBooks,
    // bookRequest,
    // customerSearch,
    // getRequestedBooks,
    // bookRequestSearch,
    // setIssueDate,
    // booksIssuedByCustomer,
    // getAllBorrowedBooks,
    // totalBorrowed30,
    // mostRequestedBook,
    // mostBorrowedBook };
