module.exports = {
    /**
     * Set a thing's health property
     * @param {Object} thing
     * @param {Number} health
     * @returns {*}
     */
    setHealth:(thing,health) =>{
        if(thing.health){
            thing.health = health;
        }
        return thing;
    },
    /**
     * Set a thing's quality property
     * @param {Object} thing
     * @param {String} quality
     * @returns {*}
     */
    setQuality:(thing,quality) =>{
        if(thing.quality){
            thing.quality = quality;
        }
        return thing;
    }
};
