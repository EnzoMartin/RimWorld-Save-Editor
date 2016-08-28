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
        const enemyFactions = this.getEnemyFactionNames(factions);
        return (
            this.isHuman(thing)
            && (
                thing.faction
                && enemyFactions.indexOf(thing.faction[0]) !== -1
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
     * Get the enemy faction names of the player colony
     * @param {Object} factions
     * @returns {Array}
     */
    getEnemyFactionNames(factions){
        //TODO: Memoize this
        const playerFaction = this.getPlayerFaction(factions);
        return playerFaction.relations[0].li.reduce((factions,faction) =>{
            if(faction.hostile && faction.hostile[0] === 'True'){
                factions.push(faction.other[0]);
            }
            return factions;
        },[]);
    },
    /**
     * Get the enemy faction IDs of the player colony
     * @param {Object} factions
     * @returns {Array}
     */
    getEnemyFactionIds(factions){
        const enemyFactionNames = this.getEnemyFactionNames(factions);
        return enemyFactionNames.map((name) =>{
            return parseInt(name.replace('Faction_',''),10);
        });
    },
    /**
     * Get the enemy factions of the player colony
     * @param {Object} factions
     * @returns {Array}
     */
    getEnemyFactions(factions){
        //TODO: Memoize this
        const enemyFactionIds = this.getEnemyFactionIds(factions);
        return factions.reduce((factions,faction) =>{
            const id = parseInt(faction.loadID && faction.loadID[0],10) || 0;
            if(enemyFactionIds.indexOf(id) !== -1){
                factions.push(faction);
            }
            return factions;
        },[]);
    }
};
