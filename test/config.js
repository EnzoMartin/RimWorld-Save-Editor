require('./_helper');
proxyquire.noPreserveCache().noCallThru();

const configProxy = {
    './config/models': class Configuration {
        constructor(config){
            this.item = config.item || 'bar';
        }
    },
    './config/local': null,
};

const configLocal = Object.assign({},configProxy,{
    './config/local': {
        item: 'foo'
    }
});

describe('invoking config', () =>{
    after(() =>{
        proxyquire.preserveCache().callThru();
    });

    it('should not throw when local config is missing', () =>{
        expect(function (){
            proxyquire('../config',configProxy);
        }).toNotThrow();
    });

    describe('should return the config object', () =>{
        it('with no local overrides when local config missing', () =>{
            const config = proxyquire('../config',configProxy);
            expect(config.item).toEqual('bar');
        });

        it('with local overrides when local config present', () =>{
            const config = proxyquire('../config',configLocal);
            expect(config.item).toEqual('foo');
        });
    });
});
