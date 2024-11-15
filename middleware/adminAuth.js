const checkSession=(req,res,next)=>{
    if(!req.session.admin){
        console.log("admin exist")
        return res.redirect('/admin/login')
    }else{
        next();
    }
}
const isLogin=(req,res,next)=>{
    console.log("in login page")
    if(req.session.admin){
        console.log("admin exists")
        return res.redirect('/admin/dashboard')
    }else{
        next()
    }
}


module.exports={checkSession,isLogin}