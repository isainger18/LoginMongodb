const express               = require("express")
const app                   = express();
const port                  = 3000
const mongoose              = require("mongoose")
const passport              = require("passport")
const localStrategy          = require("passport-local")
const bodyParser            = require("body-parser")
const passportLocalMongoose = require("passport-local-mongoose")
const user                  = require("./models/user")

mongoose.connect("mongodb://localhost:27017/authDemoApp", {useNewUrlParser:true, useUnifiedTopology: true})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}))


app.use(require("express-session")({
    secret:"Ishank is good boy",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session());

passport.use(new localStrategy(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())


app.get("/", function(req, res){
    res.render("home")
})

app.get("/secret",isLoggedIn, function(req, res){
    res.render("secret"); 
 });
 

app.get("/register", function(req, res){
    res.render("register")
})

app.post("/register", function(req, res){
   
    user.register(new user({username:req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err)
            return res.render("register")
        }
        passport.authenticate("local")(req, res, function(){
                res.redirect("secret")
        })
    })
})

app.get("/login", function(req, res){
    res.render("login")
})

app.post("/login", passport.authenticate("local",{
    successRedirect:"/secret",
    failureRedirect:"/login"
}), function(req, res){

})
app.get("/logout", function(req, res){
    req.logOut();
    res.redirect("/")
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(port, function() {
    console.log("Server started on port 3000" );
  });
