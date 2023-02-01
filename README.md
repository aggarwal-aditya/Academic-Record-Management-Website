# AcademicProject

## Dependencies - 

```
sudo apt install nodejs

```


## Step to be followed - 
```
git clone https://github.com/aggarwal-aditya/AcademicProject
cd AcademicProject
npm install
node app.js
```



## APIs available

- /signup: name, email, role, advisor. Advisor can be empty for instructors and admin. Available Role: admin, instructor, student(Case-sensitive).
- /login: send email at this route. Otp will be sent.
- login/otp-verification: Send email and otp entered by the user. Receive success or failure messege. If the user is not registered, receive an http response with error code 401.
- /instructor/addcourse: takes name and code. code must be 5 chars long. Adds the course with the mail of instructor
- /courses : Takes two optional parameter instructormail(email of instructor), listofcodes(array containing list of courses codes(strings) to be searched). Returns all courses that match the criteria. Not giving parameter means return all.
- /courses/gettickets: Make a GET request with the course code to see all pending/rejected/enrolled tickets of the course
- /pending: Make a get request. A list of JSON objects will be returned denoting the tickets which are pending for approval at this user.
- /approve: Make a post request to approve the course. Send _id of the ticket in the body. _id will be available with ticket received from /pending.
- /reject: Make a POST request with the _id. It will reject the course enrolment.
- /logout: Make DELETE request. Logs the user out.
- /enrol: Make a post request with the course code. Send an enrolment ticket to the instructor for approval.
- /getenrolmentstatus: Returns all the tickets of the student along with its _id.
- /drop: Make a DELETE request with the _id. The course will be dropped
