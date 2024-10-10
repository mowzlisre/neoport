const { contextBridge, shell, ipcRenderer } = require("electron");
const fs = require('fs');
const Papa = require('papaparse');
const { identifyDataType } = require("./lib/parser");
const { createHiddenDirectory, preRunCheck, checkForExisting, saveFile, openProject, decrypt } = require("./lib/preferences");
const { getDataBaseStatus } = require("./lib/neo4j");
const path = require('path');

contextBridge.exposeInMainWorld( 'ipcRenderer', {
    send: (channel, data) => {
      ipcRenderer.send(channel, data);
    },
    on: (channel, listener) => {
        ipcRenderer.on(channel, (event, args) => listener(args));
    },
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
  }
);

contextBridge.exposeInMainWorld('electron', {
    openHttp: (url) => {
        shell.openExternal(url);
    },
    getLines: (filePath, headers) => {
        return new Promise((resolve, reject) => {
            const file = fs.createReadStream(filePath);
            let lineCount = 0;

            Papa.parse(file, {
                step: () => {
                    lineCount++;
                },
                complete: () => {
                    resolve(lineCount - (headers === true ? 1 : 0));
                },
                error: (error) => {
                    reject(error);
                }
            });
        });
    },
    getData: (filePath, headers, start, end, dataType, process) => {
        return new Promise((resolve, reject) => {
            const file = fs.createReadStream(filePath);
            let lineCount = 0;
            let partialData = [];
    
            Papa.parse(file, {
                dynamicTyping: true,
                step: (result) => {
                    if (lineCount >= start && lineCount < end) {
                        if (headers.length === result.data.length) {
                            const rowData = {};
                            for (let i = 0; i < headers.length; i++) {
                                if(process === 'init'){
                                    let res = identifyDataType(result.data[i])
                                    rowData[headers[i]] = res[0]
                                    dataType[headers[i]][res[1]]++

                                } else{
                                    rowData[headers[i]] = result.data[i]
                                }
                                
                            }
                            partialData.push(rowData);
                        }
                    }
                    lineCount++;
                },
                complete: () => {
                    resolve({data: partialData, dataType: dataType});
                },
                error: (error) => {
                    reject(error);
                }
            });
        });
    },    
    getHeaders : (filePath, headers) => {
        return new Promise((resolve, reject) => {
            const file = fs.createReadStream(filePath);
    
                Papa.parse(file, {
                    step: (result) => {

                    if (headers === true) {
                        if (result.data && result.data.length > 0) {
                            resolve(result.data);
                        }
                    } else {
                        const defaultHeaders = Array.from({ length: result.data.length }, (_, i) => `Field ${i + 1}`);
                        resolve(defaultHeaders);
                    }
                    },
                    error: (error) => {
                        reject(error);
                    }
                });
        });
    },
    saveProject: (data, filePath) => {
        try {
            const jsonData = JSON.stringify(data, null, 2);
            fs.writeFileSync(filePath, jsonData);
        } catch (error) {
            console.error('Error saving data to JSON file:', error);
        }
    },
    createProject: (data) => {
        createHiddenDirectory()
        const path = saveFile(data)
        return path
    },
    getProjectName : (filePath) => {
        const baseName = path.basename(filePath);
        const projectName = baseName.replace(path.extname(baseName), '');
        return projectName;
    },
    renameProject: (oldPath, projectName) => {
        return new Promise((resolve, reject) => {
            if(projectName === '' || projectName === undefined || projectName === null){
                return reject("Error: Saving file")
            }
            
            if (!fs.existsSync(oldPath)) {
                return reject(`Error: File "${oldPath}" does not exist.`);
            }
            const directory = path.dirname(oldPath);
            const extension = path.extname(oldPath);
            let newPath = path.join(directory, `${projectName}${extension}`);
            if (fs.existsSync(newPath)) {
                let counter = 1;
                const baseName = projectName;
                while (fs.existsSync(newPath)) {
                    newPath = path.join(directory, `${baseName}_${counter}${extension}`);
                    counter++;
                }
            }
            fs.rename(oldPath, newPath, (err) => {
                if (err) {
                    return reject(`Error renaming file: ${err.message}`);
                }
                resolve({
                    message: `File renamed to ${path.basename(newPath)}`,
                    newPath: newPath
                });
            });
        });
    },
    checkForExisting: checkForExisting,
    loadFromBuffer: openProject,

});

contextBridge.exposeInMainWorld('settings', {
    testConnection: getDataBaseStatus,
    getPref: () => {
        return preRunCheck()
    },
});