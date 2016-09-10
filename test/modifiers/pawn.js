require('../_helper');
proxyquire.noPreserveCache();

const factions = proxyquire('./mocks/factions',{});
const pawnsSource = proxyquire('./mocks/pawns',{});

const Pawn = require('../../modifiers/pawn');

var pawns = {};
var colonist = {};
var human = {};
var wolf = {};
var wanderer = {};

const health = 500;
const quality = 'Masterwork';
const skill = 20;
const faction = 'Faction_1';
const factionId = 1;

describe('invoking pawn modifier',() =>{
    after(() =>{
        proxyquire.preserveCache();
    });

    beforeEach(() =>{
        // Clear our any changes from the tests
        pawns = JSON.parse(JSON.stringify(pawnsSource));
        colonist = pawns.colonist;
        human = pawns.human;
        wolf = pawns.wolf;
        wanderer = pawns.wanderer;
    });

    it('modifies the skills of the pawn', () =>{
        expect(colonist.skills.skills.li[0].level).toEqual('12');
        expect(colonist.skills.skills.li[1].level).toEqual('5');
        const modified = Pawn.setSkills(colonist,skill);
        expect(modified.skills.skills.li[0].level).toEqual(skill);
        expect(modified.skills.skills.li[1].level).toEqual(skill);
    });

    it('does not modify the skills of a pawn with no skills', () =>{
        expect(wolf.skills.$.IsNull).toEqual(true);
        expect(typeof wolf.skills.skills).toEqual('undefined');
        const modified = Pawn.setSkills(wolf,skill);
        expect(modified.skills.$.IsNull).toEqual(true);
        expect(typeof modified.skills.skills).toEqual('undefined');
    });

    it('modifies the pawn\'s apparel health', () =>{
        expect(colonist.apparel.wornApparel.li[0].health).toEqual('100');
        expect(colonist.apparel.wornApparel.li[1].health).toEqual('50');
        const modified = Pawn.setApparelHealth(colonist,health);
        expect(modified.apparel.wornApparel.li[0].health).toEqual(health);
        expect(modified.apparel.wornApparel.li[1].health).toEqual(health);
    });

    it('modifies the pawn\'s apparel quality', () =>{
        expect(colonist.apparel.wornApparel.li[0].quality).toEqual('Normal');
        expect(colonist.apparel.wornApparel.li[1].quality).toEqual('Shoddy');
        const modified = Pawn.setApparelQuality(colonist,quality);
        expect(modified.apparel.wornApparel.li[0].quality).toEqual(quality);
        expect(modified.apparel.wornApparel.li[1].quality).toEqual(quality);
    });

    it('does not modify pawn\'s apparel health with no apparel', () =>{
        expect(wolf.apparel.$.IsNull).toEqual(true);
        expect(typeof wolf.apparel.wornApparel).toEqual('undefined');
        const modified = Pawn.setApparelHealth(wolf,health);
        expect(modified.apparel.$.IsNull).toEqual(true);
        expect(typeof modified.apparel.wornApparel).toEqual('undefined');
    });

    it('does not modify pawn\'s apparel quality with no apparel', () =>{
        expect(wolf.apparel.$.IsNull).toEqual(true);
        expect(typeof wolf.apparel.wornApparel).toEqual('undefined');
        const modified = Pawn.setApparelQuality(wolf,quality);
        expect(modified.apparel.$.IsNull).toEqual(true);
        expect(typeof modified.apparel.wornApparel).toEqual('undefined');
    });

    it('modifies the pawn\'s equipment health', () =>{
        expect(colonist.equipment.primary.health).toEqual(100);
        const modified = Pawn.setEquipmentHealth(colonist,health);
        expect(modified.equipment.primary.health).toEqual(health);
    });

    it('modifies the pawn\'s equipment quality', () =>{
        expect(colonist.equipment.primary.quality).toEqual('Shoddy');
        const modified = Pawn.setEquipmentQuality(colonist,quality);
        expect(modified.equipment.primary.quality).toEqual(quality);
    });

    it('does not modify the pawn\'s equipment health if equipment has a class', () =>{
        expect(human.equipment.primary.health).toEqual(100);
        const modified = Pawn.setEquipmentHealth(human,health);
        expect(modified.equipment.primary.health).toEqual(100);
    });

    it('does not modify the pawn\'s equipment quality if equipment has a class', () =>{
        expect(human.equipment.primary.quality).toEqual('Shoddy');
        const modified = Pawn.setEquipmentQuality(human,quality);
        expect(modified.equipment.primary.quality).toEqual('Shoddy');
    });

    it('does not modify pawn\'s equipment health with no equipment', () =>{
        expect(wolf.equipment.$.IsNull).toEqual(true);
        expect(typeof wolf.equipment.primary).toEqual('undefined');
        const modified = Pawn.setEquipmentHealth(wolf,health);
        expect(modified.equipment.$.IsNull).toEqual(true);
        expect(typeof modified.equipment.primary).toEqual('undefined');
    });

    it('does not modify pawn\'s apparel quality with no apparel', () =>{
        expect(wolf.equipment.$.IsNull).toEqual(true);
        expect(typeof wolf.equipment.primary).toEqual('undefined');
        const modified = Pawn.setEquipmentQuality(wolf,quality);
        expect(modified.equipment.$.IsNull).toEqual(true);
        expect(typeof modified.equipment.primary).toEqual('undefined');
    });

    it('returns the pawn\'s faction ID', () =>{
        expect(Pawn.getFactionId(colonist)).toEqual(9);
    });

    it('returns the pawn\'s faction string ID', () =>{
        expect(Pawn.getFaction(colonist)).toEqual('Faction_9');
    });

    it('modifies the pawn\'s faction with a string input', () =>{
        expect(colonist.faction).toEqual('Faction_9');
        const modified = Pawn.setFaction(colonist,faction);
        expect(modified.faction).toEqual(faction);
    });

    it('modifies the pawn\'s faction with a number input', () =>{
        expect(colonist.faction).toEqual('Faction_9');
        const modified = Pawn.setFaction(colonist,factionId);
        expect(modified.faction).toEqual(faction);
    });

    it('returns 0 for the faction ID if the pawn\'s faction is missing', () =>{
        expect(Pawn.getFactionId(wanderer)).toEqual(0);
    });

    it('returns Faction_0 for the faction if the pawn\'s faction is missing', () =>{
        expect(Pawn.getFaction(wanderer)).toEqual('Faction_0');
    });

    it('modifies the pawn\'s faction even if pawn has no faction', () =>{
        expect(typeof wanderer.faction).toEqual('undefined');
        const modified = Pawn.setFaction(wanderer,faction);
        expect(modified.faction).toEqual(faction);
    });
});
