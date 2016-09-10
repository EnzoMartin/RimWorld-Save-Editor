'use strict';

const config = require('./config');

const Utils = require('./lib/utils');

// Models
const Meta = require('./models/meta');
const Game = require('./models/game');

// Modifiers
const faction = require('./modifiers/faction');
const item = require('./modifiers/item');
const pawn = require('./modifiers/pawn');
const wound = require('./modifiers/wound');

class SaveGame {
    constructor(save){
        this.meta = new Meta(save.meta);
        this.game = new Game(save.game);
    };
}

function verify(save){
    let err = null;

    if(!Meta.isSupported(save)){
        err = new Error(`Game version "${Meta.extractVersion(save)}" is not supported`);
    }

    return err;
}

module.exports = {
    fromObject(save,callback){
        const err = verify(save);
        let construct = null;

        if(!err){
            construct = new SaveGame(save);
        }

        callback(err,construct);
    }
};

// Temp
const testFile = require('./temp/test.js');
const save = module.exports.fromObject(testFile.savegame,(err,item) =>{
    if(err){
        console.error(err);
    } else {
        console.log(Object.keys(item.game.map));
    }
});
