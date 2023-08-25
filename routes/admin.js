const express = require('express');
const router = express.Router();
const adminHelper = require('../helper/adminHelper')
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
  router.get('/',verifyLogin,(req,res) =>{
        adminHelper.getAllUsers().then((users) =>{
            res.render('admin/adminIndex',{admin:true,alert:req.session.alert,user:req.session.admin?.user,userData:users})
            delete req.session.alert
        })
      
  })
router.get('/login',(req,res) =>{
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
router.get('/updateUser/:id',verifyLogin,(req,res)=>{
    console.log("id is",req.params.id)
    req.session.updateUser=req.params.id;
    adminHelper.getUserData(req.session.updateUser).then((updatingUser)=>{
        console.log(updatingUser)
        res.render('admin/update-user',{admin:true,updatingUser})
    })
})
  module.exports=router;