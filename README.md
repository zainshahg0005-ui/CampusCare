# 🎓 CampusCare – Student Complaint Management System `v2.4.10`

> **Current Version:** `v2.4.10` (Production Ready)  
> **Changelog & Rollback Guide:** See [CHANGELOG.md](CHANGELOG.md) for full version history and 1-click rollback procedures.  
> **Live Website:** [https://campuscare-livid.vercel.app/](https://campuscare-livid.vercel.app/)

**CampusCare** is a modern, responsive full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application designed for colleges and universities. It bridges the communication gap between students and campus administrators, allowing students to report facility issues (classrooms, Wi-Fi, electricity, washrooms, labs, etc.) and administrators to review, dispatch maintenance teams, and resolve complaints in real time.

---

## 🌟 Key Features

### 💬 Help & Services Chat Desk (v2.4.0)
- **Registered Members Gate:** Sign-in gate enforces authentication before chatting with administrators.
- **Dashboard Chat Continuity:** Carry on real-time discussions directly within the Student Dashboard workspace.
- **24-Hour Space Optimization:** MongoDB TTL auto-cleanup permanently purges chat records after 24 hours to preserve database storage.
- **Instant Answers / FAQ Bot:** Pre-configured automated answers for common questions (complaint lodging, turnaround times, emergency contacts, password resets).
- **Live Admin Chat:** Real-time two-way messaging between students/visitors and campus administrators.
- **Admin Support Desk:** Dedicated administrative operations center (`/admin/support`) with thread management, live polling, and quick response shortcuts.

### 👨‍🎓 Student Portal
- **Secure Authentication:** Register with Full Name, Student ID, and Email. Passwords securely hashed with `bcryptjs`.
- **Student Profile & DP:** Upload, change, or remove a custom Profile Picture (DP). Edit phone number, academic department, and bio. Secure in-app password changes.
- **Intuitive Dashboard:** Quick metrics showing Total Submitted, Pending, In Progress, and Resolved complaints.
- **Lodge Complaints:** Submit facility complaints categorized by Classroom, Laboratory, Internet/Wi-Fi, Washroom, Electricity, Water Supply, or Other with optional photo evidence.
- **My Complaints View:** Real-time status badges, search and filter by category or status, and comprehensive inspection modal.
- **Administrative Transparency:** Direct view of official administrator remarks and status changes without permission to tamper with statuses.

### 🛡️ Admin Operations Portal
- **Executive Cockpit:** Overview metrics for enrolled students, total grievances, pending issues, and resolved tickets.
- **Visual Analytics:** Breakdown charts displaying complaint distribution across campus departments.
- **Manage Complaints:** Filter and search tickets across the campus. Update ticket statuses (`Pending`, `In Progress`, `Resolved`, `Rejected`) and write official remarks published directly to students.
- **Manage Students & Dossier:** Directory of verified enrolled students with real uploaded profile pictures, contact details, department, bio, and instant profile dossier inspector.
- **Protected Backend:** Role-based access control (RBAC) enforced on the backend via JWT authentication middleware.

---

## 🛠️ Technologies Used

- **Frontend:**
  - React.js 18+ (bootstrapped with Vite)
  - React Router DOM v7 (Client-side routing & protected routes)
  - Axios (HTTP client with JWT request interceptors)
  - Lucide React (Modern icons)
  - Custom Responsive CSS3 Design System (Clean blue, white, slate palette, accessible SaaS UI)
- **Backend:**
  - Node.js & Express.js (RESTful API architecture)
  - MongoDB & Mongoose (NoSQL database with strict schemas and validations)
  - JSON Web Tokens (`jsonwebtoken`) & `bcryptjs` (Password hashing & secure token sessions)
  - Multer (Local file uploads for complaint photo evidence)
  - CORS & Dotenv (Cross-Origin Resource Sharing & Environment management)

---

## 📁 Project Structure

```text
CampusCare/
├── client/                     # Frontend (React + Vite)
│   ├── src/
│   │   ├── assets/             # Static assets & icons
│   │   ├── components/         # ProtectedRoute, UI components
│   │   ├── context/            # AuthContext (JWT session management)
│   │   ├── layouts/            # DashboardLayout, PublicNavbar, PublicFooter
│   │   ├── pages/              # Home, Login, Register, Student & Admin pages
│   │   ├── services/           # api.js (Axios instance with auth interceptors)
│   │   ├── App.jsx             # Router definition
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Complete SaaS styling system
│   ├── .env.example            # Frontend environment template
│   └── package.json
│
├── server/                     # Backend (Node.js + Express + MongoDB)
│   ├── config/                 # db.js (MongoDB Mongoose connection)
│   ├── controllers/            # authController, complaintController, adminController
│   ├── middleware/             # authMiddleware (JWT + RBAC), uploadMiddleware (Multer)
│   ├── models/                 # User.js, Complaint.js (Mongoose models)
│   ├── routes/                 # authRoutes, complaintRoutes, adminRoutes
│   ├── scripts/                # seedAdmin.js (Secure first admin account creator)
│   ├── uploads/                # Directory for uploaded complaint images
│   ├── .env.example            # Backend environment template
│   ├── server.js               # Express application entrypoint
│   └── package.json
│
├── package.json                # Workspace helper scripts
└── README.md                   # Full documentation & setup guide
```

---

## 🚀 Step-by-Step Installation & Setup

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher): Verify by running `node -v`
- **MongoDB**: Either a local instance (`mongodb://127.0.0.1:27017/campuscare`) or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud connection string.

