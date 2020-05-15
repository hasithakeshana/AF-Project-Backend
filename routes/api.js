const express = require('express');

const router = express.Router();

const User = require('../models/user');
// const Product = require('../models/Product');
const Review = require('../models/Review');
const mongoose = require("mongoose");
const multer = require('multer');


const storage = multer.diskStorage({
  destination: function(req, file, cb){
      cb(null,'./uploads/');
  },
  // filename: function(req,file,cb){
  //     cb(null, new Date().toISOString().replace(/:/g, '-') +'-'+ file.originalname);
  // }
  filename: function(req,file,cb){
    //cb(null, Date.now() + file.originalname);
    cb(null, new Date().toISOString().replace(/:/g, '-') +'-'+ file.originalname);
}
});


const upload = multer({storage:storage});

const Items = require('../models/Items');

const Products = require('../models/Product');

router.get('/users',function(req,res){

  

    res.send({type : 'GET'});
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


router.put('/users/:id',function(req,res){

    User.findByIdAndUpdate({_id : req.params.id},req.body).then(function(){

     User.findOne({_id : req.params.id}).then(function(user){

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

router.post("/items",function(req, res) {   // add an item

   // console.log(req.file);

    const product = new Products({

      
      itemID : req.body.itemID,
      name : req.body.name,
      price : req.body.price,
      description : req.body.description,
      mainCategory :  req.body.mainCategory,
      subCategory :  req.body.subCategory,
      quantityInCart : req.body.quantityInCart,
      cartIn : req.body.cartIn,
      quantity : req.body.quantity
     

    });

    product.save().then(function(dbProduct) {
       
          res.json(dbProduct);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          res.json(err);
        });

    
  });

  router.get('/allitems', async (req, res, next) => {
    try {

      const item = await Products.find();

    
      res.send(JSON.stringify({message:"item details" , item : item } ));

      
    } catch (e) {
      
      next(e) 
    }
  });//5ebba697274b830ec4515452

  router.post("/UpdateImages/:id",upload.single('productImage'), async (req, res) =>{   // add a items for wishlist
    
    console.log(req.params.id);
    console.log('body',req.body); // get the username or userid

    console.log(req.file);
        try{
    
          const itemAdd = {productImage :req.file.filename}
        //const image = req.file.filename;
  
         //console.log('itemAdd',itemAdd);
        // const productImage = req.file.filename;
          
         const response = await Products.findOneAndUpdate({ _id: req.params.id }, {$push: {images: itemAdd}}, { new: true });
     
        console.log('res',response);
  
         res.send(JSON.stringify({message:"add image " , res : response } ));
  
        }catch(e)
        {
          console.log(e);
        }
    
  });
  
router.post("/addRatingWithComment/:id", async (req, res) =>{   // add a rating with comment to given product
    

    try{

      console.log('apiiiiiiiiiiiiiiiiiiiiii  body',req.body);
      console.log('apiiiiii id',req.params.id);

      const item = await Products.findOneAndUpdate({ _id: req.params.id }, {$push: {ratings: req.body}}, { new: true });

      console.log(item);

      
      res.send(JSON.stringify({message:"rating added successfully" , item : item } ));


    }catch(e)
    {
      console.log(e);
    }

 });

 router.post("/checkUserIsRated/:id", async (req, res) =>{   // add a rating with comment to given product
    

  try{

    console.log('apii  body',req.body);
    console.log('apiiiiii id',req.params.id);

    const user = req.body.username;

    const item = await Products.findOne({_id : req.params.id});

    console.log('items ratings',item.ratings);

    //5ebcf2228739513778b72153
    let isRated = false;
    let userIS = null;

    for(let rating of item.ratings)
    {
      console.log(rating.userName);
      if(rating.userName == user)
      {
        console.log('found user');
        console.log('rating',rating);
        isRated = true;
        userIS = rating;
      }
      
    }

    if(isRated)
    {
      res.send(JSON.stringify({message:"user rated" ,rated:true ,rating:userIS  } ));
    }
    else
    {
      res.send(JSON.stringify({message:"user not rated",rated:false } ));
    }

    
    
    //res.send(JSON.stringify({message:"rating added successfully" , item : item } ));


  }catch(e)
  {
    console.log(e);
  }

});


router.get("/getRatingsWithComments/:id", async (req, res ,next) => {  // get ratings for given product id

  try{

    const item = await Products.findOne({_id : req.params.id});

    console.log('items ratinggggggggggggggggggggggggggggg',item.ratings);

    let sum = 0;

    let noOfRatings = 0;

    let a = 0,b=0,c=0,d=0,e=0;

    for(let ratings of item.ratings)
    {
      console.log(ratings.userName);

    }

   

    for (let value of item.ratings) {
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
    const avgs = sum /item.ratings.length;
    console.log('sum',sum);
    const avg = avgs.toFixed(2);
   

    res.send(JSON.stringify({message:"item details" ,countRatings : {noOfRatings} , ratings: item.ratings, avg : {avg} , item : item , noOfRatings : {one: a , two : b , three : c , four : d , five : e } } ));
  }
catch(e)
{
next(e)
}



});


router.get('/items/:id', async (req, res, next) => {
      try {

        const item = await Products.findOne({_id : req.params.id});

      
        res.send(JSON.stringify({message:"item details" , item : item } ));

        
      } catch (e) {
        
        next(e) 
      }
    });



router.post("/addItemToWishList/:id", async (req, res) =>{   // add a items for wishlist
    
  console.log(req.params.id);
  console.log('body',req.body); // get the username or userid
      try{
  
       

        const item = await Items.findOne({_id : req.params.id}); // find the item
  
        console.log(item);

        const itemAdd = {itemName : item.name,price : item.price,quantity:item.quantity}

        console.log('itemAdd',itemAdd);

        const user = await User.findOne({_id : req.body.userId});

        console.log('user',user.wishlist);

        const list = await user.wishlist;

        var exists = false;

        for (let x of list) {
          console.log('item 11111',x.itemName);
          if(x.itemName === item.name)
          {
              console.log('alreadyy existssssssssssssssss');
             
              exists = true;
          }

        }

        if(exists)
        {
          res.send(JSON.stringify({message:"alreadyy existssssssssssssssss" } ));
        }
        else{

          const response = await User.findOneAndUpdate({ _id: req.body.userId }, {$push: {wishlist: itemAdd}}, { new: true });
          // const response = await User.findOneAndUpdate({ userName: 'hasitha' }, {$push: {wishlist: itemAdd}}, { new: true });
        
          console.log('res',response);
  
          res.send(JSON.stringify({message:"add item successfully to wishlist" , wishlist : response.wishlist } ));

        }

        
      

      }catch(e)
      {
        console.log(e);
      }
  
   });


router.post("/addItemWishListFromCart/:id", async (req, res) =>{   // add a items for wishlist
    
    console.log(req.params.id);
    console.log('body',req.body); // get the username or userid
        try{
    
      
          const itemAdd = req.body;
  
         console.log('itemAdd',itemAdd);
  
          
         const response = await User.findOneAndUpdate({ _id: req.params.id }, {$push: {cart: itemAdd}}, { new: true });
        // //   // const response = await User.findOneAndUpdate({ userName: 'hasitha' }, {$push: {wishlist: itemAdd}}, { new: true });
        
        console.log('res',response);
  
         res.send(JSON.stringify({message:"add item successfully to cart" , wishlist : response.cart } ));
  
        }catch(e)
        {
          console.log(e);
        }
    
     });

router.get('/getWishList/:id', async (req, res, next) => {  // get user wishlist
    try {

      const response = await User.findOne({_id : req.params.id});

      console.log(response.wishlist);

     
     res.send(JSON.stringify({message:"wishlist details" , wishlist : response.wishlist } ));
      
    } catch (e) {
      
      next(e) 
    }
  });

router.post('/deleteWishListProduct', async (req, res, next) => { // delete item from wishlist
    try {

      console.log('body',req.body);

      const response = await User.findOne({_id : req.body.userId });

      console.log(response.wishlist);

     
      const responses = await User.updateOne({_id : req.body.userId },{'$pull':{ 'wishlist':{'_id': req.body.wishListOredrId }}},{multi:true});
     console.log('res',responses);

     
     res.send(JSON.stringify({message:"deleted successfully" , wishlist :responses} ));
      
    } catch (e) {
      
      next(e) 
    }
  });



module.exports = router;