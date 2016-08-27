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
     */
    setApparelHealth:(thing,health) =>{
        if(thing.apparel && thing.apparel[0].wornApparel && thing.apparel[0].wornApparel[0].li){
            const apparel = thing.apparel[0].wornApparel[0].li;
            thing.apparel[0].wornApparel[0].li = apparel.map((item) =>{
                return Item.setHealth(item,health);
            });
        }
    },
    /**
     * Set apparel thing's quality
     * @param {Object} thing
     * @param {String} quality
     */
    setApparelQuality:(thing,quality) =>{
        if(thing.apparel && thing.apparel[0].wornApparel && thing.apparel[0].wornApparel[0].li){
            const apparel = thing.apparel[0].wornApparel[0].li;
            thing.apparel[0].wornApparel[0].li = apparel.map((item) =>{
                return Item.setQuality(item,quality);
            });
        }
    },
    /**
     * Set equipment thing's health
     * @param {Object} thing
     * @param {Number} health
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
    },
    /**
     * Set equipment thing's quality
     * @param {Object} thing
     * @param {String} quality
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
    },
    /**
     * Set pawn's faction affiliation
     * @param {Object} thing
     * @param {String} faction
     * @returns {*}
     */
    setFaction:(thing,faction) =>{
        if(thing.faction){
            thing.faction[0] = faction;
        }
        return thing;
    },
    /**
     * Return pawn's faction ID
     * @param {Object} thing
     * @returns {Number}
     */
    getFaction:(thing) =>{
        let faction = 0;
        if(thing.faction){
            const arr = thing.faction.split('_');
            faction = arr[arr.length - 1];
        }
        return faction;
    }
};