---

### 2. Configure Environment Variables

#### Backend (`server/.env`):
A default `.env` is already configured for local use. You can inspect or modify `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/campuscare
JWT_SECRET=campuscare_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:5173
```
> **Note for MongoDB Atlas users:** Replace `MONGODB_URI` with your connection string:
> `MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/campuscare?retryWrites=true&w=majority`

#### Frontend (`client/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

### 3. Create the First Admin Account

To keep the system secure, public registration only creates **Student** accounts. To seed the default administrator account, run:

```bash
cd server
npm run seed:admin
```

This provisions an administrator account based on the `ADMIN_EMAIL` and `ADMIN_PASSWORD` defined in your environment:
- **Email:** Specified in `ADMIN_EMAIL`
- **Role:** `admin`

---

### 4. Running the Project

Open two terminal tabs (one for backend, one for frontend):

#### Terminal 1: Start Backend Server
```bash
cd server
npm run dev
```
*The backend server will start at `http://localhost:5000`.*

#### Terminal 2: Start Frontend Client
```bash
cd client
npm run dev
```
*The React Vite development server will start at `http://localhost:5173`.*

---

## 🧪 Demonstration & Testing Walkthrough

1. Open your browser and navigate to `http://localhost:5173`.
2. Explore the **Landing Page** (`/`) featuring hero headlines, how-it-works workflow, statistics, and category highlights.
3. Click **Get Started** to register a new student account (e.g. Name: `Alex Morgan`, Student ID: `STU-101`, Email: `alex@university.edu`).
4. You will be redirected to the **Student Dashboard** (`/student/dashboard`).
5. Click **Submit New Complaint** (`/student/submit`) and lodge an issue (e.g., Category: *Classroom*, Location: *Science Block Room 204*, Title: *Broken ceiling fan regulator*, attach an optional image).
6. Check **My Complaints** (`/student/complaints`) to view your new ticket with status `Pending`.
7. Sign out from the sidebar.
8. Navigate to `/admin/login` and sign in using your designated Administrator credentials.
9. You will be redirected to the **Admin Dashboard** (`/admin/dashboard`).
10. Go to **Manage Complaints** (`/admin/complaints`), locate Alex's ticket, click **Status**, change status to `In Progress` or `Resolved`, and add an official note: *"Electrician dispatched; regulator repaired on Nov 23"*.
11. Log back in as Alex to observe the immediate status update and admin response on the student portal!

---

## 🔒 Security Best Practices Implemented

- Passwords hashed using `bcryptjs` with salt rounds.
- Admin APIs protected via role-based middleware (`adminOnly`).
- Route parameter validation and strict Mongoose schema constraints.
- Sensitive environment variables kept out of client-side bundles.
- CORS restricted to the frontend client origin.
