const express = require('express');
const router = express.Router();
const User = require('../models/user');
// const Product = require('../models/Product');
const Review = require('../models/Review');
const app = express();
const mongoose = require("mongoose");
const multer = require('multer');
const bodyParser = require('body-parser');
const Categories = require('../models/Categories');

app.use(bodyParser.json());
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    // filename: function(req,file,cb){
    //     cb(null, new Date().toISOString().replace(/:/g, '-') +'-'+ file.originalname);
    // }
    filename: function (req, file, cb) {
        //cb(null, Date.now() + file.originalname);
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});


const upload = multer({storage: storage});

const Items = require('../models/Items');

const Products = require('../models/Product');

router.get('/users', function (req, res) {


    res.send({type: 'GET'});
});


router.post('/signup', function (req, res, next) {

    User.create(req.body).then(function (user) {

    
    res.send(JSON.stringify({success: "registerd successfully", code: 'reg', user: user}));


    }).catch(next);

});


router.post('/login', function (req, res, next) {

console.log('login');
    User.findOne({email: req.body.email}, function (err, user) {


        if (user === null) {
            //res.send("User doesn't Exists");
            res.send(JSON.stringify({message: "User doesn't Exists", code: false}));
        } else if (user.email === req.body.email) {

            if (user.password === req.body.password) {
                res.send(JSON.stringify({message: "login successfully", code: true, user: user}));
            } else {
                res.send(JSON.stringify({message: "Invalid Password", code: false}));
            }
        } else if (user.email === req.body.email && user.password === req.body.password) {
            res.send(JSON.stringify({message: "login successfully", code: true, user: user}));
        }

    });

});


router.put('/users/:id', function (req, res) {

    User.findByIdAndUpdate({_id: req.params.id}, req.body).then(function () {

        User.findOne({_id: req.params.id}).then(function (user) {

            res.send(user);
        });
    });


});


router.delete('/users/:id', function (req, res, next) {


    User.findByIdAndDelete({_id: req.params.id}).then(function (user) {

        res.send(user);

    });

    //res.send({type : 'DELETE'});
});


router.post("/items", function (req, res) {   // add an item

    // console.log(req.file);

    const product = new Products({

        itemID: req.body.itemID,
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        mainCategory: req.body.mainCategory,
        subCategory: req.body.subCategory,
        quantityInCart: req.body.quantityInCart,
        cartIn: req.body.cartIn,
        quantity: req.body.quantity


    });

    product.save().then(function (dbProduct) {

        res.json(dbProduct);
    })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });


});

router.get('/allitems', async (req, res, next) => {
    try {

        const item = await Products.find();
        res.send(JSON.stringify({message: "item details", item: item}));


    } catch (e) {

        next(e)
    }
});//5ebba697274b830ec4515452

router.post("/UpdateImages/:id", upload.single('productImage'), async (req, res) => {   // add a items for wishlist

    try {


        const itemAdd = {productImage: req.file.filename}
        //const image = req.file.filename;

        //console.log('itemAdd',itemAdd);
        // const productImage = req.file.filename;

        const response = await Products.findOneAndUpdate({_id: req.params.id}, {$push: {images: itemAdd}}, {new: true});

        res.send(JSON.stringify({message: "add image ", res: response}));

    } catch (e) {
        console.log(e);
    }

});

router.post("/addRatingWithComment/:id", async (req, res) => {   // add a rating with comment to given product


    try {

        const item = await Products.findOneAndUpdate({_id: req.params.id}, {$push: {ratings: req.body}}, {new: true});

        res.send(JSON.stringify({message: "rating added successfully", item: item}));


    } catch (e) {
        console.log(e);
    }

});

// router.post("/checkUserIsRated/:id", async (req, res) => {   // add a rating with comment to given product


//     try {
//         const user = req.body.username;
//         const item = await Products.findOne({_id: req.params.id});
//         //5ebcf2228739513778b72153
//         let isRated = false;
//         let userIS = null;

//         for (let rating of item.ratings) {
//             console.log(rating.userName);
//             if (rating.userName == user) {
//                 console.log('found user');
//                 console.log('rating', rating);
//                 isRated = true;
//                 userIS = rating;
//             }

//         }

//         if (isRated) {
//             res.send(JSON.stringify({message: "user rated", rated: true, rating: userIS}));
//         } else {
//             res.send(JSON.stringify({message: "user not rated", rated: false}));
//         }


//         //res.send(JSON.stringify({message:"rating added successfully" , item : item } ));


//     } catch (e) {
//         console.log(e);
//     }

// });


