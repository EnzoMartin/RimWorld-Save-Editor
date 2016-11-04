const Map = require('./map');
const World = require('./world');

class Game {
    constructor(items){
        Object.keys(items).forEach((key) => {
            const item = items[key];
            switch(key){
                case 'world':
                    this[key] = new World(item);
                    break;
                case 'map':
                    this[key] = new Map(item);
                    break;
                default:
                    this[key] = item;
                    break;
            }
        });
    }
}

module.exports = Game;
