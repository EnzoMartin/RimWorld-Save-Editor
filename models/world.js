const FactionManager = require('./faction/manager');

class World {
    constructor(items){
        Object.keys(items).forEach((key) =>{
            const item = items[key];
            switch(key){
                case 'info':
                    this[key] = item;
                    const size = item.size.split(',');
                    this[key]._size = {
                        width: parseInt(size[0].replace('(','').trim(),10),
                        height: parseInt(size[1].replace(')','').trim(),10)
                    };
                    break;
                case 'factionManager':
                    this[key] = new FactionManager(item);
                    break;
                default:
                    this[key] = item;
                    break;
            }
        });
    }
}

module.exports = World;
