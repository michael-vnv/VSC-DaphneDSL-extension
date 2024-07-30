import * as path from "path";
import { workspace, ExtensionContext } from "vscode";

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from "vscode-languageclient/node";

let client: LanguageClient;

export function activate(context: ExtensionContext) {

  // The server is implemented in node
  const serverModule = context.asAbsolutePath(
    path.join("server", "out", "server.js")

  );

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.stdio },
    debug: {
      module: serverModule,
      transport: TransportKind.stdio,
    },
  };

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    // Registers the server for indicated file type
    documentSelector: [{ scheme: "file", language: "daphne" }],
    synchronize: {
      // Notifies the server about file changes to '.clientrc files contained in the workspace
      fileEvents: workspace.createFileSystemWatcher("**/.clientrc"),
    },
  };

  // Creates the language client and starts it.
  client = new LanguageClient(
    "Daphne language-server-id",
    "Daphne language server name",
    serverOptions,
    clientOptions
  );

  // Starts the client and server.
  client.start();
}

// Stops the client
export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}