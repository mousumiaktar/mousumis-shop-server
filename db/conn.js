const mongoose = require("mongoose");

const DB = process.env.DATABASE;
// productsUser  // 3Ks8F8d49U8421qQ
mongoose.connect(DB).then(()=>console.log("database connected")).catch((error)=>console.log("error" + error.message));