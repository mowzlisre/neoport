import React, { useEffect, useState } from "react";
import { Box, Text, VStack, HStack, Circle, Spinner, Flex } from "@chakra-ui/react";
import { FaCheckCircle, FaExclamationCircle, FaSpinner } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";

const PreCheck = ({ onReady }) => {
    const [steps, setSteps] = useState([
        { id: 1, name: "Verifying Python Installation", status: "pending" },
        { id: 2, name: "Verifying Python Environment", status: "pending" },
        { id: 3, name: "Verifying Dependencies", status: "pending" },
    ]);
    const [isTimeoutComplete, setIsTimeoutComplete] = useState(false);

    useEffect(() => {
        const performChecks = async () => {
            const checkFunctions = ["check-python", "check-python-env", "check-dependencies"];

            for (let i = 0; i < checkFunctions.length; i++) {
                try {
                    const response = await window.ipcRenderer.invoke(checkFunctions[i]);

                    setSteps((prevSteps) =>
                        prevSteps.map((step) =>
                            step.id === i + 1
                                ? { ...step, status: response.success ? "success" : "error" }
                                : step
                        )
                    );

                    if (!response.success) {
                        setSteps((prevSteps) =>
                            prevSteps.map((step) =>
                                step.id > i + 1 ? { ...step, status: "error" } : step
                            )
                        );
                        break;
                    }
                } catch (error) {
                    setSteps((prevSteps) =>
                        prevSteps.map((step) =>
                            step.id >= i + 1
                                ? { ...step, status: "error", error: error.message }
                                : step
                        )
                    );
                    break;
                }
            }

            setSteps((prevSteps) => {
                const allSuccessful = prevSteps.every((step) => step.status === "success");
                if (allSuccessful) {
                    
                    setTimeout(() => {
                        setIsTimeoutComplete(true);
                        
                    onReady();
                    }, 2000);
                }
                return prevSteps;
            });

        };

        performChecks();
    }, [onReady]);

    const getStatusIcon = (status) => {
        switch (status) {
            case "pending":
                return <Spinner size="sm" />;
            case "success":
                return <IoCheckmarkCircle color="#0083ff" size="20px" />;
            case "error":
                return <FaExclamationCircle color="red" size="20px" />;
            default:
                return <FaSpinner size="20px" />;
        }
    };

    return (
        <Flex justifyContent={"center"} height={"100vh"}>
            <VStack my={"auto"} spacing={6} align="stretch" position="relative">
                {steps.map((step, index) => (
                    <HStack key={step.id} align="flex-start">
                        <Box position="relative">
                            <Circle size="24px" bg="white" border="2px solid" borderColor="gray.200">
                                {getStatusIcon(step.status)}
                            </Circle>
                            {index < steps.length - 1 && (
                                <Box
                                    position="absolute"
                                    top="24px"
                                    left="50%"
                                    transform="translateX(-50%)"
                                    height="50px"
                                    borderLeft="2px solid"
                                    borderColor="gray.200"
                                />
                            )}
                        </Box>

                        <Flex ml={2} mt={"-0.6"}>
                            <Text fontSize="lg">{step.name}</Text>
                        </Flex>
                    </HStack>
                ))}
            </VStack>
            {!isTimeoutComplete && (
                <Flex justifyContent={"center"} position={"fixed"} bottom={3}>
                    <Text
                        textAlign={"center"}
                        role="button"
                        color={"gray"}
                        onClick={() => window.electron.openHttp("https://github.com/mowzlisre")}
                        fontSize={"sm"}
                    >
                       If you have an error in python click here to Troubleshoot.
                    </Text>
                </Flex>
            )}
        </Flex>
    );
};

export default PreCheck;
