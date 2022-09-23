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
app.use(router);
app.use(cors({
    origin: "http://localhost:3000",
}));



// const corsConfig = {
//     origin: true,
//     credentials: true,
//   };
//   app.use(cors(corsConfig));
//   app.options("*", cors(corsConfig));


const port = process.env.PORT||5000;
app.get('/', (req, res)=>{
    res.send("home page");

})
app.all('*', (req, res)=>{
    res.send("no route found");

})

app.listen(port,()=>{
    console.log(`server is running on port number ${port}`);
});
DefaultData();