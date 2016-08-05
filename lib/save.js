const config = require('../config/config');
const logger = config.logger.child({file:__filename});

const Game = config.Game;

const mortallyWoundPawn = require('../modifiers/mortallyWoundPawn');
const modifySkills = require('../modifiers/skills');
const modifyItem = require('../modifiers/item');

const pawnsModified = [];

module.exports = {
    /**
     * Modify save file object
     * @param {Object} result
     * @param {Function} callback
     */
    process:(result,callback) =>{
        // Check the game version
        if(result.savegame.meta[0].gameVersion[0].indexOf(Game.supportedVersion) !== 0){
            throw new Error('Unsupported game save version');
        }

        logger.info('Applying modifications..');
        var things = result.savegame.game[0].map[0].things[0].thing;

        const factions = result.savegame.game[0].world[0].factionManager[0].allFactions[0].li;
        const playerFaction = factions.find((faction) =>{
            return faction.loadID && faction.loadID[0] == Game.playerFactionId;
        });

        const enemyFactions = playerFaction.relations[0].li.reduce((factions,faction) =>{
            if(faction.hostile && faction.hostile[0] === 'True'){
                factions.push(faction.other[0]);
            }
            return factions;
        },[]);

        result.savegame.game[0].map[0].things[0].thing = things.reduce((things,thing) =>{
            const add = true;
            if(thing.$ && thing.$.Class){
                switch(thing.$.Class){
                    case 'ThingWithComps':
                        thing = modifyItem(thing,Game.healthLevel,Game.qualityLevel);
                        break;
                    case 'Building_Art':
                        thing = modifyItem(thing,false,Game.qualityLevel);
                        break;
                    case 'Apparel':
                        thing = modifyItem(thing,Game.healthLevel,Game.qualityLevel);
                        break;
                    case 'AIRobot.AIRobot':
                        if(thing.faction.indexOf(Game.playerFaction) !== -1){
                            /*
                            TODO: Give bots their own list
                            const name = thing.name[0];
                            pawnsModified.push(name.first + ' "' + name.nick + '" ' + name.last);
                            */
                            let skills = thing.skills[0];
                            // Upgrade skills
                            if(skills.skills){
                                skills = modifySkills(skills.skills[0].li,Game.skillLevel);
                            }
                        }
                        break;
                    case 'Pawn':
                        if(
                            thing.def.indexOf('Human') !== -1
                            && thing.faction.indexOf(Game.playerFaction) !== -1
                        ){
                            const name = thing.name[0];
                            pawnsModified.push(name.first + ' "' + name.nick + '" ' + name.last);

                            let skills = thing.skills[0];
                            let apparel = thing.apparel[0];
                            let equipment = thing.equipment[0];

                            // Upgrade weapons
                            if(equipment.primary){
                                equipment = equipment.primary;
                                equipment = equipment.map((item) =>{
                                    if(!item.$){
                                        item = modifyItem(item,Game.healthLevel,Game.qualityLevel);
                                    }

                                    return item;
                                });
                            }

                            // Upgrade apparel
                            if(apparel.wornApparel){
                                apparel = apparel.wornApparel[0].li;
                                if(apparel){
                                    apparel = apparel.map((item) =>{
                                        return modifyItem(item,Game.healthLevel,Game.qualityLevel);
                                    });
                                }
                            }

                            // Upgrade skills
                            if(skills.skills){
                                skills = modifySkills(skills.skills[0].li,Game.skillLevel);
                            }
                        } else if(
                            // Kill non-human pawns of non-player faction
                        thing.def.indexOf('Human') === -1
                        && (
                            thing.faction
                            && thing.faction.indexOf(Game.playerFaction) === -1
                            && thing.faction[0] !== 'Faction_2'
                        )
                        || !thing.faction
                        ){
                            logger.info('non-human',thing.def,thing.faction,thing.gender);
                            // thing.healthTracker = mortallyWoundPawn;
                            if(thing.faction){
                                thing.faction[0] = enemyFactions[0];
                            }
                        } else if(
                            // Kill hostile faction's human pawns
                        thing.def.indexOf('Human') !== -1
                        && (thing.faction && enemyFactions.indexOf(thing.faction[0]) !== -1)
                        && thing.faction[0] !== 'Faction_2'
                        ){
                            logger.info('human',thing.def,thing.faction);
                            thing.healthTracker = mortallyWoundPawn;
                        } else {
                            logger.info('Fallthrough',thing.def,thing.faction,thing.gender);
                        }
                        break;
                    default:
                        // Nothing
                        break;
                }
            }

            if(add){
                things.push(thing);
            }

            return things;
        },[]);

        logger.info('Finished updating save file');
        logger.info(`Modified ${pawnsModified.length} colonist(s):`,pawnsModified);
        callback(result);
    }
};
