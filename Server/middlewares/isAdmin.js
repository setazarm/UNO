export const isAdmin=(req,res,next)=>{
    if(req.user && req.user.role==="admin"){
        next()
    }else{
        res.json({success:false,message:"unauthorized access"})
    }
}