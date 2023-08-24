const db=require('../config/connection')
const bcrypt=require('bcrypt');
module.exports={
    createUser:(user)=>{
        return new Promise(async(resolve, reject)=>{
            let data = await db.get().collection('users').findOne({$or: [{userName:{$eq: user.UserName}},{email:{$eq:user.email}}]})
            if(data===null){
            user.createdOn = new Date();
            user.userType = 'user';
            user.password=await bcrypt.hash(user.password,10);
            await db.get().collection('users').insertOne(user)
            resolve()
            }
            else{
                reject()
            }
        })
    }
}