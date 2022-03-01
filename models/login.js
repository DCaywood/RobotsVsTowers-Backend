var sql = require('./db');
var {v4: uuidv4} = require('uuid');
var log = require('../config/logger');
var login = {}

login.deviceCheck = function(deviceID, result){
    sql.query('SELECT * FROM userid WHERE BINARY deviceid = ?', [deviceID], function(err, res){
        if(err){
            return(err, false);
        }
        if(res[0] == null){
            result(false,false);
        } else {
            result(false,res[0].playerid);
        }
    });
}

login.playerCheck = function(deviceID, playerID, result){
    sql.query('SELECT * FROM userid WHERE BINARY deviceid = ? AND playerid = ?', [deviceID, playerID], function(err, res){
        if(err){
            return(err, false);
        }
        if(res[0] == null){
            result(false,false);
        } else {
            result(false,true);
        }
    });
}

login.createNewAccount = function(deviceID, Platform, result){
    var newid = uuidv4();
    var query = {
        deviceid: deviceID,
        playerid: newid,
        platform: Platform
    };
    sql.query('INSERT INTO userid SET ?', query, function(err,res){
        if(err){
            log.error({Message: 'SQL Error', ErrorMessage: err});
            result(err, false);
        } else {
            res.id = newid;
            result(false, res.id);
        }
    });
}

module.exports = login;