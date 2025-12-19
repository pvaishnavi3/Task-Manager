# Quick Start Guide - Task Manager

## Prerequisites Checklist
- [ ] Node.js 18+ installed
- [ ] PostgreSQL installed (or access to cloud PostgreSQL)
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## Step-by-Step Setup

### 1. Database Setup

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL (Windows)
# Download from: https://www.postgresql.org/download/windows/

# Create database
psql -U postgres
CREATE DATABASE taskmanager;
\q
```

**Option B: Cloud PostgreSQL (Railway - Recommended for Quick Start)**
1. Go to https://railway.app/
2. Sign up with GitHub
3. Click "New Project" → "Provision PostgreSQL"
4. Copy the connection string (DATABASE_URL)

### 2. Backend Setup

```bash
# Navigate to backend
cd "c:\Users\vaish\OneDrive\Desktop\Task Manager\backend"

# Copy environment file
copy .env.example .env

# Edit .env file and update DATABASE_URL
# For Railway: paste the connection string you copied
# For local: postgresql://postgres:password@localhost:5432/taskmanager

# Install dependencies (if not already done)
npm install

# Run Prisma migrations
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate

# Start backend server
npm run dev
```

Backend should now be running on http://localhost:5000

### 3. Frontend Setup

```bash
# Open a NEW terminal window
# Navigate to frontend
cd "c:\Users\vaish\OneDrive\Desktop\Task Manager\frontend"

# Install dependencies (if not already done)
npm install

# Start frontend server
npm run dev
```

Frontend should now be running on http://localhost:5173

### 4. Test the Application

1. Open http://localhost:5173 in your browser
2. Click "Sign up" to create a new account
3. Fill in the registration form:
   - Name: Your Name
   - Email: test@example.com
   - Password: Test1234 (must have uppercase, lowercase, number)
4. After registration, you'll be redirected to the dashboard
5. Click "Tasks" to create your first task
6. Test real-time features by opening the app in two browser windows

## Common Issues & Solutions

### Issue: "Cannot connect to database"
**Solution**: 
- Check if PostgreSQL is running
- Verify DATABASE_URL in backend/.env is correct
- For Railway: Make sure you copied the full connection string

### Issue: "Port 5000 already in use"
**Solution**:
- Change PORT in backend/.env to 5001
- Update VITE_API_URL in frontend/.env to http://localhost:5001/api
- Update VITE_SOCKET_URL in frontend/.env to http://localhost:5001

### Issue: "Module not found" errors
**Solution**:
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: Prisma errors
**Solution**:
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

## Testing Checklist

Once running, test these features:

### Authentication
- [ ] Register new user
- [ ] Login with credentials
- [ ] Logout
- [ ] View profile
- [ ] Update profile

### Task Management
- [ ] Create a new task
- [ ] View task list
- [ ] Edit a task
- [ ] Delete a task
- [ ] Change task status
- [ ] Filter by status
- [ ] Filter by priority
- [ ] Sort by due date
- [ ] Assign task to user

### Real-Time Features
- [ ] Open app in two browser windows
- [ ] Create task in window 1
- [ ] Verify it appears in window 2 instantly
- [ ] Update task status in window 1
- [ ] Verify update in window 2
- [ ] Assign task to yourself
- [ ] Check notification bell

### Dashboard
- [ ] View statistics (assigned, created, overdue)
- [ ] Navigate to tasks from quick actions

## Next Steps

### For Development
1. Review the code structure in both backend and frontend
2. Check the README.md for detailed architecture information
3. Run tests: `cd backend && npm test`
4. Explore Prisma Studio: `cd backend && npm run prisma:studio`

### For Deployment
1. Follow deployment instructions in README.md
2. Deploy backend to Railway/Render
3. Deploy frontend to Vercel/Netlify
4. Update environment variables in production

## Useful Commands

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm test             # Run tests
npm run prisma:studio # Open Prisma Studio (database GUI)
npm run type-check   # Check TypeScript types
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # Check TypeScript types
```

## Project Structure Reference

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── controllers/    # HTTP request handlers
│   │   ├── services/       # Business logic
│   │   ├── repositories/   # Database access
│   │   ├── dtos/           # Validation schemas
│   │   ├── middleware/     # Auth, validation, errors
│   │   ├── socket/         # Real-time handlers
│   │   ├── routes/         # API routes
│   │   └── server.ts       # Entry point
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── tests/              # Unit tests
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API clients
│   │   └── types/          # TypeScript types
│   └── public/             # Static assets
└── README.md               # Full documentation
```

## Support

If you encounter issues:
1. Check the error message carefully
2. Review the Common Issues section above
3. Check backend terminal for errors
4. Check frontend terminal for errors
5. Check browser console for errors
6. Review README.md for detailed documentation

## Success Indicators

You'll know everything is working when:
- ✅ Backend shows "Server running on port 5000"
- ✅ Backend shows "Socket.io server ready"
- ✅ Frontend shows "VITE ready in XXXms"
- ✅ You can register and login
- ✅ You can create and manage tasks
- ✅ Real-time updates work across browser windows
- ✅ Notifications appear when tasks are assigned

Happy coding! 🚀
