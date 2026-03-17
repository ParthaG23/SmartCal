# CalcVision – Full Stack Calculator Platform

CalcVision is a modern **full-stack calculator platform** built with the **MERN stack**.
It provides a collection of calculators for **finance, health, math, science, and daily utilities**, all in a clean and responsive interface.

The platform dynamically loads calculator definitions from the backend so new calculators can be added without modifying the frontend.

---
## 🌐 Live Demo

You can try the deployed CalcVision platform here:

**Frontend (Vercel)**
https://smart-cal-tan.vercel.app/

**Backend API (Render)**
https://smartcal-rusc.onrender.com

Example API endpoint:

```
https://smartcal-rusc.onrender.com/api/calculators
```

⚠️ Note: The backend runs on Render's free tier, so the first request may take **30–50 seconds** if the server was inactive.

---

## 🚀 Features

* Multiple calculator categories
* Dynamic calculator configuration from API
* Responsive premium UI
* Dark / Light theme support
* Calculator history
* Unit conversion support
* Backend API for calculations
* MongoDB database for calculator metadata
* Secure API with Helmet, CORS, and rate limiting
* Production deployment ready

---


## 🧱 Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Framer Motion
* Axios
* React Router

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* Helmet
* CORS
* Compression
* Morgan logging

### Deployment

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** MongoDB Atlas

---

## 📂 Project Structure

```
SMARTCAL/
│
├── backend/
│   ├── src/
│   │   ├── config/              # Config files
│   │   │   ├── db.js
│   │   │   ├── firebaseAdmin.js
│   │   │   └── cors.js
│   │   │
│   │   ├── controllers/         # Route logic
│   │   │   ├── authController.js
│   │   │   ├── calculatorController.js
│   │   │   └── historyController.js
│   │   │
│   │   ├── routes/              # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── calculatorRoutes.js
│   │   │   └── historyRoutes.js
│   │   │
│   │   ├── middlewares/         # Middleware
│   │   │   ├── authMiddleware.js
│   │   │   ├── firebaseAuth.js
│   │   │   └── errorHandler.js
│   │   │
│   │   ├── models/              # MongoDB models
│   │   │   ├── userModel.js
│   │   │   └── historyModel.js
│   │   │
│   │   ├── services/            # Business logic
│   │   │   ├── calculator/
│   │   │   │   ├── emi.js
│   │   │   │   ├── factorial.js
│   │   │   │   ├── fuelCost.js
│   │   │   │   ├── gst.js
│   │   │   │   ├── percentage.js
│   │   │   │   ├── simpleInterest.js
│   │   │   │   ├── temperature.js
│   │   │   │   ├── tip.js
│   │   │   │   └── index.js      # export all calculators
│   │   │   │
│   │   │   └── calculatorEngine.js
│   │   │
│   │   ├── utils/               # Helpers
│   │   │   ├── logger.js
│   │   │   ├── response.js
│   │   │   └── validators.js
│   │   │
│   │   ├── constants/           # Static configs
│   │   │   └── calculatorTypes.js
│   │   │
│   │   ├── app.js               # Express app
│   │   └── server.js            # Server start
│   │
│   ├── .env
│   ├── package.json
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   │
│   │   ├── components/          # Reusable UI
│   │   │   ├── ui/
│   │   │   ├── layout/
│   │   │   └── common/
│   │   │
│   │   ├── pages/               # Pages
│   │   │   ├── Home.jsx
│   │   │   ├── Calculator.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Dashboard.jsx
│   │   │
│   │   ├── features/            # Feature-based logic
│   │   │   ├── calculator/
│   │   │   ├── auth/
│   │   │   └── history/
│   │   │
│   │   ├── context/             # React Context
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   │
│   │   ├── services/            # API calls
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   └── calculatorService.js
│   │   │
│   │   ├── config/
│   │   │   └── firebase.js
│   │   │
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   │
│   │   ├── styles/
│   │   │   └── globals.css
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── package.json
│   └── index.html
│
├── README.md
└── .gitignore
```

---

## ⚙️ Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/SmartCal.git
cd SmartCal
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection
ALLOWED_ORIGINS=http://localhost:5173
```

Run server

```bash
npm run dev
```

Server runs at

```
http://localhost:5000
```

Health check

```
http://localhost:5000/api/health
```

---

## Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`

```
VITE_API_URL=http://localhost:5000/api
```

Run frontend

```bash
npm run dev
```

Frontend runs at

```
http://localhost:5173
```

---

## 🌐 Deployment

### Frontend (Vercel)

Add environment variable:

```
VITE_API_URL=https://smartcal-rusc.onrender.com

Deploy with:

```
vercel
```

---

### Backend (Render)

Environment variables:

```
PORT=5000
NODE_ENV=production
MONGO_URI=your_mongodb_connection
ALLOWED_ORIGINS=https://your-vercel-domain.vercel.app
```

---

## 🔌 API Endpoints

### Health Check

```
GET /api/health
```

---

### Get Calculators

```
GET /api/calculators
```

Returns all calculator definitions.

---

### Run Calculator

```
POST /api/calculators/:type
```

Example:

```
POST /api/calculators/bmi
```

Body:

```json
{
  "weight": 70,
  "height": 175
}
```

---

## 📊 Example Calculators

* BMI Calculator
* EMI Calculator
* Compound Interest
* Discount Calculator
* Fuel Cost Calculator
* Age Calculator
* Average Calculator
* Factorial Calculator

---

## 🔒 Security

The backend uses:

* Helmet security headers
* Rate limiting
* CORS origin control
* JSON body size limits

---

## 🧑‍💻 Author

Partha Gayen

GitHub
https://github.com/ParthaG23

---

## 📜 License

MIT License
