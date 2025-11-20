# Where to view logs in VSCode

## build

When hitting F5, the default task for building is called.

Results of 'npn run compile' are shown in the Terminal.

## backend

Logs are written in 'DEBUG CONSOLE' of the developping VSCode.

Here we see logs for src/codeParser.ts and src/extension.ts

## frontend

When the extension is launched with F5, a new window of VSCode is opened, lets call it the test VScode.

We need a file to test the extension, for example :
test.py
--
from machine import Pin
import time

led = Pin(25, Pin.OUT)
while True:
    led.value(1)
    time.sleep(1)
    led.value(0)
    time.sleep(1)

You must select the Python interpreter if not already done.

- Now Ctrl+Shift+P and execute the command 'VoP: Open Workflow Editor' to open the extension panel
- Now Ctrl+Shift+P and execute the command 'Developer: Open Webview Developer Tools' to see the console for the webview

Here you'll see some backend messages (like debug console) and the frontend messages that starts with '[VoP Webview Logs]'

# Create Vscode extension

## 1. Create github project

Create a repos in github (vop-vscode) and clone it here : C:\Users\xxxxx\source\repos

## 1. Install NodeJS and npm

- Go to : https://nodejs.org/fr/download
- Select version LTS (in my case : 24.11.1)
- Click Windows Installer (.msi) to download
- Run the msi. Check the "add to PATH" is checked (restart your terminal if already opened).

## 2. Install Yo

`npm install -g yo generator-code`

Go to the github repos and go to parent dir, ex: C:\Users\xxxxx\source\repos

`yo code`

Answer to questions :

- What type of extension...? : New Extension (TypeScript)
- What's the name of your extension? : vop-vscode (name of the repos, it will write in ...\repos\vop-vscode)
- What's the identifier...? : (Enter for default)
- What's the description...? : Visual workflow editor side-by-side with code
- Initialize a git repository? : No (or n) because already done
- Bundle the source code with Webpack? : Yes (Important for React).
- Which package manager...? : npm.
