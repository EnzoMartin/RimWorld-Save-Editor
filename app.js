'use strict';

const processTime = process.hrtime();
const path = require('path');
const config = require('./config');
const logger = config.logger.child({file:__filename});

const XML = require('./lib/parser');
const Local = require('./lib/local');
const Save = require('./lib/save');
const Actions = require('./lib/actions');
const Utils = require('./lib/utils');

const Game = config.Game;
const savePath = path.join(Game.saveDir,Game.saveName);
const writePath = path.join(Game.saveDir,Game.modifiedName);

/**
 * Convert the edited save game back to XML and save to file
 * @param {Object} editedSave
 * @param {Array} modified
 */
function save(editedSave,modified){
    Local.save(writePath,XML.compile(editedSave),(err) =>{
        if(err){
            logger.error('Failed to write save file',err);
            throw new Error(err);
        } else {
            const elapsed = process.hrtime(processTime);
            logger.info(`Save written as "${Game.modifiedName}", ready to play!`);
            logger.info(`Process took ${(elapsed[0] * 1000 + elapsed[1] / 1000000)}ms`);
            modified.forEach((item) =>{
                logger.info(`${item.name} modified:`,item.modified);
            });
        }
    });
}

/**
 * Process the converted XML string
 * @param {Error} err
 * @param {Object} result
 */
function processSave(err,result){
    if(err){
        logger.error(err);
        throw new Error(err);
    } else {
        logger.info('Finished loading save data');

        const gameMeta = result.savegame.meta[0];
        const gameSave = result.savegame.game[0];

        if(Save.isSupported(gameMeta)){
            config.Game.updateColonyFaction(Utils.findPlayerColony(gameSave));
            const result = Actions.doQuickActions(gameSave);
            const editedSave = {
                savegame:{
                    meta: [
                        gameMeta
                    ],
                    game: [
                        result.save
                    ]
                }
            };

            logger.info('Finished modifying, writing save file');
            save(editedSave,result.modified);
        } else {
            throw new Error('Unsupported game save version');
        }
    }
}

/**
 * Process the XML loaded
 * @param {Error} err
 * @param {String} file
 */
function processXml(err,file){
    if(err){
        logger.error(err);
        throw new Error(err);
    } else {
        logger.info('Loading save data');
        XML.parse(file,processSave);
    }
}

// Start process by loading in the desired file
Local.get(savePath,processXml);
