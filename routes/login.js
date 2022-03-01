var express = require('express');
var router = express.Router();
var login = require('../models/login');
var user = require('../models/user')
var log = require('../config/logger');
var jwt = require('jsonwebtoken');

router.post('/', function(req, res, next){
  if(req.query.deviceid == null){
    log.info({message: 'No "deviceid" Paramater Found', route: 'login/:deviceid/:privacyAgree', type: 'post', successResponse: false, source: req.socket.remoteAddress});
    res.send({success: false, error: 'Missing "deviceid" paramater'});
  } else if (req.query.privacyAgree !== "true"){
    log.info({message: 'need to agree to privacy policy', route: 'login/:deviceid/:privacyAgree', type: 'post', successResponse: false, source: req.socket.remoteAddress});
    res.send({success: false, error: 'Must agree to Privacy Policy'});
  } else {
    login.deviceCheck(req.query.deviceid, function(err, check){
      console.log('check: ' + check);
      if(err){
      log.error({message: 'SQL Related Error checking Device', route: 'login/:deviceid/:privacyAgree', type: 'post', successResponse: false, deviceID: req.params.deviceid, source: req.socket.remoteAddress});
      res.send({success: false, error: 'SQL Related Error'});
      } else if(check !== false){
        log.info({message: 'User data for this deviceid exists', route: 'login/:deviceid/:privacyAgree', type: 'post', successResponse: false, deviceID: req.params.deviceid, source: req.socket.remoteAddress});
        res.send({success: false, error: 'user already exists'});
      } else {
        login.createNewAccount(req.query.deviceid, req.query.deviceplatform, function(err, result){
          console.log(result);
          if(err){
            log.error({message: 'SQL Related Error adding account', route: 'login/:deviceid/:privacyAgree', type: 'post', successResponse: false, deviceID: req.params.deviceid, source: req.socket.remoteAddress});
            res.send({success: false, error: 'SQL Related Error'});
          } else {
            log.info({message: 'New user successfully created', route: 'login/:deviceid/:privacyAgree', type: 'post', successResponse: true, deviceID: req.params.deviceid, playerID: result, source: req.socket.remoteAddress});
            user.createUserData(result, function(err, succ){
              if(err){
                log.error({message: 'SQL Related Error creating user data', route: 'login/:deviceid/:privacyAgree', type: 'post', successResponse: false, deviceID: req.params.deviceid, source: req.socket.remoteAddress});
                res.send({success: false, error: 'SQL Related Error'});
              } else {
                log.info({message: 'New player data successfully created', route: 'login/:deviceid/:privacyAgree', type: 'post', successResponse: true, deviceID: req.params.deviceid, playerID: result, source: req.socket.remoteAddress});
                res.send({success: true, playerID: result});
              }
            });
          }
        });
      }
    });
  }
});

/* check if deviceid exists in the database to load cloud save */
router.get('/devicecheck/:deviceid', function(req, res, next) {
  if(req.params.deviceid == null){
    log.info({message: 'No "deviceid" Paramater Found', route: 'login/devicecheck/:deviceid', type: 'get', successResponse: false, source: req.socket.remoteAddress});
    res.send({success: false, error: '"deviceid" Paramater not found not found'});
  } else {
    login.deviceCheck(req.params.deviceid, function(err, result){
      if(err){
        log.error({message: 'SQL Related Error', route: 'login/devicecheck/:deviceid', type: 'get', successResponse: false, deviceID: req.params.deviceid, source: req.socket.remoteAddress});
        res.send({success: false, error: 'SQL Related Error'});
      } else if(result == false){
        log.info({message: 'Player Data not found, asking to create', route: 'login/devicecheck/:deviceid', type: 'get', successResponse: true, deviceID: req.params.deviceid, source: req.socket.remoteAddress});
        res.send({success: true, newplayer: true});
      } else {
        log.info({message: 'Matching DeviceID, sending playerID', route: 'login/devicecheck/:deviceid', type: 'get', successResponse: true, deviceID: req.params.deviceid, source: req.socket.remoteAddress});
        res.send({success: true, newplayer: false, playerid: result});
      }
    });
  }
});

router.get('/:deviceid/:playerid', function(req, res, next){
  log.info(req.params);
  if(req.params.deviceid == null || req.params.playerid == null){
    log.info({message: 'missing one or multiple parameters', route: 'login/:deviceid/:playerid', type: 'get', successResponse: false, deviceID: req.params.deviceID, playerid: req.params.playerid, source: req.socket.remoteAddress});
    res.send({success: false, error: "missing one or multiple paramaters"});
  } else {
    login.playerCheck(req.params.deviceid, req.params.playerid, function(err, result){
      if(err){
        log.error({message: 'SQL Related Error', route: 'login/:deviceid/:playerid', type: 'get', successResponse: false, deviceID: req.params.deviceid, playerID: req.params.playerid, source: req.socket.remoteAddress});
        res.send({success: false, error: 'SQL Related Error'});
      } else if(result == false){
        log.info({message: 'Player Not Found', route: 'login/:deviceid/:playerid', type: 'get', successResponse: false, deviceID: req.params.deviceid, playerID: req.params.playerid, source: req.socket.remoteAddress});
        res.send({success: false, error: 'Player Not Found'});
      } else {
        log.info({message: 'Player Found', route: 'login/:deviceid/:playerid', type: 'get', successResponse: true, deviceID: req.params.deviceid, playerID: req.params.playerid, source: req.socket.remoteAddress});
        jwt.sign({playerid: req.params.playerid}, process.env.JWT_SECRET, {expiresIn: '24h'}, function(err, token){
          if(err){
            log.error({message: 'Token related error', error: err});
          } else {
            res.send({success: true, token: token});
          }
        })
      }
    })
  }
});


module.exports = router;
