# SkillSprint AI 🚀

An AI-powered Opportunity Operating System for college students that helps discover internships, hackathons, scholarships, and fellowships while providing AI-driven eligibility analysis, application tracking, resume intelligence, and GitHub profile insights — all from a single student profile.

---

## ✨ Features

### 🎯 Opportunity Discovery
- Discover internships
- Find hackathons and coding competitions
- Explore scholarships and fellowships
- Bookmark opportunities for later

### 🤖 AI-Powered Analysis
- Eligibility analysis using Google Gemini
- Resume analysis and improvement suggestions
- Skill gap identification
- Personalized recommendations

### 📊 Application Management
- Kanban board for tracking applications
- Application status monitoring
- Opportunity management dashboard

### 💻 Developer Intelligence
- GitHub profile analysis
- Skill extraction from repositories
- Technical profile insights

### 👤 Student Dashboard
- Personalized student profile
- Saved opportunities
- Progress tracking
- Application overview

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- shadcn/ui
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### AI Integration
- Google Gemini API

---

## 📁 Project Structure

```text
SprintAi2026/
│
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── seed.js
│   └── server.js
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── hooks/
│       └── lib/
│
├── .gitignore
└── README.md
```

---

## ⚙️ Prerequisites

Before running the project, ensure you have:

- Node.js (v18 or later)
- MongoDB Atlas or Local MongoDB
- Google Gemini API Key

Get your Gemini API Key from:

https://aistudio.google.com/apikey

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/artisharma9260/SprintAi2026.git
cd SprintAi2026
```

---

## 🔧 Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
MONGO_URL=your_mongodb_connection_string
DB_NAME=skillsprintai
JWT_SECRET=your_secret_key
NODE_PORT=8002
CORS_ORIGINS=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash
```

Start the backend server:

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:8002
```

---

## 🎨 Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
REACT_APP_BACKEND_URL=http://localhost:8002
```

Start the frontend:

```bash
npm start
```

Frontend runs at:

```text
http://localhost:3000
```

---

## 📜 Available Scripts

### Backend

Run development server:

```bash
npm run dev
```

Run production server:

```bash
npm start
```

Seed sample opportunities:

```bash
npm run seed
```

### Frontend

Start development server:

```bash
npm start
```

Create production build:

```bash
npm run build
```

---

## 🔐 Environment Variables

### Backend

| Variable | Description |
|-----------|------------|
| MONGO_URL | MongoDB Connection String |
| DB_NAME | Database Name |
| JWT_SECRET | JWT Secret Key |
| NODE_PORT | Backend Port |
| CORS_ORIGINS | Allowed Origins |
| GEMINI_API_KEY | Google Gemini API Key |
| GEMINI_MODEL | Gemini Model Name |

### Frontend

| Variable | Description |
|-----------|------------|
| REACT_APP_BACKEND_URL | Backend Base URL |

---

## 🌟 Future Enhancements

- AI Resume Builder
- AI Interview Preparation
- LinkedIn Profile Analysis
- Smart Opportunity Recommendation Engine
- Email Notifications
- Student Passport Scoring System
- AI Skill Roadmap Generator
- Application Deadline Reminders
- Resume ATS Score Checker


## 🎯 Project Vision

SkillSprint AI aims to become a centralized platform where students can manage their career growth, discover opportunities, analyze their skills, and track their professional journey using AI-powered insights.

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Commit your changes
5. Push to your branch
6. Create a Pull Request

---

## 📄 License

This project is intended for educational and portfolio purposes.

---
