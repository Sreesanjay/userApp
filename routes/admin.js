const express = require('express');
const router = express.Router();
const adminHelper = require('../helper/adminHelper')
const commonHelper = require('../helper/commonHelper')
const noCache = (req,res,next) => {
    console.log("chache clearing")
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    next();
}

const verifyLogin=(req,res,next) => {
    if(req.session.admin?.logedIn){
      next();
    }
    else{
      res.redirect('/admin/login')
    }
  }
  router.get('/',noCache,verifyLogin,(req,res) =>{
        adminHelper.getAllUsers().then((users) =>{
            res.render('admin/adminIndex',{admin:true,alert:req.session.alert,user:req.session.admin?.user,userData:users})
            delete req.session.alert
        })
      
  })
router.get('/login',noCache,(req,res) =>{
    if(req.session.admin?.logedIn){
        res.redirect('/admin/login')
    }
    else{
    res.render('admin/adminLogin',{admin:true,err:req.session.err})
    delete req.session.err
    }
})
  router.post('/admin-login',(req,res) =>{
    adminHelper.doLogin(req.body).then((user) => {
        req.session.admin={
            user: user,
            logedIn:true
        }
        req.session.alert={
            message:"Loged in successfully",
            type:true
        }
        res.redirect('/admin')
    }).catch((err) => {
        req.session.err={
            message:err
        }
        res.redirect('/admin/login')
    })
  })
  router.get('/deleteUser/:id',verifyLogin,(req,res)=>{
    adminHelper.deleteUser(req.params.id).then(()=>{
        req.session.alert={
            message:"user deleted succesfully",
            type:true
        }
        res.redirect('/admin')
    })
  })
router.get('/update-user/:id',verifyLogin,(req,res)=>{
   adminHelper.getUserData(req.params.id).then((userData)=>{
    res.render('admin/update-user',{admin:true,alert:req.session.alert,user:req.session.admin?.user,userData})
   })
    
})

router.post('/update_user_data',verifyLogin,(req,res)=>{
    let updateUserId= req.body._id
    adminHelper.updateUser(updateUserId,req.body).then(()=>{
        req.session.alert={
            message:"user updated succesfully",
            type:true
        }
        res.redirect('/admin')
    }).catch((err)=>{
        req.session.alert={
            message:err,
            type:false
        }
        let url="/admin/update-user/"+updateUserId;
        res.redirect(url)
    })
})
router.get('/search-user',verifyLogin,(req, res)=>{
    adminHelper.searchUser(req.query.userName).then((users)=>{
        res.render('admin/adminIndex',{admin:true,alert:req.session.alert,user:req.session.admin?.user,userData:users})
            delete req.session.alert
    })
})
router.get('/new-user',verifyLogin,(req,res)=>{
    res.render('admin/newUser',{admin:true,err:req.session.err})
    delete req.session.err
})
router.post('/new-user',(req,res)=>{
    commonHelper.createUser(req.body).then((user)=>{
        req.session.alert={
            message:"user created succesfully",
            type:true
        }
         res.redirect('/admin')
       }).catch(()=>{
        req.session.err={
            message: 'User or password already used !'
        }
        res.redirect('/admin/new-user')
       })
})
  module.exports=router;