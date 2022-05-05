const express = require("express");
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require("path");
const  app = express();
const MongoDBSession = require("connect-mongodb-session")(session);
const  mongoose = require("mongoose");
const db = mongoose.connection;
const UserModel = require("./js/models/User");
const nodemailer = require('nodemailer');
const serial = require("generate-serial-key");
const mongoURI = "mongodb+srv://cascio97:dogo1997@tgz.4vj9b.mongodb.net/TGZ?retryWrites=true&w=majority";
require('dotenv').config();
const axios = require('axios');
const bodyParser = require("body-parser");
const mailWebsite = 'mail.thegamingzone2022@gmail.com';
const  clientID = "nyudlcj70c24khb7hzf10wjb3bl3td", clientSecret="Bearer xccadxxiwsxday1l8a57pal6of5az4";
app.use("/images", express.static(__dirname + "/images"));
app.use("/css", express.static(__dirname + "/css"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/html", express.static(__dirname + "/html"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

const mailHeader = '<head>\n' +
    '    <title></title>\n' +
    '    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n' +
    '    <meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\n' +
    '    <style type="text/css">\n' +
    '        @media screen {\n' +
    '            @font-face {\n' +
    '                font-family: \'Lato\';\n' +
    '                font-style: normal;\n' +
    '                font-weight: 400;\n' +
    '                src: local(\'Lato Regular\'), local(\'Lato-Regular\'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format(\'woff\');\n' +
    '            }\n' +
    '\n' +
    '            @font-face {\n' +
    '                font-family: \'Lato\';\n' +
    '                font-style: normal;\n' +
    '                font-weight: 700;\n' +
    '                src: local(\'Lato Bold\'), local(\'Lato-Bold\'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format(\'woff\');\n' +
    '            }\n' +
    '\n' +
    '            @font-face {\n' +
    '                font-family: \'Lato\';\n' +
    '                font-style: italic;\n' +
    '                font-weight: 400;\n' +
    '                src: local(\'Lato Italic\'), local(\'Lato-Italic\'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format(\'woff\');\n' +
    '            }\n' +
    '\n' +
    '            @font-face {\n' +
    '                font-family: \'Lato\';\n' +
    '                font-style: italic;\n' +
    '                font-weight: 700;\n' +
    '                src: local(\'Lato Bold Italic\'), local(\'Lato-BoldItalic\'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format(\'woff\');\n' +
    '            }\n' +
    '        }\n' +
    '\n' +
    '        /* CLIENT-SPECIFIC STYLES */\n' +
    '        body,\n' +
    '        table,\n' +
    '        td,\n' +
    '        a {\n' +
    '            -webkit-text-size-adjust: 100%;\n' +
    '            -ms-text-size-adjust: 100%;\n' +
    '        }\n' +
    '\n' +
    '        table,\n' +
    '        td {\n' +
    '            mso-table-lspace: 0pt;\n' +
    '            mso-table-rspace: 0pt;\n' +
    '        }\n' +
    '\n' +
    '        img {\n' +
    '            -ms-interpolation-mode: bicubic;\n' +
    '        }\n' +
    '\n' +
    '        /* RESET STYLES */\n' +
    '        img {\n' +
    '            border: 0;\n' +
    '            height: auto;\n' +
    '            line-height: 100%;\n' +
    '            outline: none;\n' +
    '            text-decoration: none;\n' +
    '        }\n' +
    '\n' +
    '        table {\n' +
    '            border-collapse: collapse !important;\n' +
    '        }\n' +
    '\n' +
    '        body {\n' +
    '            height: 100% !important;\n' +
    '            margin: 0 !important;\n' +
    '            padding: 0 !important;\n' +
    '            width: 100% !important;\n' +
    '        }\n' +
    '\n' +
    '        /* iOS BLUE LINKS */\n' +
    '        a[x-apple-data-detectors] {\n' +
    '            color: inherit !important;\n' +
    '            text-decoration: none !important;\n' +
    '            font-size: inherit !important;\n' +
    '            font-family: inherit !important;\n' +
    '            font-weight: inherit !important;\n' +
    '            line-height: inherit !important;\n' +
    '        }\n' +
    '\n' +
    '        /* MOBILE STYLES */\n' +
    '        @media screen and (max-width:600px) {\n' +
    '            h1 {\n' +
    '                font-size: 32px !important;\n' +
    '                line-height: 32px !important;\n' +
    '            }\n' +
    '        }\n' +
    '\n' +
    '        /* ANDROID CENTER FIX */\n' +
    '        div[style*="margin: 16px 0;"] {\n' +
    '            margin: 0 !important;\n' +
    '        }\n' +
    '    </style>\n' +
    '</head>\n';

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: mailWebsite,
        pass: 'thegamingzone'
    }
});


mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then((res) => {
    console.log("MongoDB Connected");
}).catch(err => console.log(err));

const store = new MongoDBSession({
    uri:mongoURI,
    collection:"sessions"
});

app.use(express.urlencoded({extended: true}));

app.use(session({
    secret:"vp598jvhgf@#e%rTYk0jhG##%$^H&Oj",
    resave: false,
    saveUninitialized: false,
    store: store,
}));

const isAuth = (req, res, next) =>{
    if(req.session.isAuth){
        next()
    }else{
        res.redirect("/login");
    }
};

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/html/index.html"));
});

app.post("/register", async (req, res) =>{
    const {email, name, surname, username, password} = req.body;
    const hashedPwd = await bcrypt.hash(password, 12);
    const verificationString = await bcrypt.hash(email, 12);
    let emailExist = await db.collection("users").findOne({email});
    let usernameExist = await db.collection("users").findOne({username});

    if(emailExist || usernameExist){
        return res.redirect("/");
    }

    user = new UserModel({
        email,
        name,
        surname,
        username,
        password: hashedPwd,
        registration_date: Date.now(),
        verified: false,
        verificationString: verificationString,
        purchase_history: [],
        cart: [],
        admin:false,
    });
    await db.collection("users").insertOne(user);
        let htmlMail='<!DOCTYPE html>\n' +
            '<html>\n' +
            '\n' +
           mailHeader +
            '\n' +
            '<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">\n' +
            '    <!-- HIDDEN PREHEADER TEXT -->\n' +
            '    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: \'Lato\', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We\'re thrilled to have you here! Get ready to dive into your new account. </div>\n' +
            '    <table border="0" cellpadding="0" cellspacing="0" width="100%">\n' +
            '        <!-- LOGO -->\n' +
            '        <tr>\n' +
            '            <td bgcolor="#FFA73B" align="center">\n' +
            '                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\n' +
            '                    <tr>\n' +
            '                        <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>\n' +
            '                    </tr>\n' +
            '                </table>\n' +
            '            </td>\n' +
            '        </tr>\n' +
            '        <tr>\n' +
            '            <td bgcolor="#FFA73B" align="center" style="padding: 0px 10px 0px 10px;">\n' +
            '                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\n' +
            '                    <tr>\n' +
            '                        <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">\n' +
            '                            <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome!</h1> <img src="http://entosource.altervista.org/Pages/logo.PNG" width="125" height="120" style="display: block; border: 0px;" />\n' +
            '                        </td>\n' +
            '                    </tr>\n' +
            '                </table>\n' +
            '            </td>\n' +
            '        </tr>\n' +
            '        <tr>\n' +
            '            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">\n' +
            '                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\n' +
            '                    <tr>\n' +
            '                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">\n' +
            '                            <p style="margin: 0;">We\'re excited to have you get started. First, you need to confirm your account. Just press the button below.</p>\n' +
            '                        </td>\n' +
            '                    </tr>\n' +
            '                    <tr>\n' +
            '                        <td bgcolor="#ffffff" align="left">\n' +
            '                            <table width="100%" border="0" cellspacing="0" cellpadding="0">\n' +
            '                                <tr>\n' +
            '                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">\n' +
            '                                        <table border="0" cellspacing="0" cellpadding="0">\n' +
            '                                            <tr>\n' +
            '                                                <td align="center" style="border-radius: 3px;" bgcolor="#FFA73B"><a href="https://scascian2.alwaysdata.net/#!/verify?ver='+ verificationString+'" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">Confirm Account</a></td>\n' +
            '                                            </tr>\n' +
            '                                        </table>\n' +
            '                                    </td>\n' +
            '                                </tr>\n' +
            '                            </table>\n' +
            '                        </td>\n' +
            '                    </tr> <!-- COPY -->\n' +
            '                    <tr>\n' +
            '                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">\n' +
            '                            <p style="margin: 0;">If that doesn\'t work, copy and paste the following link in your browser:</p>\n' +
            '                        </td>\n' +
            '                    </tr> <!-- COPY -->\n' +
            '                    <tr>\n' +
            '                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 20px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">\n' +
            '                            <p style="margin: 0;"><a href="https://scascian2.alwaysdata.net/#!/verify?ver='+ verificationString+'" target="_blank" style="color: #FFA73B;">https://scascian2.alwaysdata.net/#!/verify?ver='+ verificationString +'</a></p>\n' +
            '                        </td>\n' +
            '                    </tr>\n' +
            '                    <tr>\n' +
            '                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">\n' +
            '                            <p style="margin: 0;">If you have any questions, just reply to this email—we\'re always happy to help out.</p>\n' +
            '                        </td>\n' +
            '                    </tr>\n' +
            '                    <tr>\n' +
            '                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">\n' +
            '                            <p style="margin: 0;">Cheers,<br>TGZ Team</p>\n' +
            '                        </td>\n' +
            '                    </tr>\n' +
            '                </table>\n' +
            '</body>\n' +
            '\n' +
            '</html>';
    var mailOptions = {
        from: mailWebsite,
        to: email,
        subject: 'Please verify your TGZ account',
        html: htmlMail
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error)
            console.log(error);
        else
            console.log("Verification mail sent to: " + email);
    });
    res.send(true);
});

