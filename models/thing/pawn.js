class Pawn {
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

    modifySkill(name,level,options){
        const filtered = {
            xpSinceLastLevel: options.xpSinceLastLevel,
            xpSinceMidnight: options.xpSinceMidnight,
            passing: options.passion
        };

        const index = this.skills.skills.li.findIndex((item) =>{
            return item.def === name;
        });
        this.skills.skills.li[index] = Object.assign(this.skills.skills.li[index],{
            level,
            ...options
        });
    }
}

module.exports = Pawn;
