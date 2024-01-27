const fs = require('fs');
const os = require('os');
const path = require('path');

const userDataPath = os.homedir();
const preferencesDirectory = path.join(userDataPath, '.neoport');
const preferencesFilePath = path.join(preferencesDirectory, 'neoport-pref.json');

const defaultPreferences = {
    database: {
        URI: "neo4j://localhost:7687",
        username: "neo4j",
        password: ""
    }
};

function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

function savePreferences(preferences) {
    try {
        ensureDirectoryExistence(preferencesFilePath);
        fs.writeFileSync(preferencesFilePath, JSON.stringify(preferences));
    } catch (error) {
        console.error('Error saving preferences:', error);
    }
}

function loadPreferences() {
    try {
        if (fs.existsSync(preferencesFilePath)) {
            const preferencesData = fs.readFileSync(preferencesFilePath, 'utf8');
            return JSON.parse(preferencesData);
        } else {
            ensureDirectoryExistence(preferencesFilePath); // Ensure the directory exists
            savePreferences(defaultPreferences);
            return defaultPreferences;
        }
    } catch (error) {
        console.error('Error loading preferences:', error);
        return {};
    }
}

module.exports = { savePreferences, loadPreferences };
