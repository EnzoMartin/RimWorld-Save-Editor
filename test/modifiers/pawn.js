require('../_helper');
proxyquire.noPreserveCache();

const factions = proxyquire('./mocks/factions',{});
const pawn = proxyquire('./mocks/pawn',{});

const Pawn = require('../../modifiers/pawn');

const colonist = pawn.colonist;

const health = 500;
const quality = 'Masterwork';
const skill = 20;
const faction = 'Faction_1';

describe('invoking pawn modifier',() =>{
    after(() =>{
        proxyquire.preserveCache();
    });

    it('modifies the skills of the pawn', () =>{
        expect(colonist.skills[0].skills[0].li[0].level).toEqual('12');
        expect(colonist.skills[0].skills[0].li[1].level).toEqual('5');
        const modified = Pawn.setSkills(colonist,skill);
        expect(modified.skills[0].skills[0].li[0].level).toEqual(skill);
        expect(modified.skills[0].skills[0].li[1].level).toEqual(skill);
    });

    it('modifies the pawn\'s apparel health', () =>{
        expect(colonist.apparel[0].wornApparel[0].li[0].health).toEqual('100');
        expect(colonist.apparel[0].wornApparel[0].li[1].health).toEqual('50');
        const modified = Pawn.setApparelHealth(colonist,health);
        expect(modified.apparel[0].wornApparel[0].li[0].health).toEqual(health);
        expect(modified.apparel[0].wornApparel[0].li[1].health).toEqual(health);
    });

    it('modifies the pawn\'s apparel quality', () =>{
        expect(colonist.apparel[0].wornApparel[0].li[0].quality).toEqual('Normal');
        expect(colonist.apparel[0].wornApparel[0].li[1].quality).toEqual('Shoddy');
        const modified = Pawn.setApparelQuality(colonist,quality);
        expect(modified.apparel[0].wornApparel[0].li[0].quality).toEqual(quality);
        expect(modified.apparel[0].wornApparel[0].li[1].quality).toEqual(quality);
    });

    it('modifies the pawn\'s equipment health', () =>{
        expect(colonist.equipment[0].primary[0].health).toEqual('100');
        const modified = Pawn.setEquipmentHealth(colonist,health);
        expect(modified.equipment[0].primary[0].health).toEqual(health);
    });

    it('modifies the pawn\'s equipment quality', () =>{
        expect(colonist.equipment[0].primary[0].quality).toEqual('Shoddy');
        const modified = Pawn.setEquipmentQuality(colonist,quality);
        expect(modified.equipment[0].primary[0].quality).toEqual(quality);
    });

    it('returns the pawn\'s faction ID', () =>{
        expect(Pawn.getFactionId(colonist)).toEqual(9);
    });

    it('returns the pawn\'s faction string ID', () =>{
        expect(Pawn.getFaction(colonist)).toEqual('Faction_9');
    });

    it('modifies the pawn\'s faction', () =>{
        expect(colonist.faction[0]).toEqual('Faction_9');
        const modified = Pawn.setFaction(colonist,faction);
        expect(modified.faction[0]).toEqual(faction);
    });
});
