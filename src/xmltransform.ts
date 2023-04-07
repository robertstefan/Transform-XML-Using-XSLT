import { getInput, setFailed } from '@actions/core';
import { constants, accessSync, readFileSync, writeFileSync } from 'fs';
import * as path from 'path';
import { xsltProcess, xmlParse } from 'xslt-processor';

function run(): void {
    try {
        console.log(`Running on ${new Date()}`);

        const sourceFile: string = getInput('source');
        const styleFile: string = getInput('style');
        let outputFile: string = getInput('output');

        accessSync(sourceFile, constants.R_OK | constants.W_OK);
        accessSync(styleFile, constants.R_OK | constants.W_OK);

        if (!outputFile) {
            outputFile = `${path.parse(sourceFile).name}.html`
        }

        let fileContents = undefined;

        fileContents = readFileSync(sourceFile, { encoding: 'utf-8' })
        console.log('Reading XML file...')
        const xmlString = xmlParse(fileContents);


        fileContents = readFileSync(styleFile, { encoding: 'utf-8' })
        console.log('Reading XSL file...')
        const xsltString = xmlParse(fileContents);

        const outXmlString = xsltProcess(xmlString, xsltString);

        writeFileSync(outputFile, outXmlString, { encoding: 'utf-8' })
        console.log("File was generated")

    } catch (error: any) {
        console.error(error);

        setFailed(error.message);
    }
}

run();
