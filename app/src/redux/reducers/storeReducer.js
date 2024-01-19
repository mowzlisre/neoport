const initialState = {
  csvData : {},
  filePath: null,
  fileName: null,
  fileSize: null,
  headers: true,
  nodes : {},
  relationships : {},
  dataTypes: {},
  parseDataTypes: false,
  // Add any other state properties you need
};

const initialState_ = {
  "csvData" : {},
  "filePath": "/Users/MowzliSreGWU/Desktop/Dats_Grade.csv",
  "fileName": "Dats_Grade.csv",
  "fileSize": 5769,
  "headers": true,
  "nodes" : {},
  "parseDataTypes": false,
  "relationships" : {},
  "dataTypes": {
      "H1": {
          "NULL": 0,
          "LIST": 0,
          "MAP": 0,
          "BOOLEAN": 0,
          "INTEGER": 0,
          "FLOAT": 0,
          "STRING": 0,
          "ByteArray": 0,
          "abs": true
      },
      "H2": {
          "NULL": 0,
          "LIST": 0,
          "MAP": 0,
          "BOOLEAN": 0,
          "INTEGER": 0,
          "FLOAT": 0,
          "STRING": 0,
          "ByteArray": 0,
          "abs": true
      },
      "H3": {
          "NULL": 0,
          "LIST": 0,
          "MAP": 0,
          "BOOLEAN": 0,
          "INTEGER": 0,
          "FLOAT": 0,
          "STRING": 0,
          "ByteArray": 0,
          "abs": true
      },
      "H4": {
          "NULL": 0,
          "LIST": 0,
          "MAP": 0,
          "BOOLEAN": 0,
          "INTEGER": 0,
          "FLOAT": 0,
          "STRING": 0,
          "ByteArray": 0,
          "abs": true
      },
      "H5": {
          "NULL": 0,
          "LIST": 0,
          "MAP": 0,
          "BOOLEAN": 0,
          "INTEGER": 0,
          "FLOAT": 0,
          "STRING": 0,
          "ByteArray": 0,
          "abs": true
      },
      "H6": {
          "NULL": 0,
          "LIST": 0,
          "MAP": 0,
          "BOOLEAN": 0,
          "INTEGER": 0,
          "FLOAT": 0,
          "STRING": 0,
          "ByteArray": 0,
          "abs": true
      },
      "H7": {
          "NULL": 0,
          "LIST": 0,
          "MAP": 0,
          "BOOLEAN": 0,
          "INTEGER": 0,
          "FLOAT": 0,
          "STRING": 0,
          "ByteArray": 0,
          "abs": true
      },
      "H8": {
          "NULL": 0,
          "LIST": 0,
          "MAP": 0,
          "BOOLEAN": 0,
          "INTEGER": 0,
          "FLOAT": 0,
          "STRING": 0,
          "ByteArray": 0,
          "abs": true
      },
      "Q1": {
          "NULL": 0,
          "LIST": 0,
          "MAP": 0,
          "BOOLEAN": 0,
          "INTEGER": 0,
          "FLOAT": 0,
          "STRING": 0,
          "ByteArray": 0,
          "abs": true
      },
      "Q2": {
          "NULL": 0,
          "LIST": 0,
          "MAP": 0,
          "BOOLEAN": 0,
          "INTEGER": 0,
          "FLOAT": 0,
          "STRING": 0,
          "ByteArray": 0,
          "abs": true
      },
      "Proj1": {
          "NULL": 0,
          "LIST": 0,
          "MAP": 0,
          "BOOLEAN": 0,
          "INTEGER": 0,
          "FLOAT": 0,
          "STRING": 0,
          "ByteArray": 0,
          "abs": true
      },
      "Proj2": {
          "NULL": 0,
          "LIST": 0,
          "MAP": 0,
          "BOOLEAN": 0,
          "INTEGER": 0,
          "FLOAT": 0,
          "STRING": 0,
          "ByteArray": 0,
          "abs": true
      },
      "Bool": {
          "NULL": 0,
          "LIST": 0,
          "MAP": 0,
          "BOOLEAN": 0,
          "INTEGER": 0,
          "FLOAT": 0,
          "STRING": 0,
          "ByteArray": 0,
          "abs": true
      }
  }
}

const storeReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_STORE_DATA":
      return {
        ...state,
        filePath: action.payload.filePath,
        fileName: action.payload.fileName,
        fileSize: action.payload.fileSize,
        dataTypes: action.payload.dataTypes,
        parseDataTypes: action.payload.parseDataTypes,
      };
    default:
      return state;
  }
};
export default storeReducer;

