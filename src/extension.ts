import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let currentPanel: vscode.WebviewPanel | undefined = undefined;

    context.subscriptions.push(
        vscode.commands.registerCommand('vop-vscode.showWorkflow', () => {
            if (currentPanel) {
                currentPanel.reveal();
                return;
            }

            currentPanel = vscode.window.createWebviewPanel(
                'vop-vscode.workflow',
                'Workflow',
                vscode.ViewColumn.Beside,
                {
                    enableScripts: true,
                    localResourceRoots: [
                        vscode.Uri.file(path.join(context.extensionPath, 'dist'))
                    ]
                }
            );

            currentPanel.onDidDispose(() => {
                currentPanel = undefined;
            });

            // Get the path to the bundle.js file
            const bundlePath = vscode.Uri.file(
                path.join(context.extensionPath, 'dist', 'bundle.js')
            );

            // Convert the path to a webview URI
            const bundleUri = currentPanel.webview.asWebviewUri(bundlePath);

			const cssPath = vscode.Uri.file(
                path.join(context.extensionPath, 'dist', 'reactflow.css')
            );
            const cssUri = currentPanel.webview.asWebviewUri(cssPath);

            // HTML content for the webview
            currentPanel.webview.html = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Workflow</title>
                    <link rel="stylesheet" type="text/css" href="${cssUri}"> </head>
                <body>
                    <div id="root" style="width: 100%; height: 100vh;"></div>
                    <script src="${bundleUri}"></script>
                </body>
                </html>
            `;
        })
    );
}
