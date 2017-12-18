const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('./../authenticate');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'public/images'); //first param takes err, 2nd param takes dest
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname) //if filename is not configured, multer uses a random string to config the name of the file
  }
});

const imageFileFilter = (req, file, callback) => {
  if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    var err = new Error('You can only upload image files!');
    return callback(err, false);
  }
  callback(null, true);
};

const upload = multer({storage: storage, fileFilter: imageFileFilter})


const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /imageUpload');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /imageUpload');
})


module.exports = uploadRouter;
