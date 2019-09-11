var express = require('express');
var router = express.Router();
var User = require('../models/user');
var jwt = require('jsonwebtoken');

/**
 * To register the user in collection
 */
router.post('/register', function (req, res, next) {
  addToDB(req, res);
});

async function addToDB(req, res) {
  var user = new User({
    username: req.body.username,
    number: req.body.number,
    password: req.body.password,
    creation_dt: Date.now()
  });

  try {
    doc = await User.findOne({ username: req.body.username }).then((finduser) => {
      if (!finduser) {
        user.save((error, registeredUser) => {
          if (error) {
            console.log(error);
          } else {
            let payload = { subject: registeredUser._id };
            let token = jwt.sign(payload, 'secretKey');
            return res.status(200).send({ token });
          }
        });
      } else {
        return res.status(501).send('username is already used !');
      }
    });
  } catch (err) {
    return res.status(501).json(err);
  }
}

/**
 * To authenticate the user 
 */
router.post('/login', function (req, res, next) {
  ToCheck(req, res);
});

async function ToCheck(req, res) {
  try {
    User.findOne({ username: req.body.username, password: req.body.password }, function (err, doc) {
      if (err) throw err;
      if (doc) {
        console.log(JSON.stringify(doc));
        let payload = { subject: doc._id };
        let token = jwt.sign(payload, 'secretKey')
        return res.status(200).send({ token })
      }
    });
  } catch (err) {
    return res.status(501).json(err);
  }
}

/**
 * To get categorylist
 */
router.post('/getcategorylist', function (req, res, next) {
  getcategorylist(req, res);
});

async function getcategorylist(req, res) {
  try {
    User.findOne({ username: req.body.username }, function (err, doc) {
      if (err) throw err;
      if (doc) {
        console.log(JSON.stringify(doc));
        return res.status(200).send({ doc })
      }
    });
  } catch (err) {
    return res.status(501).json(err);
  }
}

/**
 * To add categorylist
 */
router.post('/putcategorylist', function (req, res, next) {
  putcategorylist(req, res);
});

async function putcategorylist(req, res) {
  var myquery = { username: req.body.username };
  var newvalues = {
    $set: {
      categorylist: req.body.categorylist,
    }
  };
  try {
    User.updateOne(myquery, newvalues, (err, doc) => {
      if (err) throw err;
      console.log("1 document updated");
      return res.status(200).json(doc);
    });
  } catch (err) {
    return res.status(501).json(err);
  }
}

module.exports = router;
