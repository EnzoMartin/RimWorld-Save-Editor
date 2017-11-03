const Singleton = require('singleton-class');

class UniqueIDsManager extends Singleton {
  constructor(items){
    super();

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
     * Get the next ID for a given type, and increment it afterwards
     * @param {String} type
     * @returns {Number}
     */
  getNextID(type){
    let key;

    switch(type.toLowerCase()){
      case 'faction':
        key = 'nextFactionID';
        break;
      case 'verb':
        key = 'nextVerbID';
        break;
      case 'lord':
        key = 'nextLordID';
        break;
      case 'tale':
        key = 'nextTaleID';
        break;
      default:
        key = 'nextThingID';
        break;
    }

    const id = this[key];

    // Increment the next ID so it's valid in the game
    this[key]++;

    return id;
  }

  /**
     * Generate a valid ID
     * @param {String} definition Definition name without numbers
     * @param {String} type Thing, Faction, Lord, etc.
     * @returns {string}
     */
  generateId(definition,type){
    return `${definition}${this.getNextID(type)}`;
  }
}

module.exports = UniqueIDsManager;
