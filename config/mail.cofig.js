const nodemailer=require('nodemailer');

const transporter=nodemailer.createTransport({
    secure:true,
    port:465,
    host:'mail.google.com',
    auth:
    {
        user:'xyz@mail.com',
        pass:'@admin2020'
    }     
});

const transporter1=nodemailer.createTransport({
    secure:true,
    port:465,
    host:'mail.google.com',
    auth:{
        user:'xyz@mail.com',
        pass:'@admin2020'
    }     
});

const sendEmailViaAdmin=async (mailOptions)=>{
    console.log(mailOptions);
    await transporter1.sendMail(mailOptions);
}

const sendEmail=(mailOptions,done)=>{
    transporter.sendMail(mailOptions,(err,info)=>{
        done(err,info);
    });
}

module.exports.transporter=transporter;
module.exports.sendEmail=sendEmail;
module.exports.sendEmailViaAdmin=sendEmailViaAdmin;
