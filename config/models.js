/* eslint no-process-env: 0 */
'use strict';
const os = require('os');
const bunyan = require('bunyan');
const pjson = require('../package.json');

const platform = os.platform();
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
const version = pjson.version;
const name = pjson.name;

// Used for proxyquire
const level = pjson.logLevel || 30;

const logger = bunyan({
    name,
    version,
    level,
    src: true,
});

var defaultPath = '';
switch(platform){
    case 'darwin':
        defaultPath = '~/Library/Application Support/RimWorld/Saves/';
        break;
    case 'linux':
        defaultPath = `${process.env.HOME}/.config/unity3d/Ludeon Studios/RimWorld/`;
        break;
    case 'win32':
        defaultPath = `C:\\Users\\${process.env.USERNAME}\\AppData\\LocalLow\\Ludeon Studios\\RimWorld\\Saves\\`;
        break;
    default:
        throw new Error(`Platform "${platform}" is not supported currently`);
}

/**
 * Game
 * @property {String} colonyFaction
 * @property {Number} colonyFactionId
 * @property {Number} skillLevel
 * @property {Array} supportedVersions
 * @property {Number} healthLevel
 * @property {String} qualityLevel
 * @property {String} saveDir
 * @property {String} saveName
 * @property {String|Boolean} saveId
 * @property {String} modifiedName
 * @property {String} modifiedNamePrefix
 * @property {Function} updateColonyFaction
 */
class Game {
    constructor(config){
        this.updateColonyFaction(config.colonyFaction || 'Faction_9');
        this.supportedVersions = pjson.supportedVersions;

        this.skillLevel = parseInt(config.skillLevel,10);
        if(isNaN(this.skillLevel) || this.skillLevel > maxSkill){
            logger.warn(`Skill level must be a number and cannot be above "${maxSkill}", setting it to "${maxSkill}" instead`);
            this.skillLevel = maxSkill;
        }

        this.healthLevel = parseInt(config.healthLevel,10);
        if(isNaN(this.healthLevel)){
            logger.warn(`Health level must be a number, setting it to "${maxHealth}" instead`);
            this.healthLevel = maxHealth;
        }

        this.qualityLevel = config.qualityLevel;
        if(qualities.indexOf(this.qualityLevel) === -1){
            logger.warn(`Specified quality does not exist, resetting to "${highestQuality}"`);
            this.qualityLevel = highestQuality;
        }

        this.saveDir = config.saveDir || defaultPath;
        this.saveName = config.saveName || 'Colony1.rws';
        this.modifiedNamePrefix = config.modifiedNamePrefix || 'Edited';
        this.modifiedName = this.modifiedNamePrefix + this.saveName;
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
            logger.warn('Ignoring world peace due to world war set to `true`');
        }

        if(this.setColonyPeace && this.setColonyWar){
            logger.warn('Ignoring colony peace due to colony war set to `true`');
        }
    }
}

/**
 * @param {QuickActions} QuickActions
 * @param {Game} Game
 * @param {String} version
 * @param {String} name
 * @param {bunyan} logger
 */
class Configuration {
    constructor(config){
        this.version = version;
        this.name = name;
        this.logger = logger;

        this.Game = new Game(config.gameConfig || {});
        this.QuickActions = new QuickActions(config.quickActionsConfig || {});
    }
}

module.exports = Configuration;
