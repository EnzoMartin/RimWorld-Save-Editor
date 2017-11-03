require('../_helper');
proxyquire.noPreserveCache();

const factions = proxyquire('./mocks/factions',{});
const pawnsSource = proxyquire('./mocks/pawns',{});

const Pawn = require('../../modifiers/pawn');

let pawns = {};
let colonist = {};
let wolf = {};
let wanderer = {};

const health = 500;
const quality = 'Masterwork';
const skill = 20;
const faction = 'Faction_1';
const factionId = 1;

describe('invoking pawn modifier',() => {
  after(() => {
    proxyquire.preserveCache();
  });

  beforeEach(() => {
    // Clear our any changes from the tests
    pawns = JSON.parse(JSON.stringify(pawnsSource));
    colonist = pawns.colonist;
    wolf = pawns.wolf;
    wanderer = pawns.wanderer;
  });

  it('modifies the skills of the pawn', () => {
    expect(colonist.skills[0].skills[0].li[0].level).toEqual('12');
    expect(colonist.skills[0].skills[0].li[1].level).toEqual('5');
    const modified = Pawn.setSkills(colonist,skill);
    expect(modified.skills[0].skills[0].li[0].level).toEqual(skill);
    expect(modified.skills[0].skills[0].li[1].level).toEqual(skill);
  });

  it('does not modify the skills of a pawn with no skills', () => {
    expect(wolf.skills[0].$.IsNull).toEqual('True');
    expect(typeof wolf.skills[0].skills).toEqual('undefined');
    const modified = Pawn.setSkills(wolf,skill);
    expect(modified.skills[0].$.IsNull).toEqual('True');
    expect(typeof modified.skills[0].skills).toEqual('undefined');
  });

  it('modifies the pawn\'s apparel health', () => {
    expect(colonist.apparel[0].wornApparel[0].li[0].health).toEqual('100');
    expect(colonist.apparel[0].wornApparel[0].li[1].health).toEqual('50');
    const modified = Pawn.setApparelHealth(colonist,health);
    expect(modified.apparel[0].wornApparel[0].li[0].health).toEqual(health);
    expect(modified.apparel[0].wornApparel[0].li[1].health).toEqual(health);
  });

  it('modifies the pawn\'s apparel quality', () => {
    expect(colonist.apparel[0].wornApparel[0].li[0].quality).toEqual('Normal');
    expect(colonist.apparel[0].wornApparel[0].li[1].quality).toEqual('Shoddy');
    const modified = Pawn.setApparelQuality(colonist,quality);
    expect(modified.apparel[0].wornApparel[0].li[0].quality).toEqual(quality);
    expect(modified.apparel[0].wornApparel[0].li[1].quality).toEqual(quality);
  });

  it('does not modify pawn\'s apparel health with no apparel', () => {
    expect(wolf.apparel[0].$.IsNull).toEqual('True');
    expect(typeof wolf.apparel[0].wornApparel).toEqual('undefined');
    const modified = Pawn.setApparelHealth(wolf,health);
    expect(modified.apparel[0].$.IsNull).toEqual('True');
    expect(typeof modified.apparel[0].wornApparel).toEqual('undefined');
  });

  it('does not modify pawn\'s apparel quality with no apparel', () => {
    expect(wolf.apparel[0].$.IsNull).toEqual('True');
    expect(typeof wolf.apparel[0].wornApparel).toEqual('undefined');
    const modified = Pawn.setApparelQuality(wolf,quality);
    expect(modified.apparel[0].$.IsNull).toEqual('True');
    expect(typeof modified.apparel[0].wornApparel).toEqual('undefined');
  });

  it('modifies the pawn\'s equipment health', () => {
    expect(colonist.equipment[0].primary[0].health).toEqual('100');
    const modified = Pawn.setEquipmentHealth(colonist,health);
    expect(modified.equipment[0].primary[0].health).toEqual(health);
  });

  it('modifies the pawn\'s equipment quality', () => {
    expect(colonist.equipment[0].primary[0].quality).toEqual('Shoddy');
    const modified = Pawn.setEquipmentQuality(colonist,quality);
    expect(modified.equipment[0].primary[0].quality).toEqual(quality);
  });

  it('does not modify pawn\'s equipment health with no equipment', () => {
    expect(wolf.equipment[0].$.IsNull).toEqual('True');
    expect(typeof wolf.equipment[0].primary).toEqual('undefined');
    const modified = Pawn.setEquipmentHealth(wolf,health);
    expect(modified.equipment[0].$.IsNull).toEqual('True');
    expect(typeof modified.equipment[0].primary).toEqual('undefined');
  });

  it('does not modify pawn\'s apparel quality with no apparel', () => {
    expect(wolf.equipment[0].$.IsNull).toEqual('True');
    expect(typeof wolf.equipment[0].primary).toEqual('undefined');
    const modified = Pawn.setEquipmentQuality(wolf,quality);
    expect(modified.equipment[0].$.IsNull).toEqual('True');
    expect(typeof modified.equipment[0].primary).toEqual('undefined');
  });

  it('returns the pawn\'s faction ID', () => {
    expect(Pawn.getFactionId(colonist)).toEqual(9);
  });

  it('returns the pawn\'s faction string ID', () => {
    expect(Pawn.getFaction(colonist)).toEqual('Faction_9');
  });

  it('modifies the pawn\'s faction with a string input', () => {
    expect(colonist.faction[0]).toEqual('Faction_9');
    const modified = Pawn.setFaction(colonist,faction);
    expect(modified.faction[0]).toEqual(faction);
  });

  it('modifies the pawn\'s faction with a number input', () => {
    expect(colonist.faction[0]).toEqual('Faction_9');
    const modified = Pawn.setFaction(colonist,factionId);
    expect(modified.faction[0]).toEqual(faction);
  });

  it('returns 0 for the faction ID if the pawn\'s faction is missing', () => {
    expect(Pawn.getFactionId(wanderer)).toEqual(0);
  });

  it('returns Faction_0 for the faction if the pawn\'s faction is missing', () => {
    expect(Pawn.getFaction(wanderer)).toEqual('Faction_0');
  });

  it('modifies the pawn\'s faction even if pawn has no faction', () => {
    expect(typeof wanderer.faction).toEqual('undefined');
    const modified = Pawn.setFaction(wanderer,faction);
    expect(modified.faction[0]).toEqual(faction);
  });
});
