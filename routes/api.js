const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const passport = require("passport");
const nodemailer = require('nodemailer');

const User = require('../models/user');
const Token = require('../models/Token');
const Product = require('../models/Product');
const Review = require('../models/Review');
const Category = require('../models/Category');

const Items = require('../models/Items');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads');
  },
  filename: function(req, file, cb) {
    const fileName = Date.now() + '_' + file.originalname;
    cb(null, fileName);
  }
});

const fileFilter = (req, file, cb) => {
  //accept image
  if(file.mimetype === 'image/jpeg' || 'image/png' || 'image/jpg') {
    cb(null, true);
  }
  //reject image
  else {
    cb(new Error('File type is not supported'), false);
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: fileFilter
});



router.post('/edituser',function(req,res){
  User.findOne({ email: req.body.email}, function(err, user){
    console.log('user',user);

        if(user === null){
            res.send(JSON.stringify({message:"User doesn't Exists" , code : 'no'} ));
        }
        else{
            res.send(JSON.stringify({message:"User found successfully" , code : 'edituser', user : user} ));
        }
  })
});

router.post('/signup',function(req,res,next){
  
  console.log(req.body);

  User.findOne({ email: req.body.email}). then(user =>{
    if(user) {
      res.status(400).send({email:"User with email already exists"} );
    } else {
      
      //encrypt password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) throw err;
          req.body.password = hash;
          
          User.create(req.body).then(function(user){

          res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
          res.header("Access-Control-Allow-Methods" , "POST, GET, OPTIONS");
            

          res.setHeader('Content-Type', 'application/json');
          //res.status(200).send(JSON.stringify({success:"registerd successfully" , code : 'reg', user : user} ));
          
          //new verification token is created for the new user
                var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
                
                //save the verification token
                token.save(function (err) {
                  if (err) {
                    return res.status(500).send({ msg: err.message }); 
                  }

                  //send the email
                  var transporter = nodemailer.createTransport({ service: 'gmail', port: 25, secure: false , auth: { user: 'donotrep2ly921@gmail.com', pass: '0711920012' }, tls: { rejectUnauthorized: false } });                                          
                  var mailOptions = { from: 'donotrep2ly921@gmail.com', to: user.email, subject: 'Account Verification Token', text: 'Hello, \n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/api\/confirmation\/' + token.token + '\/' +  user.email + '\n' }; 
                  transporter.sendMail(mailOptions, function (err) {
                    if (err) { return res.status(500).send({ msg: err.message }); }
                    res.status(200).send('A verification email has been sent to ' + user.email + '.');
                  });
                });
        })
      })

            
    }).catch(next);
  }
});

});


router.post('/login',function(req,res,next){

    console.log(req.body);
  
    User.findOne({ email: req.body.email}, function(err, user) {

        console.log('user',user);
   
        if(user === null)
        {
           //res.send("User doesn't Exists");
           res.status(401).send(JSON.stringify({message:"User does not exist" , code : 'no'} ));
        }

        else if (user.email === req.body.email ){

          bcrypt.compare(req.body.password, user.password).then(isMatch => {
            if(isMatch) {
              //User matched
              //res.status(401).send(JSON.stringify({message:"login successfully" , code : 'login', user : user} ));
              // Create JWT Payload
              const payload = {
                id: user._id,
                name: user.name
              };

              // Sign token
              jwt.sign(
                payload,
                "secret",
                {
                  expiresIn: 31556926 // 1 year in seconds
                },
                (err, token) => {
                  res.json({
                    success: true,
                    token: "Bearer " + token
                  });
                }
              );
            } else{
              res.status(400).send(JSON.stringify({message:"Invalid Password" , code : 'no'} ));
            }
          })
            
        }

    });
  
});


router.post('/signupManager',function(req,res,next){
  
  console.log(req.body);

  User.findOne({ email: req.body.email}). then(manager =>{
    if(manager) {
      res.status(400).send({email:"User with email already exists"} );
    } else {

      const managerData = {
        firstName : req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        role: "Manager",
      }         
      
      User.create(managerData).then(function(manager){

      res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.header("Access-Control-Allow-Methods" , "POST, GET, OPTIONS");
        

      res.setHeader('Content-Type', 'application/json');
      //res.status(200).send(JSON.stringify({success:"registerd successfully" , code : 'reg', user : user} ));
      
      //new verification token is created for the new user
            var token = new Token({ _userId: manager._id, token: crypto.randomBytes(16).toString('hex') });
            
            //save the verification token
            token.save(function (err) {
              if (err) {
                return res.status(500).send({ msg: err.message }); 
              }

              //send the email
              var transporter = nodemailer.createTransport({ service: 'gmail', port: 25, secure: false , auth: { user: 'donotrep2ly921@gmail.com', pass: '0711920012' }, tls: { rejectUnauthorized: false } });                                          
              var mailOptions = { from: 'donotrep2ly921@gmail.com', 
                                  to: manager.email, 
                                  subject: 'Manager Account Verification', 
                                  text: 'Hello, \n\n' + 
                                  'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/api\/confirmation\/' + token.token + '\/' +  manager.email + '\n' }; 
              transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send('A verification email has been sent to ' + user.email + '.');
              });
            });
    }).catch(next);
  }
});

});

