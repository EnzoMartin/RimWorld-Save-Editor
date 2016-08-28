/* eslint no-process-env: 0 */
'use strict';

const pjson = require('../package.json');
const os = require('os');
const networks = os.networkInterfaces();

const qualities = [
    'Awful',
    'Shoddy',
    'Poor',
    'Normal',
    'Good',
    'Superior',
    'Excellent',
    'Masterwork',
    'Legendary'
];
const highestQuality = qualities[qualities.length - 1];
const maxSkill = 20;
const maxHealth = 1000;

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
 * @property {String} colonyFaction
 * @property {Number} colonyFactionId
 * @property {Number} skillLevel
 * @property {String|Number} supportedVersion
 * @property {Number} healthLevel
 * @property {String} qualityLevel
 * @property {String} saveDir
 * @property {String} saveName
 * @property {String|Boolean} saveId
 * @property {String} modifiedName
 * @property {Function} updateColonyFaction
 */
class Game {
    constructor(config){
        this.updateColonyFaction(config.colonyFaction || 'Faction_9');
        this.supportedVersion = pjson.engines.game;

        this.skillLevel = parseInt(config.skillLevel,10);
        if(isNaN(this.skillLevel) || this.skillLevel > maxSkill){
            console.warn(`Skill level must be a number and cannot be above "${maxSkill}", setting it to "${maxSkill}" instead`);
            this.skillLevel = maxSkill;
        }

        this.healthLevel = parseInt(config.healthLevel,10);
        if(isNaN(this.healthLevel)){
            console.warn(`Health level must be a number, setting it to "${maxHealth}" instead`);
            this.healthLevel = maxHealth;
        }

        this.qualityLevel = config.qualityLevel;
        if(qualities.indexOf(this.qualityLevel) === -1){
            console.warn(`Specified quality does not exist, resetting to "${highestQuality}"`);
            this.qualityLevel = highestQuality;
        }

        this.saveDir = config.saveDir || process.env.LOCALAPPDATA + '\\..\\LocalLow\\Ludeon Studios\\RimWorld\\Saves\\';
        this.saveName = config.saveName || 'Colony1.rws';
        this.modifiedName = (typeof config.modifiedNamePrefix === 'undefined' ? 'Edited' : config.modifiedNamePrefix) + this.saveName;

        // Only used with Storage
        this.saveId = config.saveId || false;
    }

    /**
     * Update the colony faction name/id
     * @param {String} name Example: Faction_9
     */
    updateColonyFaction(name){
        this.colonyFaction = name;
        this.colonyFactionId = parseInt(this.colonyFaction.split('_')[1],10);
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
 * @property {Boolean} setColonyPeace
 * @property {Boolean} setColonyWar
 * @property {Boolean} setWorldPeace
 * @property {Boolean} setWorldWar
 */
class QuickActions {
    constructor(config){
        // Events
        this.woundHostilePawns = typeof config.woundHostilePawns === 'boolean' ? config.woundHostilePawns : true;
        this.caravanDisaster = config.caravanDisaster || false;

        // Colony
        this.upgradePawnSkills = typeof config.upgradePawnSkills === 'boolean' ? config.upgradePawnSkills : true;
        this.upgradePawnEquipment = typeof config.upgradePawnEquipment === 'boolean' ? config.upgradePawnEquipment : true;
        this.upgradePawnApparel = typeof config.upgradePawnApparel === 'boolean' ? config.upgradePawnApparel : true;

        // Things
        this.upgradeItems = typeof config.upgradeItems === 'boolean' ? config.upgradeItems : true;
        this.upgradeArt = typeof config.upgradeArt === 'boolean' ? config.upgradeArt : true;

        // Factions
        this.setColonyPeace = config.setColonyPeace || false;
        this.setColonyWar = config.setColonyWar || false;
        this.setWorldPeace = config.setWorldPeace || false;
        this.setWorldWar = config.setWorldWar || false;

        if(this.setWorldPeace && this.setWorldWar){
            console.warn('Ignoring world peace due to world war set to `true`');
        }

        if(this.setColonyPeace && this.setColonyWar){
            console.warn('Ignoring colony peace due to colony war set to `true`');
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
        this.isTest = config.isTest || false;
        this.isProd = typeof config.isProd === 'boolean' ? config.isProd : false;
        this.useStorage = typeof config.useStorage === 'boolean' ? config.useStorage : false;
    }

    constructor(config){
        this.setBaseConfig(config);
        this.Storage = false;

        // TODO: Support CLI/API usage
        if(this.useStorage){
            this.Storage = new Storage(config.storageConfig);
            if(!this.Storage.connection){
                throw new Error('You need to specify the storage medium config');
            }
        }

        this.Game = new Game(config.gameConfig || {});
        this.QuickActions = new QuickActions(config.quickActionsConfig || {});
    }
}

module.exports = {
    Configuration,
    QuickActions,
    Storage,
    Game
};
