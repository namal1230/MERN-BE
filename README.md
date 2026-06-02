Smart Blog Backend (Express API)
-------------------------------------------------------------------------------------------------------------------------------------------
Live API: https://mern-be-production.up.railway.app

A powerful backend for Smart Blog for Developers, built with Express.js and MongoDB Atlas. This API handles authentication, file storage, PDF generation, logging, and more, providing a robust backend for modern web applications.

Table of Contents
-------------------------------------------------------------------------------------------------------------------------------------------
Features

Technologies Used

Security

Database

Setup & Installation

Deployment

Features
-------------------------------------------------------------------------------------------------------------------------------------------
PDF Generation with Puppeteer

Convert content into formatted PDF files.

Download generated PDFs easily.

Cloudinary Integration

Upload and store images and videos securely in the cloud.

Logging

Automatic logging of requests and actions using Morgan.

Authentication & Security

Secure user authentication using JWT and bcrypt.

CORS Policy

Handles cross-origin requests securely.

Technologies Used
-------------------------------------------------------------------------------------------------------------------------------------------
Backend Framework: Express.js

Database: MongoDB Atlas

Authentication & Security: JSON Web Tokens, bcrypt, CORS

File Handling & Storage: Multer, Cloudinary

PDF Generation: Puppeteer

Middleware & Utilities: morgan, body-parser, cookie-parser, dotenv

Deployment: Railway

Security
-------------------------------------------------------------------------------------------------------------------------------------------
JWT – Protects routes and ensures secure user authentication.

bcrypt – Hashes passwords before storing them in the database.

CORS Policy – Restricts unauthorized cross-origin requests.

Database
-------------------------------------------------------------------------------------------------------------------------------------------
MongoDB Atlas – Cloud-hosted MongoDB for scalable and secure data storage.

Setup & Installation
-------------------------------------------------------------------------------------------------------------------------------------------
Clone the repository:

git clone <repo-url>
cd smart-blog-backend


Install dependencies:

npm install


Create a .env file and configure:

PORT=5000
MONGO_URI=<your-mongodb-atlas-uri>
JWT_SECRET=<your-secret-key>
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>


Start the development server:

npm run dev

Deployment
-------------------------------------------------------------------------------------------------------------------------------------------
The backend API is deployed on Railway:
https://mern-be-production.up.railway.app

License
-------------------------------------------------------------------------------------------------------------------------------------------
This project is open-source and available under the MIT License.
