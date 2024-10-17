const neo4j = require('neo4j-driver');
const { defaultPreferences } = require('./preferences');

const getDataBaseStatus = async () => {
    const preferences = defaultPreferences;
    const uri = preferences["database"]["URI"];
    const username = preferences["database"]["username"];
    const password = preferences["database"]["password"];

    let driver;
    let status = "unknown";

    try {
        driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
        const serverInfo = await driver.getServerInfo();
        status = "ConnectionEstablished";
    } catch (error) {
        status = error.code;
    } finally {
        if (driver) {
            await driver.close();
        }
    }
    return status;
};

module.exports = { getDataBaseStatus };
