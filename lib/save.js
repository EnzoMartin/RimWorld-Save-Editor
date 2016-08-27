const config = require('../config');
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
            supported = metaGame.gameVersion[0].indexOf(Game.supportedVersion) !== -1;
        } catch (err){
            logger.error({err},'Unable to verify version');
        }

        return supported;
    }
};
