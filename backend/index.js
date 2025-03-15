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

io.use((socket, next) => {
  let token = socket.handshake.auth?.token || socket.handshake.headers?.authorization;

  if (!token && socket.request.headers.cookie) {
    const cookies = socket.request.headers.cookie.split("; ");
    const authCookie = cookies.find((cookie) => cookie.startsWith("token="));
    if (authCookie) token = authCookie.split("=")[1];
  }

  if (!token) {
    console.log("❌ No JWT token provided for WebSocket connection.");
    return next(new Error("Authentication error: No token provided"));
  }

  token = token.replace("Bearer ", "");

  if (!process.env.TOKEN_SECRET_KEY) {
    console.log("❌ JWT Secret Key Missing");
    return next(new Error("Authentication error: JWT Secret is missing"));
  }

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

socketHandler(io);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("combined"));

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

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use("/api", router);

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
