const express = require('express');
const router = express.Router();
const commonHelper = require('../helper/commonHelper')
const noCache = (next) => {
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    next();
}
const verifyLogin=(req,res,next) => {
    if(req.session.user?.logedIn){
      next();
    }
    else{
      res.redirect('/login')
    }
  }
router.get('/', verifyLogin,(req, res) => {
    let user=users.find((usr)=>usr.id===req.session.user.id)
    res.render('common/home',{user:user})
})
router.get('/login',(req, res) => {
    console.log("log in got")
    if(req.session.user?.logedIn){
        res.redirect('/')
    }
    else{
    res.render('common/login',{err:req.session.err,alert:req.session.alert})
    delete req.session.err;
    delete req.session.alert;
    }
})
router.post('/login-form',(req, res) => {
    commonHelper
})

router.get('/logout',verifyLogin,(req,res)=>{

    console.log("log out")
    req.session.destroy();
    res.redirect('/login')
})
router.get('/sign-up',(req,res)=>{
    res.render('common/signup',{err:req.session.err})
    delete req.session.err;
})
router.post('/sign-up-form',(req,res)=>{
   commonHelper.createUser(req.body).then((user)=>{
    req.session.alert={
        message:"user created succesfully",
        type:true
    }
     res.redirect('/login')
   }).catch(()=>{
    req.session.err={
        message: 'User or password not matched !'
    }
    res.redirect('/sign-up')
   })
})
module.exports=router;