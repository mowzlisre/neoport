const { app, BrowserWindow, ipcMain, Menu, globalShortcut } = require("electron");
const path = require("path");
let welcomeWindow;
let mainWindow;
const { spawn, execFile } = require('child_process');
const os = require('os');
const fs = require('fs');
const { checkPythonInstallation, checkPythonEnviroment, checkDependencies } = require("./python-handler");

const route = "http://localhost:3000/#";

const createPreCheckWindow = () => {

    const preCheckUrl = `${route}/precheck`;
    const preCheckWindow = createWindow(800, 500, preCheckUrl, {
        resizable: false,
        frame: false,
    });

    preCheckWindow.on("closed", () => {
        if (!mainWindow) {
            app.quit();
        }
    });

    return preCheckWindow;
};

ipcMain.handle('check-python', async () => {
    return checkPythonInstallation()
});


ipcMain.handle('check-python-env', async () => {
    return checkPythonEnviroment()
});

ipcMain.handle('check-dependencies', async () => {
    return checkDependencies()
});

const createWindow = (width, height, urlPath, options = {}) => {
    const newWindow = new BrowserWindow({
        width: width,
        height: height,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, './preload.js'),
        },
        ...options,
    });
    newWindow.loadURL(urlPath);
    return newWindow;
};

const createWelcomeWindow = (path) => {

    let welcomeUrl = `${route}/prompt`;
    if(path === 'updatedatasource'){
        welcomeUrl = `${route}/updatedatasource`;
    }

    welcomeWindow = createWindow(800, 600, welcomeUrl, {
        resizable: false,
        frame: false,
    });

    welcomeWindow.webContents.openDevTools()

    welcomeWindow.on('closed', () => {
        welcomeWindow = null;
    });

    return welcomeWindow;
};

const createMainWindow = (data) => {
    const mainUrl = `${route}/app`;

    mainWindow = createWindow(1200, 800, mainUrl, {
        title: "NeoPort",
        minWidth: 1200,
        minHeight: 800,
    });

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('openWithFilePath', data);
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    let pythonProcess; 
    
    ipcMain.on('python-start', (event, args) => {
        const scriptPath = path.join(__dirname, `./scripts/${args[0]}.py`);
        const homeDir = os.homedir();
        const venvPath = path.join(homeDir, '.neoport', '.venv');
    
        const pythonExecutable =
            process.platform === 'win32'
                ? path.join(venvPath, 'Scripts', 'python.exe')
                : path.join(venvPath, 'bin', 'python3');
    
        const cli = [pythonExecutable, scriptPath, ...args];
    
        pythonProcess = spawn(cli[0], cli.slice(1));
    
        let stderrData = '';
    
        pythonProcess.stdout.on('data', (data) => {
            mainWindow.webContents.send('python-output', data.toString());
        });
    
        pythonProcess.stderr.on('data', (data) => {
            stderrData += data.toString();

            // Send data to Developer
        });
    
        pythonProcess.on('close', (code) => {
            if (stderrData) {
                console.log(stderrData);
                mainWindow.webContents.send('python-error', stderrData);
            }
            mainWindow.webContents.send('python-exit', code);
        });
    });    
    
    ipcMain.on('python-interrupt', (event) => {
        if (pythonProcess) {
            pythonProcess.kill('SIGINT'); 
            event.sender.send('python-interrupted', 'ETL was interuptted');
            pythonProcess = null;
        } else {
            event.sender.send('python-interrupted', 'No process was running');
        }
    });
    

    return mainWindow;
};

app.whenReady().then(() => {
    Menu.setApplicationMenu(null);

    const preCheckWindow = createPreCheckWindow();

    ipcMain.on("proceedAfterPreCheck", () => {
        if (preCheckWindow) {
            preCheckWindow.close();
            preCheckWindow.on("closed", () => {
                createWelcomeWindow();
            });
        } else {
            createWelcomeWindow();
        }
    });

    globalShortcut.register('CommandOrControl+Shift+I', () => {
        const focusedWindow = BrowserWindow.getFocusedWindow();
        if (focusedWindow) {
            focusedWindow.webContents.toggleDevTools();
        }
    });
    ipcMain.on("closeWindow", () => {
        if (welcomeWindow) welcomeWindow.close();
        if (mainWindow) mainWindow.close();
    });

    ipcMain.on("proceedFromNewProject", (event, data) => {
        if (welcomeWindow) welcomeWindow.close();
        createMainWindow(data);
    });

    ipcMain.on("proceedFromRecentProject", (event, data) => {
        if (welcomeWindow) welcomeWindow.close();
        createMainWindow(data);
    });

    ipcMain.on("proceedFromRawProject", (event, data) => {
        if (welcomeWindow) welcomeWindow.close();
        createMainWindow(data);
        welcomeWindow.webContents.on('did-finish-load', () => {
            welcomeWindow.webContents.send('returnOnProceedFromRawProject');
        });
    });

    ipcMain.on("returnOnFileNotFoundErrorToWelcome", () => {
        if (mainWindow) mainWindow.close();
        welcomeWindow = createWelcomeWindow();
        welcomeWindow.webContents.on('did-finish-load', () => {
            welcomeWindow.webContents.send('returnOnFileNotFoundErrorToWelcome');
        });
    });

    ipcMain.on("returnOnDataSourceMissing", (event, data) => {
        if (mainWindow) mainWindow.close();
        welcomeWindow = createWelcomeWindow('updatedatasource');
        welcomeWindow.webContents.on('did-finish-load', () => {
            welcomeWindow.webContents.send('returnToDataSourceMissing', { data });
        });
    });
    

    ipcMain.on("returnBackToWelcomeScreen", () => {
        if (mainWindow) mainWindow.close();
        createWelcomeWindow();
    });

    // createWelcomeWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWelcomeWindow();
});
