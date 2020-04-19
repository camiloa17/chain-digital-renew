require('dotenv').config();
const express=require('express');
const app=express();
const bodyParser = require('body-parser');
const Mailer =require('./Mail/mail');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/mail',async (req,res)=>{
    try{
       const mail= await Mailer.sendEmail(req.body,res);
       if(mail.accepted){
           res.status(200).json({send:true})
       }else{
           res.status(500).json({send:false,message:'something went wrong'});
       }

    }catch(error){
        console.log(error)
    }
});


app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        if (req.headers.host === 'chain-marketing.herokuapp.com'){
            return res.redirect(302, 'https://www.chaindigital.online');
        }
        if (req.headers['x-forwarded-proto'] !== 'https'){
            return res.redirect(302,'https://www.chaindigital.online');
        }  else
            return next();
    }else{
        return next();
    }
});


app.use(express.static(`${__dirname}/Client/build`));


app.get('/',(req,res)=>{
    res.sendFile(`${__dirname}/Client/build/index.html`)
});

app.get('/:type', (req, res) => {
    res.redirect('/')
})


const port = process.env.PORT||4000;

app.listen(port,()=>{
    console.log(`server started on ${port}`);
});