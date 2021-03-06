/**
 * Create a relation object
 * @param {String} targetFaction
 * @param {Number} goodwill
 * @param {Boolean} [hostile]
 * @returns {{other: *[], goodwill: *[]}}
 */
function createRelation(targetFaction,goodwill,hostile){
    hostile = hostile || goodwill < -79;

    const relation = {
        other: targetFaction,
        goodwill
    };

    if(hostile){
        relation.hostile = true;
    }

    return relation;
}

module.exports = {
    /**
     * Set the goodwill of a faction towards another faction
     * @param {Object} faction
     * @param {Number|String} targetFactionId
     * @param {Number} goodwill
     * @param {Boolean} [hostile]
     * @returns {*}
     */
    setOtherRelation: (faction,targetFactionId,goodwill,hostile) =>{
        const targetFaction = isNaN(parseInt(targetFactionId,10)) ? targetFactionId : 'Faction_' + targetFactionId;
        const factionIndex = faction.relations.li.findIndex((relation) =>{
            return relation.other === targetFaction;
        });

        if(factionIndex !== -1){
            faction.relations.li[factionIndex] = createRelation(targetFaction,goodwill,hostile);
        }

        return faction;
    },
    /**
     * Set a faction's relations towards other
     * @param {Object} faction
     * @param {Number} goodwill
     * @param {Boolean} [hostile]
     * @returns {*}
     */
    setSelfRelations(faction,goodwill,hostile){
        faction.relations.li = faction.relations.li.map((relation) =>{
            return createRelation(relation.other,goodwill,hostile);
        });

        return faction;
    },
    /**
     * Set relations for a given faction across all other factions
     * @param {Object} factions
     * @param {Number} targetFactionId
     * @param {Number} goodwill
     * @param {Boolean} [hostile]
     * @returns {*}
     */
    setRelations(factions,targetFactionId,goodwill,hostile){
        return factions.map((faction) =>{
            return this.setOtherRelation(faction,targetFactionId,goodwill,hostile);
        });
    },
    /**
     * Clears a faction's tactical memory from previous visits to the colony
     * @param {Object} faction
     * @returns {Object}
     */
    clearTacticalMemory: (faction) =>{
        faction.tacticalMemory = {
            traps:[]
        };

        return faction;
    }
};
