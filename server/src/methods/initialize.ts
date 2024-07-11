import { RequestMessage } from "../server";

type ServerCapabilities = Record<string, unknown>;

interface InitializeResult {

	capabilities: ServerCapabilities;

	serverInfo?: {
		name: string;
		version?: string;
	};
}

export const initialize = (message: RequestMessage):InitializeResult => {
    return {
        capabilities: { completionProvider: {} },
        serverInfo: {
            name: "daphne_dsl-extensio",
            version: "1",
        },
    }
};