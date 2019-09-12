const express = require('express');
const router = express.Router();
const schema = require('../models/contact');
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const filefilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const upload = multer({
  storage: storage,
  limits:{
    fileSize: 1024 * 1024* 5
  },
  fileFilter:filefilter
});

/**
 * To Store Contacts in user's Collection
 */
router.post('/store', upload.single('contactImage'), function (req, res, next) {
  console.log('called');
  console.log(req.file);
  addToDB(req, res);
});

async function addToDB(req, res) {
  var contact = new mongoose.model(req.body.username + 'col', schema)({
    name: req.body.name,
    primarynumber: req.body.primarynumber,
    secondarynumber: req.body.secondarynumber,
    email: req.body.email,
    address: req.body.address,
    category: req.body.category,
    creation_dt: Date.now(),
    contactImage: req.file.path
  });
  try {
    doc = await contact.save((error, registeredContact) => {
      if (error) {
        console.log(error);
      } else {
        return res.status(200).send({ registeredContact });
      }
    });
  } catch (err) {
    return res.status(501).json(err);
  }
}

/**
 * To Fetch all contacts from user's collection
 */
router.post('/readcontacts', function (req, res, next) {
  readcontacts(req, res);
});

async function readcontacts(req, res) {
  try {
    var Model = mongoose.model(req.body.username + 'col', schema);
    Model.find().sort({ "name": 1 }).exec(function (err, doc) {
      if (err) throw err;
      if (doc) {
        return res.status(200).json(doc);
      }
    })
  } catch (err) {
    return res.status(501).json(err);
  }
}

/**
 * To get the contacts based on categories
 */
router.post('/getcontacts', function (req, res, next) {
  getcontacts(req, res);
});

async function getcontacts(req, res) {
  try {
    var Model = mongoose.model(req.body.username + 'col', schema);
    Model.find({ category: req.body.category }).sort({ "name": 1 }).exec(function (err, doc) {
      if (err) throw err;
      if (doc) {
        return res.status(200).json(doc);
      }
    })
  } catch (err) {
    return res.status(501).json(err);
  }
}

/**
 * To Update the contact in user's collection
 */
router.put('/update', function (req, res, next) {
  updatestudent(req, res);
});

async function updatestudent(req, res) {
  var myquery = { _id: req.body.id };
  var newvalues = {
    $set: {
      name: req.body.name,
      primarynumber: req.body.primarynumber,
      secondarynumber: req.body.secondarynumber,
      email: req.body.email,
      address: req.body.address,
      category: req.body.category,
    }
  };
  try {
    var Model = mongoose.model(req.body.username + 'col', schema);
    Model.updateOne(myquery, newvalues, (err, doc) => {
      if (err) throw err;
      console.log("1 document updated");
      return res.status(200).json(doc);
    });
  } catch (err) {
    return res.status(501).json(err);
  }
}

/**
 * To delete the contact from user's collection
 */
router.post('/delete', function (req, res, next) {
  deletestudent(req, res);
});


async function deletestudent(req, res) {
  var myquery = { _id: req.body.id };
  console.log(req.body.id);
  console.log(req.body.username);
  try {
    var Model = mongoose.model(req.body.username + 'col', schema);
    Model.deleteOne(myquery, (err, doc) => {
      if (err) throw err;
      console.log("1 document deleted !");
      return res.status(200).json(doc);
    });
  } catch (err) {
    return res.status(501).json(err);
  }
}

module.exports = router;