//route to confirm email
router.get('/confirmation/:token/:email', function (req, res, next){
  
  Token.findOne({ token: req.params.token }, function (err, token) {
    if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });

    // If we found a token, find a matching user
    User.findOne({ _id: token._userId, email: req.params.email }, function (err, user) {
        if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
        if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });
        //if(user.role == "Manager") return res.redirect

        // Verify and save the user
        user.isVerified = true;
        user.save(function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
            res.status(200).send("The account has been verified. Please log in.");
        });
    });
});
});



router.delete('/users/:id',function(req,res,next){

  
    User.findByIdAndDelete({_id : req.params.id}).then(function(user){

        res.send(user);
    
      });

    //res.send({type : 'DELETE'});
});

router.post("/items", upload.array('productImage', 4) , (req, res) => {   // add an item

  const reqFiles = [];
  const url = req.protocol + '://' + req.get('host') + '/'
  for (var i = 0; i < req.files.length; i++) {
    reqFiles.push(url + req.files[i].path)
  }
    //image upload
    console.log("file",reqFiles);

    const product = {
      name : req.body.title,
      description: req.body.description,
      mainCategory: req.body.category,
      subCategory: req.body.subCategory,
      price: req.body.price,
      discount: req.body.discount,
      quantity: req.body.quantity,
      images: reqFiles,
    }

    console.log(product);
    Product.create(product)
      .then(function(products) {
       
        res.json(products);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
});


router.post("/addRatingWithComment/:id", async (req, res) =>{   // add a rating with comment to given product
    

    try{

      console.log(req.body);
      console.log(req.params.id);

      const item = await Items.findOneAndUpdate({ _id: req.params.id }, {$push: {ratings: req.body}}, { new: true });

      console.log(item);

      
      res.send(JSON.stringify({message:"rating added successfully" , item : item } ));


    }catch(e)
    {
      console.log(e);
    }

 });

//  router.post("/addComment/:id", async (req, res) =>{   // add a comment to given product
 

//   try{

//     console.log(req.body);
//     console.log(req.params);

//     const item = await Items.findOneAndUpdate({ _id: req.params.id }, {$push: {comments: req.body}}, { new: true });

//     console.log(item);

    
//     res.send(JSON.stringify({message:"comment added successfully" , item : item } ));


//   }catch(e)
//   {
//     console.log(e);
//   }

// });




router.get("/getRatingsWithComments/:id", async (req, res ,next) => {  // get ratings for given product id

  try{

    const item = await Items.findOne({_id : req.params.id});

    console.log(item.ratings);

    var sum = 0;

    var noOfRatings = 0;

    var a = 0,b=0,c=0,d=0,e=0;

   

    for (var value of item.ratings) {
     if(value.rate === 1)
     {
       a++;
     }
     if(value.rate === 2)
     {
       b++;
     }
     if(value.rate === 3)
     {
       c++;
     }
     if(value.rate === 4)
     {
       d++;
     }
     if(value.rate === 5)
     {
       e++;
     }

     noOfRatings++;
     
      sum = sum + value.rate;
    }

    console.log('no of ratings',noOfRatings);

    console.log(a,b,c,d,e);

    console.log('avg ',sum /item.ratings.length);
    const avg = sum /item.ratings.length;
    console.log(sum);
   

    res.send(JSON.stringify({message:"item details" ,countRatings : noOfRatings , ratings: item.ratings, avg : avg , item : item , noOfRatings : {1 : a , 2 : b , 3 : c , 4 : d , 5 : e } } ));
  }
catch(e)
{
next(e)
}



});



// router.get("/getComments/:id", async (req, res ,next) => {  // get comments for given product id

//   try{

//     const item = await Items.findOne({_id : req.params.id});

//     console.log(item.comments);

   

//     res.send(JSON.stringify({message:"comment details" , comments: item.comments} ));
//   }
// catch(e)
// {
// next(e)
// }



// });



router.get('/items', async (req, res, next) => {
      try {
        const items = await Items.find();
        console.log(items);

      


        res.send(items);
      } catch (e) {
        
        next(e) 
      }
});

router.get('/category', async (req, res, next) => { //get category collection for adding items on frontend
  try {
    const categories = await Category.find();
    console.log(categories);

    res.send(categories);

  } catch (e) {
    
    next(e) 
  }
});


module.exports = router;