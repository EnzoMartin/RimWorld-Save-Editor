const Apparel = require('./apparel');

class Pawn {
  constructor(items){
    Object.keys(items).forEach((key) => {
      const item = items[key];
      switch(key){
        default:
          this[key] = item;
          break;
      }
    });
  }

  /**
     * Set the pawn name
     * @param {Object} names
     * @param {String} [names.name] Used for pawns that have only 1 name
     * @param {String} [names.first] Used for pawns that have 3 names
     * @param {String} [names.nick] Used for pawns that have 3 names
     * @param {String} [names.last] Used for pawns that have 3 names
     * @param {Function} callback
     */
  setName(names,callback){
    let err = null;
    switch(this.name.$.Class){
      case 'NameSingle':
        if(names.name){
          const num = this.name.name.match(/\d+/g);
          this.name.name = names.name;

          if(this.name.numerical && !(/\d/).test(this.name.name)){
            this.name.name += ` ${num[0]}`;
          }
        } else {
          err = new Error('Missing `name` property');
        }
        break;
      case 'NameTriple':
        this.name.first = names.first || this.name.first;
        this.name.nick = names.nick || this.name.nick;
        this.name.last = names.last || this.name.last;
        break;
      default:
        err = new Error(`Unsupported pawn name type "${this.name.$.Class}"`);
        break;
    }

    callback(err);
  }

  setSkill(name,level,options){
    const filtered = {
      xpSinceLastLevel: options.xpSinceLastLevel,
      xpSinceMidnight: options.xpSinceMidnight,
      passion: options.passion
    };

    const index = this.skills.skills.li.findIndex((item) => {
      return item.def === name;
    });
    this.skills.skills.li[index] = Object.assign(this.skills.skills.li[index],{
      level,
      ...options
    });
  }

  /**
     * Set pawn's apparel item
     * @param {Object} options Set any option to null to remove it
     * @param {String|Null} [options.def]
     * @param {String|Null} [options.id]
     * @param {Number|Null} [options.health]
     * @param {Number|Null} [options.stackCount]
     * @param {String|Null} [options.stuff]
     * @param {String|Null} [options.quality]
     * @param {String|Null} [options.color]
     * @param {Boolean|Null} [options.colorActive]
     * @param {Number|Null} [options.energy]
     * @param {Number|Null} [options.lastKeepDisplayTick]
     * @param {String|Null} [options.pos]
     * @param {Function} callback
     */
  setApparel(options,callback){
    const id = options.id || null;

    const index = this.apparel.wornApparel.findIndex((apparel) => {
      return apparel.id === id;
    });

    if(index !== -1){
      const item = this.apparel.wornApparel[index];
      Object.keys(options).forEach((key) => {
        const val = options[key];
        if(val === null){
          delete item[key];
        } else {
          item[key] = val;
        }
      });
    } else {
      this.apparel.wornApparel.push(new Apparel(options));
    }

    callback(null);
  }
}

module.exports = Pawn;
