// const initialState = {
//     csvData: [
//         ["H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "Q1", "Q2", "Proj1", "Proj2"],
//         [10, "true", 10, 10, 9.5, 9.5, 10, 10, 93.61904762, 81.09756098, 96.75, 97],
//         [10, "true", 10, 9.9, 9.5, 9, 10, 10, 76.0952381, 66.46341463, 96.5, 86],
//         [10, "true", 9.5, 10, 9.5, 10, 10, 10, 86.38095238, 85.36585366, 95, 95],
//         [10, "true", 10, 10, 10, 10, 10, 9.8, 83.07692308, 98.93, 95, 94.5],
//         [10, "true", 10, 10, 9.5, 9.5, 10, 10, 91.9047619, 95.12195122, 94.5, 91],
//         [10, "true", 9.8, 9.9, 9.9, 10, 10, 10, 93.05263158, 93.01470588, 94.8, 94.7],
//         [10, "false", 10, 10, 10, 10, 9.9, 10, 94.23076923, 93.6, 93, 93.17],
//         [9.5, "false", 10, 10, 9.9, 10, 10, 10, 88.84210526, 85.29411765, 95, 95.3],
//         [9.5, "false", 10, 10, 10, 9.5, 10, 10, 87.61904762, 85.97560976, 94.5, 91],
//         [10, "false", 10, 10, 10, 8.5, 9.5, 10, 78.0952381, 85.97560976, 95, 95],
//         [10, "false", 10, 10, 10, 10, 9.75, 10, 89.89473684, 92.27941176, 95, 95.7],
//         [10, "false", 10, 9.9, 10, 10, 10, 10, 87.89473684, 94.11764706, 94, 95.7],
//         [10, "false", 10, 9.8, 9.5, 9, 9, 10, 89.42857143, 86.58536585, 95.5, 94],
//         [10, "true", 9.9, 10, 10, 10, 9.8, 9.8, 86.15384615, 60.42, 95.13, 94.17],
//         [10, "true", 9.5, 10, 9.5, 9, 10, 10, 77.9047619, 78.04878049, 96.75, 97],
//         [10, "true", 9.5, 10, 10, 10, 10, 10, 84.76190476, 88.41463415, 96.5, 96],
//         [10, "true", 10, 10, 9.9, 9.8, 10, 10, 94.92307692, 96.46, 95.63, 92.5],
//         [10, "true", 10, 9.9, 10, 7, 8, 8, 76.92307692, 84.71, 98.88, 94],
//         [9.75, "true", 9.5, 9.5, 9.5, 10, 9.5, 10, 65.78947368, 69.85294118, 89, 96.3],
//         [10, "true", 9.5, 9.9, 9.25, 9.5, 10, 10, 68.47619048, 68.90243902, 96.5, 89],
//         [10, "true", 10, 8.8, 9.5, 9.5, 10, 10, 83.61904762, 76.2195122, 95, 95],
//         [0, "true", 0, 10, 9.9, 10, 9.75, 10, 74.10526316, 83.82352941, 90, 96.7],
//         [10, "false", 9.5, 9.5, 9.5, 10, 10, 10, 72.76190476, 79.26829268, 95.5, 94],
//         [10, "false", 9.75, 10, 9.5, 10, 9.75, 10, 91.42857143, 92.68292683, 96.75, 97],
//         [10, "false", 10, 10, 9.9, 9.2, 10, 10, 95.76923077, 76.68, 98.38, 95.17],
//         [10, "false", 10, 10, 10, 10, 9.9, 10, 93.07692308, 85.3, 95.5, 92.67],
//         [10, "false", 10, 10, 10, 10, 10, 10, 71.57894737, 71.32352941, 89.5, 91.3],
//         [10, "false", 10, 10, 9.25, 10, 10, 10, 93.80952381, 95.12195122, 96.5, 96],
//         [10, "false", 9.8, 8, 8, 8, 8, 8, 56.92307692, 72.86, 93.25, 95.33],
//         [10, "false", 10, 10, 10, 10, 10, 10, 93.84615385, 94.53, 99.63, 97.5],
//         [10, "false", 10, 10, 10, 10, 10, 10, 95.76923077, 91.15, 98.5, 93]
//       ],
//     csvData: null,
//     fileName: null,
//     fileSize: null
//   };


const initialState = {
  csvData: [],
  filePath: null,
  fileName: null,
  fileSize: null,
  headers: true,
  dataTypes: []
  // Add any other state properties you need
};

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
      case "SET_HEADERS":
        return {
          ...state,
          headers: action.payload, // Update headers with the new value
        };

    default:
      return state;
  }
};
export default storeReducer;
