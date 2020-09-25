const express = require('express');
const bodyParser = require('body-parser');
var authenticate = require('../authenticate');
const multer = require('multer');
const cors=require('./cors');
var storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/images')//call back takes 2 param . first one is error which is null another is destination of file


    },

    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
});

const imageFileFilter =(req,file,cb)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error('you can only upload img file'));
    }

    cb(null,true);
};

const upload=multer({storage:storage,fileFilter:imageFileFilter});





const uploadRouter = express.Router();
const { application, json } = require('express');

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.statusCode(200); })
.get(cors.cors,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})
.post(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {  // upload.single('imageFile') ai khane imgaFile taa html ar form ar file instruction a dew thakbe
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})
.put(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})
.delete(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /imageUpload');
});


module.exports=uploadRouter;


