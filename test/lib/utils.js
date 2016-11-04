require('../_helper');
const pawn = require('../mocks/pawns');

const Utils = proxyquire('../lib/utils',{
    '../config':{
        colonyFaction:'Faction_9',
        colonyFactionId:9,
        '@noCallThru': true
    }
});

const game = {
    scenario: [{
        playerFaction: [{
            factionDef: ['PlayerColony']
        }]
    }],
    world: [{
        factionManager: [{
            allFactions: [{
                li: [{
                    def: ['Outlander'],
                    loadID: [1]
                },{
                    def: ['PlayerColony'],
                    loadID: [2]
                }]
            }]
        }]
    }]
};

proxyquire.noPreserveCache();
const factions = proxyquire('./mocks/factions',{});

describe('invoking utils module module', () => {
    after(() => {
        proxyquire.preserveCache();
    });

    it('should return that the pawn is a colonist', () => {
        expect(Utils.isColonist(pawn.colonist)).toBe(true);
    });

    it('should return that the pawn is not a colonist', () => {
        expect(Utils.isColonist(pawn.human)).toBe(false);
    });

    it('should return that the pawn is a human', () => {
        expect(Utils.isHuman(pawn.human)).toBe(true);
    });

    it('should return that the pawn is not a human', () => {
        expect(Utils.isHuman(pawn.centipede)).toBe(false);
    });

    it('should return that the pawn is a foreign non-human but not mechanoid', () => {
        expect(Utils.isForeignNonhumanPawn(pawn.wolf)).toBe(true);
    });

    it('should return that the pawn is not a foreign non-human', () => {
        expect(Utils.isForeignNonhumanPawn(pawn.centipede)).toBe(false);
    });

    it('should return that the pawn is a hostile human', () => {
        expect(Utils.isHostileHumanPawn(pawn.human,factions)).toBe(true);
    });

    it('should return that the pawn is not a hostile human', () => {
        expect(Utils.isHostileHumanPawn(pawn.colonist,factions)).toBe(false);
    });

    it('should return the colony faction object', () => {
        const colonyFaction = Utils.getColonyFaction(factions);
        expect(typeof colonyFaction).toEqual('object');
        expect(colonyFaction.loadID[0]).toEqual('9');
    });

    it('should return the enemy factions', () => {
        const enemyFactions = Utils.getEnemyFactions(factions);
        expect(typeof enemyFactions).toEqual('object');
        expect(enemyFactions.length).toBeGreaterThan(0);
        expect(typeof enemyFactions[0]).toEqual('object');
    });

    it('should return the enemy faction names', () => {
        const enemyFactions = Utils.getEnemyFactionNames(factions);
        expect(typeof enemyFactions).toEqual('object');
        expect(enemyFactions.length).toBeGreaterThan(0);
        expect(typeof enemyFactions[0]).toEqual('string');
    });

    it('should return the enemy faction IDs', () => {
        const enemyFactions = Utils.getEnemyFactionIds(factions);
        expect(typeof enemyFactions).toEqual('object');
        expect(enemyFactions.length).toBeGreaterThan(0);
        expect(typeof enemyFactions[0]).toEqual('number');
    });

    it('should return the player faction', () => {
        const faction = Utils.findPlayerColony(game);
        expect(typeof faction).toEqual('string');
        expect(faction).toEqual('Faction_2');
    });

    it('should throw an error if the player faction doesn\'t exist', () => {
        expect(function (){
            Utils.findPlayerColony();
        }).toThrow(/Unable to find player colony/);
    });
});
