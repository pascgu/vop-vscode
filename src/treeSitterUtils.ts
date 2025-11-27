const Parser = require('tree-sitter');
const Python = require('tree-sitter-python');
const JavaScript = require('tree-sitter-javascript');

const parser = new Parser();

export function parseCodeWithTreeSitter(code: string, language: string) {
  if (language === 'javascript') {
    parser.setLanguage(JavaScript);
  } else if (language === 'python') {
    parser.setLanguage(Python);
  } else {
    throw new Error(`Unsupported language: ${language}`);
  }

  return parser.parse(code);
}

export function extractFunctionsAndCalls(tree: any, code: string) {
  const functions: Array<{ id: string, name: string, node: any }> = [];
  const calls: Array<{ caller: string, callee: string }> = [];

  const language = parser.getLanguage();
  const functionQueryText = `(function_definition name: (identifier) @func-name body: (block) @func-body)`;
  const callQueryText = `(call function: (identifier) @call-name)`;

  let functionQuery, callQuery;
  try {
    functionQuery = new Parser.Query(language, functionQueryText);
    callQuery = new Parser.Query(language, callQueryText);
  } catch (error) {
    console.error("Failed to create query:", error);
    return { functions, calls };
  }

  const functionMatches = functionQuery.matches(tree.rootNode);
  const callMatches = callQuery.matches(tree.rootNode);

  functionMatches.forEach((match: any) => {
    const nameNode = match.captures[0].node;
    const name = code.substring(nameNode.startIndex, nameNode.endIndex);
    const bodyNode = match.captures[1].node;
    functions.push({ id: name, name: name, node: bodyNode });
  });

  callMatches.forEach((match: any) => {
    const callNode = match.captures[0].node;
    const callName = code.substring(callNode.startIndex, callNode.endIndex);

    // Trouver la fonction appelante
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
  const nodes = functions.map((func, index) => ({
    id: func.id,
    position: { x: 100 + (index % 5) * 200, y: 100 + Math.floor(index / 5) * 150 },
    data: { label: func.name }
  }));

  // Ajouter un nœud pour les fonctions intégrées comme 'print'
  nodes.push({
    id: 'print',
    position: { x: 500, y: 100 },
    data: { label: 'print' }
  });

  // Ajouter un nœud pour 'main'
  nodes.push({
    id: 'main',
    position: { x: 700, y: 100 },
    data: { label: 'main' }
  });

  const edges = calls.map((call, index) => ({
    id: `e${index}`,
    source: call.caller,
    target: call.callee
  }));

  return { nodes, edges };
}
