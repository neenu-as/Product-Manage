# Product Management Application

# Project Overview

This is a **Product Management Application** built using the **MERN stack** (MongoDB, Express, React, Node.js). The application allows users to manage products with categories, subcategories, and multiple variants. Features include authentication, product CRUD operations, and a clean separation between frontend and backend. ## Technical Highlights - Backend follows a simplified **MVC-like structure** (models in backend/models/ and routes in backend/index.js) - Frontend uses **React.js** with components for Home, Login, Signup, Navbar, and Product management. - Images and uploads are stored in backend/uploads/ - node\_modules/ is excluded via .gitignore for clean repository. Setup Instructions ### Backend 1. Navigate to the backend folder:
bash
cd backend



Install dependencies:

npm install



Start the backend server:

npm run dev



The server runs on http://localhost:5000 (default port)

Frontend

Navigate to the frontend folder:

cd frontend



Install dependencies:

npm install



Start the React app:

npm start



The app runs on http://localhost:3000 (default React port)

How to Run the Application

Start the backend server first (npm run dev in backend folder)

Start the frontend app (npm start in frontend folder)

Open the browser at http://localhost:3000 to use the application.



Images are stored locally in backend/uploads/.

Authentication is implemented with basic signup and login .



Folder Structure
NIFAAMAIT/
│
├── backend/
│   ├── models/
│   ├── uploads/
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md

