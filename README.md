# Task Manager - Full-Stack Collaborative Application

A production-ready, full-stack Task Management application with real-time collaboration features built with modern JavaScript/TypeScript technologies.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens and HTTP-only cookies
- **Task Management**: Full CRUD operations for tasks with title, description, due date, priority, and status
- **Real-Time Collaboration**: Live updates using Socket.io when tasks are created, updated, or deleted
- **Task Assignment**: Assign tasks to registered users with instant notifications
- **Dashboard**: Personal dashboard showing assigned tasks, created tasks, and overdue tasks
- **Filtering & Sorting**: Filter by status and priority, sort by due date
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Type Safety**: Full TypeScript coverage across frontend and backend

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Real-Time**: Socket.io
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: Zod for DTO validation
- **Testing**: Jest

### Frontend
- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching**: SWR
- **Real-Time**: Socket.io Client
- **Routing**: React Router v6
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios

## 📁 Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── repositories/     # Data access layer
│   │   ├── dtos/             # Validation schemas
│   │   ├── middleware/       # Auth, validation, error handling
│   │   ├── socket/           # Socket.io handlers
│   │   ├── routes/           # API routes
│   │   ├── types/            # TypeScript types
│   │   └── server.ts         # Entry point
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── tests/                # Unit tests
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API client & Socket.io
│   │   ├── types/            # TypeScript types
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## 🏗️ Architecture

### Backend Architecture

The backend follows a clean, layered architecture:

```
┌─────────────┐
│   Routes    │ ← HTTP endpoints
└──────┬──────┘
       │
┌──────▼──────┐
│ Controllers │ ← Request/Response handling
└──────┬──────┘
       │
┌──────▼──────┐
│  Services   │ ← Business logic
└──────┬──────┘
       │
┌──────▼──────┐
│Repositories │ ← Data access (Prisma)
└──────┬──────┘
       │
┌──────▼──────┐
│  Database   │ ← PostgreSQL
└─────────────┘
```

**Key Components:**
- **DTOs (Data Transfer Objects)**: Zod schemas for input validation
- **Middleware**: Authentication (JWT), validation, error handling
- **Socket.io**: Real-time event broadcasting
- **Prisma**: Type-safe database access with migrations

### Frontend Architecture

The frontend uses a component-based architecture with custom hooks:

```
┌─────────────┐
│    Pages    │ ← Route components
└──────┬──────┘
       │
┌──────▼──────┐
│ Components  │ ← Reusable UI components
└──────┬──────┘
       │
┌──────▼──────┐
│    Hooks    │ ← State management (SWR + Socket.io)
└──────┬──────┘
       │
┌──────▼──────┐
│  Services   │ ← API calls & Socket.io
└─────────────┘
```

**Key Features:**
- **SWR**: Automatic caching and revalidation
- **Socket.io**: Real-time updates with optimistic UI
- **React Hook Form**: Performant form handling
- **Tailwind CSS**: Utility-first styling with custom design system

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud)
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/taskmanager?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="7d"
   PORT=5000
   NODE_ENV="development"
   FRONTEND_URL="http://localhost:5173"
   ```

4. **Run Prisma migrations:**
   ```bash
   npm run prisma:migrate
   ```

5. **Generate Prisma client:**
   ```bash
   npm run prisma:generate
   ```

6. **Start development server:**
   ```bash
   npm run dev
   ```

   Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   The default values should work for local development:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |
| GET | `/api/auth/users` | Get all users | Yes |

### Task Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/tasks` | Create task | Yes |
| GET | `/api/tasks` | Get all tasks (with filters) | Yes |
| GET | `/api/tasks/:id` | Get task by ID | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |
| GET | `/api/tasks/stats/dashboard` | Get task statistics | Yes |

### Notification Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/notifications` | Get all notifications | Yes |
| GET | `/api/notifications/unread-count` | Get unread count | Yes |
| PUT | `/api/notifications/:id/read` | Mark as read | Yes |
| PUT | `/api/notifications/read-all` | Mark all as read | Yes |

