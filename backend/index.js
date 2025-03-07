const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose')
const cloudinary = require('cloudinary').v2;
const app = express();

const PORT = process.env.PORT || 3000;
const property = require('./routes/property');
const auth = require('./routes/auth');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
let corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://property-zeta-eight.vercel.app',
    ];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Must be true to allow cookies
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'], // Explicitly allow methods
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'], // Allow common headers
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.options('*', cors(corsOptions));
// Increase body size limit for JSON requests
app.use(express.json({ limit: '10mb' })); // Increase to 10MB (adjust as needed)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

mongoose.connect(process.env.DB_CONNECTION)
.then(() => console.log("MongoDB Connected! 📍"))
.catch((err) => console.error("MongoDB Connection Error:", err));

app.use(express.urlencoded({ extended : true }));
app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public/property-images/')));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Headers:`, req.headers);
  res.on('finish', () => {
    console.log(`Response Headers:`, res.getHeaders());
  });
  next();
});
app.use('/auth', auth);
app.use('/api', property)

app.listen(PORT, () => {
  console.log("started at ",PORT);
});
