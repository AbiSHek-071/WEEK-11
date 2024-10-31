require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const path = require("path");



app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(cookieParser());

mongoose.connect("mongodb://localhost:27017/Stitchers", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const userRoute = require("./Routes/userRoute");  // Correct import
const adminRoute = require("./Routes/adminRoute");


app.use("/user", userRoute);  // Use the correct router
app.use("/admin", adminRoute);

app.listen(3050, () => {
  console.log(`App running on ${process.env.PORT}`);
});
