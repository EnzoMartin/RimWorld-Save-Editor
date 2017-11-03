const idManager = require('../ids').instance;

class Apparel {
  constructor(data){
    if(!data.id){
      data.id = idManager.generateId(data.def, 'thing');
    }

    Object.keys(data).forEach((key) => {
      this[key] = data[key];
    });
  }
}

module.exports = Apparel;
