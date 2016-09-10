const pjson = require('./package.json');

/**
 * @property {String} colonyFaction
 * @property {Number} colonyFactionId
 * @property {Array} supportedVersions
 * @property {Function} updateColonyFaction
 */
class Configuration {
    constructor(config){
        this.updateColonyFaction(config.colonyFaction || 'Faction_9');
        this.supportedVersions = pjson.supportedVersions;
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
 * Load up config
 * @returns {Configuration}
 */
const initialize = () =>{
    const configuration = new Configuration({});

    module.exports = configuration;
    return configuration;
};

module.exports = initialize();
