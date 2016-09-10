class Game {
    constructor(game){
        Object.keys(game).forEach((key) =>{
            switch(key){
                default:
                    this[key] = game[key];
                    break;
            }
        });
    }
}

module.exports = Game;
