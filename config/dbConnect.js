const mongoose=require('mongoose')


function connectDb(){
 
    mongoose.set('strictQuery',false)

 mongoose.connect(process.env.dbConfig)
 .then((res)=>{
    console.log('database connected')
 }).catch((err)=>{
    console.log(err)
 })
}
module.exports=connectDb