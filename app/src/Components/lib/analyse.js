const { Text } = require("@chakra-ui/react");
const { setStoreData } = require("../../redux/actions/storeActions");
const { checkForAbsolute } = require("./conf");

export function secondsToTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes.toString();
    const secondsStr = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds.toString();
    return `${minutesStr}m ${secondsStr}s`;
}

export const parseData = async(storeData, dispatch, setStatus, headers, dataType) => {
    setStatus("Parsing CSV Data 0%")
    const arr = Array.from({ length: Math.ceil((storeData["linesCount"] + 1) / 10000) }, (v, i) => i * 10000).concat(storeData["linesCount"] + 1);
    if (storeData.headers === true) {
        arr[0] = 1
    }
    if (arr.length > 2) {
        for (let i = 0; i < arr.length - 1; i++) {
            let d = await window.electron.getData(storeData.filePath, headers, arr[i], arr[i + 1], dataType, 'init')
            if (i === 0) {
                storeData["csvData"] = d.data.slice(0, 10)
                dispatch(setStoreData(storeData));
            }
            dataType = d.dataType
            setStatus(`Parsing CSV data (${(((i + 1) * 100) / arr.length - 1).toFixed(0)}%) ~ ${secondsToTime((arr.length - i) * 4)}`)
        }
    } else {
        let d = await window.electron.getData(storeData.filePath, headers, arr[0], arr[1], dataType, 'init')
        storeData["csvData"] = d.data.slice(0, 10)
        dataType = d.dataType
    }
    dataType = checkForAbsolute(dataType, storeData.parseDataTypes)
    return dataType
}

export const fetchData = async (storeData, setColumns, dispatch, navigate, toast, setStatus) => {
    try {
        setStatus("Reading file")
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
                dataType = await parseData(storeData, dispatch, setStatus, headers, dataType)
            }
            storeData["dataTypes"] = dataType;
            dispatch(setStoreData(storeData));
        } else {
            toast({
                title: <Text fontSize={'sm'}>File not found</Text>, status: "error", duration: 3000, variant: "subtle"
            });
            navigate('/upload');
            return;
        }
        setStatus("")


    } catch (error) {
        console.error("Error:", error);
    }
};
