const fs = require('fs');
const os = require('os');
const path = require('path'); // Import the path module

const userDataPath = os.homedir();
const userDataHome = path.join(userDataPath, '.neoport');
const userDataDir = path.join(userDataHome, 'usr');

const defaultPreferences = {
    database: {
        URI: "neo4j://localhost:7687",
        username: "neo4j",
        password: ""
    }
}

function saveBuffer(hex, payload) {
    try {
        ensureDirectoryExistence(`${userDataDir}/${hex}`); // Ensure the directory exists
        fs.writeFileSync(`${userDataDir}/${hex}`, JSON.stringify(payload));
        return ""
    } catch (error) {
        console.error('Error saving buffer:', error);
        return ""
    }
}

function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

function loadBuffer(hex) {
    try {
        if (fs.existsSync(`${userDataDir}/${hex}`)) {
            const bufferData = fs.readFileSync(`${userDataDir}/${hex}`, 'utf8');
            return JSON.parse(bufferData);
        } else {
            ensureDirectoryExistence(userDataDir)
            return true;
        }
    } catch (error) {
        console.error('Error loading buffer:', error);
        return "";
    }
}



module.exports = { saveBuffer, loadBuffer }
