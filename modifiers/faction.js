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
        const targetFaction = typeof targetFactionId === 'number' ? 'Faction_' + targetFactionId : targetFactionId;
        const factionIndex = faction.relations[0].li.findIndex((relation) =>{
            return relation.other[0] === targetFaction;
        });

        if(factionIndex !== -1){
            hostile = hostile || goodwill < -79;

            const relation = {
                other: [targetFaction],
                goodwill: [goodwill]
            };

            if(hostile){
                relation.hostile = 'True';
            }

            faction.relations[0].li[factionIndex] = relation;
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
        faction.relations[0].li = faction.relations[0].li.map((relation) =>{
            return this.setOtherRelation(faction,relation.other[0],goodwill,hostile);
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
     * Remove a faction's memory of traps from previous visits to the colony
     * @returns {{traps: Array}}
     */
    eraseMemory: () =>{
        return {
            traps: []
        };
    }
};
