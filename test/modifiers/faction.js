require('../_helper');
proxyquire.noPreserveCache();
const factions = proxyquire('./mocks/factions',{});
const Faction = require('../../modifiers/faction');


const otherFaction = factions[0];
const playerFaction = factions[1];
const otherFactionId = otherFaction.loadID[0];
const playerFactionId = playerFaction.loadID[0];

describe('invoking faction modifier',() =>{
    after(() =>{
        proxyquire.preserveCache();
    });

    it('modifies the relations of a faction towards another faction', () =>{
        expect(otherFaction.relations[0].li[0].hostile[0]).toEqual('True');
        expect(otherFaction.relations[0].li[0].goodwill[0]).toEqual('-100');
        const modified = Faction.setOtherRelation(otherFaction,playerFactionId,100,false);
        expect(typeof modified.relations[0].li[0].hostile).toEqual('undefined');
        expect(modified.relations[0].li[0].goodwill[0]).toEqual(100);
    });

    it('modifies all the relations of the faction', () =>{
        expect(playerFaction.relations[0].li[0].hostile[0]).toEqual('True');
        expect(playerFaction.relations[0].li[0].goodwill[0]).toEqual('-100');
        expect(typeof playerFaction.relations[0].li[1].hostile).toEqual('undefined');
        expect(playerFaction.relations[0].li[1].goodwill[0]).toEqual('-80');
        const modified = Faction.setSelfRelations(playerFaction,100,false);
        expect(typeof modified.relations[0].li[0].hostile).toEqual('undefined');
        expect(typeof modified.relations[0].li[1].hostile).toEqual('undefined');
        expect(modified.relations[0].li[0].goodwill[0]).toEqual(100);
        expect(modified.relations[0].li[1].goodwill[0]).toEqual(100);
    });

    it('clears the tactical memory of a faction', () =>{
        expect(otherFaction.tacticalMemory[0].traps.length).toBeGreaterThan(0);
        const modified = Faction.clearTacticalMemory(otherFaction);
        expect(modified.tacticalMemory[0].traps.length).toEqual(0);
    });
});
