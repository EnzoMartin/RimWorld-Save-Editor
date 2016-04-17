'use strict';

const pjson = require('../package.json');
const os = require('os');
const networks = os.networkInterfaces();
const path = require('path');
const rootPath = path.normalize(path.join(__dirname,'/..'));

// Find the current IP
console.log('Checking machine IP');
var ip = '127.0.0.1';
for (var name in networks) {
    if (networks.hasOwnProperty(name)) {
        var network = networks[name];
        var i = 0;
        var len = network.length;
    
        while (i < len) {
            var adapter = network[i];
            if (adapter.family === 'IPv4' && adapter.internal === false) {
                ip = adapter.address;
                break;
            }
            i++;
        }
    
        if (ip !== '127.0.0.1') {
            break;
        }
    }
}

class Game {
    constructor(config) {
        this.playerFaction = config.playerFaction || 'Faction_9';
        this.skillLevel = typeof config.skillLevel !== 'undefined' ? config.skillLevel : 20;
        
        if(this.skillLevel > 20){
            console.warn('Skill level cannot be above 20, setting it to 20 instead');
            this.skillLevel = 20;
        }
        
        //TODO: Read item health definitions?
        this.healthLevel = typeof config.healthLevel !== 'undefined' ? config.healthLevel : 100;
        this.qualityLevel = config.qualityLevel || 'Superior';
        
        // TODO: Read from game config file, prompt user for save location, check if running inside the game folder
        this.saveDir = config.saveDir;
        
        //TODO: Prompt user for save to open
        this.saveName = config.saveName;
        this.modifiedName = (typeof config.modifiedNamePrefix === 'undefined' ? 'Edited' : config.modifiedNamePrefix) + this.saveName;
    }
}

class Configuration {
    setBaseConfig(config) {
        this.root = config.rootPath || rootPath;
        this.version = config.version || pjson.version;
        this.ip = config.ip || ip;
        this.env = config.env || 'development';
        this.port = config.port || process.env.PORT || 3000;
        this.isDev = typeof config.isDev === 'boolean' ? config.isDev : true;
        this.isProd = typeof config.isProd === 'boolean' ? config.isProd : false;
    }

    constructor(config) {
        this.setBaseConfig(config);
        
        if(typeof config.gameConfig !== 'object'){
            throw new Error('You need to specify the game config, check the example.local.js file or the README for instructions');
        } else if(!config.gameConfig.saveName || !config.gameConfig.saveDir) {
            throw new Error('You need to specify the save file and directory, check the example.local.js file or the README for instructions');
        }
        
        this.Game = new Game(config.gameConfig);
    }
}

module.exports = {
    Configuration,
    Game
};
