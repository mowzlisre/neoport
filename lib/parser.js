const identifyDataType = (value) => {
  if (value !== null && value !== '' && value !== 'null' && value !== 'Null' && value !== 'NULL') {
    try {
      const parsedValue = JSON.parse(value);
      if (Array.isArray(parsedValue)) {
        return [parsedValue, 'LIST'];
      } else if (typeof parsedValue === 'object') {
        return [parsedValue, 'LIST'];
      }
    } catch (error) {
      try {
        const parsedObject = eval('(' + value + ')');
        if (typeof parsedObject === 'object' && parsedObject !== null) {
          return [parsedObject, 'MAP'];
        }
      } catch (error) {
      }
    }

    if (value === 'TRUE' || value === 'true' || value === 'True' || value === 'false' || value === 'FALSE' || value === 'False') {
      return [value === 'TRUE' || value === 'true' || value === 'True', 'BOOLEAN'];
    }

    const floatValue = parseFloat(value);
    if (!isNaN(floatValue)) {
      if (Number.isInteger(floatValue)) {
        return [floatValue, 'INTEGER'];
      } else {
        return [floatValue, 'FLOAT'];
      }
    }

    return [value, 'STRING'];
  }
  else {
    return [null, "NULL"]
  }
}

module.exports = { identifyDataType };
