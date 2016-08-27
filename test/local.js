require('./_helper');
const path = require('path');
const filePath = path.join(__dirname,'/mocks/Test.rws');
const saveFileContents = 'savefile';

const Local = proxyquire('../lib/local',{
    fs: {
        readFile: (path,options,callback) =>{
            callback(null,saveFileContents);
        },
        writeFile: (path,contents,callback) =>{
            callback(null);
        }
    }
});


describe('invoking local file module', () =>{
    it('should return the specified save game file from disk', (done) =>{
        Local.get(filePath,(err,file) =>{
            expect(err).toBe(null);
            expect(file).toEqual(saveFileContents);
            expect(typeof file).toEqual('string');
            done();
        });
    });

    it('should save the specified save game contents to disk', (done) =>{
        Local.save(filePath,saveFileContents,(err) =>{
            expect(err).toBe(null);
            done();
        });
    });
});
