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
const mysql = require('mysql2/promise');

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

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

app.post('/api/some-endpoint', [
    body('username').isString().isLength({ min: 3 }),
    body('password').isString().isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
        
        if (rows.length > 0) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }

        await connection.end();
    } catch (error) {
        console.error(error);
        res.status(500).send('Database error');
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