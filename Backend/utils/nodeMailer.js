const nodemailer = require("nodemailer");
const mailSender = async (email,title,body)=>{
    try{
        let transpoter = nodemailer.createTransport({
            host:"smtp.gmail.com",
            auth:{
                user:"personalabhishek654@gmail.com",
                pass:"khyz lrwb fhsu ufoz"
            }
        })
        let info= await transpoter.sendMail({
            from :"Abhishek P",
            to:email,
            subject:"working or what",
            html:body,
        });
        console.log("email info",info);
        return info;
        
    }catch(err){
        console.log(err);
        
    }
}
module.exports = {mailSender};