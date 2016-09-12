const semver = require('semver');
const config = require('../config');

class Meta {
    constructor(items){
        Object.keys(items).forEach((key) =>{
            const item = items[key];
            switch(key){
                case 'modIds':
                case 'modNames':
                    const li = item.li;
                    this[key] = typeof li === 'string' ? [li] : li;
                    break;
                default:
                    this[key] = item;
                    break;
            }
        });
    }

    /**
     * Check whether the save file provided is supported
     * @param {Object} save
     * @returns {Boolean}
     */
    static isSupported(save){
        let supported = false;
        try {
            // Get the major and minor version of the save game
            const saveVersion = save.meta.gameVersion.split(' ')[0];
            supported = config.supportedVersions.findIndex((version) =>{
                return semver.satisfies(saveVersion,version);
            }) !== -1;
        } catch (err){
            // Nothing
        }

        return supported;
    }

    /**
     * Return the save file version
     * @param {Object} save
     * @returns {String}
     */
    static extractVersion(save){
        let version = '0.0.0';
        try {
            version = save.meta.gameVersion;
        } catch (e){
            // Nothing
        }
        return version;
    }
}

module.exports = Meta;
