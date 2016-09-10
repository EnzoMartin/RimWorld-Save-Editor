require('../_helper');
proxyquire.noPreserveCache();

const pawnsSource = proxyquire('./mocks/pawns',{});
const Wound = require('../../modifiers/wound');

var pawns = {};
var colonist = {};
var wolf = {};
var wanderer = {};

const severity = 15;

describe('invoking wound modifier',() =>{
    after(() =>{
        proxyquire.preserveCache();
    });

    beforeEach(() =>{
        // Clear our any changes from the tests
        pawns = JSON.parse(JSON.stringify(pawnsSource));
        colonist = pawns.colonist;
        wolf = pawns.wolf;
        wanderer = pawns.wanderer;
    });

    it('adds blood loss to the pawn', () =>{
        expect(colonist.healthTracker.hediffSet.hediffs.length).toEqual('0');
        const modified = Wound.addBloodLoss(colonist);
        expect(modified.healthTracker.hediffSet.hediffs.li.length).toEqual('1');
        expect(modified.healthTracker.hediffSet.hediffs.li[0].def).toEqual('BloodLoss');
        expect(typeof modified.healthTracker.hediffSet.hediffs.li[0].severity).toEqual('number');
    });

    it('adds blood loss with severity to the pawn', () =>{
        expect(colonist.healthTracker.hediffSet.hediffs.length).toEqual('0');
        const modified = Wound.addBloodLoss(colonist,severity);
        expect(modified.healthTracker.hediffSet.hediffs.li.length).toEqual('1');
        expect(modified.healthTracker.hediffSet.hediffs.li[0].def).toEqual('BloodLoss');
        expect(modified.healthTracker.hediffSet.hediffs.li[0].severity).toEqual(severity);
    });

    it('adds blood loss to the pawn with no health tracker property', () =>{
        expect(typeof wolf.healthTracker).toEqual('undefined');
        const modified = Wound.addBloodLoss(wolf);
        expect(modified.healthTracker.hediffSet.hediffs.li.length).toEqual('1');
        expect(modified.healthTracker.hediffSet.hediffs.li[0].def).toEqual('BloodLoss');
        expect(typeof modified.healthTracker.hediffSet.hediffs.li[0].severity).toEqual('number');
    });

    it('adds an injury without comps to the pawn', () =>{
        expect(colonist.healthTracker.hediffSet.hediffs.length).toEqual('0');
        const modified = Wound.addBodyInjury(colonist,'Cut');
        expect(modified.healthTracker.hediffSet.hediffs.li.length).toEqual('1');
        expect(modified.healthTracker.hediffSet.hediffs.li[0].def).toEqual('Cut');
        expect(modified.healthTracker.hediffSet.hediffs.li[0].$).toEqual({Class: 'Hediff_Injury'});
        expect(typeof modified.healthTracker.hediffSet.hediffs.li[0].severity).toEqual('number');
    });

    it('adds an injury with comps to the pawn', () =>{
        expect(colonist.healthTracker.hediffSet.hediffs.length).toEqual('0');
        const modified = Wound.addBodyInjury(colonist,'Cut',{ticksToDisappear:500});
        expect(modified.healthTracker.hediffSet.hediffs.li.length).toEqual('1');
        expect(modified.healthTracker.hediffSet.hediffs.li[0].def).toEqual('Cut');
        expect(modified.healthTracker.hediffSet.hediffs.li[0].$).toEqual({Class: 'HediffWithComps'});
        expect(modified.healthTracker.hediffSet.hediffs.li[0].ticksToDisappear).toEqual(500);
    });

    it('adds an injury with extra options and without comps to the pawn', () =>{
        expect(colonist.healthTracker.hediffSet.hediffs.length).toEqual('0');
        const modified = Wound.addBodyInjury(colonist,'Cut',{
            ticksSinceCreation: 500,
            painFactor: 10
        });
        expect(modified.healthTracker.hediffSet.hediffs.li.length).toEqual('1');
        expect(modified.healthTracker.hediffSet.hediffs.li[0].def).toEqual('Cut');
        expect(modified.healthTracker.hediffSet.hediffs.li[0].$).toEqual({Class: 'Hediff_Injury'});
        expect(modified.healthTracker.hediffSet.hediffs.li[0].ticksSinceCreation).toEqual(500);
        expect(modified.healthTracker.hediffSet.hediffs.li[0].painFactor).toEqual(10);
    });
});
