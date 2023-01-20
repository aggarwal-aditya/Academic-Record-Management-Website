# AcademicProject

create a new email for yourself to test this code. Add the passowrd and email in the app.js file

## APIs available

- /signup: name, email, role, advisor. Advisor can be empty for instructors and admin. Available Role: admin, instructor, student(Case-sensitive).
- /login: send email at this route. Otp will be sent.
- login/otp-verification: Send email and otp entered by the user. Receive success or failure messege. If the user is not registered, receive an http response with error code 401.