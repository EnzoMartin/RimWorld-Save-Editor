class FactionManager {
    constructor(items){
        Object.keys(items).forEach((key) =>{
            const item = items[key];
            switch(key){
                default:
                    this[key] = item;
                    break;
            }
        });
    }
}

module.exports = FactionManager;
