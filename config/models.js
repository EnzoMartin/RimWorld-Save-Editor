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

/**
 * Game
 * @property {String} playerFaction
 * @property {String} playerFactionId
 * @property {String|Number} skillLevel
 * @property {String|Number} supportedVersion
 * @property {String|Number} healthLevel
 * @property {String} qualityLevel
 * @property {String} saveDir
 * @property {String} saveName
 * @property {String|Boolean} saveId
 * @property {String} modifiedName
 */
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
        this.saveId = config.saveId || false;
        this.modifiedName = (typeof config.modifiedNamePrefix === 'undefined' ? 'Edited' : config.modifiedNamePrefix) + this.saveName;
    }
}

/**
 * Quick Actions
 * @property {Boolean} woundHostilePawns
 * @property {Boolean} caravanDisaster
 * @property {Boolean} upgradeArt
 * @property {Boolean} upgradePawnSkills
 * @property {Boolean} upgradePawnEquipment
 * @property {Boolean} upgradePawnApparel
 * @property {Boolean} upgradeItems
 * @property {Boolean} setPlayerPeace
 * @property {Boolean} setPlayerWar
 * @property {Boolean} setWorldPeace
 * @property {Boolean} setWorldWar
 */
class QuickActions {
    constructor(config){
        // Events
        this.woundHostilePawns = typeof config.woundHostilePawns === 'boolean' ? config.woundHostilePawns : true;
        this.caravanDisaster = typeof config.caravanDisaster === 'boolean' ? config.caravanDisaster : true;

        // Colony
        this.upgradePawnSkills = typeof config.upgradePawnSkills === 'boolean' ? config.upgradePawnSkills : true;
        this.upgradePawnEquipment = typeof config.upgradePawnEquipment === 'boolean' ? config.upgradePawnEquipment : true;
        this.upgradePawnApparel = typeof config.upgradePawnApparel === 'boolean' ? config.upgradePawnApparel : true;

        // Things
        this.upgradeItems = typeof config.upgradeItems === 'boolean' ? config.upgradeItems : true;
        this.upgradeArt = typeof config.upgradeArt === 'boolean' ? config.upgradeArt : true;

        // Factions
        this.setPlayerPeace = config.setPlayerPeace || false;
        this.setPlayerWar = config.setPlayerWar || false;
        this.setWorldPeace = config.setWorldPeace || false;
        this.setWorldWar = config.setWorldWar || false;

        if(this.setWorldPeace && this.setWorldWar){
            console.warn('Ignoring world peace due to world war set to `true`');
        }

        if(this.setPlayerPeace && this.setPlayerWar){
            console.warn('Ignoring player peace due to player war set to `true`');
        }
    }
}

/**
 * Storage
 * @property {String} connection
 */
class Storage {
    constructor(config){
        this.connection = config.connection || process.env.STORAGE_CONNECTION;
    }
}

/**
 * @param {Storage} Storage
 * @param {QuickActions} QuickActions
 * @param {Game} Game
 */
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
        this.QuickActions = new QuickActions(config.quickActionsConfig || {});
    }
}

module.exports = {
    Configuration,
    QuickActions,
    Storage,
    Game
};
