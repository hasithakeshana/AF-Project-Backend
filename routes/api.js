const express = require('express');

const router = express.Router();

const User = require('../models/user');
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

router.get('/users',function(req,res){
    res.send({type : 'GET'});
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

 User.create(req.body).then(function(user){

res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
res.header("Access-Control-Allow-Methods" , "POST, GET, OPTIONS");
  
//     res.setHeader('Content-Type', 'application/json');
// res.send({ data: 'user created in db' });

res.setHeader('Content-Type', 'application/json');
res.send(JSON.stringify({success:"registerd successfully" , code : 'reg', user : user} ));
//res.json({ user: 'foo' });

 }).catch(next);

});


router.post('/login',function(req,res,next){

    console.log(req.body);
  
    User.findOne({ email: req.body.email}, function(err, user) {

        console.log('user',user);
   
        if(user === null)
        {
           //res.send("User doesn't Exists");
            res.send(JSON.stringify({message:"User doesn't Exists" , code : 'no'} ));
        }

        else if (user.email === req.body.email ){

            if(user.password === req.body.password){
                res.send(JSON.stringify({message:"login successfully" , code : 'login', user : user} ));
            }
            else{
                res.send(JSON.stringify({message:"Invalid Password" , code : 'no'} ));
            }
        }

        else if (user.email === req.body.email && user.password === req.body.password)
         {
            res.send(JSON.stringify({message:"login successfully" , code : 'login', user : user} ));
         }

    });
  
  });


router.put('/users/:email',function(req,res){

    User.findByIdAndUpdate({email : req.params.email},req.body).then(function(){

     User.findOne({email : req.params.email}).then(function(user){

            res.send(user);
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
      itemId: req.body.itemId,
      name : req.body.title,
      description: req.body.description,
      mainCategory: req.body.category,
      subCategory: req.body.subCategory,
      price: req.body.price,
      discount: req.body.discount,
      quantityInCart: req.body.quantity,
      images: reqFiles,
    }

    console.log(product);
    Items.create(product)
      .then(function(items) {
       
        res.json(items);
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

router.get('/category', async (req, res, next) => {
  try {
    const categories = await Category.find();
    console.log(categories);

    res.send(categories);

  } catch (e) {
    
    next(e) 
  }
});

router.post("/category", (req, res) => {

  const product = {
    category: req.body.category,
    subCategory: req.body.subCategory,
  }
  console.log(product);
  Category.create(product)
    .then(function(categories) {
     
      res.json(categories);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
module.exports = router;