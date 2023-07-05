const express=require("express")
const userModel=require('../models/userModel')

const router=express.Router()
const verifyUser=require('../middlewares/verifyUser')


router.get('/',verifyUser,(req,res)=>{
    
        res.render('userHome',{userName:req.session.user.name})
})

router.get('/signup',(req,res)=>{
  res.render('usersignup')
})
router.post('/signup',async (req,res)=>{
    const {name,email,mobile,password}=req.body
    if(name==''||email==''||mobile==''||password==""){
        return res.render('usersignup',{error:true,message:'please fill all fields'})
    }
    if(mobile.toString().length!=10){
        return res.render('usersignup',{error:true,message:'Mobile number must be 10 digits'})
    }
    let exUser=await userModel.findOne({email})
    if(exUser){
        return res.render('usersignup',{error:true,message:'user alredy exists'})
    }
    let user=new userModel({name,email,mobile,password})
    user.save((err,data)=>{
        if(err){
            console.log(err)
            return res.render('usersignup',{error:true,message:'please ener all fields'})
        }
        else{
            return res.redirect('/')
            
        }

    })
})
router.get('/login',(req,res)=>{
    if(req.session.user){
        res.redirect('/')
    }
    else{

        res.render('userLogin')
    }
})

router.post('/login',async (req,res)=>{
    const {email,password}=req.body
    let user=await userModel.findOne({email})
    if(user){
        if(password==user.password){
            req.session.user={name:user.name,id:user._id}
            res.redirect('/')
        }
        else{
            res.render('userLogin',{error:true,message:'incorrect password'})
        }
    }
    else{
        res.render('userLogin',{error:true,message:'no user found'})
    }
})
router.get('/logout',(req,res)=>{
    req.session.user=null
    res.redirect('/login')
})


module.exports=router 
