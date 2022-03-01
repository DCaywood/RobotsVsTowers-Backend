var express = require('express');
var router = express.Router();
var user = require('../models/user');
var log = require('../config/logger');
var session = require('../middlewares/session')

router.get('/', session, function(req, res){
    user.getUserData(req.playerid, function(err, result){
        if(err){
            log.error({message: 'SQL Related Error', route: 'user/', type: 'get', successResponse: false, playerid: req.playerid, source: req.socket.remoteAddress});
            res.send({success: false, error: 'SQL Error'});
        } else {
            log.info({message: 'player data successfully received', route: 'user/', type: 'get', successResponse: true, playerid: req.playerid, source: req.socket.remoteAddress});
            res.send({success: true, playerdata: result});
        }
    });
});

router.get('/playerscrap/', session, function(req, res){
    user.getUserScrap(req.playerid, function(err, result){
        if(err){
            log.error({message: 'SQL Related Error', route: 'user/playerscrap/', type: 'get', successResponse: false, playerid: req.playerid, source: req.socket.remoteAddress});
            res.send({success: false, error: 'SQL Error'});
        } else {
            console.log(result);
            log.info({message: 'player scrap successfully received', route: 'user/playerscrap/', type: 'get', successResponse: true, playerid: req.playerid, source: req.socket.remoteAddress});
            res.send({success: true, scrap: result});
        }
    });
});

router.get('/playerTP/', session, function(req, res){
    user.getUserTowerPoints(req.playerid, function(err, result){
        if(err){
            log.error({message: 'SQL Related Error', route: 'user/playerTP/', type: 'get', successResponse: false, playerid: req.playerid, source: req.socket.remoteAddress});
            res.send({success: false, error: 'SQL Error'});
        } else {
            log.info({message: 'player tower points successfully received', route: 'user/playerTP/', type: 'get', successResponse: true, playerid: req.playerid, source: req.socket.remoteAddress});
            res.send({success: true, towerpoints: result[0].towerpoints});
        }
    });
})

router.get('/playertowerunlocks/', session, function(req, res){
    user.getUserTowerData(req.playerid, function(err, result){
        if(err){
            log.error({message: 'SQL Related Error', route: 'user/playertowerunlocks/', type: 'get', successResponse: false, playerid: req.playerid, source: req.socket.remoteAddress});
            res.send({success: false, error: 'SQL Error'});
        } else {
            log.info({message: 'player tower data successfully received', route: 'user/playertowerunlocks/', type: 'get', successResponse: true, playerid: req.playerid, source: req.socket.remoteAddress});
            res.send({success: true, towers: result[0].towerunlockdata});
        }
    });
});

router.get('/playermoduleunlocks/', session, function(req,res){
    user.getUserModuleData(req.playerid, function(err, result){
        if(err){
            log.error({message: 'SQL Related Error', route: 'user/playermoduleunlocks/', type: 'get', successResponse: false, playerid: req.playerid, source: req.socket.remoteAddress});
            res.send({success: false, error: 'SQL Error'});
        } else {
            log.info({message: 'player tower data successfully received', route: 'user/playertowerunlocks/', type: 'get', successResponse: true, playerid: req.playerid, source: req.socket.remoteAddress});
            res.send({success: true, towers: result[0].moduleunlockdata});
        }
    })
});

router.get('/playerprogress/', session, function(req, res){
    user.getUserLevelProgress(req.playerid, function(err, result){
        if(err){
            log.error({message: 'SQL Related Error', route: 'user/playerprogress/', type: 'get', successResponse: false, playerid: req.playerid, source: req.socket.remoteAddress});
            res.send({success: false, error: 'SQL Error'}); 
        } else {
            log.info({message: 'player progress data successfully received', route: 'user/playertowerunlocks/', type: 'get', successResponse: true, playerid: req.playerid, source: req.socket.remoteAddress});
            res.send({success: true, towers: result[0].saveprogressdata});
        }
    });
});

module.exports = router;