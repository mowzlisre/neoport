import { dispatchStatus } from "./functions";
const { setStoreData, setStatusAction } = require("../../redux/actions/storeActions");
const { checkForAbsolute } = require("./conf");

export function secondsToTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes.toString();
    const secondsStr = remainingSeconds < 9 ? `0${remainingSeconds.toFixed(0)}` : remainingSeconds.toFixed(0);
    return `${minutesStr}m ${secondsStr}s`;
}

export const parseData = async(storeData, dispatch, headers, dataType) => {
    dispatchStatus(dispatch, "Parsing CSV Data")
    const arr = Array.from({ length: Math.ceil((storeData["linesCount"] + 1) / 30000) }, (_, i) => i * 30000).concat(storeData["linesCount"] + 1);
    if (storeData.headers === true) {
        arr[0] = 1;
    }
    let totalTime = 0;
    let iterationsCompleted = 0;
    let etaSeconds = 0;
    const updateInterval = setInterval(() => {
        etaSeconds = Math.max(0, etaSeconds - 1);
        if(etaSeconds === 0) {
            dispatchStatus(dispatch, 'Parsing CSV data')
        } else{
            dispatchStatus(dispatch, `Parsing CSV data ~ ${secondsToTime(etaSeconds)}`)
        }
    }, 1000);

    if (arr.length > 2) {
        for (let i = 0; i < arr.length - 1; i++) {
            const startTime = performance.now();
            let d = await window.electron.getData(storeData.filePath, headers, arr[i], arr[i + 1], dataType, 'init');
            dataType = d.dataType
            const endTime = performance.now();
            const iterationTime = (endTime - startTime) / 1000; 
            totalTime += iterationTime; 
            iterationsCompleted++;
            const avgIterationTime = totalTime / iterationsCompleted;
            etaSeconds = avgIterationTime * (arr.length - 1 - iterationsCompleted);
        }
    } else {
        let d = await window.electron.getData(storeData.filePath, headers, arr[0], arr[1], dataType, 'init');
        dataType = d.dataType
        etaSeconds = 0; 
    }

    clearInterval(updateInterval); 
    dispatchStatus(dispatch, "Parsing CSV Data Complete");
    dataType = checkForAbsolute(dataType, storeData.parseDataTypes);
    return dataType;
}


export const fetchData = async (storeData, setColumns, dispatch, navigate, toast) => {
    try {
        dispatchStatus(dispatch, "Reading File")
        let headers = []
        let dataType = {}
        if (storeData.filePath !== null) {
            const n = await window.electron.getLines(storeData.filePath, storeData.headers)
            storeData["linesCount"] = n;
            headers = await window.electron.getHeaders(storeData.filePath, storeData.headers)
            setColumns(headers);
            headers.map((item, index) => {
                dataType[headers[index]] = {
                    NULL: 0, LIST: 0, MAP: 0, BOOLEAN: 0, INTEGER: 0, FLOAT: 0, STRING: 0, ByteArray: 0
                }
            })
            storeData["dataTypes"] = dataType
            let start = 0
            if (storeData.headers === true) {
                start = 1
            }
            let d = await window.electron.getData(storeData.filePath, headers, start, start+10, dataType)
            storeData["csvData"] = d.data.slice(0, 10)
            if(storeData.parseDataTypes === true){
                dataType = await parseData(storeData, dispatch,  headers, dataType)
            }
            storeData["dataTypes"] = dataType;
            dispatch(setStoreData(storeData));
        }
        // else {
        //     window.ipcRenderer.send('returnOnFileNotFoundErrorToWelcome');
        //     return;
        // }
        dispatchStatus(dispatch, "")


    } catch (error) {
        console.error("Error:", error);
    }
};


export const checkNodeInRelationships = (relationships, nodeName) => {
    let flag = false
    for (let key in relationships) {
        if (relationships.hasOwnProperty(key)) {
            let relationship = relationships[key];
            if (relationship.node1 === nodeName || relationship.node2 === nodeName) {
                flag = true
            }
        }
    }
    return flag
}