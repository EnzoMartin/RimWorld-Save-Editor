/* eslint no-process-env: 0 global-require: 0*/
const Configuration = require('./config/models');
const bunyan = require('bunyan');

/**
 * Load up config
 * @returns {Configuration}
 * @returns {Configuration.logger}
 */
const initialize = () =>{
    let config = {};

    try {
        config = Object.assign(config,require('./config/local'));
    } catch (err){
        if(err.code !== 'MODULE_NOT_FOUND'){
            throw err;
        }
    }

    const configuration = new Configuration(config);

    configuration.logger = bunyan({
        name: configuration.name,
        src: true,
        version: configuration.version
    });

    module.exports = configuration;
    return configuration;
};

module.exports = initialize();
