const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;

const {
    CLIENT_SECRET,
    CLIENT_ID,
    REFRESH_TOKEN,
    EMAIL,
    EMAILLETI
} = process.env;

const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground';


const Mailing = {}

const oauth2Client = new OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    OAUTH_PLAYGROUND
);

Mailing.sendEmail = async (data,res) => {
    try{
    oauth2Client.setCredentials({
        refresh_token: REFRESH_TOKEN
    });
    
    const accessToken =await oauth2Client.getAccessToken();

    const smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: EMAIL,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refresh_token: REFRESH_TOKEN,
            accessToken: accessToken.token
        },
    });
    const { fullName, email, message } = data;

    const mailOptions = {
        from: EMAIL,
        to: EMAIL,
        cc: EMAILLETI,
        subject: 'Chain Digital Lead',
        html: `<h1>Mensaje de Chain Digital</h1><p><strong>Name:</strong>${fullName}</p> <p><strong>Email</strong>:${email}</p> <p><strong>Message:</strong>${message}</p>`
    }
  return  new Promise((resolve,reject)=>{
        smtpTransport.sendMail(mailOptions, (err, info) => {
            if (err) {
                reject(err)
            }else{
                resolve(info)
            }
        });
    })
    
    }catch(error){
        console.log(error);
    }
};




module.exports=Mailing;



