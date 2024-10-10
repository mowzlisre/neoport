import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const ETLModal = () => {

    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        startPython()
        window.ipcRenderer.on('python-output', (data) => {
            const outputData = data.toString(); // Convert to string if necessary
            console.log('Received from Python:', outputData);
            setOutput((prev) => `${prev}\n${outputData}`);
        });

        window.ipcRenderer.on('python-error', (data) => {
            console.log('Python Error:', data);
            setError((prev) => `${prev}\n${data}`);
        });

        window.ipcRenderer.on('python-exit', (code) => {
            console.log(`Python process exited with code: ${code}`);
        });

        // Cleanup listeners on component unmount
        return () => {
            window.ipcRenderer.removeAllListeners('python-output');
            window.ipcRenderer.removeAllListeners('python-error');
            window.ipcRenderer.removeAllListeners('python-exit');
        };
    }, []);

    const startPython = () => {
        window.ipcRenderer.send('python-start', ['etlscript', localStorage.getItem("currentProject")]);
    };

    
    return (
    <Box p={2}>
        <Flex gap={4}>
            <Text as={"h3"}>Connecting to Database</Text> <Spinner color="blue.500"/>
        </Flex>
    </Box>
    )
};

export default ETLModal