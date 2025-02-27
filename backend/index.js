const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose')
const app = express();

const PORT = 3000 ;
const property = require('./routes/property');
const auth = require('./routes/auth');

mongoose.connect(process.env.DB_CONNECTION)
.then(() => console.log("MongoDB Connected! 📍"))
.catch((err) => console.error("MongoDB Connection Error:", err));

app.use(express.json());
app.use(express.static('public'));
let corsOptions = {
  origin: [ 'http://localhost:8000', 'http://localhost:3000' ],
  credentials : true
};
app.use(cors(corsOptions));

app.use('/auth', auth);
// mongoose.connect(process.env.DB_CONNECTION);



// app.get("/contacts/:id", async (req, res) => {
//   const id = req.params.id;
//   const parsedId = parseInt(id);
//   console.log(id);

//   try {
//     const userFound = await User.find({ _id: id });
//     console.log(userFound);
//     res.status(202).send(`User found with id: ${id}`);
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.get("/contacts", async (req, res) => {
//   try {
//     const data = await User.find({});
//     console.log("Data found are asdf:", data);

//     res.status(200).send(data);
//   } catch (err) {
//     console.log(data);
//   }
// });

// app.put("/contacts/:id", async (req, res) => {
//   const id = req.params.id || req.query.id;
//   const { email, password, name, userName } = req.body;

//   try {
//     const updatedUser = await User.updateOne(
//       { _id: id },
//       { email, password, name, userName }
//     );
//     console.log(updatedUser);
//     res.status(201).send(`User updated with id : ${id}`);
//   } catch (err) {
//     console.log(`Error updatin the user : ${err}`);
//   }
// });

// app.delete("/contacts/:id", async (req, res) => {
//   const id = req.params.id;
//   try {
//     const userDeleted = await User.deleteOne({ _id: id });
//     console.log("user deleted : ", userDeleted);
//     res.status(206).send(`User delted removed succesfully ${id}`);
//   } catch (err) {
//     console.log(err);
//   }
// });

// const login = async (req, res) => {
//   const { email, password } = req.body;
//   if (!(email && password)) {
//     return res.status(400).json({ message: "All inputs are required." });
//   }
//   const user = await User.findOne({ email });
//   if (!(user && (await bcrypt.compare(password, user.password)))) {
//     return res.status(400).json({ message: "Invalid credentials." });
//   }
//   const token = createSecretToken(user._id);
//   res.cookie("token", token, {
//     // "domain: process.env.frontend_url,"
//     path: "/",
//     expires: new Date(Date.now() + 86400000),
//     secure: true,
//     httpOnly: true,
//     sameSite: "None",
//   });
//   res.json({ token });
// };
// app.delete("/delete",(req,res)=>{
    
// })

// app.use('/cookie', function (req, res, next) {
//   res.cookie('title', 'GeeksforGeeks');
//   // res.send("Cookie Set");
//   next();
// })

// app.post("/cookie",(req,res)=>{
//   res.cookie('name', 'geeksforgeeks');
//   res.send("Cookie Set");
// })

// app.post("/signup", async (req, res) => {
//   try {
//     if (
//       !(
//         req.body.email &&
//         req.body.password &&
//         req.body.name &&
//         req.body.userName
//       )
//     ) {
//       res.status(400).send("All inputs are required.");
//     }

//     const oldUser = await User.findOne({ email: req.body.email });
//     if (oldUser)
//       return res.status(409).send("User Already Exists. Please login");

//     // saving user with hased password
//     const salt = 10;
//     const hashedPassword = await bcrypt.hash(req.body.password, salt);
//     const newUser = new User({
//       name: req.body.name,
//       userName: req.body.userName,
//       email: req.body.email,
//       password: hashedPassword,
//     });
//     const user = await newUser.save();
//     const token = createSecretToken(user._id);

//     res.cookie("token", token, {
//       path: "/",
//       expires: new Date(Date.now() + 86400000),
//       secure: true,
//       httpOnly: true,
//       sameSite: "None",
//     });

//     console.log("Cookie set successfully!");

//     res.json(user);
//   } catch (err) {
//     console.log("Got an error", err);
//   }
// });
// app.post("/login", login);

// app.get("/logout", (req, res) => {
//   res.clearCookie("token");
//   res.json({ message: "Logged out." });
// });



app.use('/api', property)

app.listen(PORT, () => {
  console.log("started at ",PORT);
});
