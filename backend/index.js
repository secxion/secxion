const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require('express-validator');
require('dotenv').config();
const connectDB = require('./config/db');
const router = require('./routes');
const helmet = require("helmet");
const morgan = require('morgan'); 

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100
});

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://trusted.cdn.com"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
}));

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true        
}));

app.use(limiter);

app.use(express.json());
app.use(cookieParser());

app.use(morgan('combined')); 

app.post('/api/some-endpoint', [
    body('username').isString().isLength({ min: 3 }),
    body('password').isString().isLength({ min: 6 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
});

app.use("/api", router);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 27017;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Connected to DB");
        console.log("Server is running on port " + PORT);
    });
});