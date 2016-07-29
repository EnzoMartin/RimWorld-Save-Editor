module.exports = (skills, level) => {
    return skills.map((item) =>{
        item.level = [level];
        delete item.xpSinceLastLevel;

        return item;
    });
};
