const express=require('express')
const {engine}=require('express-handlebars')
const connectDb =require('./config/dbConnect')
const session = require('express-session')


require('dotenv').config()

const userRouter=require('./routes/uerRouter')
const adminRouter=require('./routes/adminRouter')


const app = express()
connectDb()

app.use(express.static(__dirname+'/public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(session({
    secret:'key',
    saveUninitialized:true,
    resave:false,

}))

app.use(function cachControl(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
})

app.use('/',userRouter) 
app.use('/admin',adminRouter)


app.engine('hbs',engine({extname:'.hbs'}))
app.set('view engine','hbs')


app.listen(8000,()=>{
    console.log('http://localhost:8000')
})

