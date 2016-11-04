const Things = require('./things');

class Map {
    constructor(items){
        Object.keys(items).forEach((key) => {
            const item = items[key];
            switch(key){
                case 'things':
                    this[key] = new Things(item);
                    break;
                default:
                    this[key] = item;
                    break;
            }
        });
    }
}

module.exports = Map;
