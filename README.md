# VScode extension for DaphneDSL

## Launch in 'Development Host' window

1. Clone this repository
2. `cd` into the folder
3. Run `npm install` from the repo root
4. Run `code .` to open repository in VSC
5. Build the extension (both client and server) with `⌘+shift+B`
6. Open the Run and Debug view with `⌘+shift+D` and press <br>the green arrow `Launch Client`.  
    This will open a new window with `[Extension Development Host]`
7. Open example.daphne from tmp folder to check available functionality <br> (for .daphne and .daph files)

## Local installation

1. Run `npm install -g @vscode/vsce` <br>
to install "vsce", the CLI tool for managing VS Code extensions
2. Clone this repository
3. `cd` into the folder
3. Run `vsce package`
- VSC-DaphneDSL-extension.vsix is generated in the same folder

5. VSC `⌘+shift+D` to open extensions pane
<br> At the top click on `...` 
<br> and choose `Install from VSIX...` 

## Extension functionality

  > Activated right away on file opening

  > Autocomplition for DaphneDSL Builtin functions  
  - via a list, parsed from Builtins.md file at each start
  > Diagnostics   
  - detects function names which have typos. Underlines + shows their location in VSC Problems panel
  > Hover functionality   
  - Hover is activated only for builtin function names, upon hovering over a name   
  (at the moment works only for names without following characters)
  > Brackets and parentheses pairing, indentation, highlighing and matching

## Examples

type: outerAdd   
- a name of a builtin function. Upon hover a defenition is presented.  

type: out1rAdd( or outerAdd()   
- the text recognised as a builtin function with a typo. Gets underlines with its location and error message shown in Problems panel  

type: ou / out / oute and etc. 
- an autocomplete window appears. Upon pressing enter full name with an opening parentheses is insertered.

type: { or [
- a matching characted is autocompleted.

## Structure
- daphneData folder contains Builtins.md and LanguageRef.md which are copied, as is, from daphne repository.
- The extension parses Builtins.md for names of builtin fanctions and saves data in parsedBuiltins.txt
- As sql functions are supported in daphneDSL, but are not listed anywhere in documentation, a list of sql functions is saved in sqlFunctions.txt, which is used to avoid trigger of diagnostics on them
- casts.txt contains cast operators "as.///" 
- language-configuration.json file added for support of brackets / parentheses handling
- all functionality is defined in server folder
- server/types.ts defines position of the element.
- server/documents.ts defines an object in that position (wordUnderCursor)
- server.ts reads the entred text and call methods upon it
- all methods are defined in server/methods/textDocument folder
- server/methods also contain an initialize.ts file which makes the first request from the client to the server.  
- tmp folder contain a sample .daphne file which can be used for testing with 'Development Host'
