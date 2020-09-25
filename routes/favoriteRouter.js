const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const favoriteRouter = express.Router();
const cors=require('./cors');


const Favorites = require('../models/favorite');
const { application, json } = require('express');
var authenticate = require('../authenticate');


favoriteRouter.use(bodyParser.json());
let ab=0;


favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res,next) => { res.sendStatus(200); })

.get(cors.cors,authenticate.verifyUser,(req,res,next) => {
  
    Favorites.findOne({user:req.user._id})
    .populate('user')
    .populate('dishes')
    .exec((err,favs) => {

        if(err)
        {
            return err
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favs);
    });
    
   

})



.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    
    Favorites.findOne({user:req.user._id},(err,favs)=>{
        if(err)
        {
            return next(err);
        }
        if(!favs)
        {   
           

            Favorites.create({user:req.user._id})
            .then((favs)=>{

                for( i = 0 ; i<req.body.length; i++)
                {
                     
                    if((favs.dishes.indexOf(req.body[i]._id) ) < 0){
                        favs.dishes.push(req.body[i]);
                    }
                    

                    
                }
                    favs.save() 
                    .then((favs)=>
                    {
                        console.log('favs created');
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json(favs);
                
                    },((err)=>next(err)))
                    .catch((err)=>next(err));


                
            });
        }

     



        else{
               for( i = 0 ; i<req.body.length; i++){
            

            if((favs.dishes.indexOf(req.body[i]._id) ) < 0){
                favs.dishes.push(req.body[i]);
            }
               }
                 favs.save() 
                .then((favs)=>
                {
                   // console.log('favs already added'+favs);
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favs);
            
                },((err)=>next(err)))
                .catch((err)=>next(err));  

        }  
     });
   

})
.put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    
    res.statusCode = 403;
    res.setHeader('Content-Type','text/plain');
    res.end('PUT operation not supported on /favs');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {

    Favorites.findOneAndRemove({user:req.user._id},(err,favs)=>{
        if(err)
        {
            return next(err);
        }

        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(favs);

    
});

});




favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res,next) => { res.sendStatus(200); })
.get(cors.cors,authenticate.verifyUser,(req,res,next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type','text/plain');
    res.end('get operation not supported on /favorites/'+ req.params.dishId);
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Favorites.findOne({user:req.user._id},(err,favorite)=>{
        if(err){
        return next(err);
        }

        if(!favorite)
        {
            Favorites.create({user:req.user._id})
            .then((favorite)=>{
                if((favorite.dishes.indexOf(req.params.dishId) ) < 0){
                favorite.dishes.push(req.params.dishId);
                }
                favorite.save()
                .then((favs)=>
                {
                   // console.log('favs already added'+favs);
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favs);
            
                },((err)=>next(err)))
                .catch((err)=>next(err));

            });
        }


        else{
         //   Favorites.create({dishes:req.params.dishId})
           // .then((favorite)=>{
            if((favorite.dishes.indexOf(req.params.dishId) ) < 0){
                favorite.dishes.push(req.params.dishId);
                }
                favorite.save()
                .then((favs)=>
                {
                    console.log('favs already added');
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favs);
            
                },((err)=>next(err)))
                .catch((err)=>next(err));

           

        }
    }
    
);

})
.put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    
    res.statusCode = 403;
    res.setHeader('Content-Type','text/plain');
    res.end('PUT operation not supported on /favorites/'+ req.params.dishId);
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {

    Favorites.findOne({user:req.user._id},(err,favs)=>{
        if(err)
        {
            return next(err);
        }
        if(favs){
            Favorites.findOne( {dishes:req.params.dishId},(err,resp)=>{
                if(err)
                {
                    return next(err);
                }

                if(resp){
                
                    

                    resp.dishes.remove(req.params.dishId);
                    resp.save();
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(resp);

                }
                else{
                    err=new Error('fav '+req.params.dishId+'not found ');
                    err.statusCode=404;
                    return next(err);
                }
                
            })
           
          
    
        }

        else{
            err=new Error('fav not found');
            err.statusCode=404;
            return next(err);
        }

        
    
})
.catch((err)=>next(err));

});



   


module.exports = favoriteRouter;