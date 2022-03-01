var jwt = require('jsonwebtoken');
var log = require('../config/logger');
var session = {}

session.checkUser = function(req,res,next){
    if(req.query.token == null){
        log.info({message: 'Request requires user token', successResponse: false, source: req.connection.remoteAddress});
        res.send({success: false, error: 'No session token sent'});
    }
    jwt.verify(req.query.token, process.env.JWT_SECRET, function(err, token){
        if(err){
            log.info({message: 'Token is invalid on verify', successResponse: false, token: req.query.token, source: req.connection.remoteAddress});
            res.send({success: false, error: 'Not a valid session token'});
        } else {
            log.info({message: 'Token check good', successResponse: true, playerid: token.playerid, source: req.connection.remoteAddress});
            req.playerid = token.playerid;
            next();
        }
    });
}

module.exports = session.checkUser;