router.get("/getRatingsWithComments/:id", async (req, res, next) => {  // get ratings for given product id

    try {

        const item = await Products.findOne({_id: req.params.id});

        let sum = 0;

        let noOfRatings = 0;

        let a = 0, b = 0, c = 0, d = 0, e = 0;

        for (let ratings of item.ratings) {
        }


        for (let value of item.ratings) {
            if (value.rate === 1) {
                a++;
            }
            if (value.rate === 2) {
                b++;
            }
            if (value.rate === 3) {
                c++;
            }
            if (value.rate === 4) {
                d++;
            }
            if (value.rate === 5) {
                e++;
            }

            noOfRatings++;

            sum = sum + value.rate;
        }

        const avgs = sum / item.ratings.length;
        const avg = avgs.toFixed(2);


        res.send(JSON.stringify({
            message: "item details",
            countRatings: {noOfRatings},
            ratings: item.ratings,
            avg: {avg},
            item: item,
            noOfRatings: {one: a, two: b, three: c, four: d, five: e}
        }));
    } catch (e) {
        next(e)
    }


});


router.get('/items/:id', async (req, res, next) => {
    try {

        const item = await Products.findOne({_id: req.params.id});


        res.send(JSON.stringify({message: "item details", item: item}));
      } catch (e) {
        
        next(e)
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
    
    
    
router.put('/updateRating/:id', async (req, res, next) => {
          try {
    
            console.log("id",req.params.id);
    
        const response =   await  Products.updateOne(
              {
                "_id" : req.body.productId,
                "ratings._id" : req.params.id
              },
              {
                "$set" :
                {
                    "ratings.$.rate": req.body.rate,
                    "ratings.$.comment": req.body.comment,
    
                }
              }
            );
          
            res.send(JSON.stringify({message:"rate updated" , item : response } ));
    
            
          } catch (e) {
            
            next(e) 
          }
        });
    
router.delete('/deleteRating/:id', async (req, res, next) => {
          try {
    
            console.log("id",req.params.id);
    
        const response =   await  Products.updateOne(
          { _id: req.body.productId },
          { $pull: { 'ratings': { _id: req.params.id } } }
            );
          
            res.send(JSON.stringify({message:"rate deleted" , item : response } ));
    
            
          } catch (e) {
            
            next(e) 
          }
        });
    



router.post("/addItemToWishList/:id", async (req, res) => {   // add a items for wishlist

    try {

        const item = await Products.findOne({_id: req.params.id}); // find the item

        console.log('item wishlist',item._id);

        const itemAdd = {itemID : item._id,itemName: item.name,mainCategory :item.mainCategory, price: item.price,
            image : item.images[0].productImage}

        console.log('item',itemAdd);

        const user = await User.findOne({_id: req.body.userId});

        console.log('user wishlist',user);

        const list = await user.wishlist;

        console.log('user list',list);

        var exists = false;

        for (let x of list) {
            console.log('x',x.itemID)
            if (x.itemID == item._id) {
                exists = true;
            }
        }

        if (exists) {
            res.send(JSON.stringify({message: "alreadyy exists",exists:true}));
        } else {

            const response = await User.findOneAndUpdate({_id: req.body.userId}, {$push: {wishlist: itemAdd}}, {new: true});
            // const response = await User.findOneAndUpdate({ userName: 'hasitha' }, {$push: {wishlist: itemAdd}}, { new: true });
            res.send(JSON.stringify({message: "add item successfully to wishlist", wishlist: response.wishlist,exists:false}));

        }


    } catch (e) {
        console.log(e);
    }

});



router.post("/addItemWishListFromCart/:id", async (req, res) => {   // add a items for wishlist

    try {


        const itemAdd = req.body;

        const response = await User.findOneAndUpdate({_id: req.params.id}, {$push: {cart: itemAdd}}, {new: true});
       

        res.send(JSON.stringify({message: "add item successfully to cart", wishlist: response.cart}));

    } catch (e) {
        console.log(e);
    }

});

router.get('/getWishList/:id', async (req, res, next) => {  // get user wishlist
    try {

        const response = await User.findOne({_id: req.params.id});

        let total=0;

        for (let item of response.wishlist) {
            total = total + item.price;
        }

        console.log('total',total);

        res.send(JSON.stringify({message: "wishlist details", wishlist: response.wishlist,total:total}));

    } catch (e) {

        next(e)
    }
});

router.post('/deleteWishListProduct', async (req, res, next) => { // delete item from wishlist
    try {

        const response = await User.findOne({_id: req.body.userId});

        const responses = await User.updateOne({_id: req.body.userId}, {'$pull': {'wishlist': {'_id': req.body.wishListOredrId}}}, {multi: true});

        console.log('responses delete',responses,response);
        res.send(JSON.stringify({message: "deleted successfully", wishlist: responses}));

    } catch (e) {

        next(e)
    }
});

router.post('/addCategories',async (req,res)=>{
    const category = new Categories({
        menCategories:req.body.menCategories,
        womenCategories:req.body.womenCategories,
        kidsCategories  : req.body.kidsCategories,
        sportsCategories : req.body.sportsCategories,
    });
    try {
            const savedCategory = await category.save();
            res.json(savedCategory);
    }catch (e) {
        console.log(e)
    }


})

router.get('/getCategoriesToNav',async (req,res)=>{

    try {
        const category = await Categories.find();
        await res.json(category);

    }catch (e) {
        console.log(e)
    }

})



module.exports = router;
