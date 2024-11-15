const express=require('express')
const app=express();
const userRoutes=require('./routes/user')
const adminRoute=require('./routes/admin')
const path=require('path');
const connectDB = require('./db/connectDB');
const session=require('express-session');
const nocache=require('nocache')

// nocache MiddleWare
app.use(nocache())
// Session Middleware
app.use(session({secret:'mysecretkey',
   resave:false,
   saveUninitialized:false,
}))


// Connect pth ejs files from view Directory
app.set("views",path.join(__dirname,'views'));
// Setup view Engine "Ejs"
app.set("view engine",'ejs');
// Serve static Files from Public Folder
app.use(express.static('public'))

// Body Parsing Middleware
app.use(express.urlencoded({extended:true}))
app.use(express.json())

// User Router
app.use('/user',userRoutes)
//Admin Router
app.use('/admin',adminRoute)

// Connection To Database
connectDB();

// Starting The Server
app.listen(3000,()=>{
   console.log("server start at : http://localhost:3000/user/register")
})   

 