const fs = require('fs');
const os = require('os');
const path = require('path'); // Import the path module

const userDataPath = os.homedir();
const userDataHome = path.join(userDataPath, '.neoport');

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
        if (fs.existsSync(`${userDataHome}/${hex}`)) {
            const bufferData = fs.readFileSync(`${userDataHome}/${hex}`, 'utf8');
            return JSON.parse(bufferData);
        } else {
            ensureDirectoryExistence(userDataHome)
            return true;
        }
    } catch (error) {
        console.error('Error loading buffer:', error);
        return "";
    }
}



module.exports = { saveBuffer, loadBuffer }
