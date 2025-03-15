const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const connectDB = require("./config/db");
const router = require("./routes");
const helmet = require("helmet");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const { socketHandler } = require("./controller/chatController");
const jwt = require("jsonwebtoken");

const app = express();
const server = http.createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || "https://secxion-f.onrender.com";

// ✅ Ensure WebSocket Requests Bypass Middleware
app.use((req, res, next) => {
  if (req.headers.upgrade?.toLowerCase() === "websocket") return next();
  next();
});

// ✅ CORS Configuration (Including WebSockets)
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
  })
);

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
    transports: ["websocket", "polling"],
  },
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
});

// ✅ WebSocket Authentication Middleware
io.use((socket, next) => {
  let token = socket.handshake.auth?.token || socket.handshake.headers?.authorization;

  // ✅ Extract token from cookies (if available)
  if (!token && socket.request.headers.cookie) {
    const cookies = socket.request.headers.cookie.split("; ");
    const authCookie = cookies.find((cookie) => cookie.startsWith("token="));
    if (authCookie) token = authCookie.split("=")[1];
  }

  // ✅ Check if token exists
  if (!token) {
    console.log("❌ No JWT token provided for WebSocket connection.");
    return next(new Error("Authentication error: No token provided"));
  }

  // ✅ Remove "Bearer " prefix if present
  token = token.replace("Bearer ", "");

  // ✅ Ensure Secret Key is Available
  if (!process.env.TOKEN_SECRET_KEY) {
    console.log("❌ JWT Secret Key Missing");
    return next(new Error("Authentication error: JWT Secret is missing"));
  }

  // ✅ Verify JWT Token
  jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log("❌ WebSocket authentication failed:", err.message);
      return next(new Error("Authentication error: Invalid token"));
    }
    socket.user = decoded;
    console.log("🟢 WebSocket Authenticated:", decoded);
    next();
  });
});

// ✅ Attach WebSocket Event Handlers
socketHandler(io);

// ✅ Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("combined"));

// ✅ Helmet Security Headers
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

// ✅ Allow Credentials for WebSocket Support
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// ✅ API Routes
app.use("/api", router);

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log("✅ Connected to DB");
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`✅ API is live at: http://localhost:${PORT}/api`);
  });
});
