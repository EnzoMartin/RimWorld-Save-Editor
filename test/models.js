require('./_helper');
proxyquire.noPreserveCache();

const warnSpy = expect.createSpy();

const base = {
    '../package.json': {
        name: 'mock',
        version: 1
    },
    bunyan: () =>{
        return {
            warn: warnSpy
        };
    }
};

const osx = Object.assign({},base,{
    os: {
        platform: () =>{
            return 'darwin';
        }
    }
});

const windows = Object.assign({},base,{
    os: {
        platform: () =>{
            return 'win32';
        }
    }
});

const linux = Object.assign({},base,{
    os: {
        platform: () =>{
            return 'linux';
        }
    }
});

const unsupported = Object.assign({},base,{
    os: {
        platform: () =>{
            return 'hal';
        }
    }
});

const Models = proxyquire('../config/models',base);

const validGame = {
    gameConfig:{
        skillLevel:10,
        healthLevel:50,
        qualityLevel:'Normal',
        saveDir:'C:\\Test',
        saveName:'Hello',
        modifiedNamePrefix:'Foo',
        colonyFaction:'Faction_1'
    }
};

const invalidGame = Object.assign({},validGame,{
    gameConfig: {
        skillLevel: 50
    }
});

const validActions = Object.assign({},validGame,{
    quickActionsConfig: {
        setColonyPeace: true,
        setWorldPeace: true,
        woundHostilePawns: false,
        upgradePawnSkills: false,
        upgradePawnEquipment: false,
        upgradePawnApparel: false,
        upgradeItems: false,
        upgradeArt: false
    }
});

const invalidActions = Object.assign({},{
    quickActionsConfig: {
        setColonyWar: true,
        setWorldWar: true,
        setColonyPeace: true,
        setWorldPeace: true
    }
});

describe('invoking models', () =>{
    after(() =>{
        proxyquire.preserveCache();
    });

    afterEach(() =>{
        warnSpy.reset();
    });

    it('should return a base configuration model with default options', () =>{
        const config = new Models({});
        expect(config.name).toEqual('mock');
        expect(config.version).toEqual(1);
        expect(typeof config.logger).toEqual('object');
        expect(warnSpy).toHaveBeenCalled();
        Object.keys(validGame.gameConfig).forEach((key) =>{
            expect(typeof config.Game[key]).toNotEqual('undefined');
        });
    });

    describe('should set a different default save path for platform', () =>{
        beforeEach(() =>{
            process.env.HOME = 'home/test';
            process.env.USERNAME = 'Test';
        });

        it('Mac OSX', () =>{
            const Models = proxyquire('../config/models',osx);
            const config = new Models({});
            expect(config.Game.saveDir).toInclude('~/Library/Application');
        });

        it('Windows', () =>{
            const Models = proxyquire('../config/models',windows);
            const config = new Models({});
            expect(config.Game.saveDir).toInclude('Users\\Test');
        });

        it('Linux', () =>{
            const Models = proxyquire('../config/models',linux);
            const config = new Models({});
            expect(config.Game.saveDir).toInclude('home/test/.config');
        });

        it('Unsupported', () =>{
            expect(function (){
                proxyquire('../config/models',unsupported);
            }).toThrow(/supported/);
        });
    });

    describe('with custom game options',() =>{
        it('should return the same values that are passed in if valid', () =>{
            const config = new Models(validGame);
            Object.keys(validGame.gameConfig).forEach((key) =>{
                expect(config.Game[key]).toEqual(validGame.gameConfig[key]);
            });
            expect(warnSpy).toNotHaveBeenCalled();
        });

        it('should return the default values for invalid options', () =>{
            const config = new Models(invalidGame);
            expect(config.Game.skillLevel).toNotEqual(invalidGame.gameConfig.skillLevel);
            expect(warnSpy).toHaveBeenCalled();
        });
    });

    describe('with custom quick actions options',() =>{
        it('should return the same values that are passed in if valid', () =>{
            const config = new Models(validActions);
            Object.keys(validActions.quickActionsConfig).forEach((key) =>{
                expect(config.QuickActions[key]).toEqual(validActions.quickActionsConfig[key]);
            });
            expect(warnSpy).toNotHaveBeenCalled();
        });

        it('should warn that actions will be ignored if there are conflicting actions set', () =>{
            const config = new Models(invalidActions);
            expect(warnSpy).toHaveBeenCalled();
        });
    });
});