### Query Parameters for GET /api/tasks

- `status`: Filter by status (TODO, IN_PROGRESS, REVIEW, COMPLETED)
- `priority`: Filter by priority (LOW, MEDIUM, HIGH, URGENT)
- `assignedToMe`: Show only assigned tasks (true/false)
- `createdByMe`: Show only created tasks (true/false)
- `overdue`: Show only overdue tasks (true/false)
- `sortBy`: Sort field (dueDate, createdAt, priority, status)
- `sortOrder`: Sort order (asc, desc)

## 🔌 Socket.io Events

### Client → Server

- `join`: Join user's personal room
- `task:created`: Broadcast task creation
- `task:updated`: Broadcast task update
- `task:deleted`: Broadcast task deletion
- `task:status-changed`: Broadcast status change

### Server → Client

- `task:created`: New task created
- `task:updated`: Task updated
- `task:deleted`: Task deleted
- `task:status-changed`: Task status changed
- `notification:new`: New notification

## 🧪 Testing

### Backend Tests

Run unit tests:
```bash
cd backend
npm test
```

The test suite includes:
- Task creation validation
- Due date validation
- Overdue task detection
- DTO schema validation

### Type Checking

```bash
# Backend
cd backend && npm run type-check

# Frontend
cd frontend && npm run type-check
```

## 🚀 Deployment

### Backend Deployment (Railway/Render)

1. Create a new project on Railway or Render
2. Connect your GitHub repository
3. Set environment variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_SECRET`: Strong secret key
   - `FRONTEND_URL`: Your frontend URL
   - `NODE_ENV`: production

4. Deploy command: `npm run build && npm start`

### Frontend Deployment (Vercel/Netlify)

1. Create a new project on Vercel or Netlify
2. Connect your GitHub repository
3. Set build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Set environment variables:
   - `VITE_API_URL`: Your backend API URL
   - `VITE_SOCKET_URL`: Your backend Socket.io URL

## 🎯 Design Decisions & Trade-offs

### Why PostgreSQL?
- **ACID compliance** ensures data integrity for task assignments
- **Relational structure** fits the user-task relationship model
- **Production-ready** with excellent hosting options
- **Prisma support** provides type-safe queries

### Why SWR over React Query?
- **Simpler API** for this use case
- **Smaller bundle size**
- **Built-in cache invalidation** works well with Socket.io
- **Stale-while-revalidate** pattern perfect for real-time apps

### Why JWT with HTTP-only Cookies?
- **Security**: HTTP-only cookies prevent XSS attacks
- **Convenience**: Automatic cookie handling
- **Flexibility**: Also supports Bearer token for mobile apps

### Architecture Pattern (Controller-Service-Repository)
- **Separation of concerns**: Each layer has a single responsibility
- **Testability**: Business logic isolated in services
- **Maintainability**: Easy to modify data access without affecting business logic
- **Scalability**: Can swap repositories (e.g., caching layer) without changing services

## 📝 Lessons Learned

1. **Real-time Sync Challenges**: Coordinating SWR cache updates with Socket.io events required careful mutation handling
2. **Type Safety**: Full TypeScript coverage caught many bugs early in development
3. **Validation**: Zod schemas on both frontend and backend ensured data consistency
4. **Error Handling**: Centralized error middleware simplified debugging

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT tokens with expiration
- HTTP-only cookies for token storage
- CORS configuration
- Input validation on all endpoints
- SQL injection prevention (Prisma parameterized queries)

## 📄 License

MIT

## 👤 Author

Built as a full-stack engineering assessment project.

---

**Note**: This is a demonstration project. For production use, consider adding:
- Rate limiting
- Email verification
- Password reset functionality
- File attachments for tasks
- Task comments
- Activity logs
- Advanced search
- Export functionality