app.post("/login", async(req, res) =>{
    const {username, password} = req.body;
    let user = await db.collection("users").findOne({username});
    if(!user){
        return res.send(false); //user does not exist
    }
    if(user) {
        if(user.verified == false)
            return res.send("failedVerification");

        let pwdMatch = await bcrypt.compare(password, user.password);
        if (!pwdMatch) {
            return res.send(false); //wrong password
        }
        req.session.username = username;
        req.session.isAuth = true;
        res.send(true); //logged in
    }
});

app.post("/isLoggedIn", async (req, res) =>{

    if(req.session.isAuth) {
        let user = await db.collection("sessions").findOne({"_id": req.session.id})
        let userInfo = await db.collection("users").findOne({"username":user.session.username});

        if(!userInfo.admin)
        var div = '<div class="dropdown">' +
            '<button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown">' +
            '<i class="bi bi-person-circle" style="color:white"></i>  ' +
            user.session.username +
            '</button>' +
            '<ul class="dropdown-menu">' +
            '<li><a href="" class="dropdown-item" onclick="manageAccount()" ng-click="getInfoAccount($event)">My Account</a> </li>' +
            '<li><a class="dropdown-item" onclick="cart()" ng-click="getCart($event)">Cart</a></li>' +
            '<li><a class="dropdown-item" href="/logout">Logout</a> </li>' +
            '</ul>' +
            '</div>';
        else
            var div = '<div class="dropdown">' +
                '<button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown">' +
                '<i class="bi bi-person-circle" style="color:white"></i>  ' +
                user.session.username +
                '</button>' +
                '<ul class="dropdown-menu">' +
                '<li><a href="" class="dropdown-item" onclick="manageBalance()">Manage Balance</a> </li>' +
                '<li><a href="" class="dropdown-item" onclick="manageGames()"  ng-click="getGamesList()">Manage Games</a> </li>' +
                '<li><a class="dropdown-item" href="/logout">Logout</a> </li>' +
                '</ul>' +
                '</div>';

        return res.send(div);
    }
    return res.send(false);
});

