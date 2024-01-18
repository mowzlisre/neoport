const fs = require('fs');
const os = require('os');
const userDataPath = os.homedir()
const preferencesFilePath = `${userDataPath}/neoport-pref.json`;

const defaultPreferences = {
    database : {
        URI : "neo4j://localhost:7687",
        username : "neo4j",
        password : ""
    }
}

function savePreferences(preferences) {
    try {
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
            savePreferences(defaultPreferences);
            return defaultPreferences;
        }
    } catch (error) {
        console.error('Error loading preferences:', error);
        return {};
    }
}

module.exports = { savePreferences, loadPreferences }