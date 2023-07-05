const express =require('express')
const adminModel=require('../models/adminModel')
const userModel=require('../models/userModel')
const verifyAdmin=require('../middlewares/verifyAdmin')

const router =express.Router()

router.get('/',verifyAdmin,async (req,res)=>{
    let users=await userModel.find({},{password:0}).lean()
    // console.log(req.session.admin)
    if(req.session.admin){

    res.render('adminHome',{users})
    }else{
        res.redirect('/login')
    }
})
router.get('/login',(req,res)=>{
    if(req.session.admin){
        res.redirect('/admin')
    }
    else{
        res.render('adminLogin')
    }
})
router.post('/login',async (req,res)=>{
    const {email,password}=req.body
    if(email=="" || password==""){
        res.render('adminLogin', {error:true, message:"Please fill alll the field"})
    }
    const admin=await adminModel.findOne({email})
    if(admin){
        if(password==admin.password){
            req.session.admin={name:admin.name}
            res.redirect('/admin/')
        }else{
            res.render('adminLogin',{error:true, message:"invalid email or password"})
        }
    }else{
        res.render('adminLogin', {error:true, message:"no admin found"})
    }
})
router.get('/create-user',(req,res)=>{
    res.render('createUser')    
})
router.post('/create-user',async(req,res)=>{
    const{name,email,mobile,password}=req.body
    if(name==''||email==''||mobile==''||password==''){
        res.render('createUser',{error:true,message:'please enter all fields'})
    }
    if(mobile.toString().length!=10){
        return res.render('createUser',{error:true,message:'Mobile number must be 10 digits'})
    }
    let exUser=await userModel.findOne({email})
    if(exUser){
        return res.render('createUser',{error:true,message:'user alredy exists'})
    }
    let user=new userModel({name,email,mobile,password})
    user.save((err,data)=>{
        if(err){
            return res.render('createUser',{error:true,mesage:'couldnt save'})
        }
        else{
            console.log (req.body)
            return res.redirect('/admin/')

}})
})
router.get('/logout',(req,res)=>{
    req.session.admin=null
    res.redirect('/admin/login')
})
router.get('/delete-user/:id',(req,res)=>{
   userModel.deleteOne({_id:req.params.id}).then(()=>{
    if(req.session.user.id===req.params.id){
        req.session.user=null;
    }
    res.redirect("/admin/")
   }).catch(err=>{
    console.log(err)  
   })
})
router.get('/update-user/:id',async(req,res)=>{
    const user=await userModel.findOne({_id:req.params.id});
    console.log(user)
    res.render('updateUser', user) 
  } )
router.post('/update-user',async(req,res)=>{
    const {name, email, mobile, _id}=req.body;
  await userModel.updateOne({_id},{$set:{name, email, mobile}}, {upsert:true})
    res.redirect('/admin/')
})
router.post('/search-user',async(req,res)=>{
    const users= await userModel.find({name:new RegExp(req.body.key,"i")}).lean()
   res.render( 'adminHome',{users})
})
module.exports=router