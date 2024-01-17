const initialState = {
  filePath: null,
  fileName: null,
  fileSize: null,
  headers: true,
  dataTypes: {},
  parseDataTypes: false,
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
      };
    default:
      return state;
  }
};
export default storeReducer;

