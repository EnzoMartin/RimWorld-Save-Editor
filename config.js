/* eslint-disable global-require */
const Configuration = require('./config/models');

/**
 * Load up config
 * @returns {Configuration}
 */
const initialize = () =>{
    let localConfig = {};
    try {
        localConfig = require('./config/local');
    } catch (err){
        // Nothing
    }

    const config = Object.assign(localConfig,{});
    const configuration = new Configuration(config);

    module.exports = configuration;
    return configuration;
};

module.exports = initialize();
