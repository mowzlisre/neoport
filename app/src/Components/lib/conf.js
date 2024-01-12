export const filterArraysByDataType = (data, setColumnType) => {
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

    // Update columnType based on the data types and assign all data types with their counts
    const newColumnTypes = data[0].map((_, columnIndex) => {
        const columnData = data.map((row) => row[columnIndex]);
        const counts = countDataTypes(columnData);

        let maxDataType = 'string'; // Default to string if no other data type has a higher count
        let maxCount = 0;

        for (const dataType in counts) {
            if (counts[dataType] > maxCount) {
                maxCount = counts[dataType];
                maxDataType = dataType;
            }
        }

        // Check if the maxDataType and the count of the maxDataType match
        const abs = maxDataType === 'string' ? true : counts[maxDataType] === maxCount;

        return {
            dataTypeCounts: counts,
            maxDataType: maxDataType,
            abs: abs,
        };
    });

    setColumnType(newColumnTypes);

    // Type cast values based on the newColumnTypes
    const filteredData = data.map((row) => {
        return row.map((element, columnIndex) => {
            if (element === "true" || element === "True") {
                return true;
            } else if (element === "false" || element === "False") {
                return false;
            } else if (!isNaN(element)) {
                if (Number.isInteger(parseFloat(element))) {
                    return parseInt(element);
                } else {
                    return parseFloat(element);
                }
            }
            return element;
        });
    });

    let s = [];

    newColumnTypes.forEach(item => {
        const dataTypeCounts = item.dataTypeCounts;
        let sum = 0;
        for (const dataType in dataTypeCounts) {
            sum += dataTypeCounts[dataType];
        }
        item["abs"] = item.maxDataType === 'string' ? true : item.dataTypeCounts[item.maxDataType] === sum;
        s.push(item);
    });
    return filteredData;
};
