const config = require('../config');

const Pawn = require('../modifiers/pawn');
const Item = require('../modifiers/item');
const Wound = require('../modifiers/wound');
const Utils = require('./utils');
const Faction = require('../modifiers/faction');

const Quick = config.QuickActions;
const Game = config.Game;

const relationPeace = 100;
const relationWar = -100;

const colonistsModified = [];
const animalsModified = [];
const pawnsModified = [];

const modifyThingActions = [];
const modifyColonistsActions = [];
const modifyHostilePawnsActions = [];
const modifyAnimals = [];
const modifyArt = [];
const modifyFactions = [];

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

if(Quick.setColonyPeace){
    modifyFactions.push(
        (factions) =>{
            factions.map(() =>{
                return Faction.setRelations(factions,Game.colonyFactionId,relationPeace,false);
            });

            factions[Game.colonyFactionId] = Faction.setSelfRelations(factions[Game.colonyFactionId],relationPeace,false);

            return factions;
        }
    );
}

if(Quick.setColonyWar){
    modifyFactions.push(
        (factions) =>{
            factions.map(() =>{
                return Faction.setRelations(factions,Game.colonyFactionId,relationWar,true);
            });

            factions[Game.colonyFactionId] = Faction.setSelfRelations(factions[Game.colonyFactionId],relationWar,true);

            return factions;
        }
    );
}

if(Quick.setWorldPeace){
    modifyFactions.push(
        (factions) =>{
            factions.map((faction) =>{
                const targetFactionId = faction.loadID || 0;
                return Faction.setRelations(factions,targetFactionId,relationPeace,false);
            });

            factions[Game.colonyFactionId] = Faction.setSelfRelations(factions[Game.colonyFactionId],relationPeace,false);

            return factions;
        }
    );
}

if(Quick.setWorldWar){
    modifyFactions.push(
        (factions) =>{
            factions.map((faction) =>{
                const targetFactionId = faction.loadID || 0;
                return Faction.setRelations(factions,targetFactionId,relationWar,true);
            });

            factions[Game.colonyFactionId] = Faction.setSelfRelations(factions[Game.colonyFactionId],relationWar,true);

            return factions;
        }
    );
}

/**
 * Process all the queued actions
 * @param {Array} actions
 * @param {Object} thing
 * @returns {*}
 */
function processActions(actions,thing){
    // Grab all arguments after actions array
    const args = Array.prototype.slice.call(arguments,1);

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
        const map = save.map;
        const things = map.things.thing;
        let factions = save.world.factionManager.allFactions.li;
        const enemyFactionNames = Utils.getEnemyFactionNames(factions);

        factions = processActions(modifyFactions,factions);

        things.forEach((thing) =>{
            if(thing.$ && thing.$.Class){
                switch(thing.$.Class){
                    case 'ThingWithComps':
                        processActions(modifyThingActions,thing);
                        break;
                    case 'Building_Art':
                        processActions(modifyArt,thing);
                        break;
                    case 'Apparel':
                        processActions(modifyThingActions,thing);
                        break;
                    case 'Pawn':
                        if(Utils.isColonist(thing)){
                            // Upgrade colony's pawns
                            processActions(modifyColonistsActions,thing);
                            if(modifyColonistsActions.length){
                                const name = thing.name;
                                colonistsModified.push(name.first + ' "' + name.nick + '" ' + name.last);
                            }
                        } else if(Utils.isForeignNonhumanPawn(thing)){
                            // Set non-humans to a different always hostile faction to create caravan disaster
                            const oldFaction = factions[Pawn.getFactionId(thing)] || {name:'Unknown'};
                            processActions(modifyAnimals,thing,enemyFactionNames[0]);
                            if(modifyAnimals.length){
                                const newFaction = factions[Pawn.getFactionId(thing)] || {name:'Unknown'};
                                animalsModified.push(`${thing.def} - ${thing.gender} | "${oldFaction.name}" -> ${newFaction.name}`);
                            }
                        } else if(Utils.isHostileHumanPawn(thing,factions)){
                            // Wound hostile faction's human pawns
                            processActions(modifyHostilePawnsActions,thing);
                            if(modifyHostilePawnsActions.length){
                                const name = thing.name;
                                const faction = factions[Pawn.getFactionId(thing)] || {name:'Unknown'};
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

        save.world.factionManager.allFactions.li = factions;

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
