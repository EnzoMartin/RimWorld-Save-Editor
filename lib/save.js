const config = require('../config');
const semver = require('semver');
const logger = config.logger.child({file:__filename});

const Game = config.Game;

module.exports = {
    /**
     * Check if the save file version is supported
     * @param {Object} metaGame
     * @returns {boolean}
     */
    isSupported:(metaGame) =>{
        let supported = false;
        try {
            // Get the major and minor version of the save game
            const saveVersion = metaGame.gameVersion.split(' ')[0];
            supported = Game.supportedVersions.findIndex((version) =>{
                return semver.satisfies(saveVersion,version);
            }) !== -1;
        } catch (err){
            logger.error({err},'Unable to verify version');
        }

        return supported;
    }
};
