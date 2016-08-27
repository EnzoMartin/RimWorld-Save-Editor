require('./_helper');
const pawn = require('./mocks/pawn');
const factions = require('./mocks/factions');

const Utils = proxyquire('../lib/utils',{
    config:{
        Game: {
            playerFaction: 'Faction_9'
        }
    }
});


describe('invoking utils module module', () =>{
    it('should return that the pawn is a colonist', () =>{
        expect(Utils.isColonist(pawn.colonist)).toBe(true);
    });
    it('should return that the pawn is not a colonist', () =>{
        expect(Utils.isColonist(pawn.human)).toBe(false);
    });
    it('should return that the pawn is a human', () =>{
        expect(Utils.isHuman(pawn.human)).toBe(true);
    });
    it('should return that the pawn is not a human', () =>{
        expect(Utils.isHuman(pawn.centipede)).toBe(false);
    });
    it('should return that the pawn is a foreign non-human but not mechanoid', () =>{
        expect(Utils.isForeignNonhumanPawn(pawn.wolf)).toBe(true);
    });
    it('should return that the pawn is not a foreign non-human', () =>{
        expect(Utils.isForeignNonhumanPawn(pawn.centipede)).toBe(false);
    });

    it('should return that the pawn is a hostile human', () =>{
        expect(Utils.isHostileHumanPawn(pawn.human,factions)).toBe(true);
    });
    it('should return that the pawn is not a hostile human', () =>{
        expect(Utils.isHostileHumanPawn(pawn.colonist,factions)).toBe(false);
    });
    it('should return the player faction object', () =>{
        const playerFaction = Utils.getPlayerFaction(factions);
        expect(typeof playerFaction).toEqual('object');
        expect(playerFaction.loadID[0]).toEqual('9');
    });
    it('should return the enemy factions', () =>{
        const enemyFactions = Utils.getEnemyFactions(factions);
        expect(typeof enemyFactions).toEqual('object');
        expect(enemyFactions.length).toEqual(1);
        expect(enemyFactions[0].hostile[0]).toEqual('True');
    });
});
