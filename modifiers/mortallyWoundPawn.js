// Set to healthTracker
module.exports = {
    hediffSet:{
        hediffs:{
            li:[
                {
                    def:'BloodLoss',
                    ticksSinceCreation:'1',
                    severity:'20'
                },
                {
                    $: { Class:'Hediff_Injury' },
                    def: 'Cut',
                    ticksSinceCreation: '1',
                    source: 'MeleeWeapon_Knife',
                    partIndex: '0',
                    severity: '20',
                    infectionChanceFactor: '10'
                },
                {
                    $: { Class:'Hediff_Injury' },
                    def: 'Cut',
                    ticksSinceCreation: '1',
                    source: 'MeleeWeapon_Knife',
                    partIndex: '0',
                    severity: '20',
                    infectionChanceFactor: '10'
                },
                {
                    $: { Class:'Hediff_Injury' },
                    def: 'Gunshot',
                    ticksSinceCreation: '1',
                    partIndex: '0',
                    severity: '20',
                    infectionChanceFactor: '10',
                    painFactor: '20'
                },
                {
                    $: { Class:'Hediff_Injury' },
                    def: 'Gunshot',
                    ticksSinceCreation: '1',
                    partIndex: '0',
                    severity: '20',
                    infectionChanceFactor: '10',
                    painFactor: '20'
                },
                {
                    $: { Class:'Hediff_Injury' },
                    def:'Crack',
                    ticksSinceCreation:'1',
                    source:'Human',
                    sourceBodyPartGroup:'RightHand',
                    partIndex:'0',
                    severity:'20'
                }
            ]
        }
    },
    surgeryBills:{
        bills: {}
    },
    immunity:{
        bills: {}
    }
};
