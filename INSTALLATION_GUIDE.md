# Grocery E-Commerce Website Installation Guide

Welcome! This guide will help you set up and run your full MERN stack Grocery E-Commerce Website, including the React frontend, Node.js backend, MongoDB database, admin dashboard, authentication, email notifications, and WhatsApp support.

---

## 1. Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js & npm](https://nodejs.org/) (v18 or above recommended)
- [Git](https://git-scm.com/)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) (for local setup)
- [Vercel CLI](https://vercel.com/docs/cli) (for frontend deployment)
- [Render account](https://render.com/) (for backend deployment)

---

## 2. Clone the Project

Open your terminal and run:

```bash
git clone https://github.com/your-username/grocery_ecommerce.git
cd grocery_ecommerce
```

---

## 3. Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

Open a new terminal, then:

```bash
cd frontend
npm install
```

---

## 4. Set Environment Variables

### Backend

1. In the `backend` folder, create a file named `.env`.
2. Add the following variables (replace values as needed):

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/grocerydb
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
WHATSAPP_API_KEY=your_whatsapp_api_key
```

### Frontend

1. In the `frontend` folder, create a file named `.env`.
2. Add the following variables:

```
VITE_API_URL=http://localhost:5000/api
```

---

## 5. Setup MongoDB Locally

- Start MongoDB server:

  ```bash
  mongod
  ```
- The default connection string is `mongodb://localhost:27017/grocerydb` (as set above).
- You can use [MongoDB Compass](https://www.mongodb.com/products/compass) for a GUI.

---

## 6. Run the Project Locally

### Start Backend

```bash
cd backend
npm run dev
```

- The backend will run on [http://localhost:5000](http://localhost:5000)

### Start Frontend

```bash
cd frontend
npm run dev
```

- The frontend will run on [http://localhost:5173](http://localhost:5173) (default Vite port)

---

## 7. Deploying the Project

### Backend (Render)

1. Push your code to GitHub (if not already).
2. Go to [Render](https://render.com/), create a new Web Service, and connect your GitHub repo.
3. Set the build command to `npm install` and the start command to `npm run start`.
4. Add all required environment variables in the Render dashboard.
5. Deploy the service.

### Frontend (Vercel)

1. Push your code to GitHub (if not already).
2. Go to [Vercel](https://vercel.com/), import your frontend repo.
3. Set the environment variable `VITE_API_URL` to your Render backend URL (e.g., `https://your-backend.onrender.com/api`).
4. Deploy the project.

---

## 8. Additional Notes

- **Admin Dashboard:** Access via `/admin` route after logging in as an admin.
- **JWT Authentication:** Handled automatically; tokens are stored securely.
- **Email Notifications:** Ensure correct email credentials in `.env`.
- **WhatsApp Support:** Set up your WhatsApp API key in `.env`.

---

For any issues, check the README files in `backend` and `frontend` folders or contact the project maintainer.

Happy coding! 🚀
