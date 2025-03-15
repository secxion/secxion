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

// ✅ **Set Allowed Frontend URL**
const FRONTEND_URL = process.env.FRONTEND_URL || "https://secxion-f.onrender.com";

// ✅ **CORS Configuration for Frontend Connection**
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ✅ **Socket.io Configuration**
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Apply socket handler
socketHandler(io);

// ✅ **Rate Limiting to prevent abuse**
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("combined"));

// ✅ **Security Middleware (Updated Helmet Config)**
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", FRONTEND_URL],
        scriptSrc: ["'self'", FRONTEND_URL, "https://trusted.cdn.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

// ✅ **API Routes (Ensure this is before the auth middleware)**
app.use("/api", router);

// ✅ **Authentication Middleware**
app.use(authToken);

// ✅ **Error Handling**
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// ✅ **Start Server**
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log("✅ Connected to DB");
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`✅ API is live at: http://localhost:${PORT}/api`);
  });
});
