const { app, BrowserWindow } = require("electron");
const url = require('url')
const path = require('path')

const createMainWindow = () => {
    const mainWindow = new BrowserWindow({
        title: "NeoPort",
        minWidth: 1000,
        minHeight: 600,
        width: 1000,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, './preload.js'),
            devTools: false
        },
        
    })
    const startUrl = url.format({
        pathname: path.join( __dirname, 'app/build/index.html'),
        protocol: 'file'
    })
    mainWindow.loadURL(startUrl)

    // mainWindow.loadURL("http://localhost:3000")
}

app.whenReady().then(() => {
    createMainWindow()
})


app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});