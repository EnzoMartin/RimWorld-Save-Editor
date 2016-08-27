require('../_helper');
proxyquire.noPreserveCache();
const items = proxyquire('./mocks/items',{});
const Item = require('../../modifiers/item');

describe('invoking item modifier',() =>{
    after(() =>{
        proxyquire.preserveCache();
    });

    it('modifies the health of the item', () =>{
        expect(items.apparel.health[0]).toEqual('120');
        const modified = Item.setHealth(items.apparel,100);
        expect(modified.health[0]).toEqual('100');
    });

    it('modifies the quality of the item', () =>{
        expect(items.apparel.quality[0]).toEqual('Normal');
        const modified = Item.setQuality(items.apparel,'Masterwork');
        expect(modified.quality[0]).toEqual('Masterwork');
    });
});
