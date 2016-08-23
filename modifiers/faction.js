module.exports = {
    /**
     * Set the goodwill towards a faction
     * @param {String} other
     * @param {Number} goodwill
     * @param {Boolean} [hostile]
     * @returns {{other: *, goodwill: *}}
     */
    relation: (other,goodwill,hostile) =>{
        hostile = hostile || goodwill < -79;

        const relation = {
            other,
            goodwill
        };

        if(hostile){
            relation.hostile = hostile;
        }

        return relation;
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
