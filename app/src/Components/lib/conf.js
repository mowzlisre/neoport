export const checkForAbsolute = (obj, parse) => {
  for (const outerKey in obj) {
      if (obj.hasOwnProperty(outerKey) && typeof obj[outerKey] === 'object') {
          const innerObj = obj[outerKey];
          let maxValue = -Infinity;
          let sum = 0;

          for (const innerKey in innerObj) {
              if (innerObj.hasOwnProperty(innerKey)) {
                  const innerValue = innerObj[innerKey];
                  sum += innerValue;
                  if (innerValue > maxValue) {
                      maxValue = innerValue;
                      if(parse === true){
                        innerObj["maxDataType"] = innerKey;
                      }
                  }
              }
          }

          innerObj["abs"] = (sum === maxValue);
      }
  }
  return obj;
};


export const formatFileSize = (fileSizeInBytes) =>  {
    if (fileSizeInBytes < 1024) {
      return `${fileSizeInBytes} bytes`;
    } else if (fileSizeInBytes < 1024 * 1024) {
      const fileSizeInKB = (fileSizeInBytes / 1024).toFixed(2);
      return `${fileSizeInKB} KB`;
    } else if (fileSizeInBytes < 1024 * 1024 * 1024) {
      const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
      return `${fileSizeInMB} MB`;
    } else {
      const fileSizeInGB = (fileSizeInBytes / (1024 * 1024 * 1024)).toFixed(2);
      return `${fileSizeInGB} GB`;
    }
  }