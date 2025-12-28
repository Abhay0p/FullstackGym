# Fullstack Gym Management System 

A robust, secure, and responsive web application designed to manage gym memberships and user authentication. Built with a decoupled architecture using a **Node.js/Express backend** and a lightweight **Vanilla JavaScript frontend**.

![Project Screenshot](https://via.placeholder.com/800x400?text=Add+Your+Screenshot+Here)
*(Add a screenshot of your landing page here)*

## 🚀 Project Overview

This project was built to solve the challenge of managing user access and membership plans securely across different hosting environments. It demonstrates a complete **authentication flow** (Register → Login → Protected Routes) without relying on heavy frontend frameworks, focusing instead on core JavaScript fundamentals and DOM manipulation.

**Live Demo:** [fullstackgymx.netlify.app]  
**Backend API:** [https://fullstackgym.onrender.com]

## ✨ Key Features

* **🔐 Secure Authentication:** Implemented **JWT (JSON Web Tokens)** for stateless session management and **Bcrypt** for password hashing.
* **🛡️ Protected Routes:** Custom frontend middleware (`guard.js`) prevents unauthorized access to member-only pages like `membership.html`.
* **📱 Responsive UI:** Fully responsive design using **Bootstrap 5** and custom CSS, optimized for mobile and desktop.
* **🗄️ NoSQL Database:** Utilized **MongoDB** (via Mongoose) for flexible and scalable user data storage.
* **🌐 Cross-Origin Communication:** Successfully handled complex **CORS** policies to allow the frontend (Netlify) to securely communicate with the backend (Render).

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, Bootstrap 5, Vanilla JavaScript (ES6+).
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB Atlas.
* **Security:** JWT, Bcrypt.js, CORS.
* **Tools:** Postman (API Testing), VS Code, Git/GitHub.

## ⚙️ How to Run Locally

Follow these steps to get the project running on your machine:

**1. Clone the repository**
```bash
git clone [https://github.com/Abhay0p/FullStackGym.git](https://github.com/Abhay0p/FullStackGym.git)
cd FullStackGym
