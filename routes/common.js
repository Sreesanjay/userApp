const express = require('express');
const router = express.Router();
const commonHelper = require('../helper/commonHelper')
const noCache = (req,res,next) => {
    console.log("chache clearing")
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

router.get('/',noCache,verifyLogin,(req, res) => {
        commonHelper.getBlogs(req.session.user.user._id).then((blogs) => {
        res.render('common/home',{user:req.session.user?.user,alert:req.session.alert,blogs})
        delete req.session.alert
        })
})

router.get('/login',noCache,(req, res) => {
    if(req.session.user?.logedIn){
        res.redirect('/')
    }
    else{
    console.log("log in got")
    res.render('common/login',{err:req.session.err,alert:req.session.alert})
    delete req.session.err;
    delete req.session.alert;
    }
})
router.post('/login-form',(req, res) => {
    commonHelper.doLogin(req.body).then((user) => {
        req.session.user={
            user: user,
            logedIn:true
        }
        req.session.alert={
            message:"Loged in successfully",
            type:true
        }
        res.redirect('/')
    }).catch((err) => {
        req.session.err={
            message:err
        }
        res.redirect('/login')
    })
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
        message: 'User or password already used !'
    }
    res.redirect('/sign-up')
   })
})

router.get('/newBlog',verifyLogin, (req, res)=>{
    res.render('common/newBlog',{user:req.session.user?.user,alert:req.session.alert})
    delete req.session.alert; 
})
router.post('/new-blog',verifyLogin,(req, res)=>{
    req.body.user_id=req.session.user?.user._id;
    commonHelper.storeBlogs(req.body).then(()=>{
        req.session.alert={
            message:"New blog uploded succesfully",
            type:true
        }
        res.redirect('/newBlog')
    }).catch(()=>{
        req.session.alert={
            message:"Failed to upload blog",
            type:false
        }
        res.redirect('/new-blog')
    })
})

module.exports=router;