app.post("/getInfoAccount", async (req, res) =>{
    if(req.session.isAuth) {
        let userSession = await db.collection("sessions").findOne({"_id": req.session.id});
        let userInfo = await db.collection("users").findOne({"username":userSession.session.username});

        res.send(userInfo);
    }
});

app.get("/logout", (req, res)=>{
    req.session.destroy((err)=>{
        if(err) throw err;
        console.log("LOGGED OUT!");
        res.redirect("/");
    });
});

app.get("/userExist", async (req, res)=>{
    const username = req.query.username;
    let user = await db.collection("users").findOne({username});
    if(user)
        res.send(true);
    res.send(false);
});

app.get("/emailExist", async (req, res)=>{
    const email = req.query.email;
    let exist = await db.collection("users").findOne({email});
    if(exist)
        res.send(true);
    res.send(false);
});

app.post("/passwordMatch", async (req, res)=>{
    const {username, password} = req.body;
    let user = await db.collection("users").findOne({username});
    let pwdMatch = await bcrypt.compare(password, user.password);
    if (!pwdMatch)
        return res.send(false);
    res.send(true);
});

app.post("/changePassword", async (req, res)=>{
    const {username, password} = req.body;
    const hashedPwd = await bcrypt.hash(password, 12);
    await db.collection("users").updateOne({username:username}, {$set: {password:hashedPwd}});
    res.send(true);
});

app.post("/editInfo", async (req, res)=>{
    const newName = req.body.name, newSurname = req.body.surname;
    const newUsername = req.body.username, currentUsername = req.body.currentUsername;
    await db.collection("users").updateOne({username:currentUsername}, {$set: {name:newName, surname:newSurname, username:newUsername}});
    await db.collection("sessions").updateMany({"session.username": currentUsername}, {$set: {"session.username":newUsername}});
    res.send(true);
});

app.post("/deleteAccount", async (req, res)=>{
    let userSession = await db.collection("sessions").findOne({"_id": req.session.id});
    let userInfo = await db.collection("users").findOne({"username":userSession.session.username});
    await db.collection("users").remove({username:userInfo.username});
    await db.collection("sessions").remove({"session.username":userInfo.username});
    await db.collection("reset").remove({username: userInfo.username});
    res.send(true);
});

//verifies a user email address
app.post("/verify", async (req, res)=> {
    let verificationString = req.body.ver;
    let exist = await db.collection("users").findOne({verificationString:verificationString});
    if(exist){
        if(exist.verified == true)
            return res.send(false);
        await db.collection("users").updateOne({verificationString:verificationString}, {$set: {verified:true}});
        return res.send(true);
    }
        return res.send(false);
});

app.post("/addToCart", async (req, res) =>{
    if(req.session.isAuth) {
        let userSession = await db.collection("sessions").findOne({"_id": req.session.id});
        let user = await db.collection("users").findOne({"username":userSession.session.username});
        let cart = user.cart;
        let item = req.body.item;
        let price = req.body.price;
        cart.push({item:item, price:price});
        await db.collection("users").updateOne({"username":user.username}, {$set: {cart:cart}});
        return res.send(true);
    }
    return res.send(false);
});

app.post("/removeFromCart", async (req, res)=>{
    let userSession = await db.collection("sessions").findOne({"_id": req.session.id});
    let user = await db.collection("users").findOne({"username":userSession.session.username});
    const item = req.body.item;
    await db.collection("users").updateOne({username:user.username}, {$pull: {'cart': {item:item}}});
    res.send(true);
});

app.post("/isItemInCart", async (req, res)=>{
    let userSession = await db.collection("sessions").findOne({"_id": req.session.id});
    let user = await db.collection("users").findOne({"username":userSession.session.username});
    let cart = user.cart;
    let item = req.body.item;

    for(let i = 0; i < cart.length; i++)
        if(cart[i].item == item)
            return res.send(true);

    return res.send(false);
});

