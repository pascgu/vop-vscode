import * as vscode from 'vscode';
import * as path from 'path';
const { Parser, Language, Query } = require('web-tree-sitter');

//let Parser: any;
let parser: any;
let pythonLang: any;
let jsLang: any;
let isInitialized = false;

// Init function. Call it in extension.ts
export async function initTreeSitter(context: vscode.ExtensionContext) {
    if (isInitialized) {return;}

    try {
        await Parser.init();
        parser = new Parser();
        const parsersDir = path.join(context.extensionPath, 'parsers');
        
        // Loading of WASM files
        console.log("load python language from: %s", path.join(parsersDir, 'tree-sitter-python.wasm'));
        pythonLang = await Language.load(path.join(parsersDir, 'tree-sitter-python.wasm'));
        jsLang = await Language.load(path.join(parsersDir, 'tree-sitter-javascript.wasm'));
        
        isInitialized = true;
        console.log("Tree-sitter WASM initialized successfully");
    } catch (e) {
        console.error("Error initializing tree-sitter:", e);
        throw e;
    }
}

export function parseCodeWithTreeSitter(code: string, language: string) {
    if (!isInitialized) {
        throw new Error("Tree-sitter is not initialized. Call initTreeSitter first.");
    }
    console.log(`LOG: Parsing code for language: ${language}`);

    if (language === 'javascript' || language === 'typescript') {
        parser.setLanguage(jsLang);
    } else if (language === 'python') {
        parser.setLanguage(pythonLang);
    } else {
        throw new Error(`Unsupported language: ${language}`);
    }

    const tree = parser.parse(code);
    console.log(`LOG: Tree parsing completed. Root node type: ${tree.rootNode.type}`);
    // console.log("LOG: Root node structure (for debug):", tree.rootNode.toString()); // more debug
    return tree;
}

export function extractFunctionsAndCalls(tree: any, code: string) {
    const functions: Array<{ id: string, name: string, node: any }> = [];
    const calls: Array<{ caller: string, callee: string }> = [];

    const language = parser.language; 
    
    const functionQueryText = `(function_definition name: (identifier) @func-name body: (block) @func-body)`;
    const callQueryText = `(call function: (identifier) @call-name)`;

    let functionQuery, callQuery;
    try {
        functionQuery = new Query(language, functionQueryText);
        callQuery = new Query(language, callQueryText);
        console.log("LOG: Queries Tree-sitter Function and Call created.");
    } catch (error) {
        console.error("Failed to create query:", error);
        return { functions, calls };
    }

    const functionMatches = functionQuery.matches(tree.rootNode);
    const callMatches = callQuery.matches(tree.rootNode);

    console.log(`LOG: ${functionMatches.length} functions found.`);
    console.log(`LOG: ${callMatches.length} calls found.`);

    functionMatches.forEach((match: any) => {
        const nameNode = match.captures.find((c: any) => c.name === 'func-name')?.node || match.captures[0].node;
        const name = code.substring(nameNode.startIndex, nameNode.endIndex);
        
        const bodyNode = match.captures.find((c: any) => c.name === 'func-body')?.node || match.captures[1].node;
        
        functions.push({ id: name, name: name, node: bodyNode });
    });

    callMatches.forEach((match: any) => {
        const callNode = match.captures[0].node;
        const callName = code.substring(callNode.startIndex, callNode.endIndex);

        let caller = 'main';
        functions.forEach(func => {
            if (callNode.startIndex >= func.node.startIndex && callNode.endIndex <= func.node.endIndex) {
                caller = func.id;
            }
        });

        calls.push({ caller, callee: callName });
    });

    return { functions: functions.map(f => ({ id: f.id, name: f.name })), calls };
}

export function generateWorkflowNodesAndEdges(
  functions: Array<{ id: string, name: string }>,
  calls: Array<{ caller: string, callee: string }>
) {
  console.log(`LOG: Generate graph. Functions: ${functions.length}, Calls: ${calls.length}.`);
  const nodes = functions.map((func, index) => ({
    id: func.id,
    position: { x: 100 + (index % 5) * 200, y: 100 + Math.floor(index / 5) * 150 },
    data: { label: func.name }
  }));

  nodes.push({ id: 'print', position: { x: 500, y: 100 }, data: { label: 'print' } });
  nodes.push({ id: 'main', position: { x: 700, y: 100 }, data: { label: 'main' } });

  const edges = calls.map((call, index) => ({
    id: `e${index}`,
    source: call.caller,
    target: call.callee
  }));

  console.log(`LOG: ${nodes.length} nodes and ${edges.length} edges generated.`);
  return { nodes, edges };
}