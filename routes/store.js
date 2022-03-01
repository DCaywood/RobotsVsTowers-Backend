var express = require('express');
var router = express.Router();
var user = require('../models/user');
var log = require('../config/logger');
var rnjesus = require('../modules/rnjesus');
var store = require('../modules/store');
var session = require('../middlewares/session');

router.get('/buyitem/', session, function(req, res){
    store.buyStoreItem(req.playerid, req.query.itemid, function(err, result){
        if(err){
          res.send(err);  
        } else {
            res.send({success: true, data: result});
        }
    });
});

router.get('/openitem/', session, function(req,res){

});

router.get('/', session, function(req, res){
    user.getUserStoreData(req.playerid, function(err, result){
        if(err){
            res.send({success: false, error: err});
        } else {
            res.send({success: true, data: result});
        }
    });
})
module.exports = router;