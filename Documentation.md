# 📘 Internshala Backend API – Documentation

Base URL (Production):
https://internshala-backend-api.onrender.com


Authentication:
JWT-based authentication using HTTP-only cookies

🔐 Authentication Overview

On successful signup/signin, a JWT token is:
Generated
Stored in an HTTP-only cookie
Protected routes require the cookie token
Middleware: isAuthenticated

API Welcomes : 

🎓 Student
🏢 Employer

Each role has its own authentication & resources.

🎓 Student APIs

➤ Signup
POST /student/signup

Request Body
{
  "email": "student@example.com",
  "password": "123456",
  "firstName": "Raj",
  "lastName": "Sun",
  "city": "Mumbai",
  "contact": "9999999999",
  "gender": "male"
}

Response
{
  "success": true,
  "id": "student_id",
  "token": "jwt_token"
}

➤ Signin
POST /student/signin

{
  "email": "student@example.com",
  "password": "123456"
}

➤ Signout
GET /student/signout
Clears authentication cookie.

➤ Get Current Student
POST /student/user 🔒
Returns logged-in student details.

➤ Forgot Password
POST /student/forgot-password

{
  "email": "student@example.com"
}

📧 Sends password reset link via email.

➤ Reset Password
POST /student/reset-password/:id

{
  "password": "newpassword"
}

➤ Update Profile
POST /student/update-profile/:id 🔒

Updates student profile fields.

➤ Update Avatar
POST /student/update-avatar/:id 🔒

Form-Data
avatar: image file

📄 Resume APIs (Student)

Base Route: /resume
🔒 All routes are protected

➤ Get Resume
GET /resume

➤ Add Education
POST /resume/add-edu

{
  "college": "XYZ University",
  "degree": "B.Tech",
  "year": "2024"
}

➤ Edit Education
POST /resume/edit-edu/:id

➤ Delete Education
POST /resume/delete-edu/:id

🔁 Similar CRUD APIs Exist For:

Skills
Accomplishments
Courses
Projects
Responsibilities
Jobs
Internships

*Each section supports:*

add-<section>
edit-<section>/:id
delete-<section>/:id


Example:

POST /resume/add-skills
POST /resume/edit-project/:id
POST /resume/delete-internships/:id

🏢 Employer APIs
➤ Signup

POST /employer/signup

{
  "email": "hr@company.com",
  "password": "123456",
  "firstName": "HR",
  "lastName": "Manager",
  "orgName": "Tech Corp"
}

➤ Signin
POST /employer/signin

➤ Signout
GET /employer/signout

➤ Get Current Employer
POST /employer/user 🔒

➤ Update Profile
POST /employer/update-profile/:id 🔒

➤ Update Organization Logo
POST /employer/update-logo/:id 🔒

Form-Data

orgLogo: image file

💼 Internship APIs (Employer)
➤ Create Internship

POST /employer/create/internship 🔒

{
  "profile": "Web Developer",
  "internshipType": "remote",
  "openings": 2,
  "skillsRequired": ["HTML", "CSS", "JS"],
  "from": "2024-06-01",
  "to": "2024-08-01",
  "responsibility": "Frontend development",
  "duration": 2,
  "stipend": {
    "status": "Fixed",
    "amount": 8000
  },
  "perks": "Certificate",
  "assessment": "Yes"
}

➤ View All Internships

POST /employer/internships 🔒

➤ View Single Internship

POST /employer/internship/:id 🔒

🧑‍💼 Job APIs (Employer)
➤ Create Job

POST /employer/create/job 🔒

{
  "profile": "Backend Developer",
  "jobType": "remote",
  "openings": 1,
  "skillsRequired": ["Node.js", "MongoDB"],
  "description": "API development",
  "salary": { "amount": 600000 },
  "preferences": "1+ year experience",
  "perks": "Health Insurance",
  "assessment": "Technical Interview"
}

➤ View All Jobs
POST /employer/jobs 🔒

➤ View Single Job
POST /employer/job/:id 🔒

⚠️ Error Handling

All errors return structured JSON:
{
  "message": "User Not Found",
  "errName": "Error"
}


Handled errors:

Invalid credentials
Unauthorized access
Duplicate user
Invalid/expired token
Missing fields

🔐 Security Features
Password hashing using bcrypt
JWT authentication
HTTP-only cookies
Protected routes
Token expiration handling

🌐 Deployment

Hosted on Render
MongoDB Atlas
ImageKit for image storage
Gmail SMTP for email

🔗 Live API:
https://internshala-backend-api.onrender.com

👨‍💻 Author

Raj Sunmukhani
GitHub: https://github.com/rajsunmukhani

Do appreciate with a star if you liked this. ⭐