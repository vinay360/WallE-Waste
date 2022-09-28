var express = require("express");
var router = express.Router();
const database = require("./database");
const multer  = require('multer');
const twilio = require("./twilio");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, './public/uploads')
        },
    filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix+'.png')
}
});

const upload = multer({ storage: storage })

// router.post('/order', async function (req, res) {
router.post('/order', upload.single('image'), function (req, res) {
    let email=req.session.user.email;
    let catagory = req.body.catagory;
    let amount = req.body.amount;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;
    let address = req.body.address;
    let date = req.body.StartDate;
    let slot = req.body.slot;
    let image = req.file.filename;
    let phoneNo = req.body.phoneNo;
    let otp = Math.floor((Math.random()+0.1)*10000);
    let orderId = Math.floor((Math.random()+0.1)*10000000000);
    twilio.sendOtp(phoneNo,otp,orderId);
    try{
        database.insertOrder(email,catagory,amount,address,latitude,longitude,date,slot,image,orderId,phoneNo,otp);
        res.render("orderplaced", {orderID:orderId});
    }
    catch(err){
        res.send(err);
    }

  })

router.get('/orderdetails/:tagId', async (req,res)=>{
    if(req.session.user){
        let orderId = Number(req.params.tagId);
        const result = await database.ordersDetails(orderId);
        console.log(result);
        if (result.Pending==true){
            res.render("orderdetails",result);
        }
        else{
            res.send("Job has been completed!")
        }
    }
    else{
        res.send("Unauthorised User!");
    }

})
  
// // Login user
router.post('/login', async (req,res) =>{
    let email = req.body.email;
    let password = req.body.password;
    let result = await database.findCitizen(email);
    // console.log(result);
    if (result!=null){
        if(email==result.email && password==result.password){
            req.session.user = {
                email: email,
                name : result.name
            };
            res.redirect("/route/dashboard");
            // res.send("Login Successful");
        }
        else{
            res.send("Invalid credentials");
        }
    }
    else{
        res.send("No Citizen user found with this email!");
    }
})

// Login Receiver
router.post('/loginReceiver', async (req,res) =>{
    let email = req.body.email;
    let password = req.body.password;
    let result = await database.findReceiver(email);
    // console.log(result);
    if (result!=null){
        if(email==result.email && password==result.password){
            req.session.user = {
                email: email,
                name : result.name
            };
            res.redirect("/route/dashboardReceiver");
            // res.send("Login Successful");
        }
        else{
            res.send("Invalid credentials");
        }
    }
    else{
        res.send("No Receiver user found with this email!");
    }
})


router.get("/pendingOrders", async(req,res)=> {
    if(req.session.user){
        let result = await database.findCollectorOrders();
        let pendingOrders = await database.findPendingCollectorOrders();
        let completedOrders = await database.findCompletedCollectorOrders();
        // console.log(result);
        res.render("pendingOrders",{
            user: req.session.user,
            orders: result,
            pending: pendingOrders,
            completed: completedOrders
        });
    }
    else{
        res.send("Unauthorised User!");
    }
})

router.post("/signupCitizen", async(req,res)=>{
    let email = req.body.email;
    let password = req.body.password;
    let name = req.body.name;
    let phone = req.body.phone;
    let result = await database.findCitizen(email);
    if (result!=null){ res.send("A User already registered with with email!"); }
    else{
        try{
            database.insertCitizen(name,email,password,phone);
            // res.redirect("/route/loginReceiver");
            res.send("Your Account Has been Created!")
        }
        catch(err){
            res.send(err);
        }
    }
})
router.post("/signupReceiver", async(req,res)=>{

    let email = await req.body.email;
    let password = req.body.password;
    let name = req.body.name;
    let phone = req.body.phone;
    let result = await database.findReceiver(email);
    if (result!=null){ res.send("A Receiver already registered with with email!"); }
    else{
        try{
            database.insertReceiver(name,email,password,phone);
            res.redirect("/")
        }
        catch(err){
            res.send(err);
        }
    }
})

// Route for dashboard
router.get("/dashboard", (req,res)=> {
    if(req.session.user){
        res.render("dashboard",{user: req.session.user});
    }
    else{
        res.send("Unauthorised User!");
    }
})

router.get("/dashboardReceiver", async(req,res)=> {
    if(req.session.user){
        let result = await database.findCollectorOrders();
        console.log(result);
        res.render("dashboardReceiver",{
            user: req.session.user,
            orders: result
        });
    }
    else{
        res.send("Unauthorised User!");
    }
})

// Route for logout
router.get('/logout',(req,res) =>{
    req.session.destroy(function(err){
        if(err){
            console.log(err);
            res.send(err);
        }
        else{
            res.render("login");
        }
    });
})

//Order History
router.get("/userOrders", async(req,res)=> {
    if(req.session.user){
        let email = req.session.user.email;
        let result = await database.findCitizenOrders(email);
        let pendingOrders = await database.findPendingOrders(email);
        let completedOrders = await database.findCompletedOrders(email);
        res.render("userOrders",{
            user: req.session.user, 
            orders: result,
            pendingOrders: pendingOrders,
            completedOrders: completedOrders
        });
    }
    else{
        res.send("Unauthorised User!");
    }
})

// Slot Booking
router.get('/book',(req,res) =>{
    if(req.session.user){
        res.render("book");
    }
    else{
        res.send("Unauthorised User!");
    }
})

// Slot Booking
router.get('/collectorLogin',(req,res) =>{
    res.render("collectorLogin");
})

router.get("/about",(req,res)=>{
    res.render("about");
})

router.post("/otp",async (req,res) =>{
    console.log(req.session.user);
    console.log(req.body);
    const result = await database.ordersDetails(Number(req.body.orderId));
    if (result.otp==req.body.otp){
        await database.updateValidationStatus(req.session.email,Number(req.body.orderId));
        // res.send("Otp was correct! Good Job")
        res.render("ordercomplete");
    }
    else{
        res.send("Incorrect OTP");
    }
})

module.exports = router;
