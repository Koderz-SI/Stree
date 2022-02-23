const nodemailer = require('nodemailer');

var transport = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : "iritkushwaha2607@gmail.com",
        pass : "EshuIRIT10*",
    }
}); // transport mail

module.exports.sendVerifyEmail = async(email,token) =>{
    var url = "https://localhost:8000/user/verifyEmail?token=" + token;

    console.log(url);
    
    await transport.sendMail({
        from : "Email",
        to : email,
        subject : "Verify your account",
        text : `Click this link to verify : ${url}`,
        html : `<h3>
        Click the link to verify : ${url}
        </h3>`,
    });
}