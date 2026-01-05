🚀 MERN Full-Stack Application

A full-stack web application built using the MERN stack (MongoDB, Express.js, React, Node.js) with modern best practices, secure authentication, and a scalable architecture.

📌 Features

🔐 Authentication & Authorization (JWT / Refresh Token)

👥 Role-based access (User / Admin)

📝 CRUD operations

📦 RESTful API

⚡ Responsive UI (Material UI / Tailwind / CSS)

🔄 Persistent login

🛡 Secure API routes

📊 Clean and scalable project structure

🛠 Tech Stack
Frontend

React

TypeScript / JavaScript

React Router

Context API

Material UI / Tailwind CSS

Axios

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT Authentication

Cookie-based Refresh Tokens

📂 Project Structure
mern-project/
│
├── client/                 # Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── routes/
│   └── package.json
│
├── server/                 # Backend (Node + Express)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── package.json
│
└── README.md

⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/your-username/your-repo-name.git

2️⃣ Install dependencies
Backend
cd server
npm install

Frontend
cd client
npm install

🔑 Environment Variables

Create a .env file inside the server folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
CLIENT_URL=http://localhost:3000

▶️ Run the Application
Start Backend
cd server
npm run dev

Start Frontend
cd client
npm start


Frontend runs on:
👉 http://localhost:3000

Backend runs on:
👉 http://localhost:5000

🔐 Authentication Flow

User logs in

Access Token returned

Refresh Token stored in HTTP-only cookie

Persistent login using refresh token

Protected routes based on roles

📡 API Endpoints (Example)
Method	Endpoint	Description
POST	/api/auth/login	Login user
POST	/api/auth/register	Register user
GET	/api/users/me	Get user profile
POST	/api/auth/refresh	Refresh access token
POST	/api/auth/logout	Logout user
🧪 Future Improvements

🔔 Notifications

📸 Image upload (Cloudinary)

📈 Analytics dashboard

🧪 Unit & Integration testing

🌍 Deployment (AWS / Render / Vercel)

👨‍💻 Author

Namal Dilmith
Software Engineering Student | MERN Stack Developer

GitHub: [your-github-profile]

LinkedIn: [your-linkedin-profile]

⭐ Show Your Support

If you like this project, give it a ⭐ on GitHub!
