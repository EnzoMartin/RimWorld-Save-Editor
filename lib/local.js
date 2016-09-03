const fs = require('fs');
const config = require('../config');

module.exports = {
    /**
     * Read file
     * @param {String} path
     * @param {Function} callback
     */
    get: (path, callback) =>{
        fs.readFile(path,{encoding:'utf8'},callback);
    },
    /**
     * Save to file
     * @param {String} path
     * @param {String} contents
     * @param {Function} callback
     */
    save:(path, contents, callback) =>{
        fs.writeFile(path,contents,callback);
    }
};
