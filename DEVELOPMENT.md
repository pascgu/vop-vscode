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

# Create github project

Create a repos in github (vop-vscode) and clone it here : C:\Users\xxxxx\source\repos

# Install on windows

## 1. Install NodeJS and npm

- Go to : https://nodejs.org/fr/download
- Select version LTS (in my case : 20.19.6) (pb with v24 when installing tree-sitter)
- Click Windows Installer (.msi) to download
- Run the msi. Check the "add to PATH" is checked (restart your terminal if already opened).

## 2. Install Yeoman and the generator

`npm install -g yo generator-code`

Go to the github repos and go to parent dir, ex: C:\Users\xxxxx\source\repos

`yo code`

Answer to questions :

- What type of extension...? : New Extension (TypeScript)
- What's the name of your extension? : vop-vscode (name of the repos, it will write in ...\repos\vop-vscode)
- What's the identifier...? : (Enter for default)
- What's the description...? : Visual workflow editor side-by-side with code
- Initialize a git repository? : No (or n) because already done
- Which bundler to use? : esbuild (Needed for React).
- Which package manager...? : npm.

## 3. Install VS 2022 with "Desktop Development with C++"

Download VS2022 and install with "Desktop Development with C++"

## 4. Install Python

Download and install https://www.python.org/downloads/

## 5. Continue installation

`npm install`

`npm install react react-flow d3 @types/react @types/d3 --save-dev`

`npm install @types/react-dom react-dom react-flow-renderer --save`

`npm install webpack webpack-cli ts-loader --save-dev`

`npm install style-loader css-loader --save-dev`

## [!WARNING] Stopped here for Windows because can't compile tree-sitter

# install on Ubuntu/WSL 24.04.3 LTS

## install compilator and python 3.11
```
sudo apt update
sudo apt install -y build-essential software-properties-common
```

add Deadsnakes repo
```
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt update
```

install python 3.11 and needed modules (dev, venv, distutils, etc.)
```
sudo apt install -y python3.11 python3.11-dev python3.11-venv python3.11-distutils
sudo apt remove -y command-not-found
```

Configure python 3.11 to be default python (instead of 3.12 which was the default).
Use a bigger priority (313 > 312)
```
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.12 312
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 313
sudo update-alternatives --config python3
```

Check it returns 3.11 : python3 --version

Install pip
```
sudo python3 -m ensurepip --upgrade
```
Check it : pip3 --version

Add alias for python and pip :
```
echo "alias python='python3'" >> ~/.bashrc
echo "alias pip='pip3'" >> ~/.bashrc
source ~/.bashrc
```

Check it returns 3.11 : python --version
Check ir returns 24.0 : pip --version

## install Node.js 20 LTS and npm

```
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
```

```
sudo apt install -y nodejs
```

Check it returns v20.19.6 : `node -v`
Check it returns 10.8.2 : `npm -v`

## install Yeoman and the generator

```
sudo npm install -g yo generator-code
```

## reinstall npm modules

```
cd vop-vscode
npm install
```

## install tree-sitter

```
npm install web-tree-sitter
npm install --save-dev @types/node
```

Download WASM from https://github.com/tree-sitter/tree-sitter.github.io/tree/master :

- tree-sitter-javascript.wasm
- tree-sitter-python.wasm

and save them to ./parsers