//sends the mail for resetting the password
app.post("/resetPasswordEmail", async (req, res)=>{
    let user = await db.collection("users").findOne({"username":req.body.username});
    if(!user)
        return res.send(false);
    let email = user.email;
    const resetString = await bcrypt.hash(email, 12);

    await db.collection("reset").insertOne({username: user.username, resetString:resetString});

    let htmlMail='<!DOCTYPE html>\n' +
        '<html>\n' +
        '\n' +
      mailHeader +
        '\n' +
        '<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">\n' +
        '    <!-- HIDDEN PREHEADER TEXT -->\n' +
        '    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: \'Lato\', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> Reset password </div>\n' +
        '    <table border="0" cellpadding="0" cellspacing="0" width="100%">\n' +
        '        <!-- LOGO -->\n' +
        '        <tr>\n' +
        '            <td bgcolor="#FFA73B" align="center">\n' +
        '                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\n' +
        '                    <tr>\n' +
        '                        <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>\n' +
        '                    </tr>\n' +
        '                </table>\n' +
        '            </td>\n' +
        '        </tr>\n' +
        '        <tr>\n' +
        '            <td bgcolor="#FFA73B" align="center" style="padding: 0px 10px 0px 10px;">\n' +
        '                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\n' +
        '                    <tr>\n' +
        '                        <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">\n' +
        '                            <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Password Reset</h1> <img src="http://entosource.altervista.org/Pages/logo.PNG" width="125" height="120" style="display: block; border: 0px;" />\n' +
        '                        </td>\n' +
        '                    </tr>\n' +
        '                </table>\n' +
        '            </td>\n' +
        '        </tr>\n' +
        '        <tr>\n' +
        '            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">\n' +
        '                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\n' +
        '                    <tr>\n' +
        '                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">\n' +
        '                            <p style="margin: 0;">We \'re sending you this email because you requested a password reset. Click on this link to create a new password:</p>\n' +
        '                        </td>\n' +
        '                    </tr>\n' +
        '                    <tr>\n' +
        '                        <td bgcolor="#ffffff" align="left">\n' +
        '                            <table width="100%" border="0" cellspacing="0" cellpadding="0">\n' +
        '                                <tr>\n' +
        '                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">\n' +
        '                                        <table border="0" cellspacing="0" cellpadding="0">\n' +
        '                                            <tr>\n' +
        '                                                <td align="center" style="border-radius: 3px;" bgcolor="#FFA73B"><a href="https://scascian2.alwaysdata.net/#!/reset?str='+ resetString+'" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">Reset your password</a></td>\n' +
        '                                            </tr>\n' +
        '                                        </table>\n' +
        '                                    </td>\n' +
        '                                </tr>\n' +
        '                            </table>\n' +
        '                        </td>\n' +
        '                    </tr> <!-- COPY -->\n' +
        '                    <tr>\n' +
        '                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">\n' +
        '                            <p style="margin: 0;">If you did not request a password reset, you can safely ignore this email. Only a person with access to your email can reset your account password.</p>\n' +
        '                        </td>\n' +
        '                    </tr>\n' +
        '                    <tr>\n' +
        '                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">\n' +
        '                            <p style="margin: 0;">Cheers,<br>TGZ Team</p>\n' +
        '                        </td>\n' +
        '                    </tr>\n' +
        '                </table>\n' +
        '</body>\n' +
        '\n' +
        '</html>';
    var mailOptions = {
        from: mailWebsite,
        to: email,
        subject: 'Reset password',
        html: htmlMail
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error)
            console.log(error);
        else
            console.log("Reset password mail sent to: " + email);
    });
    res.send(true);

});

//checks in the MongoDB if a user requested their password to be reset
app.get("/isResetRequested", async (req, res) =>{
        let userResetExist = await db.collection("reset").findOne({"resetString": req.query.str});
        if(userResetExist)
            return res.send(true);

        return res.send(false);
});

