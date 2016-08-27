const config = require('../config');
const Game = config.Game;

module.exports = {
    /**
     * Check if Pawn is a human belonging to player faction
     * @param {Object} thing
     * @returns {Boolean}
     */
    isColonist(thing){
        return (
            this.isHuman(thing)
            && thing.faction.indexOf(Game.playerFaction) !== -1
        );
    },
    /**
     * Check if pawn is a human
     * @param {Object} thing
     * @returns {Boolean}
     */
    isHuman: (thing) =>{
        return thing.def.indexOf('Human') !== -1;
    },
    /**
     * Check if pawn is a non-human of non-player faction, ignores mechanoids
     * @param {Object} thing
     * @returns {Boolean}
     */
    isForeignNonhumanPawn(thing){
        return (
            !this.isHuman(thing)
            && (
                thing.faction
                && thing.faction.indexOf(Game.playerFaction) === -1
                && thing.faction[0] !== 'Faction_2'
            )
            || !thing.faction
        );
    },
    /**
     * Check if the pawn is a human of a hostile faction
     * @param {Object} thing
     * @param {Object} factions
     * @returns {Boolean}
     */
    isHostileHumanPawn(thing,factions){
        const enemyFactions = this.getEnemyFactions(factions);
        return (
            this.isHuman(thing)
            && (
                thing.faction
                && typeof enemyFactions.find((faction) =>{
                    return faction.other[0] === thing.faction[0];
                }) === 'object'
            )
            && thing.faction[0] !== 'Faction_2'
        );
    },
    /**
     * Get the player faction
     * @param {Object} factions
     * @returns {*}
     */
    getPlayerFaction: (factions) =>{
        //TODO: Memoize this
        return factions.find((faction) =>{
            return faction.loadID && faction.loadID[0] == Game.playerFactionId;
        });
    },
    /**
     * Get the enemy factions of the player colony
     * @param {Object} factions
     * @returns {Array}
     */
    getEnemyFactions(factions){
        //TODO: Memoize this
        const playerFaction = this.getPlayerFaction(factions);
        return playerFaction.relations[0].li.filter((faction) =>{
            return faction.hostile && faction.hostile[0] === 'True';
        },[]);
    }
};
