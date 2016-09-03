const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const builder = new xml2js.Builder();

module.exports = {
    /**
     * Parse XML string to JS object
     * @param {String} file
     * @param {Function} callback
     */
    parse:(file,callback) =>{
        parser.parseString(file,(err,result) =>{
            if(err){
                callback(err);
            } else {
                callback(err,result);
            }
        });
    },
    /**
     * Compile a JS object to XML
     * @param {Object} result
     * @returns {String}
     */
    compile: (result) =>{
        return builder.buildObject(result);
    }
};