//resets a user password
app.post("/resetPassword", async (req, res) =>{
    let resetRequest = await db.collection("reset").findOne({"resetString": req.body.resetString});
    let username = resetRequest.username;
    let newPwd = await bcrypt.hash(req.body.pwd, 12);
    await db.collection("users").updateOne({"username":username}, {$set: {password:newPwd}});
    await db.collection("reset").remove({"resetString":req.body.resetString});
    return res.send(true);
});

//it sends the mail containing the game's keys  to the user and updates both cart and purchase history
app.post("/purchase", async (req, res) =>{
    let userSession = await db.collection("sessions").findOne({"_id": req.session.id});
    let user = await db.collection("users").findOne({"username":userSession.session.username});
    let cart = user.cart;
    let nItems = cart.length;
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;
    let purchaseHistory = user.purchase_history;
    for(let i = 0; i < cart.length; i++)
        purchaseHistory.push({item:cart[i].item, date:today.toString(),price:cart[i].price + " ETH"});
    let keysTable = "";

    keysTable = keysTable.concat(' <tr>');
    keysTable = keysTable.concat('<td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">Game</td>');
    keysTable = keysTable.concat('<td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">Key</td>');
    keysTable = keysTable.concat('</tr>');

    for(let i = 0; i < nItems; i++){
        keysTable = keysTable.concat("<tr>");
        keysTable = keysTable.concat('<td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">'+user.cart[i].item+'</td>');
        keysTable = keysTable.concat('<td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">'+serial.generate()+'</td>');
        keysTable = keysTable.concat("</tr>");
    }
    let htmlMail='<!DOCTYPE html>\n' +
        '<html>\n' +
        '\n' +
      mailHeader +
        '\n' +
        '<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">\n' +
        '    <!-- HIDDEN PREHEADER TEXT -->\n' +
        '    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: \'Lato\', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> Thank you for your purchase! </div>\n' +
        '    <table border="0" cellpadding="0" cellspacing="0" width="100%">\n' +
        '        <!-- LOGO -->\n' +
        '        <tr>\n' +
        '            <td bgcolor="#FFA73B" align="center">\n' +
        '                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\n' +
        '                    <tr>\n' +
        '                        <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>\n' +
        '                    </tr>\n' +
        '                </table>\n' +
        '            </td>\n' +
        '        </tr>\n' +
        '        <tr>\n' +
        '            <td bgcolor="#FFA73B" align="center" style="padding: 0px 10px 0px 10px;">\n' +
        '                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\n' +
        '                    <tr>\n' +
        '                        <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">\n' +
        '                            <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Thank you for your purchase!</h1> <img src="http://entosource.altervista.org/Pages/logo.PNG" width="125" height="120" style="display: block; border: 0px;" />\n' +
        '                        </td>\n' +
        '                    </tr>\n' +
        '                </table>\n' +
        '            </td>\n' +
        '        </tr>\n' +
        '        <tr>\n' +
        '            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">\n' +
        '                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\n' +
        '                    <tr>\n' +
        '                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">\n' +
        '                            <p style="margin: 0;"> You can redeem the keys on Steam.</p>\n' +
        '                        </td>\n' +
        '                    </tr>\n' +
        '                    <tr>\n' +
        '                        <td bgcolor="#ffffff" align="left">\n' +
        '                            <table width="100%" border="0" cellspacing="0" cellpadding="0">\n' +
        '                                <tr>\n' +
        '                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">\n' +
        '                                        <table border="0" cellspacing="0" cellpadding="0">\n' +
    keysTable +
        '                                        </table>\n' +
        '                                    </td>\n' +
        '                                </tr>\n' +
        '                            </table>\n' +
        '                        </td>\n' +
        '                    </tr> <!-- COPY -->\n' +
        '                    <tr>\n' +
        '                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">\n' +
        '                            <p style="margin: 0;">Cheers,<br>TGZ Team</p>\n' +
        '                        </td>\n' +
        '                    </tr>\n' +
        '                </table>\n' +
        '</body>\n' +
        '\n' +
        '</html>';
    var mailOptions = {
        from: mailWebsite,
        to: user.email,
        subject: 'Purchase',
        html: htmlMail
    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error)
            console.log(error);
        else
            console.log("Purchase mail sent to: " + user.email);
    });

    cart = [];
    await db.collection("users").updateOne({"username":user.username}, {$set: {purchase_history:purchaseHistory}});
    await db.collection("users").updateOne({"username":user.username}, {$set: {cart:cart}});
    return res.send(true);
});

