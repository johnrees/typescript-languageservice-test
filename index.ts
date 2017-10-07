import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

class MyLanguageServiceHost implements ts.LanguageServiceHost {
  files: { [fileName: string]: { file: ts.IScriptSnapshot; ver: number } } = {}

  // settings: { compilerOptions: { types: 'three' }}

  log = _ => { };
  trace = _ => { };
  error = _ => { };
  // getCompilationSettings = ts.getDefaultCompilerOptions;
  getCompilationSettings = () => ({ baseUrl: "/Users/john/Desktop/typescript-languageservice-test", paths: { "*": ["custom_typings/*"] } })
  // getCompilationSettings = () => ({ target: 1, jsx: 1, baseUrl: ".", paths: { "three": ["./custom_typings/three"] } })
  getScriptIsOpen = _ => true;
  getCurrentDirectory = () => "";
  getDefaultLibFileName = _ => "lib";

  // resolveModuleNames = (moduleNames: string[], containingFile: string): ts.ResolvedModule[] => {
  //   return moduleNames.map(name => {
  //       return {
  //           resolvedFileName: name + '.d.ts',
  //       }
  //   });
  // };

  getScriptVersion = fileName => this.files[fileName].ver.toString();
  getScriptSnapshot = fileName => {
    if (this.files[fileName]) {
      return this.files[fileName].file;
    }
  }

  getScriptFileNames(): string[] {
    var names: string[] = [];
    for (var name in this.files) {
      if (this.files.hasOwnProperty(name)) {
        names.push(name);
      }
    }
    return names;
  }

  addFile(fileName: string, body: string) {
    var snap = ts.ScriptSnapshot.fromString(body);
    snap.getChangeRange = _ => undefined;
    var existing = this.files[fileName];
    if (existing) {
      this.files[fileName].ver++;
      this.files[fileName].file = snap
      } else {
      this.files[fileName] = { ver: 1, file: snap };
    }
  }
}

// var text = `function test() {
//     var x = ({ y: { z: () => { return ((1 + 3) * 5) / 2; } } }.y)
// }`

var text = `
import * as THREE from 'three';
const scene = new THREE.`

// text = `class Person {
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

// const includeFiles = [
//   'three/index'
// ];
// includeFiles.forEach(file => host.addFile('node_modules/@types/' + file, fs.readFileSync(path.join(__dirname, 'node_modules/@types', file)).toString()));


host.addFile("script.ts", text);
console.log(host.getCompilationSettings())
// console.log(host.resolveModuleNames(includeFiles, 'mod.ts'));

// console.log(languageService.getQuickInfoAtPosition("script.ts", text.length-1))
// console.log(languageService.getCompletionsAtPosition("script.ts", 69))

const info = languageService.getCompletionsAtPosition("script.ts", text.length);
console.log(info)
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



const printer: ts.Printer = ts.createPrinter();
const sourceFile: ts.SourceFile = ts.createSourceFile(
  'test.ts', 'const x:number=42', ts.ScriptTarget.ES2015, true, ts.ScriptKind.TS
);
console.log(printer.printFile(sourceFile));
