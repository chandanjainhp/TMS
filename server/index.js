// Express server and middleware imports
import express from "express"; // Fast, minimalist web framework for Node.js
import dotenv from "dotenv"; // Loads environment variables from a .env file into process.env
import cors from "cors"; // Middleware to enable Cross-Origin Resource Sharing
import cookieParser from "cookie-parser"; // Middleware to parse cookies from requests
// Node utilities and DB connector
import path from "path"; // Utilities for file and directory paths
import { fileURLToPath } from "url"; // Convert import.meta.url to a file path (ESM)
import { connectDB } from "./db/connectDB.js"; // Function that connects to MongoDB
// Route modules: each exports an Express router handling related endpoints
import authRoutes from "./routes/auth.route.js"; // /api/auth
import adminAuthRoutes from "./routes/admin.auth.route.js"; // /api/admin/auth
import studentRoutes from "./routes/studentRoutes.js"; // /api/students
import EditingStudentRoutes from "./routes/EditingStudentRoutes.js"; // /api/EditingStudent
import fromRoutes from "./routes/formRoutes.js"; // /api/form
import userActivityRoutes from "./routes/userActivity.routes.js"; // /api/user-activity
import userRoutes from "./routes/user.routes.js"; // /api/users

// Load environment variables from appropriate .env file
// In production you can use '.env.production' otherwise default to '.env'
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
});

// Compute __dirname for ES modules
// import.meta.url is the module's URL; fileURLToPath converts it to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app instance and define the port
const app = express();
const PORT = process.env.PORT || 5000; // fallback to 5000 if not set

// Global middleware
// CORS: allow the frontend origin to make requests and accept credentials (cookies)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded bodies (form submissions)
app.use(express.urlencoded({ extended: true }));

// Parse cookies on incoming requests and populate req.cookies
app.use(cookieParser());

// Simple request logger for development
// This prints request/response info to console; replace with a structured logger in production
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    const start = Date.now();

    // Log request arrival with a timestamp
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);

    // When the response finishes, log status and duration
    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
      );
    });

    next();
  });
}

// Lightweight health-check endpoint for load balancers / monitoring
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

// Serve uploaded/static files from the uploads directory at /uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount API route modules. Each router handles its own subpaths and middleware.
// Logging the registration in development helps debugging which routes are active.
if (process.env.NODE_ENV !== "production") {
  console.log("Registering route: /api/auth");
}
app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV !== "production") {
  console.log("Registering route: /api/admin/auth");
}
app.use("/api/admin/auth", adminAuthRoutes);

if (process.env.NODE_ENV !== "production") {
  console.log("Registering route: /api/students");
}
app.use("/api/students", studentRoutes);

if (process.env.NODE_ENV !== "production") {
  console.log("Registering route: /api/EditingStudent");
}
app.use("/api/EditingStudent", EditingStudentRoutes);

if (process.env.NODE_ENV !== "production") {
  console.log("Registering route: /api/form");
}
app.use("/api/form", fromRoutes);

if (process.env.NODE_ENV !== "production") {
  console.log("Registering route: /api/user-activity");
}
app.use("/api/user-activity", userActivityRoutes);

if (process.env.NODE_ENV !== "production") {
  console.log("Registering route: /api/users");
}
app.use("/api/users", userRoutes);

// Diagnostic endpoint that reports which routes were registered and DB status
app.get("/api/routes-status", (req, res) => {
  const routes = [
    { path: "/api/auth", status: "registered" },
    { path: "/api/admin/auth", status: "registered" },
    { path: "/api/students", status: "registered" },
    { path: "/api/EditingStudent", status: "registered" },
    { path: "/api/form", status: "registered" },
    { path: "/api/user-activity", status: "registered" },
    { path: "/api/users", status: "registered" },
  ];

  res.status(200).json({
    status: "ok",
    routes,
    databaseConnection: global.dbConnected ? "connected" : "disconnected",
  });
});

// Production setup
// Production static hosting: serve the compiled React app if in production mode
if (process.env.NODE_ENV === "production") {
  // Serve frontend build files
  app.use(express.static(path.join(__dirname, "../client/dist")));

  // For client-side routes (React Router), always return index.html
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
  });
}

// Global error handler - must be registered after all routes
app.use((err, req, res, next) => {
  // Log the error to console (replace with structured logger in production)
  console.error(`[ERROR] ${err.stack}`);

  // Send safe error response in production; include stack in development for debugging
  if (process.env.NODE_ENV === "production") {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  } else {
    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
      stack: err.stack,
    });
  }
});

// Start server only after DB connection is established
const startServer = async () => {
  try {
    await connectDB(); // Connect to MongoDB
    global.dbConnected = true; // Flag used by /api/routes-status
    console.log("✅ Database connection successful");

    app.listen(PORT, () => {
      console.log(`✅ Server is running on port: ${PORT}`);
      console.log(`✅ Health check available at: http://localhost:${PORT}/api/health`);
      console.log(`✅ Routes status available at: http://localhost:${PORT}/api/routes-status`);
    });
  } catch (error) {
    global.dbConnected = false;
    console.error("❌ Failed to start server:", error);
    // Exit with failure to avoid running without a DB connection
    process.exit(1);
  }
};

startServer();