app.post("/sendSupport", async (req, res) =>{
        let userInfo = await db.collection("users").findOne({"email":req.body.email});
    let username;
    if(userInfo)
            username = userInfo.username;
        else
            username = "NULL";
        let problem = req.body.category;
        let descProblem = req.body.text;
        let strEmail = "<h1>Request Support</h1>" +
            "<h3>Email: "+req.body.email+"</h3>" +
            "<h3>Username: "+username+"</h3>" +
            "<h5>Problem: "+problem+"</h5>" +
            "<p>Description: "+descProblem+"</p>";

    var mailOptions = {
        from: mailWebsite,
        to: mailWebsite,
        subject: 'Support: '+ req.body.email,
        html: strEmail
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error)
            console.log(error);
        else
            console.log("Sending support email");
    });
        res.send(true);
});

//adds a game in the MongoDB
app.post("/addGame", async (req, res) =>{
    await db.collection("games").insertOne({id: req.body.id, name:req.body.name, cover:req.body.cover, release_date:req.body.releaseDate,
        price:req.body.price, summary:req.body.summary, aggregated_rating:req.body.rating, aggregated_rating_count:req.body.ratingCount,
        youtube:req.body.youtube, screenshot1:req.body.screenshot1, screenshot2:req.body.screenshot2, screenshot3:req.body.screenshot3});
    res.send(true);
});

//returns all games in the MongoDB
app.get("/getGamesList", async (req, res) =>{
    const data = await db.collection("games").find().toArray();
    res.send(data);
});

//given the ID, it deletes a game from the MongoDB
app.post("/deleteGame", async (req, res)=>{
    const game = await db.collection("games").findOne({"id":req.body.id});
    await db.collection("games").remove({"id":req.body.id}, {justOne:true});
    await db.collection("users").update({}, {$pull: {'cart': {item:game.name}}});
    res.send(true);
});

//returns first or third person shooter games
app.get('/Shooters', function(req, res){
    console.log("Loading FPS games...");
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    axios({
        url: "https://api.igdb.com/v4/games",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID':clientID,
            'Authorization':clientSecret
        },
        data: 'fields name,cover.url; where genres.name="Shooter"  & player_perspectives.name="'+req.query.name+'" ' +
            '& themes.name="Action" & release_dates.date != null & screenshots != null ' +
            '& summary != null & version_parent = null & aggregated_rating_count > 5 & aggregated_rating > 40' +
            '& platforms.name="PC (Microsoft Windows)"; limit 90; sort aggregated_rating desc;'
    })
        .then(response => {
            res.send(response.data);
        })
        .catch(err => {
            console.error(err);
        });
});

//returns MMORPG games for the carousel on the main page
app.get('/start_mmorpg', function(req, res){
    console.log("Loading MMORPG games...");
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    axios({
        url: "https://api.igdb.com/v4/games",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID':clientID,
            'Authorization':clientSecret
        },
        data: 'fields name, cover.url; where genres.name="Role-playing (RPG)" & ' +
            'game_modes.name="Massively Multiplayer Online (MMO)" & platforms.name="PC (Microsoft Windows)" ' +
            '& first_release_date > 1000129354 & aggregated_rating > 50 & aggregated_rating_count != 0 & ' +
            'rating_count > 50 &  screenshots != null  & summary != null; limit 18; sort first_release_date desc;'
    })
        .then(response => {
            res.send(response.data);
        })
        .catch(err => {
            console.error(err);
        });
});

