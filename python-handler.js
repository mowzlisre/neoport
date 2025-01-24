const os = require('os');
const path = require("path");
const { exec, execFile } = require('child_process');
const fs = require('fs');
// Helper function to determine the Python command based on the OS
function getOS() {
    switch (os.platform()) {
        case 'win32': return 'python'; // Windows
        case 'darwin': return 'python3'; // macOS
        case 'linux': return 'python3'; // Linux
        default: return null;
    }
}

// Function to check Python installation
function checkPythonInstallation() {
    try {
        const command = getOS() + ' --version';
        if (command) {
            return new Promise((resolve) => {
                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        resolve({
                            success: false,
                            message: `Python is not installed or not found in PATH.`,
                        });
                    } else {
                        resolve({ success: true, message: stdout.trim() || stderr.trim() });
                    }
                });
            });
        } else {
            return { success: false, message: "Unsupported Platform." };
        }
    } catch (error) {
        return { success: false, error: `Error checking Python: ${error.message}` };
    }
}

function waitForFile(filePath, timeout = 5000, interval = 100) {
    return new Promise((resolve, reject) => {
        const start = Date.now();

        const checkFile = () => {
            if (fs.existsSync(filePath)) {
                resolve();
            } else if (Date.now() - start > timeout) {
                reject(new Error(`File not found: ${filePath}`));
            } else {
                setTimeout(checkFile, interval);
            }
        };

        checkFile();
    });
}

function checkPythonEnviroment() {
    try {
        const homeDir = os.homedir();
        const venvPath = path.join(homeDir, '.neoport', '.venv');
        const activatePath =
            process.platform === 'win32'
                ? path.join(venvPath, 'Scripts', 'activate')
                : path.join(venvPath, 'bin', 'activate');

        // Check if the virtual environment already exists
        if (fs.existsSync(activatePath)) {
            return { success: true, message: 'Virtual environment already exists.' };
        }

        // Create the virtual environment
        const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';

        return new Promise((resolve, reject) => {
            const process = execFile(pythonCmd, ['-m', 'venv', venvPath], async (error, stdout, stderr) => {
                if (error) {
                    reject({ success: false, error: `Error creating virtual environment: ${stderr || error.message}` });
                } else {
                    try {
                        // Wait for the activation script to appear
                        await waitForFile(activatePath);
                        resolve({ success: true, message: `Virtual environment created at ${venvPath}` });
                    } catch (waitError) {
                        reject({
                            success: false,
                            error: `Virtual environment created, but activation script is missing: ${waitError.message}`,
                        });
                    }
                }
            });
        });
    } catch (error) {
        return { success: false, error: error.message };
    }
}

const requiredDependencies = ['pandas', 'scikit-learn', "neo4j"];

async function checkDependencies() {
    try {
        const homeDir = os.homedir();
        const venvPath = path.join(homeDir, '.neoport', '.venv');
        const pipPath =
            process.platform === 'win32'
                ? path.join(venvPath, 'Scripts', 'pip.exe')
                : path.join(venvPath, 'bin', 'pip');

        if (!fs.existsSync(pipPath)) {
            return {
                success: false,
                error: 'Pip is not found in the virtual environment. Ensure it is installed.',
            };
        }

        const executePipCommand = (args) => {
            return new Promise((resolve, reject) => {
                execFile(pipPath, args, (error, stdout, stderr) => {
                    if (error) {
                        reject(new Error(stderr || error.message));
                    } else {
                        resolve(stdout);
                    }
                });
            });
        };

        const checkInstalledDependencies = async () => {
            const stdout = await executePipCommand(['list']);
            return stdout
                .split('\n')
                .slice(2)
                .map((line) => line.split(' ')[0])
                .filter(Boolean);
        };

        const installMissingDependencies = async (missingDependencies) => {
            await executePipCommand(['install', ...missingDependencies]);
        };

        const installedDependencies = await checkInstalledDependencies();
        const missingDependencies = requiredDependencies.filter(
            (dep) => !installedDependencies.includes(dep)
        );

        if (missingDependencies.length > 0) {
            await installMissingDependencies(missingDependencies);
            return {
                success: true,
                message: `Dependencies installed successfully: ${missingDependencies.join(', ')}`,
            };
        }

        return { success: true, message: 'All dependencies are already installed.' };
    } catch (error) {
        return { success: false, error: `Error: ${error.message}` };
    }
}

// Export the function
module.exports = { checkPythonInstallation, checkPythonEnviroment, checkDependencies };
