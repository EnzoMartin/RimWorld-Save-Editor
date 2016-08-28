const Item = require('./item');

module.exports = {
    /**
     * Set skills of a pawn
     * @param {Object} thing
     * @param {Number} level
     * @returns {Object}
     */
    setSkills:(thing,level) =>{
        if(thing.skills && thing.skills[0].skills){
            const skills = thing.skills[0].skills[0].li;

            thing.skills[0].skills[0].li = skills.map((item) =>{
                item.level = [level];
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
        if(thing.apparel && thing.apparel[0].wornApparel && thing.apparel[0].wornApparel[0].li){
            const apparel = thing.apparel[0].wornApparel[0].li;
            thing.apparel[0].wornApparel[0].li = apparel.map((item) =>{
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
        if(thing.apparel && thing.apparel[0].wornApparel && thing.apparel[0].wornApparel[0].li){
            const apparel = thing.apparel[0].wornApparel[0].li;
            thing.apparel[0].wornApparel[0].li = apparel.map((item) =>{
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
        if(thing.equipment && thing.equipment[0] && thing.equipment[0].primary){
            const equipment = thing.equipment[0].primary;
            thing.equipment[0].primary = equipment.map((item) =>{
                if(!item.$){
                    item = Item.setHealth(item,health);
                }
                return item;
            });
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
        if(thing.equipment && thing.equipment[0] && thing.equipment[0].primary){
            const equipment = thing.equipment[0].primary;
            thing.equipment[0].primary = equipment.map((item) =>{
                if(!item.$){
                    item = Item.setQuality(item,quality);
                }
                return item;
            });
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
        thing.faction = [typeof faction === 'number' ? 'Faction_' + faction : faction];
        return thing;
    },
    /**
     * Return pawn's faction
     * @param {Object} thing
     * @returns {String}
     */
    getFaction:(thing) =>{
        return thing.faction ? thing.faction[0] : 'Faction_0';
    },
    /**
     * Return pawn's faction ID
     * @param {Object} thing
     * @returns {Number}
     */
    getFactionId:(thing) =>{
        let faction = 0;
        if(thing.faction){
            const arr = thing.faction[0].split('_');
            faction = arr[arr.length - 1];
        }
        return faction;
    }
};
