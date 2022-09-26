const { render } = require('ejs');
const express = require('express');
const mongoose=require('mongoose');
const passport = require("passport");
const multer=require('multer');
const app = express();
const User=require('./models/user');
const path = require('path');
const fs=require('fs');

const bodyParser = require("body-parser");
var imageModel = require('./models/image');
const File=require('./models/file');

require('dotenv').config();
app.use(express.json());
const cookieSession = require('cookie-session');
const { findById } = require('./models/user');
require('../passport-setup');
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.static('assets'));

app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
  }))



const connect = async () => {
	try {
        console.log("connect");
		await mongoose.connect(process.env.MONGO_URL);
		console.log("Connected to mongoDB.");
	} catch (error) {
        console.log("error");
		//throw error;
	}
};
connect();

//const filePath = path.join('/upload/users');

// app.use('/',(req,res)=>{
//     console.log(req);
//     try{
//         res.render('share');
//     }
//     catch(err){
//         console.log(err);
//     }
    
// })

// let fileStorage = multer.diskStorage({
//     destination : function(req,file,cb){
//         cb(null,path.join(__dirname,'..',filePath));
//     },filename: function(req,file,cb){
//         let uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         cb(null, file.fieldname + '-' + uniqueSuffix)
//     } 
// })

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'upload/users')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })


const uploadfile = multer({storage:storage});
app.post('/uploadfile/:id',uploadfile.single('myImage'),function async (req,res){
    //console.log(req.file.originalname);
    var img = fs.readFileSync(req.file.path);
    var encode_img = img.toString('base64');
    var final_img = {
        contentType:req.file.mimetype,
        image:new Buffer.from(encode_img,'base64')
    };
    async()=>{
        const f=new file({path:req.file.path,name:req.file.originalname});
        await f.save();
        const b=f.id;
        const user=await findById({_id});
        user.MyFiles.push(b);
        await user.save();
    }
    imageModel.create(final_img,function(err,result){
        if(err){
            console.log(err);
        }else{
            //console.log(result.img.Buffer);
            //console.log(encode_img);
            //res.contentType(final_img.contentType);
            //res.send(final_img.image);
            res.render('end');
        }
    })
    
    
    
});



app.use('/share',  function (req,res){
    res.render();
})

app.post('/sharefile:id', function (req,res){
    const f=file.findById(req.body.params);
    if(req.body.view=="YES"){
        f.views.push(req.body.mail);
        f.save();
    }
    async ()=>{
        const u= await User.find({username:req.body.mail});
        if(!u){
            console.log("User not found");
        }
        else{
            await u.shared.push(f.id);
            u.save();
        }
    }
    

})

app.use('/user:id', function (req,res){
    async ()=>{
        const a=await User.findById(req.user.id);
        const b=a.populate('MyFiles');
        res.render('user',{files:sb});
    }
    
})
app.use('/sharedfile',function(req,res){
    
    res.render();
})





mongoose.connection.on("disconnected", () => {
	console.log("mongoDB disconnected!");
});


const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}
 
// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());
 
// Example protected and unprotected routes
app.get('/', (req, res) => res.render('pages/index'))
app.get('/failed', (req, res) => res.send('You Failed to log in!'))

// In this route you can see that if the user is logged in u can acess his info in: req.user
app.get('/good', isLoggedIn, async (req, res) =>{
    console.log(req.user.email);
    User.find({ email: req.user.email })
			.then(async (data) => {
                if (data.length === 0) {
                    const us = new User({
                        email: req.user.email,
                        name: req.user.displayName,
                    });
                    await us.save();
                    console.log("hello");
                    console.log(us.id);
                    res.render("main", {
                        name: req.user.displayName,
                        pic: req.user.photos[0].value,
                        email: req.user.email,
                        object: us.id,
                        file:us.File,
                    });
				} else {
                    console.log(data[0].id);
                    res.render("main", {name: req.user.displayName, 
                        pic: req.user.photos[0].value, 
                        email: req.user.emails[0].value, 
                        object: data[0].id,
                        file:data[0].File,
                    })
				}
			})
			.catch();
    
})
 
// Auth Routes
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
 
app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  }
);

// app.use('/main',(req,res)=>{
//     res.render('main');
// });

app.get("/uploader/:id",(req,res)=>{
    const ObjectId=req.params.id;
    res.render('uploader',{ObjectId});
})

app.get('/show',(req,res)=>{
    var img = fs.readFileSync(req.path);
    var encode_img = img.toString('base64');
    var final_img = {
        contentType:req.file.mimetype,
        image:new Buffer.from(encode_img,'base64')
    };
    res.contentType(final_img.contentType);
    res.send(final_img.image);
})
 
app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})
//listening on port

app.listen(5001, () => {
    console.log('Listening on port');
})
