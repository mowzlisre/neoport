const initialState = {
  projectTitle: null,
  projectDescription: null,
  projectHash: null,
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

const initialStatus = {
  status: ''
}

const storeReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_STORE_DATA":
      return {
        ...state,
        projectTitle: action.payload.projectTitle,
        projectDescription: action.payload.projectDescription,
        projectHash: action.payload.projectHash,
        csvData: action.payload.csvData,
        filePath: action.payload.filePath,
        fileName: action.payload.fileName,
        fileSize: action.payload.fileSize,
        headers: action.payload.headers,
        nodes: action.payload.nodes,
        relationships: action.payload.relationships,
        dataTypes: action.payload.dataTypes,
        parseDataTypes: action.payload.parseDataTypes,
        linesCount: action.payload.linesCount,
      };
    default:
      return state;
  }
};

const statusReducer = (state = initialStatus, action) => {
  switch(action.type) {
    case "SET_STATUS":
      return {
      ...state,
      status: action.payload.status
    }
    default:
      return state
  }
}

module.exports = {storeReducer, statusReducer}