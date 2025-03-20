const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const connectDB = require("./config/db");
const router = require("./routes");
const helmet = require("helmet");
const morgan = require("morgan");
const mysql = require("mysql2/promise");
const http = require("http");
const { Server } = require("socket.io");
const { socketHandler } = require("./controller/chatController");
const authToken = require("./middleware/authToken");

const app = express();
const server = http.createServer(app);

// Set frontend domain
const FRONTEND_URL = process.env.FRONTEND_URL || "https://secxion-bmxii.vercel.app";

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
});

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP to prevent conflicts
  })
);

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("combined"));

// WebSocket Setup
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

socketHandler(io);

// API Routes
app.use("/api", router);

// Apply auth middleware only to protected routes (DO NOT apply globally)
app.use(authToken);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start Server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log("✅ Connected to DB");
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
