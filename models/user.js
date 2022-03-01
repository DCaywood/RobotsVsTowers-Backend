var sql = require('./db');
var log = require('../config/logger');
var appRoot = require('app-root-path');
var fs = require('fs');
const e = require('express');
var user = {}

user.createUserData = function(playerID, result){
    fs.readFile('json/mapdatahelper.json', function(err, mapData){
        if(err){
            log.error({message: 'Could not read Json file', Error: err});
            result(err, false);
        } else {
            fs.readFile('json/moduleunlockhelper.json', function(err, moduleData){
                if(err){
                    log.error({message: 'Could not read Json file', Error: err});
                    result(err, false);
                } else {
                    fs.readFile('json/towerdatahelper.json', function(err, towerData){
                        if(err){
                            log.error({message: 'Could not read Json file', Error: err});
                            result(err, false);
                        } else {
                            console.log(JSON.parse(mapData));
                            mapData = JSON.parse(mapData);
                            moduleData = JSON.parse(moduleData);
                            towerData = JSON.parse(towerData)
                            let queryData = {
                                playerid: playerID,
                                saveprogressdata: JSON.stringify(mapData),
                                towerunlockdata: JSON.stringify(towerData),
                                moduleunlockdata: JSON.stringify(moduleData)
                            }
                            sql.query('INSERT INTO userdata SET ?', queryData, function(err,res){
                                if(err){
                                    log.error({message: 'Error creating user data', Error: err});
                                    result(err,false);
                                } else {
                                    result(false,res);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

user.getUserData = function(playerID, result){
    sql.query('SELECT * FROM userdata WHERE BINARY playerid = ?', [playerID], function(err, res){
        if(err){
            log.error({message: 'Error retreiving user data', Error: err});
            result(err, false);
        } else {
            result(false, res);
        }
    });
}

user.getUserScrap = function(playerID, result){
    sql.query('SELECT scrap FROM userdata WHERE BINARY playerid = ?', [playerID], function(err, res){
        if(err){
            log.error({message: 'Error retreiving user scrap', Error: err});
            result(err, false);
        } else {
            result(false, res[0].scrap);
        }
    });
}

user.getUserTowerPoints = function(playerID, result){
    sql.query('SELECT towerpoints FROM userdata WHERE BINARY playerid = ?', [playerID], function(err, res){
        if(err){
            log.error({message: 'Error retreiving user scrap', Error: err});
            result(err, false);
        } else {
            result(false, res);
        }
    });
}

user.getUserTowerData = function(playerID, result){
    sql.query('SELECT towerunlockdata FROM userdata WHERE BINARY playerid = ?', [playerID], function(err, res){
        if(err){
            log.error({message: 'Error retreiving user tower data', Error: err});
            result(err, false);
        } else {
            result(false, res);
        }
    });
}

user.getUserModuleData = function(playerID, result){
    sql.query('SELECT moduleunlockdata FROM userdata WHERE BINARY playerid = ?', [playerID], function(err, res){
        if(err){
            log.error({message: 'Error retreiving user module data', Error: err});
            result(err, false);
        } else {
            result(false, res);
        }
    })
}

user.getUserLevelProgress = function(playerID, result){
    sql.query('SELECT saveprogressdata FROM userdata WHERE BINARY playerid = ?', [playerID], function(err,res){
        if(err){
            log.error({message: 'Error retreiving user module data', Error: err});
            result(err, false);
        } else {
            result(false, res);
        }
    });
}

user.subtractScrap = function(playerID, amount, result){
    sql.query('UPDATE userdata set scrap = scrap - ? WHERE playerid = ?', [amount, playerID], function(err,res){
        if(err){
            log.error({message: 'Error retreiving user module data', Error: err});
            result(err, false);
        } else {
            result(false, res);
        }
    });
}

user.addScrap = function(playerID, amount, result){
    sql.query('UPDATE userdata set scrap = scrap + ? WHERE playerid = ?', [amount, playerID], function(err,res){
        if(err){
            log.error({message: 'Error retreiving user module data', Error: err});
            result(err, false);
        } else {
            result(false, res);
        }
    });
}

user.getUserStoreData = function(playerID, result){
    sql.query('SELECT storedata FROM userdata WHERE playerid = ?', [playerID], function(err, res){
        if(err){
            log.error({message: 'Error retreiving user store data', Error: err});
            result(err, false);
        } else {
            result(false, JSON.parse(res[0].storedata));
        }
    });
}

user.updateUserStoreData = function(playerID, storeData, result){
    let queryData = {
        storedata: JSON.stringify(storeData),
        playerid: playerID
    }
    console.log(queryData.storedata);
    sql.query('UPDATE userdata set storedata = ? WHERE BINARY playerid = ?', [queryData.storedata, queryData.playerid], function(err, res){
        if(err){
            log.error({message: 'Error updating user store data', Error: err});
            result(err, false);
        } else {
            result(false, res);
        }
    })
}

module.exports = user;