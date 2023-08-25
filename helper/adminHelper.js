const db=require('../config/connection')
const bcrypt=require('bcrypt');
const ObjectId  = require('mongodb').ObjectId;
module.exports={
  //login
  doLogin:(data) => {
    return new Promise(async(resolve, reject) => {         
        let user = await db.get().collection('admin').findOne({email:data.email})
        if(user){
           if(user.password==data.password){
            delete user.password
            console.log("loge in")
            resolve(user)
           }
           else{
            reject("Password not matched!")
           }
    }
        else{
            reject("user not found!")
        }
    })
},
getAllUsers:()=>{
    return new Promise(async(resolve, reject)=>{
        let useData=await db.get().collection("users").find().toArray()
        console.log(useData[0])
        resolve(useData)
    })
},
deleteUser:(user_id)=>{
    return new Promise(async(resolve, reject)=>{
        await db.get().collection('users').deleteOne({_id:new ObjectId(user_id)})
        resolve()
    })
},

//get userdata
getUserData:(user_id)=>{
    console.log("user id",user_id)
    return new Promise(async(resolve, reject) =>{
        db.get().collection('users').findOne({_id:new ObjectId(user_id)}).then((result)=>{
            resolve(result)   
        })
      
    })

},
}