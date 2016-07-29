const Models = require('./models');

// Environment specific configs
var configs = {
    development:{
        env:'development',
        port:3000,
        isDev:true,
        isProd:false
    },
    test:{
        env:'test',
        isDev:false,
        isProd:false,
        port:process.env.PORT || 8000
    },
    staging:{
        env:'staging',
        isDev:false,
        isProd:true
    },
    production:{
        env:'production',
        isDev:false,
        isProd:true,
        port:process.env.PORT || 80
    }
};

/**
 * Load up config for specified environment
 * @param {string} environment
 * @returns {Configuration}
 */
module.exports.initialize = (environment) => {
    console.log('Initializing config for environment "' + environment + '"');
    var config = configs[environment];

    if (!config) {
        throw new Error('No "' + environment + '" environment configuration exists');
    }

    if (config.isDev) {
        // Load the config overrides for development environment
        try {
            config = Object.assign(config,require('./local'));
        } catch (err) {
            // Ignore
        }
    }

    const configuration = new Models.Configuration(config);

    module.exports = configuration;
    return configuration;
};
