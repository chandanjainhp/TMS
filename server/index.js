import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import adminAuthRoutes from "./routes/admin.auth.route.js";
import studentRoutes from "./routes/studentRoutes.js";
import EditingStudentRoutes from "./routes/EditingStudentRoutes.js";
import fromRoutes from "./routes/formRoutes.js";
import userActivityRoutes from "./routes/userActivity.routes.js";
import userRoutes from "./routes/user.routes.js";

// Load environment variables
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
});

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API request logger middleware - only in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    const start = Date.now();

    // Log when request is received
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);

    // Capture response finish
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });

    next();
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
// Log route registration only in development mode
if (process.env.NODE_ENV !== 'production') {
  console.log('Registering route: /api/auth');
}
app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV !== 'production') {
  console.log('Registering route: /api/admin/auth');
}
app.use("/api/admin/auth", adminAuthRoutes);

if (process.env.NODE_ENV !== 'production') {
  console.log('Registering route: /api/students');
}
app.use("/api/students", studentRoutes);

if (process.env.NODE_ENV !== 'production') {
  console.log('Registering route: /api/EditingStudent');
}
app.use("/api/EditingStudent", EditingStudentRoutes);

if (process.env.NODE_ENV !== 'production') {
  console.log('Registering route: /api/form');
}
app.use("/api/form", fromRoutes);

if (process.env.NODE_ENV !== 'production') {
  console.log('Registering route: /api/user-activity');
}
app.use("/api/user-activity", userActivityRoutes);

if (process.env.NODE_ENV !== 'production') {
  console.log('Registering route: /api/users');
}
app.use("/api/users", userRoutes);

// API routes test endpoint
app.get('/api/routes-status', (req, res) => {
  const routes = [
    { path: '/api/auth', status: 'registered' },
    { path: '/api/admin/auth', status: 'registered' },
    { path: '/api/students', status: 'registered' },
    { path: '/api/EditingStudent', status: 'registered' },
    { path: '/api/form', status: 'registered' },
    { path: '/api/user-activity', status: 'registered' },
    { path: '/api/users', status: 'registered' }
  ];

  res.status(200).json({
    status: 'ok',
    routes: routes,
    databaseConnection: global.dbConnected ? 'connected' : 'disconnected'
  });
});

// Production setup
if (process.env.NODE_ENV === "production") {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, "../client/dist")));

  // For any request that doesn't match one above, send back React's index.html file
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
  });
}

// Error handling middleware (should be last)
app.use((err, req, res, next) => {
  // Always log the error
  console.error(`[ERROR] ${err.stack}`);

  // In production, don't send detailed error information
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  } else {
    // In development, send more details
    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
      stack: err.stack
    });
  }
});

// Modified connectDB to track connection status
const startServer = async () => {
  try {
    await connectDB();
    global.dbConnected = true;
    console.log(`✅ Database connection successful`);

    app.listen(PORT, () => {
      console.log(`✅ Server is running on port: ${PORT}`);
      console.log(`✅ Health check available at: http://localhost:${PORT}/api/health`);
      console.log(`✅ Routes status available at: http://localhost:${PORT}/api/routes-status`);
    });
  } catch (error) {
    global.dbConnected = false;
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();