//look for a certain game on the IGDB and returns the information
app.post('/selectGame', function(req, res){
    console.log("A game has been selected...");
    console.log("Game requested: " + req.query.id);
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    axios({
        url: "https://api.igdb.com/v4/games",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID':clientID,
            'Authorization':clientSecret
        },
        data: 'fields name, cover.url, screenshots.url, release_dates.date, storyline, summary, aggregated_rating, ' +
            'aggregated_rating_count, websites.category, websites.*, game_modes.name, ' +
            'involved_companies.company.name, age_ratings.rating_cover_url, ' +
            'videos.video_id; where id=' + req.query.id + ';'
    })
        .then(response => {
            res.send(response.data);
        })
        .catch(err => {
            console.error(err);
        });
});

//look for a certain game on the MongoDB and returns the information
app.post('/selectGameMongo', async (req, res)=>{
    const game = await db.collection("games").findOne({"id":req.query.id});
    res.send(JSON.parse("["+JSON.stringify(game) + "]"));
});

//given the game's name, it returns all games from the IGDB and MongoDB related to that name
app.get('/searchGame', async (req, res)=>{
    const game = await db.collection("games").find({"name": {$regex: req.query.name, $options:'i'}}).toArray();
    console.log("A game has been searched");
    console.log("Game searched: " + req.query.name);
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    axios({
        url: "https://api.igdb.com/v4/games",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID':clientID,
            'Authorization':clientSecret
        },
        data: 'fields name, cover.url; where category != (1, 5, 12) ' +
            '& platforms.name="PC (Microsoft Windows)" & cover.url != null &  screenshots != null  & ' +
            'release_dates.date != null & aggregated_rating_count != null &  summary != null & version_parent = null ' +
            '& aggregated_rating_count !=  null & aggregated_rating > 40; search "' + req.query.name + '"; limit 90;'
    })
        .then(response => {
            if(response.data.length>0) {
                if (game.length > 0) {
                    let length = JSON.stringify(response.data).length;
                    let arrString = JSON.stringify(response.data);
                    const queryResult = arrString.substring(0, length - 1) + ", " + JSON.stringify(game[0]) + arrString.substring(length - 1);
                    return res.send(JSON.parse(queryResult));
                }
                return res.send(response.data);
            }
            return res.send(game)
        })
        .catch(err => {
            console.error(err);
        });
});

//returns the games from the public API that belong to a certain category
app.get('/browseCategory', function(req, res){
    console.log("Browsing a category...");
    console.log("Category requested: " + req.query.name);
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    axios({
        url: "https://api.igdb.com/v4/games",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID':clientID,
            'Authorization':clientSecret
        },
        data: 'fields name, cover.url; where category != (1, 5, 12) & ' +
            'platforms.name="PC (Microsoft Windows)" & cover.url != null & release_dates.date != null & ' +
            'aggregated_rating_count != null &  aggregated_rating > 40 & summary != null &  screenshots != null  & ' +
            'genres.name = "' + req.query.name + '"; limit 90;'
    })
        .then(response => {
            res.send(response.data);
        })
        .catch(err => {
            console.error(err);
        });
});

//returns the games from the public API that belong to a certain theme
app.get('/browseTheme', function(req, res){
    console.log("Browsing a theme...");
    console.log("Category requested: " + req.query.name);
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    axios({
        url: "https://api.igdb.com/v4/games",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID':clientID,
            'Authorization':clientSecret
        },
        data: 'fields name, cover.url; where category != (1, 5, 12) & ' +
            'platforms.name="PC (Microsoft Windows)" & cover.url != null & release_dates.date != null & ' +
            'aggregated_rating_count != null &  aggregated_rating > 40 & summary != null &  screenshots != null  &' +
            'themes.name = "' + req.query.name + '"; limit 90;'
    })
        .then(response => {
            res.send(response.data);
        })
        .catch(err => {
            console.error(err);
        });
});

app.listen(8100, process.env.ALWAYSDATA_HTTPD_IP, console.log("Server running on port 8100"));