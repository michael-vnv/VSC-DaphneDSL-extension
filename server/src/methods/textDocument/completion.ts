import { RequestMessage } from "../../server";
import * as fs from "fs"


//
// Absolute path. Works.
//
const words = fs.readFileSync("/Users/me/Desktop/project-draft/draft1/server/src/methods/textDocument/words").toString().split("\n");

//
// Relative path 1. Doesn't work.
//
// const words = fs.readFileSync("./words").toString().split("\n");

//
// Relative path 2. Doesn't work.
//
// const path = require('path');
// const wordsPath = path.join(__dirname, 'words');
// const words = fs.readFileSync(wordsPath).toString().split("\n");


const items = words.map((word) => {
    return { label: word };
});

type CompletionItem = {
    label: string;
};

interface CompletionList {
    isIncomplete: boolean;
    items: CompletionItem[];
}

export const completion = (message: RequestMessage ): CompletionList => {
    return {
        isIncomplete: false,
        items,
        // items: [
        //     {label: "TypeScript"},
        //     {label: "LSP"},
        // ],

    };
};
