const cookieParser = require("cookie-parser");
const express = require("express")
const app = express()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require("./models/user")
const Path = require("path")


app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(Path.join(__dirname, 'public'))); 
app.use(cookieParser());




app.get("/",(req, res)=>{
    res.render("index.ejs")
})


app.post("/create", async(req, res)=>{
    let {username, email, password, age} = req.body;

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hash) {
            // Store hash in your password DB.
            let createdUser =  await userModel.create({
                username,
                email,
                password: hash,
                age
            }) 

            // Aab account baan hi gaya to login bhi kara dete hai
            let token = jwt.sign({email}, "abcd");
            res.cookie("token", token)

            res.redirect("/" )
        });
    });
})


app.get("/login", (req, res)=>{
    res.render("login")
})
app.post("/login",async (req, res)=>{
    let {email, password} = req.body;
    
   let user =  await userModel.findOne({email})
   if(!user) return res.render("login")
    bcrypt.compare(password, user.password, (err, result)=>{
            if(result){
                let token = jwt.sign({email: user.email}, "abcd");
                res.cookie("token", token)

                res.send("User successfully login")
            }
            else{
                res.send("Something went wronge")
            }
    })
})




app.get('/logout', (req,res)=>{
    res.cookie("token","" )
    res.redirect("/")


})
















app.listen(3000,()=>{
    console.log(`🟢 Server started at http://localhost:3000  🟢`);
    
})