const { contextBridge, shell } = require("electron");
const fs = require('fs');
const Papa = require('papaparse');
const { filterObjectsByDataType } = require("./lib/parser");

// Separate function for readFile functionality
function readFileFunction(path, headers, startLine = 1, endLine = 10000) {
    return new Promise((resolve, reject) => {
        let linesCount = 0;
        let partialData = '';

        const readStream = fs.createReadStream(path, { encoding: 'utf-8' });

        readStream.on('data', (chunk) => {
            partialData += chunk;
            const lines = partialData.split('\n');
            const remainingLines = lines.length - 1;

            if (linesCount + remainingLines >= endLine) {
                readStream.close();
                const partialContent = lines.slice(startLine - 1, endLine - linesCount + startLine - 1).join('\n');
                parseCSV(partialContent);
            } else {
                linesCount += remainingLines;
            }
        });

        readStream.on('end', () => {
            parseCSV(partialData);
        });

        function parseCSV(data) {
            Papa.parse(data, {
                header: headers,
                skipEmptyLines: true,
                complete: (results) => {
                    const arrayOfHeaders = headers === true ? results.meta.fields : [];
                    const filteredData = filterObjectsByDataType(results.data);
                    if (headers === true) {
                        filteredData["headers"] = arrayOfHeaders;
                    } else {
                        const arrayOfObjects = results.data.map((array) => {
                            const obj = {};
                            array.forEach((value, index) => {
                                obj[`column ${index + 1}`] = value;
                            });
                            return obj;
                        });
                        filteredData["headers"] = arrayOfObjects;
                    }
                    resolve(filteredData);
                },
                error: (error) => {
                    reject(error);
                }
            });
        }
    });
}

contextBridge.exposeInMainWorld('electron', {
    openHttp: (url) => {
        shell.openExternal(url);
    },
    readFile: (path, headers, startLine = 1, endLine = 10000) => {
      return readFileFunction(path, headers, startLine, endLine);
  },
});
