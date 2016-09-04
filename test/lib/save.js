require('../_helper');
const loggingSpy = expect.createSpy();
const Save = proxyquire('../lib/save',{
    '../config':{
        Game: {
            supportedVersions: ['~0.14']
        },
        logger: {
            child: () =>{
                return {error:loggingSpy};
            }
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

const corruptedMock = {};

describe('invoking save module', () =>{
    it('should return that the save file is supported', () =>{
        expect(Save.isSupported(supportedMock)).toBe(true);
    });

    it('should return that the save file is not supported', () =>{
        expect(Save.isSupported(unsupportedMock)).toBe(false);
    });

    describe('with a corrupted save file', () =>{
        it('should return that the save file is not supported and log out the error', () =>{
            expect(Save.isSupported(corruptedMock)).toBe(false);
            expect(loggingSpy).toHaveBeenCalled();
        });
    });
});
