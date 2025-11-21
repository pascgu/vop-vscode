"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
function activate(context) {
    let currentPanel = undefined;
    context.subscriptions.push(vscode.commands.registerCommand('vop-vscode.showWorkflow', () => {
        if (currentPanel) {
            currentPanel.reveal();
            return;
        }
        currentPanel = vscode.window.createWebviewPanel('vop-vscode.workflow', 'Workflow', vscode.ViewColumn.Beside, {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.file(path.join(context.extensionPath, 'dist'))
            ],
            retainContextWhenHidden: true,
            enableCommandUris: true,
        });
        currentPanel.onDidDispose(() => {
            currentPanel = undefined;
        });
        // Get the path to the bundle.js file
        const bundlePath = vscode.Uri.file(path.join(context.extensionPath, 'dist', 'bundle.js'));
        // Convert the path to a webview URI
        const bundleUri = currentPanel.webview.asWebviewUri(bundlePath);
        const cssPath = vscode.Uri.file(path.join(context.extensionPath, 'dist', 'reactflow.css'));
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
    }));
}
