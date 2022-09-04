require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require('./db/conn.js');
const cookieParser = require("cookie-parser");

const Products = require("./models/productsSchema.js");

const DefaultData = require("./defaultdata.js");
const cors = require("cors");
const router = require("./routes/router.js");


app.use(express.json());
app.use(cookieParser(""));
app.use(cors());
app.use(router);


const port = 5000;

app.listen(port,()=>{
    console.log(`server is running on port number ${port}`);
});
DefaultData();