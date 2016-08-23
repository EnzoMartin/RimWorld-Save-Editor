/* eslint no-process-env: 0 global-require: 0*/
const Models = require('./config/models');
const bunyan = require('bunyan');

// Environment specific configs
var configs = {
    development:{
        port:3000,
        isDev:true,
        isProd:false
    },
    test:{
        isDev:false,
        isProd:false,
        port:process.env.PORT || 8000
    },
    staging:{
        useStorage: true,
        isDev:false,
        isProd:true
    },
    production:{
        useStorage: true,
        isDev:false,
        isProd:true,
        port:process.env.PORT || 80
    }
};

/**
 * Load up config for specified environment
 * @returns {Configuration}
 * @returns {Configuration.logger}
 */
const initialize = () =>{
    const environment = process.env.SERVER_ENV || process.env.NODE_ENV || 'development';
    var config = configs[environment];

    if(!config){
        throw new Error('No "' + environment + '" environment configuration exists');
    }

    if(config.isDev){
        // Load the config overrides for development environment
        try {
            config = Object.assign(config,require('./config/local'));
        } catch (err){
            // Ignore
        }
    }

    config.env = environment;
    const configuration = new Models.Configuration(config);

    configuration.logger = bunyan({
        name: configuration.name,
        environment: config.env,
        ip: config.ip,
        src: config.isDev,
        version: configuration.version,
        streams: config.isDev ? '' : [
            {
                level:'info',
                stream:process.stdout
            },
            {
                level:'error',
                stream:process.stderr
            }
        ]
    });

    configuration.logger.info(`Initialized config for environment "${environment}"`);

    module.exports = configuration;
    return configuration;
};

module.exports = initialize();
