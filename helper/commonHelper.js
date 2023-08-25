const db=require('../config/connection')
const bcrypt=require('bcrypt');
const ObjectId  = require('mongodb').ObjectId;
module.exports={
    //code for creating a new user
    createUser:(user)=>{
        return new Promise(async(resolve, reject)=>{
            let data = await db.get().collection('users').findOne({$or: [{userName:{$eq: user.UserName}},{email:{$eq:user.email}}]})
            if(data===null){
            user.createdOn = new Date();
            user.password=await bcrypt.hash(user.password,10);
            await db.get().collection('users').insertOne(user)
            resolve()
            }
            else{
                reject()
            }
        })
        
    },
    //login
    doLogin:(data) => {
        return new Promise(async(resolve, reject) => {         
            let user = await db.get().collection('users').findOne({email:data.email})
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

storeBlogs:(blog) =>{
    return new Promise(async(resolve, reject) =>{
        blog.created_on=new Date();
        db.get().collection('blogs').insertOne(blog).then(()=>{
            resolve()
        }).catch((error)=>{
            reject()
        })
    })
},
getBlogs:(user_id) =>{
    console.log("user id",user_id)
    return new Promise(async(resolve, reject) =>{
        let blogs=await db.get().collection('blogs').find({user_id:user_id}).toArray()
        console.log(blogs)
        resolve(blogs)
    })
}

}