/* eslint no-process-env: 0 */
'use strict';

const pjson = require('../package.json');
const os = require('os');
const networks = os.networkInterfaces();

// Find the current IP
var ip = '127.0.0.1';
for(var name in networks){
    if(networks.hasOwnProperty(name)){
        var network = networks[name];
        var i = 0;
        var len = network.length;

        while(i < len){
            var adapter = network[i];
            if(adapter.family === 'IPv4' && adapter.internal === false){
                ip = adapter.address;
                break;
            }
            i++;
        }

        if(ip !== '127.0.0.1'){
            break;
        }
    }
}

class Game {
    constructor(config){
        this.playerFaction = config.playerFaction || 'Faction_9';
        this.playerFactionId = this.playerFaction.split('_')[1];
        this.skillLevel = typeof config.skillLevel === 'undefined' ? 20 : config.skillLevel;
        this.supportedVersion = pjson.engines.game;

        if(this.skillLevel > 20){
            console.warn('Skill level cannot be above 20, setting it to 20 instead');
            this.skillLevel = 20;
        }

        //TODO: Read item health definitions?
        this.healthLevel = typeof config.healthLevel === 'undefined' ? 1000 : config.healthLevel;
        this.qualityLevel = config.qualityLevel || 'Masterwork';

        // TODO: Read from game config file, prompt user for save location, check if running inside the game folder
        this.saveDir = config.saveDir;

        //TODO: Prompt user for save to open
        this.saveName = config.saveName;
        this.modifiedName = (typeof config.modifiedNamePrefix === 'undefined' ? 'Edited' : config.modifiedNamePrefix) + this.saveName;

        // Used for storage retrieval
        this.saveId = config.saveId || false;
    }
}

class Storage {
    constructor(config){
        this.container = config.container || 'saves';
        this.connection = config.connection || process.env.STORAGE_CONNECTION;
    }
}

class Configuration {
    setBaseConfig(config){
        this.version = pjson.version;
        this.name = pjson.name;
        this.ip = ip;
        this.env = config.env;
        this.port = config.port || process.env.PORT || 3000;
        this.isDev = typeof config.isDev === 'boolean' ? config.isDev : true;
        this.isProd = typeof config.isProd === 'boolean' ? config.isProd : false;
        this.useStorage = typeof config.useStorage === 'boolean' ? config.useStorage : false;
    }

    constructor(config){
        this.setBaseConfig(config);
        this.Storage = false;

        if(this.useStorage){
            this.Storage = new Storage(config.storageConfig);
            if(!this.Storage.connection){
                throw new Error('You need to specify the storage medium config');
            }
        } else {
            if(typeof config.gameConfig !== 'object'){
                throw new Error('You need to specify the game config, check the example.local.js file or the README for instructions');
            } else if(!config.gameConfig.saveName || !config.gameConfig.saveDir){
                throw new Error('You need to specify the save file and directory, check the example.local.js file or the README for instructions');
            }
        }

        this.Game = new Game(config.gameConfig);
    }
}

module.exports = {
    Configuration,
    Storage,
    Game
};
