import { RequestMessage } from "../../server";
import * as fs from "fs"

const words = fs.readFileSync("/langData").toString().split("\n");
// server/langData/langData.txt
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
        items: 
        [
            {label: "Check"},
          //  {label: "TypeScript"},
          //  {label: "LSP"},
            {label: "Lua"},
        ],
    };
};