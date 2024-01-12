const { contextBridge, shell } = require("electron");

const os = require('os')

contextBridge.exposeInMainWorld('electron', {
    openHttp: (url) => {
        shell.openExternal(url)
    }

})