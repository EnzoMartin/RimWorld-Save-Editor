require('../_helper');
proxyquire.noPreserveCache();
const items = proxyquire('./mocks/items',{});
const Item = require('../../modifiers/item');

describe('invoking item modifier',() => {
  after(() => {
    proxyquire.preserveCache();
  });

  it('modifies the health of the item', () => {
    expect(items.apparel.health[0]).toEqual('120');
    const modified = Item.setHealth(items.apparel,100);
    expect(modified.health[0]).toEqual('100');
  });

  it('modifies the quality of the item', () => {
    expect(items.apparel.quality[0]).toEqual('Normal');
    const modified = Item.setQuality(items.apparel,'Masterwork');
    expect(modified.quality[0]).toEqual('Masterwork');
  });

  it('does not modify the health of an item that doesn\'t have a health attribute', () => {
    expect(typeof items.steel.health).toEqual('undefined');
    const modified = Item.setHealth(items.steel,100);
    expect(typeof modified.health).toEqual('undefined');
  });

  it('does not modify the quality of an item that doesn\'t have a quality attribute', () => {
    expect(typeof items.steel.quality).toEqual('undefined');
    const modified = Item.setQuality(items.steel,'Masterwork');
    expect(typeof modified.quality).toEqual('undefined');
  });
});
