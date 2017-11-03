/**
 * Ensure the health tracker and related properties exist
 * @param {Object} pawn
 * @returns {*}
 */
function verifyPawnHealthProperty(pawn){
  if(!pawn.healthTracker){
    pawn.healthTracker = [{}];
  }

  if(!pawn.healthTracker[0].hediffSet){
    pawn.healthTracker[0] = {hediffSet:[{}]};
  }

  if(!pawn.healthTracker[0].hediffSet[0].hediffs || !pawn.healthTracker[0].hediffSet[0].hediffs.length){
    pawn.healthTracker[0].hediffSet[0] = {hediffs:[{}]};
  }

  if(!pawn.healthTracker[0].hediffSet[0].hediffs[0].li){
    pawn.healthTracker[0].hediffSet[0].hediffs[0] = {li:[]};
  }

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
    pawn = this.addBodyInjury(pawn,'BloodLoss',severity ? {severity} : {});
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
     * @param {Number} [options.ticksSinceCreation]
     * @param {Boolean} [options.isOld]
     * @returns {*}
     */
  addBodyInjury:(pawn,type,options) => {
    pawn = verifyPawnHealthProperty(pawn);
    options = options || {};
    let className = '';

    switch(type){
      case 'BloodLoss':
        className = '';
        break;
      default:
        className = 'Hediff_Injury';
        if(typeof options.ticksToDisappear === 'number'){
          className = 'HediffWithComps';
        }
        break;
    }

    const injuryClass = className ? {
      $: {
        Class: className
      }
    } : {};

    const injury = Object.assign(
      injuryClass,
      {
        def: type,
        ticksSinceCreation: typeof options.ticksSinceCreation === 'undefined' ? 1 : options.ticksSinceCreation,
        severity: typeof options.severity === 'undefined' ? 20 : options.severity
      },
      options
    );

    pawn = addHediff(pawn,injury);
    return pawn;
  }
};
