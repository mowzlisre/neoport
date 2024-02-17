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

export const defaultConf = {
  database : {
      URI : "neo4j://localhost:7687",
      username:"neo4j",
      password:"12345678"
  }
}

export const validateProperties = (current) => {
  let flag = false;
  if(current.attributes && Object.keys(current.attributes).length !== 0){
      if (current.issues && Object.values(current.issues).some(value => value === true)) {
          flag = true;
      }
      if(!Object.values(current.attributes).every(param => param.key && param.key.trim() !== '')){
          flag = true;
      }
      if(!Object.values(current.attributes).every(param => param.value && param.value.trim() !== '')){
          flag = true;
      }
  } else {
      flag = false;
  }
  if (current.name === null || current.name === ''){
      flag = true; 
  }
  if (current.index === null || current.index === ''){
      flag = true; 
  }
  return flag;
}