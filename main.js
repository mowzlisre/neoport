const { app, BrowserWindow } = require("electron");
const url = require('url')
const path = require('path')

const createMainWindow = () => {
    const mainWindow = new BrowserWindow({
        title: "NeoPort",
        minWidth: 1200,
        minHeight: 800,
        width: 1200,
        height: 800,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, './preload.js'),
            //devTools: false
        },
        
    })
    const startUrl = url.format({
        pathname: path.join( __dirname, 'app/build/index.html'),
        protocol: 'file'
    })
    // mainWindow.loadURL(startUrl)

    mainWindow.loadURL("http://localhost:3000")
}

app.whenReady().then(() => {
    createMainWindow()
})


app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});