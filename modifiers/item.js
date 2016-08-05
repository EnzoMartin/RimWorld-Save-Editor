/**
 * Set a thing' quality and health properties
 * @param {Object} thing
 * @param {Number|Boolean} health
 * @param {String|Boolean} quality
 * @returns {*}
 */
module.exports = (thing,health,quality) =>{
    if(health !== false && thing.health){
        thing.health = [health];
    }

    if(quality !== false && thing.quality){
        thing.quality = [quality];
    }

    return thing;
};
