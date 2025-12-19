# 🚀 Task Manager - Complete Execution Guide

## 📋 Prerequisites

Before running the application, ensure you have:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL Database** (Railway account for cloud database)
- **Git** (optional, for version control)

---

## 🎯 Quick Start (First Time Setup)

### **Step 1: Set Up the Database**

1. Go to [Railway.app](https://railway.app/)
2. Sign up for a free account
3. Create a new project
4. Add a PostgreSQL database
5. Copy the **Public Database URL** (looks like: `postgresql://postgres:xxx@xxx.railway.app:5432/railway`)

### **Step 2: Configure Backend**

1. Open a terminal/command prompt
2. Navigate to the backend folder:
   ```powershell
   cd "c:\Users\vaish\OneDrive\Desktop\Task Manager\backend"
   ```

3. Install dependencies:
   ```powershell
   npm install
   ```

4. Create `.env` file (copy from `.env.example`):
   ```powershell
   Copy-Item .env.example .env
   ```

5. Edit the `.env` file with your database URL:
   ```env
   DATABASE_URL=your_railway_database_url_here
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_EXPIRES_IN=7d
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

6. Run Prisma migrations to create database tables:
   ```powershell
   npx prisma migrate dev --name init
   ```

7. Generate Prisma Client:
   ```powershell
   npx prisma generate
   ```

### **Step 3: Configure Frontend**

1. Open a **NEW** terminal/command prompt
2. Navigate to the frontend folder:
   ```powershell
   cd "c:\Users\vaish\OneDrive\Desktop\Task Manager\frontend"
   ```

3. Install dependencies:
   ```powershell
   npm install
   ```

4. Create `.env` file:
   ```powershell
   Copy-Item .env.example .env
   ```

5. The `.env` file should contain:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

---

## ▶️ Running the Application

### **Every Time You Want to Use the App:**

#### **Terminal 1 - Start Backend Server**
```powershell
cd "c:\Users\vaish\OneDrive\Desktop\Task Manager\backend"
npm run dev
```

**You should see:**
```
Server running on port 5000
Socket.io server ready
```

#### **Terminal 2 - Start Frontend Server**
```powershell
cd "c:\Users\vaish\OneDrive\Desktop\Task Manager\frontend"
npm run dev
```

**You should see:**
```
VITE v7.3.0  ready in XXX ms
➜  Local:   http://localhost:5173/
```

#### **Open in Browser**
1. Open your web browser
2. Go to: **http://localhost:5173**
3. You should see the Task Manager login page!

---

## 👤 Using the Application

### **1. Create Your Account**

1. Click **"Sign up"** on the login page
2. Fill in the registration form:
   - **Name**: Your Name
   - **Email**: your.email@example.com
   - **Password**: Must include uppercase, lowercase, and number (e.g., "Password123")
3. Click **"Sign Up"**
4. You'll be automatically logged in to the Dashboard

### **2. Navigate the Dashboard**

After logging in, you'll see:
- **Assigned to Me**: Count of tasks assigned to you
- **Created by Me**: Count of tasks you created
- **Overdue Tasks**: Count of tasks past their due date
- Quick action buttons to view tasks

### **3. Create a Task**

1. Click **"Tasks"** in the top navigation
2. Click **"New Task"** button (top right)
3. Fill in the task details:
   - **Title**: Brief task name
   - **Description**: Detailed task information
   - **Due Date**: When the task should be completed
   - **Priority**: LOW, MEDIUM, HIGH, or URGENT
   - **Assign To**: Select a user (optional)
4. Click **"Create Task"**

### **4. Manage Tasks**

On the Tasks page:
- **View**: See all your tasks as cards
- **Edit**: Click the ✏️ pencil icon to modify a task
- **Delete**: Click the 🗑️ trash icon to remove a task
- **Update Status**: Click status buttons at the bottom of each card:
  - TODO → IN_PROGRESS → REVIEW → COMPLETED
- **Filter**: Use dropdown menus to filter by status or priority
- **Sort**: Sort tasks by due date, priority, status, or creation date

### **5. Real-Time Collaboration**

To test real-time features:
1. Open **two browser windows** (or use Incognito mode for second window)
2. Login to both windows (can use same account or create two accounts)
3. In Window 1: Create or update a task
4. In Window 2: Watch the task appear/update **instantly**!

### **6. Notifications**

- Look for the 🔔 bell icon in the top navigation bar
- A **red badge** shows the count of unread notifications
- Click the bell to view notifications
- Notifications appear when:
  - Someone assigns a task to you
  - A task you're involved with is updated

### **7. Update Your Profile**

1. Click your **name** in the top right corner
2. Select **"Profile"** from the dropdown
3. Update your name or email
4. Click **"Save Changes"**

### **8. Logout**

1. Click your **name** in the top right corner
2. Select **"Logout"**
3. You'll be redirected to the login page

---

## 🛑 Stopping the Application

When you're done using the app:

1. In **Terminal 1** (Backend): Press `Ctrl + C`
2. In **Terminal 2** (Frontend): Press `Ctrl + C`
3. Close your browser tabs

---

## 🔄 Restarting the Application

To use the app again later:

1. Open two terminals
2. Run backend: `cd "c:\Users\vaish\OneDrive\Desktop\Task Manager\backend" && npm run dev`
3. Run frontend: `cd "c:\Users\vaish\OneDrive\Desktop\Task Manager\frontend" && npm run dev`
4. Open browser to http://localhost:5173

---

## 🐛 Troubleshooting

### **Problem: "Port 5000 already in use"**
**Solution:** Another application is using port 5000
```powershell
# Find and kill the process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### **Problem: "Port 5173 already in use"**
**Solution:** Frontend server is already running
```powershell
# Find and kill the process using port 5173
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F
```

### **Problem: Blank white page**
**Solution:** 
1. Clear browser cache (Ctrl + Shift + Delete)
2. Hard refresh (Ctrl + Shift + R)
3. Try Incognito/Private window

### **Problem: "Cannot connect to database"**
**Solution:**
1. Check your Railway database is running
2. Verify `DATABASE_URL` in `backend/.env` is correct
3. Ensure you ran `npx prisma migrate dev`

### **Problem: Backend errors**
**Solution:**
```powershell
cd backend
rm -rf node_modules
npm install
npx prisma generate
npm run dev
```

### **Problem: Frontend errors**
**Solution:**
```powershell
cd frontend
rm -rf node_modules
rm -rf node_modules/.vite
npm install
npm run dev
```

---

## 📦 Production Build (Optional)

### **Build Backend**
```powershell
cd backend
npm run build
npm start
```

### **Build Frontend**
```powershell
cd frontend
npm run build
npm run preview
```

---

## 📚 Additional Resources

- **README.md**: Detailed project documentation
- **SETUP.md**: Step-by-step setup instructions
- **API Documentation**: See README.md for all API endpoints

---

## 🎓 For Your Assessment

### **What to Demonstrate:**

1. **User Registration & Login**
   - Create an account
   - Login with credentials
   - Show authentication works

2. **Task Management (CRUD)**
   - **Create**: Add multiple tasks with different priorities
   - **Read**: View tasks in the list
   - **Update**: Edit task details, change status
   - **Delete**: Remove a task

3. **Filtering & Sorting**
   - Filter by status (TODO, IN_PROGRESS, etc.)
   - Filter by priority (LOW, MEDIUM, HIGH, URGENT)
   - Sort by due date, priority, or creation date

4. **Real-Time Features**
   - Open two browser windows
   - Create/update tasks in one window
   - Show instant updates in the other window

5. **Notifications**
   - Assign a task to yourself
   - Show notification appears
   - Mark notification as read

6. **Dashboard Statistics**
   - Show task counts update automatically
   - Demonstrate overdue task detection

### **Screenshots to Take:**
1. Login page
2. Dashboard with statistics
3. Task list with multiple tasks
4. Task creation form
5. Task editing
6. Real-time updates (two windows side by side)
7. Notifications dropdown
8. Profile page

---

## ✅ Success Checklist

Before your assessment, verify:
- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Can register a new user
- [ ] Can login with credentials
- [ ] Can create tasks
- [ ] Can edit tasks
- [ ] Can delete tasks
- [ ] Can change task status
- [ ] Filtering works
- [ ] Sorting works
- [ ] Real-time updates work
- [ ] Notifications appear
- [ ] Dashboard statistics update
- [ ] Profile can be updated
- [ ] Logout works

---

**🎉 Your Task Manager is ready to use! Good luck with your assessment!**
