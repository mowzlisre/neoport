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
  linesCount: 0
  // Add any other state properties you need
};


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
        linesCount: action.payload.linesCount,
      };
    default:
      return state;
  }
};
export default storeReducer;

