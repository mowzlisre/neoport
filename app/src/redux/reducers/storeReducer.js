const initialState = {
  csvData: [],
  filePath: null,
  fileName: null,
  fileSize: null,
  headers: true,
  dataTypes: {}
  // Add any other state properties you need
};

// const initialState = {
//   "csvData": [
//       {
//           "H1": "10",
//           "H2": "10",
//           "H3": "{name: \"123\"}",
//           "H4": "[\"123\"]",
//           "H5": "",
//           "H6": "9.5",
//           "H7": "10",
//           "H8": "10",
//           "Q1": "93.61904762",
//           "Q2": "81.09756098",
//           "Proj1": "96.75",
//           "Proj2": "97",
//           "Bool": "TRUE"
//       },
//       {
//           "H1": "10",
//           "H2": "10",
//           "H3": "10",
//           "H4": "9.9",
//           "H5": "9.5",
//           "H6": "9",
//           "H7": "10",
//           "H8": "10",
//           "Q1": "76.0952381",
//           "Q2": "66.46341463",
//           "Proj1": "96.5",
//           "Proj2": "86",
//           "Bool": "TRUE"
//       },
//       {
//           "H1": "10",
//           "H2": "10",
//           "H3": "9.5",
//           "H4": "10",
//           "H5": "9.5",
//           "H6": "10",
//           "H7": "10",
//           "H8": "10",
//           "Q1": "86.38095238",
//           "Q2": "85.36585366",
//           "Proj1": "95",
//           "Proj2": "95",
//           "Bool": "TRUE"
//       },
//       {
//           "H1": "10",
//           "H2": "10",
//           "H3": "10",
//           "H4": "10",
//           "H5": "10",
//           "H6": "10",
//           "H7": "10",
//           "H8": "9.8",
//           "Q1": "83.07692308",
//           "Q2": "98.93",
//           "Proj1": "95",
//           "Proj2": "94.5",
//           "Bool": "TRUE"
//       },
//       {
//           "H1": "10",
//           "H2": "10",
//           "H3": "10",
//           "H4": "10",
//           "H5": "9.5",
//           "H6": "9.5",
//           "H7": "10",
//           "H8": "10",
//           "Q1": "91.9047619",
//           "Q2": "95.12195122",
//           "Proj1": "94.5",
//           "Proj2": "91",
//           "Bool": "TRUE"
//       },
//       {
//           "H1": "10",
//           "H2": "10",
//           "H3": "9.8",
//           "H4": "9.9",
//           "H5": "9.9",
//           "H6": "10",
//           "H7": "10",
//           "H8": "10",
//           "Q1": "93.05263158",
//           "Q2": "93.01470588",
//           "Proj1": "94.8",
//           "Proj2": "94.7",
//           "Bool": "TRUE"
//       },
//       {
//           "H1": "10",
//           "H2": "10",
//           "H3": "10",
//           "H4": "10",
//           "H5": "10",
//           "H6": "10",
//           "H7": "9.9",
//           "H8": "10",
//           "Q1": "94.23076923",
//           "Q2": "93.6",
//           "Proj1": "93",
//           "Proj2": "93.17",
//           "Bool": "TRUE"
//       },
//       {
//           "H1": "9.5",
//           "H2": "10",
//           "H3": "10",
//           "H4": "10",
//           "H5": "9.9",
//           "H6": "10",
//           "H7": "10",
//           "H8": "10",
//           "Q1": "88.84210526",
//           "Q2": "85.29411765",
//           "Proj1": "95",
//           "Proj2": "95.3",
//           "Bool": "TRUE"
//       },
//       {
//           "H1": "9.5",
//           "H2": "9.9",
//           "H3": "10",
//           "H4": "10",
//           "H5": "10",
//           "H6": "9.5",
//           "H7": "10",
//           "H8": "10",
//           "Q1": "87.61904762",
//           "Q2": "85.97560976",
//           "Proj1": "94.5",
//           "Proj2": "91",
//           "Bool": "TRUE"
//       }
//   ],
//   "filePath": "/Users/MowzliSreGWU/Desktop/Dats_Grade.csv",
//   "fileName": "Dats_Grade.csv",
//   "fileSize": 5769,
//   "headers": true,
//   "dataTypes": {
//       "H1": {
//           "NULL": 0,
//           "LIST": 0,
//           "MAP": 0,
//           "BOOLEAN": 0,
//           "INTEGER": 0,
//           "FLOAT": 0,
//           "STRING": 0,
//           "ByteArray": 0,
//           "maxDataType": "NULL",
//           "abs": true
//       },
//       "H2": {
//           "NULL": 0,
//           "LIST": 0,
//           "MAP": 0,
//           "BOOLEAN": 0,
//           "INTEGER": 0,
//           "FLOAT": 0,
//           "STRING": 0,
//           "ByteArray": 0,
//           "maxDataType": "NULL",
//           "abs": true
//       },
//       "H3": {
//           "NULL": 0,
//           "LIST": 0,
//           "MAP": 0,
//           "BOOLEAN": 0,
//           "INTEGER": 0,
//           "FLOAT": 0,
//           "STRING": 0,
//           "ByteArray": 0,
//           "maxDataType": "NULL",
//           "abs": true
//       },
//       "H4": {
//           "NULL": 0,
//           "LIST": 0,
//           "MAP": 0,
//           "BOOLEAN": 0,
//           "INTEGER": 0,
//           "FLOAT": 0,
//           "STRING": 0,
//           "ByteArray": 0,
//           "maxDataType": "NULL",
//           "abs": true
//       },
//       "H5": {
//           "NULL": 0,
//           "LIST": 0,
//           "MAP": 0,
//           "BOOLEAN": 0,
//           "INTEGER": 0,
//           "FLOAT": 0,
//           "STRING": 0,
//           "ByteArray": 0,
//           "maxDataType": "NULL",
//           "abs": true
//       },
//       "H6": {
//           "NULL": 0,
//           "LIST": 0,
//           "MAP": 0,
//           "BOOLEAN": 0,
//           "INTEGER": 0,
//           "FLOAT": 0,
//           "STRING": 0,
//           "ByteArray": 0,
//           "maxDataType": "NULL",
//           "abs": true
//       },
//       "H7": {
//           "NULL": 0,
//           "LIST": 0,
//           "MAP": 0,
//           "BOOLEAN": 0,
//           "INTEGER": 0,
//           "FLOAT": 0,
//           "STRING": 0,
//           "ByteArray": 0,
//           "maxDataType": "NULL",
//           "abs": true
//       },
//       "H8": {
//           "NULL": 0,
//           "LIST": 0,
//           "MAP": 0,
//           "BOOLEAN": 0,
//           "INTEGER": 0,
//           "FLOAT": 0,
//           "STRING": 0,
//           "ByteArray": 0,
//           "maxDataType": "NULL",
//           "abs": true
//       },
//       "Q1": {
//           "NULL": 0,
//           "LIST": 0,
//           "MAP": 0,
//           "BOOLEAN": 0,
//           "INTEGER": 0,
//           "FLOAT": 0,
//           "STRING": 0,
//           "ByteArray": 0,
//           "maxDataType": "NULL",
//           "abs": true
//       },
//       "Q2": {
//           "NULL": 0,
//           "LIST": 0,
//           "MAP": 0,
//           "BOOLEAN": 0,
//           "INTEGER": 0,
//           "FLOAT": 0,
//           "STRING": 0,
//           "ByteArray": 0,
//           "maxDataType": "NULL",
//           "abs": true
//       },
//       "Proj1": {
//           "NULL": 0,
//           "LIST": 0,
//           "MAP": 0,
//           "BOOLEAN": 0,
//           "INTEGER": 0,
//           "FLOAT": 0,
//           "STRING": 0,
//           "ByteArray": 0,
//           "maxDataType": "NULL",
//           "abs": true
//       },
//       "Proj2": {
//           "NULL": 0,
//           "LIST": 0,
//           "MAP": 0,
//           "BOOLEAN": 0,
//           "INTEGER": 0,
//           "FLOAT": 0,
//           "STRING": 0,
//           "ByteArray": 0,
//           "maxDataType": "NULL",
//           "abs": true
//       },
//       "Bool": {
//           "NULL": 0,
//           "LIST": 0,
//           "MAP": 0,
//           "BOOLEAN": 0,
//           "INTEGER": 0,
//           "FLOAT": 0,
//           "STRING": 0,
//           "ByteArray": 0,
//           "maxDataType": "NULL",
//           "abs": true
//       }
//   }
// }

const storeReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_STORE_DATA":
      return {
        ...state,
        csvData: action.payload.csvData,
        filePath: action.payload.filePath,
        fileName: action.payload.fileName,
        fileSize: action.payload.fileSize,
        dataTypes: action.payload.dataTypes,
      };
    default:
      return state;
  }
};
export default storeReducer;

