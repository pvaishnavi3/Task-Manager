# 🚀 Task Manager - Deployment Guide

## 📋 Deployment Options

You have several options to deploy your Task Manager application:

1. **Railway** (Recommended - Easy & Free)
2. **Vercel** (Frontend) + **Railway** (Backend)
3. **Render** (Free tier available)
4. **Heroku** (Paid)

---

## 🎯 Option 1: Deploy to Railway (Recommended)

Railway is the easiest option since you're already using it for the database.

### **Step 1: Prepare Your Project**

1. **Create a GitHub Repository**
   
   ```powershell
   # Navigate to your project
   cd "c:\Users\vaish\OneDrive\Desktop\Task Manager"
   
   # Initialize git (if not already done)
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit - Task Manager"
   ```

2. **Create a `.gitignore` file** (if not exists)
   
   Create a file named `.gitignore` in the root:
   ```
   node_modules/
   dist/
   .env
   *.log
   .DS_Store
   ```

3. **Push to GitHub**
   
   - Go to [GitHub.com](https://github.com)
   - Create a new repository called "task-manager"
   - Follow the instructions to push your code:
   
   ```powershell
   git remote add origin https://github.com/YOUR_USERNAME/task-manager.git
   git branch -M main
   git push -u origin main
   ```

### **Step 2: Deploy Backend to Railway**

1. **Go to [Railway.app](https://railway.app)**
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your **task-manager** repository
5. Railway will detect it's a Node.js project

6. **Configure Environment Variables:**
   
   Click on your backend service → **Variables** tab → Add:
   
   ```
   DATABASE_URL=your_railway_postgres_url
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_EXPIRES_IN=7d
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

7. **Configure Build Settings:**
   
   Railway should auto-detect, but verify:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`

8. **Add a `start` script** to `backend/package.json`:
   
   ```json
   "scripts": {
     "dev": "tsx watch src/server.ts",
     "build": "tsc",
     "start": "node dist/server.js",
     "prisma:generate": "prisma generate",
     "prisma:migrate": "prisma migrate deploy"
   }
   ```

9. **Deploy!**
   - Railway will automatically build and deploy
   - Copy the **public URL** (e.g., `https://your-app.railway.app`)

### **Step 3: Deploy Frontend to Vercel**

1. **Go to [Vercel.com](https://vercel.com)**
2. Click **"Add New Project"**
3. **Import** your GitHub repository
4. **Configure:**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Add Environment Variables:**
   
   In Vercel dashboard → **Settings** → **Environment Variables**:
   
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   VITE_SOCKET_URL=https://your-backend.railway.app
   ```

6. **Deploy!**
   - Vercel will build and deploy automatically
   - You'll get a URL like `https://task-manager-xyz.vercel.app`

### **Step 4: Update Backend CORS**

Update `backend/src/server.ts` to allow your frontend URL:

```typescript
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
```

Then update the `FRONTEND_URL` environment variable in Railway to your Vercel URL.

---

## 🎯 Option 2: Deploy Everything to Render

Render offers free tier for both frontend and backend.

### **Deploy Backend to Render**

1. **Go to [Render.com](https://render.com)**
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. **Configure:**
   - **Name**: task-manager-backend
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`

5. **Add Environment Variables** (same as Railway)

6. **Add PostgreSQL Database:**
   - Click **"New +"** → **"PostgreSQL"**
   - Copy the **Internal Database URL**
   - Use it as `DATABASE_URL` in backend

### **Deploy Frontend to Render**

1. Click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. **Configure:**
   - **Name**: task-manager-frontend
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Add Environment Variables:**
   ```
   VITE_API_URL=https://task-manager-backend.onrender.com/api
   VITE_SOCKET_URL=https://task-manager-backend.onrender.com
   ```

---

## 🎯 Option 3: Deploy to Vercel (Full Stack)

Vercel can host both frontend and backend (serverless functions).

### **Convert Backend to Serverless**

This requires restructuring your backend as serverless functions. This is more complex and not recommended for beginners.

**Recommendation**: Use **Railway for backend** + **Vercel for frontend** (Option 1).

---

## 📝 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] **Environment Variables**
  - [ ] All `.env` files are in `.gitignore`
  - [ ] `.env.example` files are committed
  - [ ] Production environment variables are set

- [ ] **Database**
  - [ ] Railway PostgreSQL is running
  - [ ] Database URL is correct
  - [ ] Prisma migrations are applied

- [ ] **Backend**
  - [ ] `npm run build` works locally
  - [ ] `start` script is in `package.json`
  - [ ] CORS is configured for production URL

- [ ] **Frontend**
  - [ ] `npm run build` works locally
  - [ ] API URLs point to production backend
  - [ ] No hardcoded localhost URLs

- [ ] **Testing**
  - [ ] Test locally with production build
  - [ ] All features work
  - [ ] No console errors

---

## 🔧 Common Deployment Issues

### **Issue 1: Database Connection Failed**

**Solution:**
- Verify `DATABASE_URL` in Railway/Render
- Ensure it's the **external** connection string
- Run `npx prisma migrate deploy` after deployment

### **Issue 2: CORS Errors**

**Solution:**
- Update `FRONTEND_URL` in backend environment variables
- Ensure CORS middleware allows your frontend domain
- Check that `credentials: true` is set

### **Issue 3: Build Fails**

**Solution:**
- Check build logs for errors
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### **Issue 4: 404 on Frontend Routes**

**Solution:**
- Add a `vercel.json` or `_redirects` file for SPA routing:

**For Vercel** (`frontend/vercel.json`):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**For Render** (`frontend/public/_redirects`):
```
/*    /index.html   200
```

---

## 🎉 After Deployment

### **Test Your Deployed App**

1. **Visit your frontend URL**
2. **Register a new user**
3. **Create tasks**
4. **Test all features**
5. **Check for errors in browser console**

### **Monitor Your App**

- **Railway**: Check logs in Railway dashboard
- **Vercel**: Check logs in Vercel dashboard
- **Render**: Check logs in Render dashboard

### **Update Your App**

To deploy updates:

```powershell
# Make changes to your code
git add .
git commit -m "Update: description of changes"
git push origin main
```

Railway, Vercel, and Render will **automatically redeploy** when you push to GitHub!

---

## 💰 Cost Breakdown

### **Free Tier Limits:**

**Railway:**
- $5 free credit per month
- Enough for small projects
- PostgreSQL database included

**Vercel:**
- Unlimited deployments
- 100GB bandwidth/month
- Perfect for frontend

**Render:**
- Free tier available
- 750 hours/month
- Database: $7/month (or use Railway)

**Recommended Setup (Free):**
- **Database**: Railway PostgreSQL (Free $5 credit)
- **Backend**: Railway (Free $5 credit)
- **Frontend**: Vercel (Free unlimited)

---

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)

---

## ✅ Quick Start (Railway + Vercel)

**5-Minute Deployment:**

1. Push code to GitHub
2. Deploy backend to Railway (connect GitHub repo)
3. Deploy frontend to Vercel (connect GitHub repo)
4. Add environment variables to both
5. Test your live app!

**Your app will be live at:**
- Frontend: `https://task-manager-xyz.vercel.app`
- Backend: `https://task-manager-xyz.railway.app`

---

**Need help with deployment? Let me know which platform you want to use!** 🚀
