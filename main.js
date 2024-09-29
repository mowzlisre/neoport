const { app, BrowserWindow, ipcMain, Menu, globalShortcut } = require("electron");
const path = require("path");
let welcomeWindow;
let mainWindow;

const route = "http://localhost:3000/#";

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

    welcomeWindow = createWindow(800, 500, welcomeUrl, {
        resizable: false,
        frame: false,
    });

    mainWindow.webContents.openDevTools()

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
    mainWindow.webContents.openDevTools()

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    return mainWindow;
};

app.whenReady().then(() => {
    Menu.setApplicationMenu(null);
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

    createWelcomeWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWelcomeWindow();
});
