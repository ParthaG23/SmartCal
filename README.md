# CalcVision – Frontend Calculator Platform

CalcVision is a modern **frontend-only calculator platform** built with **React + Vite**.
It provides a collection of calculators for **finance, health, math, science, and daily utilities**, all in a clean and responsive interface.

All calculation logic runs **client-side** — no backend server, no database, no accounts required.

---

## 🌐 Live Demo

**Frontend (Vercel)**
https://smart-cal-tan.vercel.app/

---

## 🚀 Features

* 13+ calculator types across multiple categories
* All calculations run instantly in-browser (no API calls)
* Interactive charts & visualizations (Recharts)
* Responsive premium UI with dark / light theme
* Framer Motion animations throughout
* Zero backend dependencies — purely static frontend
* No accounts, no tracking, no data collection

---

## 🧱 Tech Stack

* **React 19** — UI framework
* **Vite** — Build tool & dev server
* **Tailwind CSS** — Utility-first styling
* **Framer Motion** — Animations
* **Recharts** — Charts & data visualizations
* **React Router** — Client-side routing

### Deployment

* **Hosting:** Vercel (or any static host)

---

## 📂 Project Structure

```
SmartCal/
├── Frontend/
│   ├── src/
│   │   ├── engine/                # Calculator logic (fully client-side)
│   │   │   ├── calculatorEngine.js    # Registry & runner
│   │   │   └── calculators/           # Individual calculator modules
│   │   │       ├── age.js
│   │   │       ├── average.js
│   │   │       ├── bmi.js
│   │   │       ├── compoundInterest.js
│   │   │       ├── discount.js
│   │   │       ├── emi.js
│   │   │       ├── factorial.js
│   │   │       ├── fuelCost.js
│   │   │       ├── gst.js
│   │   │       ├── percentage.js
│   │   │       ├── simpleInterest.js
│   │   │       ├── temperature.js
│   │   │       └── tip.js
│   │   │
│   │   ├── services/
│   │   │   └── api.js                 # Client-side API adapter
│   │   │
│   │   ├── context/
│   │   │   └── ThemeContext.jsx       # Dark/light theme state
│   │   │
│   │   ├── components/            # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── CalculatorCard.jsx
│   │   │   └── CategorySection.jsx
│   │   │
│   │   ├── pages/                 # Route pages
│   │   │   ├── Home.jsx
│   │   │   ├── CalculatorPage.jsx
│   │   │   ├── Categories.jsx
│   │   │   ├── About.jsx
│   │   │   └── NotFound.jsx
│   │   │
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

---

## ⚙️ Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/ParthaG23/SmartCal.git
cd SmartCal/Frontend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run Dev Server

```bash
npm run dev
```

App runs at:

```
http://localhost:5173
```

---

## 🌐 Deployment (Vercel)

```bash
vercel
```

No environment variables needed — everything runs client-side.

---

## 📊 Available Calculators

| Calculator | Category | Description |
|---|---|---|
| BMI | Health | Body Mass Index with ideal weight, body fat estimate |
| EMI | Finance | Monthly installment with amortization breakdown |
| Compound Interest | Finance | Growth with inflation, SIP, and CAGR |
| Simple Interest | Finance | Basic interest calculation with growth chart |
| GST | Finance | Tax breakdown across all slabs |
| Discount | Shopping | Savings at various discount percentages |
| Tip | Personal | Bill split and tip comparison |
| Fuel Cost | Travel | Trip cost with mileage & price sensitivity |
| Age | Personal | Exact age with life milestones |
| Average | Math | Mean, deviation, and distribution |
| Factorial | Math | Factorial with growth visualization |
| Percentage | Math | Percentage gauge with value chart |
| Temperature | Science | Celsius, Fahrenheit, Kelvin conversion |

---

## 🔒 Privacy

* No accounts or login required
* No data leaves your browser
* No tracking, no cookies, no analytics
* Purely static — can run offline once loaded

---

## 🧑‍💻 Author

Partha Gayen

GitHub: https://github.com/ParthaG23

---

## 📜 License

MIT License
