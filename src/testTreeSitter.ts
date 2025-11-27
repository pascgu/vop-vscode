import { parseCodeWithTreeSitter, extractFunctionsAndCalls, generateWorkflowNodesAndEdges } from './treeSitterUtils';

const code = `
def hello():
    print("Hello, world!")

def greet(name):
    print(f"Hello, {name}!")

hello()
greet("Alice")
`;

const tree = parseCodeWithTreeSitter(code, 'python');
console.log("Parsed Tree:", tree);

const { functions, calls } = extractFunctionsAndCalls(tree, code);
console.log("Functions:", functions);
console.log("Calls:", calls);

const { nodes, edges } = generateWorkflowNodesAndEdges(functions, calls);
console.log("Nodes:", nodes);
console.log("Edges:", edges);
