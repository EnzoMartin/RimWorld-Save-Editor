'use strict';

const processTime = process.hrtime();
const path = require('path');
const config = require('./config/config').initialize();
const logger = config.logger.child({file:__filename});

const Storage = require('./lib/storage');
const XML = require('./lib/parser');
const Local = require('./lib/local');
const Save = require('./lib/save');

const Game = config.Game;
const savePath = path.join(Game.saveDir,Game.saveName);
const writePath = path.join(Game.saveDir,Game.modifiedName);

function processSave(err,result){
    if(err){
        logger.error(err);
        throw new Error(err);
    } else {
        console.log('Finished XML to JS conversion');
        Save.process(result,(result) =>{
            logger.info('Finished modifying, saving file');
            Local.save(writePath,XML.compile(result),(err) =>{
                if(err){
                    logger.error('Failed to save file',err);
                    throw new Error(err);
                } else {
                    const elapsed = process.hrtime(processTime);
                    logger.info(`File saved as "${Game.modifiedName}", ready to play!`);
                    logger.info(`Process took ${(elapsed[0] * 1000 + elapsed[1] / 1000000)}ms`);
                }
            });
        });
    }
}

function processXml(err,file){
    if(err){
        logger.error(err);
        throw new Error(err);
    } else {
        logger.info('Converting XML to JS');
        XML.parse(file,processSave);
    }
}

if(config.useStorage){
    Storage.get(Game.saveId, processXml);
} else {
    Local.get(savePath,processXml);
}
