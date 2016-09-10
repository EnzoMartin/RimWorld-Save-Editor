const Item = require('./item');

module.exports = {
    /**
     * Set skills of a pawn
     * @param {Object} thing
     * @param {Number} level
     * @returns {Object}
     */
    setSkills:(thing,level) =>{
        if(thing.skills && thing.skills.skills){
            const skills = thing.skills.skills.li;

            thing.skills.skills.li = skills.map((item) =>{
                item.level = level;
                delete item.xpSinceLastLevel;

                return item;
            });
        }
        return thing;
    },
    /**
     * Set apparel thing's health
     * @param {Object} thing
     * @param {Number} health
     * @returns {Object}
     */
    setApparelHealth:(thing,health) =>{
        if(thing.apparel && thing.apparel.wornApparel && thing.apparel.wornApparel.li){
            const apparel = thing.apparel.wornApparel.li;
            thing.apparel.wornApparel.li = apparel.map((item) =>{
                return Item.setHealth(item,health);
            });
        }
        return thing;
    },
    /**
     * Set apparel thing's quality
     * @param {Object} thing
     * @param {String} quality
     * @returns {Object}
     */
    setApparelQuality:(thing,quality) =>{
        if(thing.apparel && thing.apparel.wornApparel && thing.apparel.wornApparel.li){
            const apparel = thing.apparel.wornApparel.li;
            thing.apparel.wornApparel.li = apparel.map((item) =>{
                return Item.setQuality(item,quality);
            });
        }
        return thing;
    },
    /**
     * Set equipment thing's health
     * @param {Object} thing
     * @param {Number} health
     * @returns {Object}
     */
    setEquipmentHealth:(thing,health) =>{
        if(thing.equipment && thing.equipment && thing.equipment.primary){
            const equipment = thing.equipment.primary;
            if(!equipment.$){
                thing.equipment.primary = Item.setHealth(equipment,health);
            }
        }
        return thing;
    },
    /**
     * Set equipment thing's quality
     * @param {Object} thing
     * @param {String} quality
     * @returns {Object}
     */
    setEquipmentQuality:(thing,quality) =>{
        if(thing.equipment && thing.equipment && thing.equipment.primary){
            const equipment = thing.equipment.primary;
            if(!equipment.$){
                thing.equipment.primary = Item.setQuality(equipment,quality);
            }
        }
        return thing;
    },
    /**
     * Set pawn's faction affiliation
     * @param {Object} thing
     * @param {String|Number} faction Accepts either an ID or a string like Faction_0
     * @returns {Object}
     */
    setFaction:(thing,faction) =>{
        thing.faction = typeof faction === 'number' ? 'Faction_' + faction : faction;
        return thing;
    },
    /**
     * Return pawn's faction
     * @param {Object} thing
     * @returns {String}
     */
    getFaction:(thing) =>{
        return thing.faction ? thing.faction : 'Faction_0';
    },
    /**
     * Return pawn's faction ID
     * @param {Object} thing
     * @returns {Number}
     */
    getFactionId:(thing) =>{
        let faction = 0;
        if(thing.faction){
            const arr = thing.faction.split('_');
            faction = arr[arr.length - 1];
        }
        return faction;
    }
};
