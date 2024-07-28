import { documents, TextDocumentIdentifier } from "../../documents";
import { RequestMessage } from "../../server";
import { Range } from "../../types";
import * as path from "path";
import * as fs from "fs";


const outputFilePath = path.join(__dirname, "../../../../daphneData/parsedBuiltins.txt");
const dictioneryWords = fs.readFileSync(outputFilePath).toString().split("\n");


interface DocumentDiagnosticParams{
    textDocument: TextDocumentIdentifier;
}

namespace DiagnosticSeverity {
    export const Error: 1=1;
    export const Warning: 2=2;
    export const Information: 3=3;
    export const Hint: 4=4;
}

type DiagnosticSeverity = 1 | 2 | 3 | 4 ;

interface Diagnostic {
    range: Range;
    severity: DiagnosticSeverity;
    source: "daphne extension";
    message: string;
    data?: unknown;
}

interface FullDocumentDiagnosticReport {
    kind: "full";
    items: Diagnostic[];
}

export const diagnostic = ( message: RequestMessage ): FullDocumentDiagnosticReport | null => {
    const params = message.params as DocumentDiagnosticParams;
    const content = documents.get(params.textDocument.uri);

    if(!content) {
        return null;
    }

    const wordsInDocument = content.split(/\W/);
    // const invalidWords = new Set(wordsInDocument.filter( (word) => !dictioneryWords.includes(word) ));


    const invalidWords = new Set( wordsInDocument.filter((word) => word !== '' && !dictioneryWords.includes(word)   )  );

    const items: Diagnostic[] = []
    const lines = content.split("\n");

    invalidWords.forEach((invalidWord) => {
        const regex = new RegExp(`\\b${invalidWord}\\b`, "g");

        lines.forEach((line, lineNumber) => {
            let match;

                // Reset the lastIndex to 0 before starting the search in a new line
                // regex.lastIndex = 0;

                // while ((match = regex.exec(line)) !== null) {

                    if ((match = regex.exec(line)) !== null) {
                        items.push({
                            source: "daphne extension",
                            severity: DiagnosticSeverity.Error,
                            range: {
                                start: { line: lineNumber, character: match.index },
                                end: { line: lineNumber, character: match.index + invalidWord.length },
                            },
                            message: `${invalidWord} is not in the dictionary.`
                        });

                        // // Avoid infinite loop by advancing lastIndex if the match is an empty string
                        // if (match.index === regex.lastIndex) {
                        //     regex.lastIndex++;
                        // }
                    }
        });
    });

    return {
        kind: "full",
        items,
    };
};