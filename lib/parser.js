const filterObjectsByDataType = (data) => {
    // Function to count occurrences of data types in a column
    const countDataTypes = (column) => {
        const counts = {
            integer: 0,
            float: 0,
            string: 0,
            boolean: 0,
        };
        column.forEach((element) => {
            if (typeof element === 'boolean') {
                counts.boolean++;
            } else if (typeof element === 'number') {
                if (Number.isInteger(element)) {
                    counts.integer++;
                } else {
                    counts.float++;
                }
            } else if (typeof element === 'string') {
                const parsedValue = parseFloat(element);
                if (!isNaN(parsedValue) && Number.isInteger(parsedValue)) {
                    counts.integer++;
                } else if (!isNaN(parsedValue)) {
                    counts.float++;
                } else if (element.toLowerCase() === 'true' || element.toLowerCase() === 'false') {
                    counts.boolean++;
                } else {
                    counts.string++;
                }
            } else {
                counts.string++;
            }
        });
        
        return counts;
    };
  
    // Extract column data from the array of objects
    const columnData = {};
    data.forEach((row) => {
        for (const key in row) {
            if (!columnData[key]) {
                columnData[key] = [];
            }
            columnData[key].push(row[key]);
        }
    });
  
    // Update columnType based on the data types and assign all data types with their counts
    const newColumnTypes = Object.keys(columnData).map((columnName) => {
        const counts = countDataTypes(columnData[columnName]);
      
        let maxDataType = 'string'; // Default to string if no other data type has a higher count
        let maxCount = 0;
        let totalCounts = 0;
      
        for (const dataType in counts) {
          if (counts[dataType] > maxCount) {
            maxCount = counts[dataType];
            maxDataType = dataType;
          }
          totalCounts += counts[dataType];
        }
      
        // Check if the maxDataType and the count of the maxDataType match
        const abs = counts[maxDataType] === maxCount && totalCounts !== maxCount;
      
        return {
          dataTypeCounts: counts,
          maxDataType: maxDataType,
          abs: abs,
        };
      });
      
  
    // Type cast values based on the newColumnTypes
    const filteredData = data.map((row) => {
        const newRow = { ...row };
        for (const columnName in newRow) {
            const element = newRow[columnName];
            if (element === "true" || element === "True") {
                newRow[columnName] = true;
            } else if (element === "false" || element === "False") {
                newRow[columnName] = false;
            } else if (!isNaN(element)) {
                if (Number.isInteger(parseFloat(element))) {
                    newRow[columnName] = parseInt(element);
                } else {
                    newRow[columnName] = parseFloat(element);
                }
            }
        }
        return newRow;
    });
  
    return { data: filteredData, columnType: newColumnTypes} ;
  };

  

module.exports = { filterObjectsByDataType };