# 🎯 Internshala Backend API (Production-Grade)

A **full-featured Internshala-inspired Backend API** built using **Node.js, Express.js, and MongoDB**, designed to handle **Students, Employers, Resume Management, Jobs, and Internships** with secure authentication and scalable architecture.

> 🚀 Live API: https://internshala-backend-api.onrender.com/  
> 👨‍💻 Developer: [Raj Sunmukhani](https://github.com/rajsunmukhani)

---

## 📌 Why This Project?
This project demonstrates **real-world backend engineering skills**, including:
- Secure authentication using **JWT & HTTP-only cookies**
- Role-based architecture (**Student & Employer**)
- Complex **resume builder logic**
- Job & Internship posting system
- Email-based password reset
- Cloud-based image uploads
- Production deployment on **Render**

This is **not a tutorial project** — it reflects **industry-level backend practices**.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT + Cookies
- **Security:** bcrypt, httpOnly cookies
- **File Uploads:** ImageKit
- **Email Service:** Nodemailer (Gmail SMTP)
- **Deployment:** Render
- **Architecture:** MVC Pattern

---

## 👥 User Roles & Features

### 🎓 Student
- Signup / Signin / Signout
- JWT-based authentication
- Forgot & Reset password (email link)
- Profile & avatar upload
- **Complete Resume Builder**:
  - Education
  - Skills
  - Accomplishments
  - Courses
  - Projects
  - Responsibilities
  - Jobs
  - Internships

---

### 🏢 Employer
- Signup / Signin / Signout
- Secure authentication
- Organization profile & logo upload
- Create & manage:
  - Internships
  - Jobs
- View all & individual job/internship listings

---

## 📄 Resume Builder (Core Highlight)
A deeply structured resume system where students can:
- Add / Edit / Delete each resume section
- Manage nested resume data using UUIDs
- Store resume data directly in MongoDB

This showcases **advanced data modeling and update logic**.

---

## 🔐 Authentication Flow
- JWT generated on login/signup
- Stored in **HTTP-only cookies**
- Protected routes via `isAuthenticated` middleware
- Token validation on every secured request
- Secure cookie handling for production (`NODE_ENV=production`)

---

## 📡 API Route Overview

### Student Routes
POST /student/signup
POST /student/signin
GET /student/signout
POST /student/user
POST /student/update-profile/:id
POST /student/update-avatar/:id
POST /student/forgot-password
POST /student/reset-password/:id


### Resume Routes (Protected)
POST /employer/signup
POST /employer/signin
GET /employer/signout
POST /employer/create/internship
POST /employer/internships
POST /employer/create/job
POST /employer/jobs


---

## 🧩 Project Structure
Internshala-API/
│
├── Controllers/
│ ├── EmployerController.js
│ ├── IndexController.js
│ └── ResumeController.js
│
├── Models/
│ ├── StudentModel.js
│ ├── EmployerModel.js
│ ├── internships.js
│ ├── jobs.js
│ └── Database.js
│
├── Middlewares/
│ ├── Auth.js
│ ├── Error.js
│ └── catchAsyncErrors.js
│
├── Router/
│ ├── IndexRouter.js
│ ├── EmployerRouter.js
│ └── ResumeRouter.js
│
├── utils/
│ ├── ErrorHandler.js
│ ├── imagekit.js
│ ├── nodemailer.js
│ └── sendToken.js
│
├── app.js
└── .env


---

## ⚙️ Environment Variables

Create a `.env` file and add:

```env
PORT=
MONGODB_URL=
SESSION_SECRET=
JWT_SECRET=
JWT_EXPIRY=
TOKEN_EXPIRY=
US_MAIL=
US_PASS=
IMAGEKIT_PUBLICKEY=
IMAGEKIT_PRIVATEKEY=
IMAGEKIT_URL_ENDPOINT=
NODE_ENV=


🚀 Local Setup
git clone https://github.com/rajsunmukhani/Internshala-API.git
cd Internshala-API
npm install
npm start

Server runs on:
http://localhost:3000

🌐 Live Deployment

This project is deployed on Render:

🔗 https://internshala-backend-api.onrender.com/

🧠 Key Learnings Demonstrated

MVC backend architecture
Secure authentication with cookies
MongoDB relational modeling
Resume builder logic
Error handling & async safety
Real-world API design
Cloud deployment experience

🙌 Author

Raj Sunmukhani
🔗 GitHub: https://github.com/rajsunmukhani

If you’re a recruiter or developer reviewing this project —
thank you for your time! 

Do appreciate with a star if you liked this ⭐