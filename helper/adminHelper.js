const db=require('../config/connection')
const bcrypt=require('bcrypt');
const ObjectId  = require('mongodb').ObjectId;
module.exports={
  //login
    //login
    doLogin:(data) => {
        return new Promise(async(resolve, reject) => {         
            let user = await db.get().collection('admin').findOne({email:data.email})
            if(user){
               await bcrypt.compare(data.password,user.password).then((cmp) => {
               if(cmp){
                delete user.password
                resolve(user)
               }
               else{
                reject("Password not matched!")
               }
            })
        }
            else{
                reject("user not found!")
            }
        })
    },
checkAdmin:()=>{
    return new Promise(async(resolve, reject) =>{
       let admin=await db.get().collection('admin').findOne()
       console.log(admin)
        if(admin){
            console.log("Admin found")
            resolve()
        }
        else{
            console.log("admin not found")
            reject("admin not found!")
        }
    })
},
createAdmin:(user)=>{
    return new Promise(async(resolve, reject)=>{
        user.createdOn = new Date();
        user.password=await bcrypt.hash(user.password,10);
        await db.get().collection('admin').insertOne(user)
        resolve()
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