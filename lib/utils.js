const config = require('../config');
const Game = config.Game;
const logger = config.logger.child({file:__filename});

module.exports = {
    /**
     * Check if Pawn is a human belonging to colony faction
     * @param {Object} thing
     * @returns {Boolean}
     */
    isColonist(thing){
        return (
            this.isHuman(thing)
            && thing.faction.indexOf(Game.colonyFaction) !== -1
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
     * Check if pawn is a non-human of non-colony faction, ignores mechanoids
     * @param {Object} thing
     * @returns {Boolean}
     */
    isForeignNonhumanPawn(thing){
        return (
            !this.isHuman(thing)
            && (
                thing.faction
                && thing.faction.indexOf(Game.colonyFaction) === -1
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
     * Get the colony faction
     * @param {Object} factions
     * @returns {*}
     */
    getColonyFaction: (factions) =>{
        //TODO: Memoize this
        return factions.find((faction) =>{
            return faction.loadID && faction.loadID[0] == Game.colonyFactionId;
        });
    },
    /**
     * Get the enemy faction names of the colony colony
     * @param {Object} factions
     * @returns {Array}
     */
    getEnemyFactionNames(factions){
        //TODO: Memoize this
        const colonyFaction = this.getColonyFaction(factions);
        return colonyFaction.relations[0].li.reduce((factions,faction) =>{
            if(faction.hostile && faction.hostile[0] === 'True'){
                factions.push(faction.other[0]);
            }
            return factions;
        },[]);
    },
    /**
     * Get the enemy faction IDs of the colony
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
     * Get the enemy factions of the colony
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
    },
    findPlayerColony:(game) =>{
        let faction = '';
        try {
            const def = game.scenario[0].playerFaction[0].factionDef[0];
            faction = 'Faction_' + game.world[0].factionManager[0].allFactions[0].li.find((faction) =>{
                return faction.def[0] === def;
            }).loadID[0];
        } catch (err){
            throw new Error(err);
        }

        return faction;
    }
};
