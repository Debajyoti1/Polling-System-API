//----------Just a home page with json------------//
module.exports.homePage=(req,res)=>{
    return res.status(200).json({
        message: "Welcome To Open Polling System"
    })
}