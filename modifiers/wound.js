// Base health tracker object setup
const healthTracker = [{
    hediffSet:[{
        hediffs:[{
            li:[]
        }]
    }]
}];

/**
 * Ensure the health tracker and related properties exist
 * @param {Object} pawn
 * @returns {*}
 */
function verifyPawnHealthProperty(pawn){
    pawn.healthTracker = Object.assign(healthTracker,pawn.healthTracker);
    return pawn;
}

/**
 * Add a new Hediff definition
 * @param {Object} pawn
 * @param {Object} injury
 * @returns {*}
 */
function addHediff(pawn,injury){
    pawn.healthTracker[0].hediffSet[0].hediffs[0].li.push(injury);
    return pawn;
}

module.exports = {
    /**
     * Add blood loss
     * @param {Object} pawn
     * @param {Number} [severity]
     * @returns {*}
     */
    addBloodLoss(pawn,severity){
        pawn = this.addBodyInjury(pawn,'BloodLoss',{
            severity
        });
        return pawn;
    },
    /**
     * Add a body part injury
     * @param {Object} pawn
     * @param {String} type Type of injury
     * @param {Object} [options]
     * @param {Number} [options.partIndex] Index of the body part to apply the injury to
     * @param {Number} [options.severity]
     * @param {Number} [options.infectionChanceFactor]
     * @param {Number} [options.painFactor]
     * @param {String} [options.source] Type of thing that caused the injury
     * @param {String} [options.sourceBodyPartGroup] The part group of the thing that caused the injury
     * @param {Number} [options.ticksToDisappear]
     * @param {Boolean} [options.isOld]
     * @returns {*}
     */
    addBodyInjury:(pawn,type,options) =>{
        pawn = verifyPawnHealthProperty(pawn);
        options = options || {};

        let className = 'Hediff_Injury';
        if(typeof options.ticksToDisappear === 'number'){
            className = 'HediffWithComps';
        }

        const injury = Object.assign({
            $: {
                Class: className
            },
            def: 'Cut',
            ticksSinceCreation: 1,
            severity: 20
        },options);

        // Need to convert to having each value in an array
        /*
        options = Object.keys(options).reduce((opts,key) =>{
            opts[key] = [opts[key]];
            return opts;
        },{});
        */

        pawn = addHediff(pawn,injury);
        return pawn;
    }
};
