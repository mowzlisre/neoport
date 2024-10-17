import { Box, Button, Divider, Flex, Spinner, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FcOk } from "react-icons/fc";

const ETLModal = ({ closeModal }) => {
    const [etlState, setEtlState] = useState(true);

    // Default ETL status with subprocesses allowed for each step
    const defaultEtlStatus = {
        steps: [
            { name: "Starting ETL pipeline", status: "pending", completed: false, percentage: 0, subprocesses: [] },
            { name: "Extracting nodes and relationships", status: "pending", completed: false, percentage: 0, subprocesses: [] },
            { name: "Transforming Entities", status: "pending", completed: false, percentage: 0, subprocesses: [] },
            { name: "Exporting data to Neo4j Database", status: "pending", completed: false, percentage: 0, subprocesses: [] }
        ],
        currentStep: "Starting ETL pipeline",
        completed: false
    };

    const [etlStatus, setEtlStatus] = useState(defaultEtlStatus);
    const toast = useToast();
    const [error, setError] = useState('');

    useEffect(() => {
        if (etlState) startPython();

        window.ipcRenderer.on('python-output', (data) => {
            const outputData = data.toString();
            console.log('Received from Python:', outputData);
            handlePythonOutput(outputData);
        });

        window.ipcRenderer.on('python-error', (data) => {
            console.log('Python Error:', data);
            setError((prev) => `${prev}\n${data}`);
        });

        window.ipcRenderer.on('python-exit', (code) => {
            console.log(`Python process exited with code: ${code}`);
        });

        window.ipcRenderer.on('python-interupted', (code) => {
            console.log(`ETL interrupted`);
        });

        return () => {
            window.ipcRenderer.removeAllListeners('python-output');
            window.ipcRenderer.removeAllListeners('python-error');
            window.ipcRenderer.removeAllListeners('python-exit');
        };
    }, [etlState]);

    const startPython = () => {
        window.ipcRenderer.send('python-start', ['etlscript', localStorage.getItem("currentProject")]);
    };

    const interruptETL = () => {
        window.ipcRenderer.send('python-interrupt');
        resetEtlStatus();
        closeModal();
        toast({
            title: <Text fontSize={'sm'}>ETL was interrupted</Text>,
            status: "warning",
            duration: 3000,
            variant: "subtle"
        });
    };

    const resetEtlStatus = () => {
        setEtlStatus(defaultEtlStatus);
        setEtlState(false);
    };

    const handlePythonOutput = (outputData) => {
        try {
            const jsonDataArray = outputData.trim().split('\n'); 
            jsonDataArray.forEach(jsonStr => {
                const parsedData = JSON.parse(jsonStr);
                
                setEtlStatus((prevStatus) => {
                    const updatedSteps = prevStatus.steps.map((step) => {
                        if (step.name === parsedData.stepName) {
                            // Update step and subprocess if exists
                            const updatedStep = {
                                ...step,
                                status: parsedData.subProcessName ? parsedData.subProcessStatus : parsedData.subProcessStatus || "in-progress",
                                completed: parsedData.subProcessCompleted,
                                percentage: parsedData.percentage || 0,
                                subprocesses: parsedData.subProcessName ? updateSubprocesses(step.subprocesses, parsedData) : step.subprocesses
                            };
                            return updatedStep;
                        }
                        return step;
                    });

                    return {
                        ...prevStatus,
                        steps: updatedSteps,
                        currentStep: parsedData.stepName,
                        completed: updatedSteps.every((step) => step.completed)
                    };
                });
            });
        } catch (error) {
            console.error("Error parsing JSON data:", error);
        }
    };

    // Helper function to update subprocesses
    const updateSubprocesses = (subprocesses, parsedData) => {
        const subprocessIndex = subprocesses.findIndex(sub => sub.name === parsedData.subProcessName);
        if (subprocessIndex > -1) {
            subprocesses[subprocessIndex] = {
                name: parsedData.subProcessName,
                status: parsedData.subProcessStatus,
                completed: parsedData.subProcessCompleted,
                percentage: parsedData.percentage || 0
            };
        } else {
            subprocesses.push({
                name: parsedData.subProcessName,
                status: parsedData.subProcessStatus,
                completed: parsedData.subProcessCompleted,
                percentage: parsedData.percentage || 0
            });
        }
        return subprocesses;
    };

    const handleStart = () => {
        setEtlState(true);
    };

    return (
        etlState ? (
            <Box p={5}>
                <Flex gap={4}>
                    <Text my={'auto'} fontWeight={'bold'} fontSize={'2xl'}>Neoport ETL Wizard</Text> 
                </Flex>
                <Divider my={2} />
                <Flex mt={5} direction={'column'} gap={2}>
                    {etlStatus.steps.map((step, index) => (
                        <Box key={index} ml={3}>
                            <Flex gap={3} color={step.status === 'in-progress' ? 'black' : step.status === 'error' ? 'red' : 'gray'}>
                                <Text fontWeight={step.status === 'in-progress' ? 'bold' : 'normal'}>
                                    {step.name}
                                </Text>
                                {step.completed && <FcOk fontSize={20} />}
                                {step.status === 'in-progress' && (
                                    <Spinner size="sm" color="blue.500" ml={2} />
                                )}
                                <Text>
                                    {step.percentage === 0 || step.percentage === 100 ? '' : `${step.percentage}%`}
                                </Text>
                            </Flex>
    
                            {/* Display subprocesses if any */}
                            {step.subprocesses.length > 0 && (
                                <Box ml={5} mt={2}>
                                    {step.subprocesses.map((sub, subIndex) => (
                                        <Flex key={subIndex} gap={3} color={sub.status === 'in-progress' ? 'black' : sub.status === 'error' ? 'red' : 'gray'}>
                                            <Text fontSize={"xs"} fontStyle={'italic'} fontWeight={sub.status === 'in-progress' ? 'bold' : 'normal'}>
                                                {sub.name}
                                            </Text>
                                            {sub.status === 'in-progress' && (
                                                <Spinner size="sm" color="blue.500" ml={2} />
                                            )}
                                            <Text>
                                                {sub.percentage === 0 || sub.percentage === 100 ? '' : `${sub.percentage}%`}
                                            </Text>
                                        </Flex>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    ))}
                </Flex>
                <Flex mt={5}>
                    <Button size={'sm'} onClick={interruptETL}>Cancel</Button>
                </Flex>
            </Box>
        ) : (
            <Box p={5}>
                <Flex justifyContent={'center'} direction={'column'} gap={7}>
                    <Text textAlign={'center'}>
                        Are you sure you want to start the ETL? This is an automated process that will stop when the ETL is completed or an error occurs!
                    </Text>
                    <Button onClick={handleStart}>Start</Button>
                </Flex>
            </Box>
        )
    );
};

export default ETLModal;
