const { contextBridge, shell } = require("electron");
const fs = require('fs');
const Papa = require('papaparse');
const os = require('os');

contextBridge.exposeInMainWorld('electron', {
    openHttp: (url) => {
        shell.openExternal(url);
    },
    readFile: (path, headers) => {
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf-8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    Papa.parse(data, {
                        header: headers,
                        skipEmptyLines: true, 
                        complete: (results) => {
                          const arrayOfHeaders = headers === true ? results.meta.fields : [];
                          if (headers === true) {
                            resolve({data: results.data, headers: arrayOfHeaders})
                          } else{
                            const arrayOfObjects = results.data.map((array) => {
                              const obj = {};
                              array.forEach((value, index) => {
                                obj[`column ${index + 1}`] = value;
                              });
                              return obj;
                            });
                            resolve({data: arrayOfObjects, headers: arrayOfHeaders});
                          }
                        },
                        error: (error) => {
                            reject(error);
                        }
                    });
                }
            });
        });
    },
});
