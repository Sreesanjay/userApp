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
        let useData = await db.get().collection('users').find().toArray()
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
    return new Promise(async(resolve, reject) =>{
        db.get().collection('users').findOne({_id:new ObjectId(user_id)}).then((result)=>{
            resolve(result)   
        })
      
    })

},
updateUser:(user_id, user_data)=>{
    return new Promise(async(resolve, reject) =>{
        delete user_data._id;
        if(user_data.password==''){
            delete user_data.password
        }
        else{
            user_data.password=await bcrypt.hash(user_data.password,10);
        }
        let existUser = await db.get().collection('users').find({_id:{$ne:new ObjectId(user_id)},email:user_data.email}).toArray()
        if(existUser.length>0){
            reject("email already used")
        }
        else{
        await db.get().collection('users').updateOne({_id:new ObjectId(user_id)},{$set:user_data})
        resolve()
        }
    })
},
searchUser:(userName) => {
    return new Promise(async(resolve, reject) => {
       let users = await db.get().collection('users').find({userName:{$regex:userName}}).toArray()
       resolve(users)
    })
}
}