const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

// Function to create a hidden directory at the user's home path
function createHiddenDirectory() {
    const homePath = os.homedir(); // Get user's home directory
    const hiddenFolderPath = path.join(homePath, '.neoport');

    // Check if the hidden folder already exists
    if (fs.existsSync(hiddenFolderPath)) {
        console.log("Hidden folder already exist.")
        return;
    }

    // Create the hidden folder
    fs.mkdir(hiddenFolderPath, { recursive: true }, (err) => {
        if (err) {
            console.error('Error creating hidden folder:', err);
        } else {
            console.log('Hidden folder created successfully.');
        }
    });
}

// Function to get details of all files in a directory as objects
function getAllFilesDetails(directoryPath) {
    const files = fs.readdirSync(directoryPath);
    const fileDetails = [];

    files.forEach((file) => {
        const filePath = path.join(directoryPath, file);
        const stats = fs.statSync(filePath);

        // Filter by .neoproj extension and only include files (not directories)
        if (path.extname(file) === '.neoproj' && !stats.isDirectory()) {
            const fileObject = {
                name: file,
                path: filePath,
                size: stats.size, // Size of the file in bytes
                created: stats.birthtime, // Creation time of the file
                modified: stats.mtime, // Last modified time of the file
                isDirectory: stats.isDirectory() // Whether the file is a directory or not
            };

            fileDetails.push(fileObject);
        }
    });

    return fileDetails;
}

function saveFile(data){
    // Example usage
    // Convert the object to a JSON string
    const jsonData = JSON.stringify(data, null, 2);
    const hiddenFolderPath = path.join(os.homedir(), '.neoport');
    // Write JSON string to a file
    fs.writeFile(`${hiddenFolderPath}/${data.projectTitle}.neoproj`, jsonData, (err) => {
    if (err) {
        console.error('Error writing file', err);
    } else {
        console.log('JSON file has been saved.');
    }
    });
    return `${hiddenFolderPath}/${data.projectTitle}.neoproj`
}

function openProject(path){
    try {
        if (fs.existsSync(path)) {
            const bufferData = fs.readFileSync(path, 'utf8');
            return JSON.parse(bufferData);
        } else {
            console.error('Cannot load file');
        }
    } catch (error) {
        console.error('Error loading buffer:', error);
        return "";
    }
}

function checkForExisting(prjtName){
    
    const hiddenFolderPath = path.join(os.homedir(), '.neoport');
    const filesDetails = getAllFilesDetails(hiddenFolderPath);
    
    const isNamePresent = filesDetails.some(dict => dict.name.includes(prjtName + ".neoproj"));
    return isNamePresent
}


function preRunCheck(){
    createHiddenDirectory();

    const hiddenFolderPath = path.join(os.homedir(), '.neoport');
    const filesDetails = getAllFilesDetails(hiddenFolderPath);
    return filesDetails
}

const defaultPreferences = {
    database: {
        URI: "neo4j://localhost:7687",
        username: "neo4j",
        password: ""
    }
}

module.exports = { createHiddenDirectory, preRunCheck, saveFile, checkForExisting, defaultPreferences, openProject }