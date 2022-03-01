var user = require('../models/user');
var log = require('../config/logger');
var fs = require('fs');
const e = require('express');
var store = {}

store.buyStoreItem = function(playerID, itemID, result){
    fs.readFile('json/storeprices.json', function(err, storebuf){
        if(err){
            log.error({message: 'error loading store prices', Error: err, route: 'store/buyitem/', type: 'get', successResponse: false, playerid: req.playerid, source: req.socket.remoteAddress});
            result(err, false);
        } else {
            let storeprices = JSON.parse(storebuf);
            if(storeprices[itemID].TowerPoints == false){
                user.getUserScrap(playerID, function(err, pscrap){
                    if(pscrap < storeprices[itemID].Cost){
                        log.info({message: 'Not enough scrap'});
                        result("not enough scrap", false);
                    } else {
                        log.info({message: 'player has enough scrap'});
                        user.subtractScrap(playerID,storeprices[itemID].Cost, function(err, buy){
                            if(err){
                                log.info({message: 'some SQL error', error: err});
                                result(err, false);
                            } else {
                                log.info(buy);
                                user.getUserStoreData(playerID, function(err, sdata){
                                    if(err){
                                        log.info({message: 'some SQL error', error: err});
                                        result(err, false);
                                    } else {
                                        let playerStoreObject = sdata;
                                        playerStoreObject[itemID]++
                                        user.updateUserStoreData(playerID, playerStoreObject, function(err, resupt){
                                            if(err){
                                                log.info({message: 'some SQL error', error: err});
                                            } else {
                                                console.log(resupt);
                                                result(false, playerStoreObject);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                
            }
        }
    });
}

module.exports = store;