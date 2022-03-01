var user = require('../models/user');
var log = require('../config/logger');
var rnjesusweighted = require('random-weighted-choice');
var fs = require('fs');
var rnjesus = {}

rnjesus.getRandomModule = function(result) {
    fs.readFile('json/modulerandomdata.json', function(err, data){
        if(err){
            result(err, false);
        } else {
            let table = JSON.parse(data);
            let newModule = rnjesusweighted(table);
            result(false, newModule);
        }
    });
}

module.exports = rnjesus;
