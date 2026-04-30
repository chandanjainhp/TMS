// Must be first — fixes Buffer compatibility
import "./polyfill.js";

import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./db/connectDB.js";
import { app, server } from "./socket/socket.js";

// Route modules
import authRoutes         from "./routes/auth.route.js";
import adminAuthRoutes    from "./routes/adminAuth.route.js";
import studentRoutes      from "./routes/student.route.js";
import EditingStudentRoutes from "./routes/editingStudent.route.js";
import formRoutes         from "./routes/form.route.js";
import userActivityRoutes from "./routes/userActivity.route.js";
import userRoutes         from "./routes/user.route.js";
import allowedEmailRoutes from "./routes/allowedEmail.route.js";
import analyticsRoutes    from "./routes/analytics.route.js";
import teacherRoutes      from "./routes/teacher.route.js";
import eventRoutes        from "./routes/event.route.js";
import messageRoutes      from "./routes/message.route.js";
import subjectRoutes      from "./routes/subject.route.js";
import branchRoutes       from "./routes/branch.route.js";
import principalRoutes    from "./routes/principal.route.js";
import setupRoutes        from "./routes/setup.route.js";

dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${Date.now() - start}ms`
      );
    });
    next();
  });
}

// ── Static files ──────────────────────────────────────────────────────────────

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Health check ──────────────────────────────────────────────────────────────

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime(), timestamp: Date.now() });
});

// ── Routes ────────────────────────────────────────────────────────────────────

app.use("/api/auth",           authRoutes);
app.use("/api/admin/auth",     adminAuthRoutes);
app.use("/api/students",       studentRoutes);
app.use("/api/EditingStudent", EditingStudentRoutes);
app.use("/api/form",           formRoutes);
app.use("/api/user-activity",  userActivityRoutes);
app.use("/api/users",          userRoutes);
app.use("/api/allowed-emails", allowedEmailRoutes);
app.use("/api/analytics",      analyticsRoutes);
app.use("/api/teacher",        teacherRoutes);
app.use("/api/events",         eventRoutes);
app.use("/api/messages",       messageRoutes);
app.use("/api/subjects",       subjectRoutes);
app.use("/api/branches",       branchRoutes);
app.use("/api/principal",      principalRoutes);
app.use("/api/setup",          setupRoutes);

// Diagnostic endpoint
app.get("/api/routes-status", (req, res) => {
  res.status(200).json({
    status: "ok",
    routes: [
      "/api/auth", "/api/admin/auth", "/api/students", "/api/EditingStudent",
      "/api/form", "/api/user-activity", "/api/users", "/api/allowed-emails",
      "/api/analytics", "/api/teacher", "/api/events", "/api/messages",
      "/api/subjects", "/api/branches", "/api/principal", "/api/setup",
    ],
    databaseConnection: global.dbConnected ? "connected" : "disconnected",
  });
});

// ── Production static hosting ─────────────────────────────────────────────────

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
  });
}

// ── Global error handler ──────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.stack}`);
  if (process.env.NODE_ENV === "production") {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  } else {
    res.status(500).json({ success: false, message: err.message, stack: err.stack });
  }
});

// ── Start server ──────────────────────────────────────────────────────────────

const startServer = async () => {
  try {
    await connectDB();
    global.dbConnected = true;
    console.log("✅ Database connected");
    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    global.dbConnected = false;
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
