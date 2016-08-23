const azure = require('azure-storage');
const config = require('../config');
const logger = config.logger.child({file:__filename});

const Blob = config.useStorage ? azure.createBlobService(config.Storage.connection) : {};

if(config.useStorage){
    logger.info(`Using storage container "${config.Storage.container}"`);
}

module.exports = {
    /**
     * Get a blob from storage
     * @param {String} id
     * @param {Function} callback
     */
    get: (id,callback) =>{
        logger.info(`Accessing stored file "${id}"`);
        Blob.getBlobToText(config.Storage.container,id,(err,result) =>{
            callback(err,result);
        });
    }
};
