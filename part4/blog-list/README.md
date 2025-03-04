Notes:

4.15
    To create the user and test the exercise, you can make a request using REST or POSTMAN.
    Then in the url http://localhost:3003/api/users you can see the result of the operation

4.16
    On response to the post request
    - Invalid username
        status code: 400
        error: "User validation failed: username: Path `username` (`aa`) is shorter than the minimum allowed length (3)."

    - No username
        status code: 400
        error: "User validation failed: username: Path `username` is required."

    - Invalid password
        status code: 400
        error: "the password must be at least 3 character long"

    - No password
        status code: 400
        error: 

4.17
    Remenber that blogs can be deleted, but with the current code, if one blog is added to the user blogs, it cannot be deleted from the array.

4.22
    request.user represent the User object!

4.23
    Token changes are only asked to the post and delete operation, not update. 
    In a real case, this changes should also be done!