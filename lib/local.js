const fs = require('fs');
const config = require('../config');
const logger = config.logger.child({file:__filename});

module.exports = {
    /**
     * Read file
     * @param {String} savePath
     * @param {Function} callback
     */
    get: (savePath, callback) =>{
        logger.info(`Accessing local file "${savePath}"`);
        fs.readFile(savePath,callback);
    },
    /**
     * Save to file
     * @param {String} savePath
     * @param {String} contents
     * @param {Function} callback
     */
    save:(savePath, contents, callback) =>{
        logger.info(`Saving local file "${savePath}"`);
        fs.writeFile(savePath,contents,callback);
    }
};
