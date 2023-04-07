"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const fs_1 = require("fs");
const path = __importStar(require("path"));
const xslt_processor_1 = require("xslt-processor");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(`Running on ${new Date()}`);
            const sourceFile = (0, core_1.getInput)('source');
            const styleFile = (0, core_1.getInput)('style');
            let outputFile = (0, core_1.getInput)('output');
            (0, fs_1.accessSync)(sourceFile, fs_1.constants.R_OK | fs_1.constants.W_OK);
            (0, fs_1.accessSync)(styleFile, fs_1.constants.R_OK | fs_1.constants.W_OK);
            if (!outputFile) {
                outputFile = `${path.parse(sourceFile).name}.html`;
            }
            let fileContents = undefined;
            fileContents = (0, fs_1.readFileSync)(sourceFile, { encoding: 'utf-8' });
            console.log('Reading XML file...');
            const xmlString = (0, xslt_processor_1.xmlParse)(fileContents);
            fileContents = (0, fs_1.readFileSync)(styleFile, { encoding: 'utf-8' });
            console.log('Reading XSL file...');
            const xsltString = (0, xslt_processor_1.xmlParse)(fileContents);
            const outXmlString = (0, xslt_processor_1.xsltProcess)(xmlString, xsltString);
            (0, fs_1.writeFileSync)(outputFile, outXmlString, { encoding: 'utf-8' });
            console.log("File was generated");
        }
        catch (error) {
            console.error(error);
            (0, core_1.setFailed)(error.message);
        }
    });
}
run();
