const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose')
const app = express();

const PORT = 3000 ;
const property = require('./routes/property');
const auth = require('./routes/auth');

mongoose.connect(process.env.DB_CONNECTION)
.then(() => console.log("MongoDB Connected! 📍"))
.catch((err) => console.error("MongoDB Connection Error:", err));

app.use(express.urlencoded({ extended : true }));
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());
let corsOptions = {
  origin: [ 'http://localhost:3000' ],
  credentials : true
};
app.use(cors(corsOptions));

app.use('/auth', auth);
app.use('/api', property)

app.listen(PORT, () => {
  console.log("started at ",PORT);
});
