const Pawn = require('./thing/pawn');

class Things {
    constructor(items){
        this.thing = items.thing.map((item) => {
            let newItem = {};

            try {
                const test = item.def[0];
            } catch (err){
                console.error(item);
            }

            switch(item.def){
                case 'Human':
                    newItem = new Pawn(item);
                    break;
                default:
                    newItem = item;
                    break;
            }

            return item;
        });
    }
}

module.exports = Things;
