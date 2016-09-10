require('../_helper');
proxyquire.noPreserveCache();
const factionsSource = proxyquire('./mocks/factions',{});
const Faction = require('../../modifiers/faction');


var factions = [];
var otherFaction = {};
var colonyFaction = {};
var fooFaction = {};
var colonyFactionId = 0;

describe('invoking faction modifier',() =>{
    after(() =>{
        proxyquire.preserveCache();
    });

    beforeEach(() =>{
        // Clear our any changes from the tests
        factions = JSON.parse(JSON.stringify(factionsSource));
        otherFaction = factions[0];
        colonyFaction = factions[1];
        fooFaction = factions[2];
        colonyFactionId = colonyFaction.loadID;
    });

    it('modifies the relations of a faction towards another faction', () =>{
        expect(otherFaction.relations.li[0].hostile).toEqual(true);
        expect(otherFaction.relations.li[0].goodwill).toEqual('-100');
        const modified = Faction.setOtherRelation(otherFaction,colonyFactionId,100,false);
        expect(typeof modified.relations.li[0].hostile).toEqual('undefined');
        expect(modified.relations.li[0].goodwill).toEqual(100);
    });

    it('modifies all the relations of the faction', () =>{
        expect(colonyFaction.relations.li[0].hostile).toEqual(true);
        expect(colonyFaction.relations.li[0].goodwill).toEqual('-100');
        expect(typeof colonyFaction.relations.li[1].hostile).toEqual('undefined');
        expect(colonyFaction.relations.li[1].goodwill).toEqual('-80');
        const modified = Faction.setSelfRelations(colonyFaction,100,false);
        expect(typeof modified.relations.li[0].hostile).toEqual('undefined');
        expect(typeof modified.relations.li[1].hostile).toEqual('undefined');
        expect(modified.relations.li[0].goodwill).toEqual(100);
        expect(modified.relations.li[1].goodwill).toEqual(100);
    });

    it('modifies all the relations of the faction', () =>{
        const targetFaction = 'Faction_9';
        expect(factions[0].relations.li[0].goodwill).toEqual('-100');
        expect(factions[2].relations.li[1].goodwill).toEqual('-80');
        expect(factions[0].relations.li[0].hostile).toEqual(true);
        expect(typeof factions[2].relations.li[1].hostile).toEqual('undefined');
        const modifiedFactions = Faction.setRelations(factions,targetFaction,-90,true);
        expect(modifiedFactions[0].relations.li[0].goodwill).toEqual(-90);
        expect(modifiedFactions[2].relations.li[1].goodwill).toEqual(-90);
        expect(modifiedFactions[0].relations.li[0].hostile).toEqual(true);
        expect(modifiedFactions[2].relations.li[1].hostile).toEqual(true);
    });

    it('clears the tactical memory of a faction', () =>{
        expect(otherFaction.tacticalMemory.traps.li.length).toBeGreaterThan(0);
        const modified = Faction.clearTacticalMemory(otherFaction);
        expect(modified.tacticalMemory.traps.length).toEqual(0);
    });
});
