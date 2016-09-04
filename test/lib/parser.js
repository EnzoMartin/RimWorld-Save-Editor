require('../_helper');
const xmlMock = '<savegame>0.14</savegame>';
const objMock = {savegame:'0.14'};

const Parser = proxyquire('../lib/parser',{
    xml2js: {
        Parser:function Parser(){
            this.parseString = (str,callback) =>{
                if(str){
                    callback(null,objMock);
                } else {
                    callback(new Error('Failure'));
                }
            };
        },
        Builder:function Builder(){
            this.buildObject = () =>{
                return xmlMock;
            };
        }
    }
});


describe('invoking parser module', () =>{
    it('should return a JS object converted from the XML', (done) =>{
        Parser.parse(xmlMock,(err,result) =>{
            expect(err).toBe(null);
            expect(typeof result).toEqual('object');
            expect(result.savegame).toEqual('0.14');
            done();
        });
    });

    it('should compile the passed object into an XML string', () =>{
        const compiled = Parser.compile(objMock);
        expect(compiled).toEqual(xmlMock);
        expect(typeof compiled).toEqual('string');
    });

    describe('with an invalid XML source', () =>{
        it('should return the error to the callback', (done) =>{
            Parser.parse('',(err,result) =>{
                expect(err).toNotBe(null);
                done();
            });
        });
    });
});
