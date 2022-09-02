const express = require("express");
const router = new express.Router();
const Products = require("../models/productsSchema.js");
const USER = require("../models/userSchema.js");


// get Productsdata api
router.get("/getproducts", async(req,res)=>{
    try {
        const productsdata = await Products.find();
        // console.log("console the data" + productsdata);
        res.status(201).json(productsdata);
    } catch (error) {
        console.log("error" + error.message);
    }
});


// get individual id data
router.get("/getproductsone/:id", async(req, res)=>{
    try {
        const {id} = req.params;
        // console.log(id);
        const individualdata = await Products.findOne({id:id});
        // console.log(individualdata);
        res.status(201).json(individualdata);
    } catch (error) {
        res.status(400).json(individualdata);
        console.log("error" + error.message);
    }
});

router.post("/register", async(req,res)=>{
    // console.log(req.body);

    const {fname,email,mobile,password,cpassword} = req.body;

    if(!fname || !email || !mobile || !password || !cpassword){
        res.status(422).json({error:"fill the all field"});
        console.log("no data available");
    };

    try {
        const preuser = await USER.findOne({email:email});

        if(preuser){
            res.status(422).json({error:"this user is already exist"})
        }else if(password !== cpassword){
            res.status(422).json({error:"password and confirm password are not match"})
        }else{
            const finalUser = new USER({
                fname,email,mobile,password,cpassword
            });

            const storedata = await finalUser.save();
            console.log(storedata);

            res.status(201).json(storedata);
        }

        
    } catch (error) {
        
    }
})



module.exports = router;