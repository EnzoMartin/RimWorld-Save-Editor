require('./_helper');
const Save = proxyquire('../lib/save',{
    config:{
        Game: {
            supportedVersions: ['~0.14']
        }
    }
});

const supportedMock = {
    gameVersion:[
        '0.14.1000 rev1'
    ]
};

const unsupportedMock = {
    gameVersion:[
        '0.13.1000 rev0'
    ]
};

describe('invoking save module', () =>{
    it('should return that the save file is supported', () =>{
        expect(Save.isSupported(supportedMock)).toBe(true);
    });
    it('should return that the save file is not supported', () =>{
        expect(Save.isSupported(unsupportedMock)).toBe(false);
    });
});
