const express = require('express');

const router = express.Router();

const User = require('../models/user');
const Product = require('../models/Product');
const Review = require('../models/Review');

const Items = require('../models/Items');

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

router.post("/items", function(req, res) {   // add an item

    console.log(req.body);
    Items.create(req.body)
      .then(function(dbProduct) {
       
        res.json(dbProduct);
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


router.get("/getRatingsWithComments/:id", async (req, res ,next) => {  // get ratings for given product id

  try{

    const item = await Items.findOne({_id : req.params.id});

    console.log(item.ratings);

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

        const item = await Items.findOne({_id : req.params.id});

      
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

        
       const response = await User.findOneAndUpdate({ _id: req.body.userId }, {$push: {wishlist: itemAdd}}, { new: true });
        // const response = await User.findOneAndUpdate({ userName: 'hasitha' }, {$push: {wishlist: itemAdd}}, { new: true });
      
        console.log('res',response);

        res.send(JSON.stringify({message:"add item successfully to wishlist" , wishlist : response.wishlist } ));

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