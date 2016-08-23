const config = require('../config');
const logger = config.logger.child({file:__filename});

const Pawn = require('../modifiers/pawn');
const Item = require('../modifiers/item');
const Wound = require('../modifiers/wound');
const Utils = require('./utils');

const Quick = config.QuickActions;
const Game = config.Game;

const colonistsModified = [];
const animalsModified = [];
const pawnsModified = [];

const modifyThingActions = [];
const modifyColonistsActions = [];
const modifyHostilePawnsActions = [];
const modifyAnimals = [];
const modifyArt = [];

if(Quick.upgradeItems){
    modifyThingActions.push(
        (thing) =>{
            return Item.setHealth(thing,Game.healthLevel);
        },
        (thing) =>{
            return Item.setQuality(thing,Game.qualityLevel);
        }
    );
}

if(Quick.upgradeArt){
    modifyArt.push(
        (thing) =>{
            return Item.setHealth(thing,Game.healthLevel);
        },
        (thing) =>{
            return Item.setQuality(thing,Game.qualityLevel);
        }
    );
}

if(Quick.upgradePawnSkills){
    modifyColonistsActions.push(
        (thing) =>{
            return Pawn.setSkills(thing,Game.skillLevel);
        }
    );
}

if(Quick.upgradePawnEquipment){
    modifyColonistsActions.push(
        (thing) =>{
            return Pawn.setEquipmentHealth(thing,Game.healthLevel);
        },
        (thing) =>{
            return Pawn.setEquipmentQuality(thing,Game.qualityLevel);
        }
    );
}

if(Quick.upgradePawnApparel){
    modifyColonistsActions.push(
        (thing) =>{
            return Pawn.setApparelHealth(thing,Game.healthLevel);
        },
        (thing) =>{
            return Pawn.setApparelQuality(thing,Game.qualityLevel);
        }
    );
}

if(Quick.woundHostilePawns){
    modifyHostilePawnsActions.push(
        (thing) =>{
            if(Utils.isHuman(thing)){
                thing = Wound.addBloodLoss(thing);
                thing = Wound.addBodyInjury(thing,'Cut',{
                    partIndex: 0,
                    source: 'MeleeWeapon_Knife',
                    infectionChanceFactor: 10
                });
                thing = Wound.addBodyInjury(thing,'Cut',{
                    partIndex: 0,
                    source: 'MeleeWeapon_Knife',
                    infectionChanceFactor: 10
                });
                thing = Wound.addBodyInjury(thing,'Cut',{
                    partIndex: 0,
                    source: 'MeleeWeapon_Knife',
                    infectionChanceFactor: 10
                });
                thing = Wound.addBodyInjury(thing,'Gunshot',{
                    partIndex: 0,
                    painFactor: 20,
                    infectionChanceFactor: 10
                });
                thing = Wound.addBodyInjury(thing,'Crack',{
                    partIndex: 0,
                    painFactor: 20,
                    source:'Human',
                    sourceBodyPartGroup:'RightHand',
                    infectionChanceFactor: 10
                });
            }
            return thing;
        }
    );
}

if(Quick.caravanDisaster){
    modifyAnimals.push(
        (thing,faction) =>{
            return Pawn.setFaction(thing,faction);
        }
    );
}

/**
 * Process all the queued actions
 * @param {Object} thing
 * @param {Array} actions
 * @returns {*}
 */
function processActions(thing,actions){
    // Grab all extra arguments aside from first two to pass into the action
    let args = Array.prototype.slice.call(arguments,2);
    args = [thing, ...args];

    actions.forEach((action) =>{
        thing = action.apply(action,args);
    });

    return thing;
}

module.exports = {
    /**
     * Perform pre-defined actions from config
     * @param {Object} save
     * @returns {{save: *, modified: Array}}
     */
    doQuickActions: (save) =>{
        const map = save.map[0];
        const things = map.things[0].thing;
        const factions = save.world[0].factionManager[0].allFactions[0].li;
        const enemyFactions = Utils.getEnemyFactions(factions);

        things.forEach((thing) =>{
            if(thing.$ && thing.$.Class){
                switch(thing.$.Class){
                    case 'ThingWithComps':
                        processActions(thing,modifyThingActions);
                        break;
                    case 'Building_Art':
                        processActions(thing,modifyArt);
                        break;
                    case 'Apparel':
                        processActions(thing,modifyThingActions);
                        break;
                    case 'Pawn':
                        if(Utils.isColonist(thing)){
                            // Upgrade player's pawns
                            processActions(thing,modifyColonistsActions);
                            if(modifyColonistsActions.length){
                                const name = thing.name[0];
                                colonistsModified.push(name.first + ' "' + name.nick + '" ' + name.last);
                            }
                        } else if(Utils.isForeignNonhumanPawn(thing)){
                            // Set non-humans to a different always hostile faction to create caravan disaster
                            const oldFaction = factions[Pawn.getFaction(thing)] || {name:'Unknown'};
                            processActions(thing,modifyAnimals,enemyFactions[0]);
                            if(modifyAnimals.length){
                                const newFaction = factions[Pawn.getFaction(thing)] || {name:'Unknown'};
                                animalsModified.push(`${thing.def} - ${thing.gender} | "${oldFaction.name}" -> ${newFaction.name}`);
                            }
                        } else if(Utils.isHostileHumanPawn(thing,factions)){
                            // Wound hostile faction's human pawns
                            processActions(thing,modifyHostilePawnsActions);
                            if(modifyHostilePawnsActions.length){
                                const name = thing.name[0];
                                const faction = factions[Pawn.getFaction(thing)] || {name:'Unknown'};
                                pawnsModified.push(`${name.first} "${name.nick}" ${name.last} from "${faction.name}" faction`);
                            }
                        } else {
                            // logger.info('Fallthrough',thing.def,thing.faction,thing.gender);
                        }
                        break;
                    default:
                        // Nothing
                        break;
                }
            }
        });

        return {
            save,
            modified:[
                {
                    name: 'Animals',
                    modified: animalsModified
                },
                {
                    name: 'Pawns',
                    modified: pawnsModified
                },
                {
                    name: 'Colonists',
                    modified: colonistsModified
                }
            ]
        };
    }
};
