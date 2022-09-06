const express = require("express");
const router = new express.Router();
const Products = require("../models/productsSchema.js");
const USER = require("../models/userSchema.js");
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate.js");


// get Productsdata api
router.get("/getproducts", async (req, res) => {
    try {
        const productsdata = await Products.find();
        // console.log("console the data" + productsdata);
        res.status(201).json(productsdata);
    } catch (error) {
        console.log("error" + error.message);
    }
});


// get individual id data
router.get("/getproductsone/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(id);
        const individualdata = await Products.findOne({ id: id });
        // console.log(individualdata);
        res.status(201).json(individualdata);
    } catch (error) {
        res.status(400).json(individualdata);
        console.log("error" + error.message);
    }
});



// Register
router.post("/register", async (req, res) => {
    // console.log(req.body);
    const { fname, email, mobile, password, cpassword } = req.body;

    if (!fname || !email || !mobile || !password || !cpassword) {
        res.status(422).json({ error: "fill the all field" });
        console.log("no data available");
    };

    try {
        const preuser = await USER.findOne({ email: email });

        if (preuser) {
            res.status(422).json({ error: "this user is already exist" })
        } else if (password !== cpassword) {
            res.status(422).json({ error: "password and confirm password are not match" })
        } else {
            const finalUser = new USER({
                fname, email, mobile, password, cpassword
            });

            const storedata = await finalUser.save();
            console.log(storedata);

            res.status(201).json(storedata);
        }


    } catch (error) {

    }
});




// LOgin.........................
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: "fill all the input field" });
    };

    try {
        const userlogin = await USER.findOne({ email: email });
        console.log(userlogin + "user value");

        if (userlogin) {
            const isMatch = await bcrypt.compare(password, userlogin.password);
            // console.log(isMatch);

            // jwt Token.........
            const token = await userlogin.generateAuthtoken();
            // console.log(token);

            res.cookie("restaurant", token, {
                expires: new Date(Date.now() + 900000),
                httpOnly: true
            })


            if (!isMatch) {
                res.status(400).json({ error: "invalid password" });
            } else {
                res.status(201).json(userlogin);
            }
        } else {
            res.status(400).json({ error: "invalid password" });
        }

    } catch (error) {
        res.status(400).json({ error: "invalid details" });
    }

});

// adding the data into cart

router.post("/addcart/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await Products.findOne({ id: id });
        console.log(cart + "cart value");

        const UserContact = await USER.findOne({ _id: req.userID });
        console.log(UserContact);

        if (UserContact) {
            const cartData = await UserContact.addcartdata(cart);
            await UserContact.save();
            console.log(cartData);
            res.status(201).json(UserContact);
        } else {
            res.status(401).json({ error: "invalid user" });
        }

    } catch (error) {
        res.status(401).json({ error: "invalid user" });
    }
});

// GET CART DETAILS
router.get("/cartdetails", authenticate, async (req, res) => {
    try {
        const buyuser = await USER.findOne({ _id: req.userID });
        res.status(201).json(buyuser);
    } catch (error) {
        console.log("error" + error);
    }
})


// GET VALID USER
router.get("/validuser", authenticate, async (req, res) => {
    try {
        const validuserone = await USER.findOne({ _id: req.userID });
        res.status(201).json(validuserone);
    } catch (error) {
        console.log("error" + error);
    }
});


// DELETE ITEM FROM CART
router.delete("/remove/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        req.rootUser.carts = req.rootUser.carts.filter((currentValue) => {
            return currentValue.id != id;
        });

        req.rootUser.save();
        res.status(201).json(req.rootUser);
        console.log("item removed");

    } catch (error) {
        console.log("error" + error);
        res.status(400).json(req.rootUser);
    }
});


// USER LOGOUT...
router.get("/logout",authenticate,(req,res)=>{
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((currentElement)=>{
            return currentElement.token !== req.token
        });

        res.clearCookie("restaurant",{path:"/"});

        req.rootUser.save();
        res.status(201).json(req.rootUser.tokens);
        console.log("user logout");
    } catch (error) {
       console.log("error for user logout");
    }
})





module.exports = router;