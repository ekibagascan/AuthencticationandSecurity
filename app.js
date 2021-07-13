//jshint esversion:6
require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useUnifiedTopology: true}, {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema) 

app.get("/", (req, res) => {
    res.render("home")
})
app.get("/login", (req, res) => {
    res.render("login")
})
app.get("/register", (req, res) => {
    res.render("register")
})

app.post("/register", (req, res) => {
   const newUser = new User ({
     email: req.body.username,
     password: req.body.password
   });

   newUser.save((err) => {
       if(!err){
           res.render("secrets");
       }
   })
});

app.post("/login", (req, res) => {
    User.findOne({email: req.body.username}, (err, foundUser) => {
        if(err){
            console.log(err);
        } else {
            if(foundUser){
                if(foundUser.password === req.body.password){
                    res.render("secrets")      
                }
            }
        }
    });
});

app.get("/secrets", (req, res) => {
    res.render("secrets")
})
app.get("/submit", (req, res) => {
    res.render("submit")
})


app.listen(3000, function() {
    console.log("Server started on port 3000");
  });