import * as vscode from 'vscode';
import * as path from 'path';
import { initTreeSitter, parseCodeWithTreeSitter, extractFunctionsAndCalls, generateWorkflowNodesAndEdges } from './treeSitterUtils';

export async function activate(context: vscode.ExtensionContext) {
    try {
        await initTreeSitter(context);
    } catch (e) {
        vscode.window.showErrorMessage("Failed to initialize parser: " + e);
    }

    let currentPanel: vscode.WebviewPanel | undefined = undefined;

    const showWorkflow = async () => {
        if (!vscode.window.activeTextEditor) {
            console.error("LOG(Ext): No active text editor found.");
            vscode.window.showErrorMessage("No active text editor found.");
            return;
        }

        if (currentPanel) {
            currentPanel.reveal(vscode.ViewColumn.Beside);
            return;
        }

        currentPanel = vscode.window.createWebviewPanel(
            'vop-vscode.workflow',
            'Workflow Visualization',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [
                    vscode.Uri.file(path.join(context.extensionPath)),
                    vscode.Uri.file(path.join(context.extensionPath, 'dist'))
                ]
            }
        );

        const editor = vscode.window.activeTextEditor;
        const document = editor.document;
        const code = document.getText();
        const language = document.languageId;

        console.log(`LOG(Ext): Active Document: ${document.fileName}, Language: ${language}`);

        try {
            const tree = parseCodeWithTreeSitter(code, language);
            const { functions, calls } = extractFunctionsAndCalls(tree, code);
            const { nodes, edges } = generateWorkflowNodesAndEdges(functions, calls);

            console.log(`LOG(Ext): final Nodes: ${nodes.length}, final Edges: ${edges.length}`);

            if (nodes.length === 0) {
                vscode.window.showInformationMessage("No functions or calls could be extracted from the code.");
            }

            const bundleScriptUri = currentPanel.webview.asWebviewUri(
                vscode.Uri.file(path.join(context.extensionPath, 'dist', 'bundle.js'))
            );
            const reactFlowCssUri = currentPanel.webview.asWebviewUri(
                vscode.Uri.file(path.join(context.extensionPath, 'dist', 'reactflow.css'))
            );

            console.log("LOG(Ext): Update Webview HTML.");
            currentPanel.webview.html = getWebviewContent(currentPanel.webview, context.extensionUri,
                                                         bundleScriptUri, reactFlowCssUri, nodes, edges);
        } catch (error) {
            console.error(`LOG(Ext): Failed to generate workflow in extension host: ${error}`);
            vscode.window.showErrorMessage(`Failed to generate workflow: ${error}`);
        }
    };

    const getWebviewContent = (
        webview: vscode.Webview,
        extensionUri: vscode.Uri,
        bundleScriptUri: vscode.Uri,
        reactFlowCssUri: vscode.Uri,
        nodes: any[],
        edges: any[]
    ) => {
        // 1. Definition of the Content Security Policy (CSP)
        const cspSource = webview.cspSource;
        const nonce = getNonce();
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Workflow Visualization</title>
                
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}' ${cspSource};">

                <link rel="stylesheet" type="text/css" href="${reactFlowCssUri}"> 
                
                <script nonce="${nonce}">
                    console.log("LOG(Webview): HTML JS is working and ready to load bundle.");
                    console.log("LOG(Webview): bundleScriptUri = ${bundleScriptUri}");
                </script>
                
            </head>
            <body>
                <div id="root" style="width: 100%; height: 100vh;"></div>
                <script nonce="${nonce}">
                    // global data
                    window.nodes = ${JSON.stringify(nodes)};
                    window.edges = ${JSON.stringify(edges)};
                </script>
                <script src="${bundleScriptUri}"></script>
            </body>
            </html>
        `;
    };

    let showWorkflowCommand = vscode.commands.registerCommand('vop-vscode.showWorkflow', showWorkflow);
    context.subscriptions.push(showWorkflowCommand);
}

export function deactivate() {}

/**
 * Generate a random nonce.
 */
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}