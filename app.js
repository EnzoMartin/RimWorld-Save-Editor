'use strict';

const processTime = process.hrtime();
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const builder = new xml2js.Builder();
const fs = require('fs');
const env = process.env.SERVER_ENV || process.env.NODE_ENV || 'development';
const config = require('./config/config').initialize(env);

const Game = config.Game;
const savePath = Game.saveDir + Game.saveName;
const writePath = Game.saveDir + Game.modifiedName;

const pawnsModified = [];

//TODO: Save a backup copy
console.log('Accessing directory "' + Game.saveDir + '"');
fs.readFile(savePath, (err, file) => {
    if(err){
        console.error('Failed reading file "' + Game.saveName + '"', err);
    } else {
        console.log('Loaded save file "' + Game.saveName + '"');
        parser.parseString(file, (err, result) => {
            if(err){
                console.error('Failed parsing XML', err);
            } else {
                console.log('Parsed save file, now applying modifications..');
                var things = result.savegame.map[0].things[0].thing;
                
                things = things.reduce((things,thing) => {
                    let add = true;
                    if(thing.$ && thing.$.Class){
                        switch(thing.$.Class){
                            case 'Filth':
                                // Remove most of the filth?
                                add = false;
                                break;
                            case 'Pawn':
                                if(
                                    thing.faction.indexOf(Game.playerFaction) !== -1 &&
                                    thing.def.indexOf('Human') !== -1 &&
                                    thing.kindDef.indexOf('Colonist') !== -1
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
                                                item.health = [Game.healthLevel];
                                                item.quality = [Game.qualityLevel];
                                            }

                                            return item;
                                        });
                                    }

                                    // Upgrade apparel
                                    if(apparel.wornApparel){
                                        apparel = apparel.wornApparel[0].li;
                                        apparel = apparel.map((item) =>{
                                            item.health = [Game.healthLevel];
                                            item.quality = [Game.qualityLevel];

                                            return item;
                                        });
                                    }

                                    // Upgrade skills
                                    if(skills.skills){
                                        skills = skills.skills[0].li;
                                        skills = skills.map((item) =>{
                                            item.level = [Game.skillLevel];
                                            delete item.xpSinceLastLevel;

                                            return item;
                                        });
                                    }
                                }
                                break;
                            default:
                                // Nothing
                                break;
                        }
                    } else {
                        add = true;
                    }

                    if(add){
                        things.push(thing);
                    }

                    return things;
                },[]);
                
                console.log('Finished modifying, saving..');

                fs.writeFile(writePath,builder.buildObject(result),(err) =>{
                    if(err){
                        console.error('Failed to save file',err);
                    } else {
                        const elapsed = process.hrtime(processTime);
                        console.log('File saved as "' + Game.modifiedName + '", ready to play!');
                        console.log('Modified the following ' + pawnsModified.length + ' human colonist(s):',pawnsModified);
                        console.log('Process took ' + (elapsed[0] * 1000 + elapsed[1] / 1000000) + 'ms');
                    }
                });
            }
        });
    }
});

