"use strict";
exports.__esModule = true;
var ts = require("typescript");
var MyLanguageServiceHost = /** @class */ (function () {
    function MyLanguageServiceHost() {
        var _this = this;
        this.files = {};
        // settings: { compilerOptions: { types: 'three' }}
        this.log = function (_) { };
        this.trace = function (_) { };
        this.error = function (_) { };
        // getCompilationSettings = ts.getDefaultCompilerOptions;
        this.getCompilationSettings = function () { return ({ target: 1, jsx: 1, baseUrl: ".", paths: { "*": ["custom_typings/*"] } }); };
        this.getScriptIsOpen = function (_) { return true; };
        this.getCurrentDirectory = function () { return ""; };
        this.getDefaultLibFileName = function (_) { return "lib"; };
        // resolveModuleNames = (moduleNames: string[], containingFile: string): ts.ResolvedModule[] => {
        //   return moduleNames.map(name => {
        //       return {
        //           resolvedFileName: name + '.d.ts',
        //       }
        //   });
        // };
        this.getScriptVersion = function (fileName) { return _this.files[fileName].ver.toString(); };
        this.getScriptSnapshot = function (fileName) {
            if (_this.files[fileName]) {
                return _this.files[fileName].file;
            }
        };
    }
    MyLanguageServiceHost.prototype.getScriptFileNames = function () {
        var names = [];
        for (var name in this.files) {
            if (this.files.hasOwnProperty(name)) {
                names.push(name);
            }
        }
        return names;
    };
    MyLanguageServiceHost.prototype.addFile = function (fileName, body) {
        var snap = ts.ScriptSnapshot.fromString(body);
        snap.getChangeRange = function (_) { return undefined; };
        var existing = this.files[fileName];
        if (existing) {
            this.files[fileName].ver++;
            this.files[fileName].file = snap;
        }
        else {
            this.files[fileName] = { ver: 1, file: snap };
        }
    };
    return MyLanguageServiceHost;
}());
// var text = `function test() {
//     var x = ({ y: { z: () => { return ((1 + 3) * 5) / 2; } } }.y)
// }`
var text = "\nimport * as THREE from 'three';\nconst scene = new THREE.";
// var text = `class Person {
//     firstname : string;
//     lastname : string;
//     friendList : Person[];
//     constructor(firstname : string, lastname : string) {
//         this.firstname = firstname;
//         this.lastname = lastname;
//     }
//     public getName() {
//         return this.lastname + ", " + this.firstname;
//     }
//     public getFirstname() {
//         return this.firstname;
//     }
// }
// var p : Person = new Person("Tom","Schindl");
// p.`
var host = new MyLanguageServiceHost();
var languageService = ts.createLanguageService(host, ts.createDocumentRegistry());
// console.log(host.getCompilationSettings())
// const includeFiles = [
//   'three/index'
// ];
// includeFiles.forEach(file => host.addFile('node_modules/@types/' + file, fs.readFileSync(path.join(__dirname, 'node_modules/@types', file)).toString()));
host.addFile("script.ts", text);
// console.log(host.resolveModuleNames(includeFiles, 'mod.ts'));
// console.log(languageService.getQuickInfoAtPosition("script.ts", text.length-1))
// console.log(languageService.getCompletionsAtPosition("script.ts", 69))
var info = languageService.getCompletionsAtPosition("script.ts", text.length);
console.log(info);
// if (info) {
//   console.log('a')
//   info.entries.forEach(i => {
//     // console.log('---------------')
//     // console.log(languageService.getCompletionEntryDetails("script.ts", text.length-1, i.name));
//   })
// } else {
//   console.log('no')
// }
// info.entries().stream().forEach( i -> {
//   languageService.getCompletionEntryDetails(fileId, 424, i.name());
// })
// var program = ts.createProgram(["script.ts"], host.getCompilationSettings(), host);
// var output = languageService.getEmitOutput("script.ts")//.outputFiles[0].text;
// console.log(output)
