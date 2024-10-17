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
            if (parse === true) {
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


export const formatFileSize = (fileSizeInBytes) => {
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
  database: {
    URI: "neo4j://localhost:7687",
    username: "neo4j",
    password: ""
  }
}

export const validateProperties = (current, setCurrent) => {
  let flag = false;
  if (current.attributes && Object.keys(current.attributes).length !== 0) {
    if (current.issues && Object.values(current.issues).some(value => value === true)) {
      flag = true;
    }
    if (!Object.values(current.attributes).every(param => param.key && param.key.trim() !== '')) {
      flag = true;
    }
    if (!Object.values(current.attributes).every(param => param.value && param.value.trim() !== '')) {
      flag = true;
    }
  } else {
    flag = false;
  }
  if (current.name === null || current.name === '') {
    flag = true;
  }
  if (current.index === null || current.index === '') {
    flag = true;
  }
  return flag;
}

export const validateAndFixEntities = (structure) => {
  const nodes = structure.nodes;
  const relationships = structure.relationships;
  for (const relationshipName in relationships) {
    const relationship = relationships[relationshipName];
    if (!(relationship.node1 in nodes)) {
      relationship.node1 = '';
    }
    if (!(relationship.node2 in nodes)) {
      relationship.node2 = '';
    }
  }
  structure["nodes"] = nodes
  structure["relationships"] = relationships
  return structure
}

export function validateProjectData(projectData) {
  const nodes = projectData.nodes;
  const relationships = projectData.relationships;

  const nodeKeys = Object.keys(nodes);
  const relationshipKeys = Object.keys(relationships);

  if (nodeKeys.length === 0) {
    return { valid: false, error: 'Node keys cannot be empty.' };
  }

  
  

  for (const relKey of relationshipKeys) {
    const relationship = relationships[relKey];
    const { node1, node2, name } = relationship;

    if (!node1 || !node2) {
      return { valid: false, error: `Relationship "${relKey}" is missing node1 or node2.` };
    }

    if (!(node1 in nodes) || !(node2 in nodes)) {
      return { valid: false, error: `Relationship "${relKey}" refers to non-existing node(s): ${node1} or ${node2}.` };
    }

    if (!name.trim()) {
      return { valid: false, error: `Relationship "${relKey}" must have a name.` };
    }

    if (relationship.type !== 'relationships') {
      return { valid: false, error: `Relationship "${relKey}" has an invalid type: ${relationship.type}` };
    }
    
  }
  for (const nodeKey of nodeKeys) {
    const node = nodes[nodeKey];

    if (!node.name.trim() || !nodeKey.trim()) {
      return { valid: false, error: `Nodes must have a name.` };
    }
    if (node.type !== 'node') {
      return { valid: false, error: `Node "${nodeKey}" has an invalid type: ${node.type}.` };
    }

    if (Object.keys(node.attributes).length === 0) {
      return { valid: false, error: `Node "${nodeKey}" must have at least one attribute.` };
    }
    
    if (!node.index || node.index.length === 0) {
      return { valid: false, error: `Node "${nodeKey}" must have an indexed attribute.` };
    }
    
    for (const attrKey in node.attributes) {
      const attribute = node.attributes[attrKey];
      if (!attribute.key || !attribute.value) {
        return { valid: false, error: `Node "${nodeKey}" has an invalid attribute at index ${attrKey}. Attributes must have both a key and a value.` };
      }
    }
  }

  return { valid: true, error: null };
}

export const primaryColor = "#6495ED"
export const primaryColorBg = "#6495ED22"