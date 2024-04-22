require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const User = require('./model/message');
const bodyparser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt   = require('jsonwebtoken');
const cookieParser = require('cookie-parser')


mongoose.connect('mongodb://0.0.0.0:27017/Registration').then(() => console.log('Connected!'));

app.use(express.json());

app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views');

// app.use(express.static(static_path));

app.set('view engine', 'html');
app.set('view engine', 'ejs');

console.log(process.env.SECRET_KEY);

app.get('/register',(req,res)=>{
    res.render('register')
})
app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/secret',(req,res)=>{
    console.log(`this is the cookie ${req.cookies.jwt}`);
    res.render('secret')
})

app.post('/register', async(req, res) => {
    const { username, email, password } = req.body;

    const user = await new User({ username, email, password });
    user.save();
    console.log("sucess"+user);

    const token =  await user.generateAuthToken();
    console.log("the token part "+token);

    res.cookie("jwt",token,{
        expires :new Date(Date.now()+50000),
        httpOnly:true
    })

    res.send('Registration successful');
});



app.post('/login' ,async(req,res)=>{
    
    try {

        const email = req.body.email;
        const password = req.body.password;
        const data = await User.findOne({email:email});
        const isMatch =  await bcrypt.compare(password, data.password);

        const token =  await data.generateAuthToken();
        console.log("the token part :"+ token);

        res.cookie("jwt",token,{
            expires :new Date(Date.now()+60000),
            httpOnly:true
        })

        res.send(data);

        
    } catch (error) {
        res.send("invalid email and password")
    }
})


app.listen(3000,()=>{
    console.log("Server connected......");
})