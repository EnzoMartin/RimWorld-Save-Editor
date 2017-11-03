require('../_helper');
proxyquire.noPreserveCache();
const factionsSource = proxyquire('./mocks/factions',{});
const Faction = require('../../modifiers/faction');


let factions = [];
let otherFaction = {};
let colonyFaction = {};
let fooFaction = {};
let colonyFactionId = 0;

describe('invoking faction modifier',() => {
  after(() => {
    proxyquire.preserveCache();
  });

  beforeEach(() => {
    // Clear our any changes from the tests
    factions = JSON.parse(JSON.stringify(factionsSource));
    otherFaction = factions[0];
    colonyFaction = factions[1];
    fooFaction = factions[2];
    colonyFactionId = colonyFaction.loadID[0];
  });

  it('modifies the relations of a faction towards another faction', () => {
    expect(otherFaction.relations[0].li[0].hostile[0]).toEqual('True');
    expect(otherFaction.relations[0].li[0].goodwill[0]).toEqual('-100');
    const modified = Faction.setOtherRelation(otherFaction,colonyFactionId,100,false);
    expect(typeof modified.relations[0].li[0].hostile).toEqual('undefined');
    expect(modified.relations[0].li[0].goodwill[0]).toEqual(100);
  });

  it('modifies all the relations of the faction', () => {
    expect(colonyFaction.relations[0].li[0].hostile[0]).toEqual('True');
    expect(colonyFaction.relations[0].li[0].goodwill[0]).toEqual('-100');
    expect(typeof colonyFaction.relations[0].li[1].hostile).toEqual('undefined');
    expect(colonyFaction.relations[0].li[1].goodwill[0]).toEqual('-80');
    const modified = Faction.setSelfRelations(colonyFaction,100,false);
    expect(typeof modified.relations[0].li[0].hostile).toEqual('undefined');
    expect(typeof modified.relations[0].li[1].hostile).toEqual('undefined');
    expect(modified.relations[0].li[0].goodwill[0]).toEqual(100);
    expect(modified.relations[0].li[1].goodwill[0]).toEqual(100);
  });

  it('modifies all the relations of the faction', () => {
    const targetFaction = 'Faction_9';
    expect(factions[0].relations[0].li[0].goodwill[0]).toEqual('-100');
    expect(factions[2].relations[0].li[1].goodwill[0]).toEqual('-80');
    expect(factions[0].relations[0].li[0].hostile[0]).toEqual('True');
    expect(typeof factions[2].relations[0].li[1].hostile).toEqual('undefined');
    const modifiedFactions = Faction.setRelations(factions,targetFaction,-90,true);
    expect(modifiedFactions[0].relations[0].li[0].goodwill[0]).toEqual(-90);
    expect(modifiedFactions[2].relations[0].li[1].goodwill[0]).toEqual(-90);
    expect(modifiedFactions[0].relations[0].li[0].hostile[0]).toEqual('True');
    expect(modifiedFactions[2].relations[0].li[1].hostile[0]).toEqual('True');
  });

  it('clears the tactical memory of a faction', () => {
    expect(otherFaction.tacticalMemory[0].traps.length).toBeGreaterThan(0);
    const modified = Faction.clearTacticalMemory(otherFaction);
    expect(modified.tacticalMemory[0].traps.length).toEqual(0);
  });
});
