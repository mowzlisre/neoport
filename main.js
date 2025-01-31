const { app, BrowserWindow, ipcMain, Menu, globalShortcut } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const os = require("os");
const fs = require("fs");
const { checkPythonInstallation, checkPythonEnviroment, checkDependencies } = require("./python-handler");
const isDev = false
const route = isDev
    ? "http://localhost:3000/#"
    : ``;

const buildPath = path.join(app.getAppPath(), "app", "build", "index.html");

let welcomeWindow;
let mainWindow;

const extractScript = (scriptName) => {
    // Get the script path inside ASAR
    const scriptPathInsideAsar = path.join(__dirname, "scripts", scriptName);

    // Create a temp folder to extract the script
    const tempDir = path.join(os.tmpdir(), "neoport-scripts");
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    // Copy the script to the temp folder
    const extractedScriptPath = path.join(tempDir, scriptName);
    fs.copyFileSync(scriptPathInsideAsar, extractedScriptPath);

    return extractedScriptPath;  // Return the path to the extracted file
};

const createWindow = (width, height, urlPath, options = {}) => {
    const newWindow = new BrowserWindow({
        width: width,
        height: height,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, "./preload.js"),
        },
        ...options,
    });

    if (isDev) {
        newWindow.loadURL(urlPath);
    } else {
        newWindow.loadURL(`${buildPath}#${urlPath}`);
    };

    return newWindow;
};

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

const createWelcomeWindow = (path) => {
    const welcomeUrl = `${route}/prompt`;
    welcomeWindow = createWindow(800, 500, welcomeUrl, {
        resizable: false,
        frame: false,
    });

    if (isDev) welcomeWindow.webContents.openDevTools();

    welcomeWindow.on("closed", () => {
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

    mainWindow.webContents.on("did-finish-load", () => {
        mainWindow.webContents.send("openWithFilePath", data);
    });

    mainWindow.on("closed", () => {
        mainWindow = null;
    });

    let pythonProcess;

    ipcMain.on("python-start", (event, args) => {
        // Extract Python script from ASAR before execution
        const scriptPath = extractScript(`${args[0]}.py`);

        // Choose the correct Python executable
        const pythonExecutable = process.platform === "win32"
            ? path.join(os.homedir(), ".neoport", ".venv", "Scripts", "python.exe")
            : path.join(os.homedir(), ".neoport", ".venv", "bin", "python3");

        const cli = [pythonExecutable, scriptPath, ...args];

        pythonProcess = spawn(cli[0], cli.slice(1));

        let stderrData = "";

        pythonProcess.stdout.on("data", (data) => {
            mainWindow.webContents.send("python-output", data.toString());
        });

        pythonProcess.stderr.on("data", (data) => {
            stderrData += data.toString();
        });

        pythonProcess.on("close", (code) => {
            if (stderrData) {
                console.log(stderrData);
                mainWindow.webContents.send("python-error", stderrData);
            }
            mainWindow.webContents.send("python-exit", code);
        });
    });

    ipcMain.on("python-interrupt", (event) => {
        if (pythonProcess) {
            pythonProcess.kill("SIGINT");
            event.sender.send("python-interrupted", "ETL was interrupted");
            pythonProcess = null;
        } else {
            event.sender.send("python-interrupted", "No process was running");
        }
    });

    return mainWindow;
};

// IPC Handlers
ipcMain.handle("check-python", async () => checkPythonInstallation());
ipcMain.handle("check-python-env", async () => checkPythonEnviroment());
ipcMain.handle("check-dependencies", async () => checkDependencies());

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

    globalShortcut.register("CommandOrControl+Shift+I", () => {
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
        welcomeWindow.webContents.on("did-finish-load", () => {
            welcomeWindow.webContents.send("returnOnProceedFromRawProject");
        });
    });

    ipcMain.on("returnOnFileNotFoundErrorToWelcome", () => {
        if (mainWindow) mainWindow.close();
        welcomeWindow = createWelcomeWindow();
        welcomeWindow.webContents.on("did-finish-load", () => {
            welcomeWindow.webContents.send("returnOnFileNotFoundErrorToWelcome");
        });
    });

    ipcMain.on("returnOnDataSourceMissing", (event, data) => {
        if (mainWindow) mainWindow.close();
        welcomeWindow = createWelcomeWindow("updatedatasource");
        welcomeWindow.webContents.on("did-finish-load", () => {
            welcomeWindow.webContents.send("returnToDataSourceMissing", { data });
        });
    });

    ipcMain.on("returnBackToWelcomeScreen", () => {
        if (mainWindow) mainWindow.close();
        createWelcomeWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWelcomeWindow();
});
