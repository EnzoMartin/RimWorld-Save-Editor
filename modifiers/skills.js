/**
 * Set skills of a pawn
 * @param {Array} skills
 * @param {Number} level
 * @returns {Array}
 */
module.exports = (skills, level) =>{
    return skills.map((item) =>{
        item.level = [level];
        delete item.xpSinceLastLevel;

        return item;
    });
};
