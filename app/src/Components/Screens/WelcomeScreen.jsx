import logo from "../../logo.png"
import { useEffect, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { CiFolderOn, CiSquarePlus } from "react-icons/ci";
import { Box, Flex, Image, Stack, Text, useToast } from "@chakra-ui/react";
import { primaryColor, primaryColorBg } from "../lib/conf";

const WelcomeScreen = () => {
    const [projects, setProjects] = useState([])
    const toast = useToast();


    const handleCreateNew = () => {
        window.location.hash = "#/newproject"
    };

    const handleCloseWindow = () => {
        window.ipcRenderer.send('closeWindow');
    }

    const handleOpenFromRecent = (path) => {
        window.ipcRenderer.send('proceedFromRecentProject', {path});
    }

    useEffect(() => {
        const projects = window.settings.getPref()
        setProjects(projects)
    }, [])

    useEffect(() => {
        window.ipcRenderer.on('returnOnFileNotFoundErrorToWelcome', (event, data) => {
            toast({
                title: <Text fontSize={'sm'}>File not found</Text>, status: "error", duration: 3000, variant: "subtle"
            });
        });
        
        return () => {
            window.ipcRenderer.removeAllListeners('returnOnFileNotFoundErrorToWelcome');
        };
    }, []);

    return (
        projects &&
        <div className='fade-in'>
            <Box position={"fixed"} top={15} right={15} sx={{ cursor: 'pointer' }} onClick={handleCloseWindow}>
                <IoMdClose />
            </Box>
            <Box display={"flex"} width={"100%"}>
                <Stack direction={"column"} height={"100vh"} width={"30%"} bg={primaryColorBg} px={2} py={2} gap={1} overflowY={'auto'}>
                    {
                        projects.length !== 0 ? projects.map((item, index) => (
                            <Box key={index} display={"flex"} p={2} role={"button"} color={"black"} gap={0.5} onClick={() => handleOpenFromRecent(item.path)} borderRadius={3} sx={{ cursor: "pointer", ":hover": { backgroundColor: primaryColorBg} }}>
                                
                                <Box display={"flex"}>
                                    
                                </Box>
                                <Box display={"flex"} overflowX={'hidden'}>
                                    <Box my={'auto'} color={"inherit"}>
                                        <Text fontSize={12} fontWeight={"bold"}>{item.name}</Text>
                                        <Text fontSize={8} fontStyle={"italic"}>{item.path}</Text>
                                    </Box>
                                </Box>
                            </Box>
                        )) : (
                                <Text m={"auto"} fontStyle={'italic'} fontSize={'xs'}>No recent Projects found</Text>
                        )
                    }
                </Stack>
                <Box width={"70%"} height={"100vh"}>
                    <Flex flexDirection={"column"} justifyContent={"center"} textAlign={"center"} height={"70%"}>
                            <Box mx={'auto'}>
                                <Image src={logo} draggable="false" width={120} />
                            </Box>
                            <Text fontSize={25}>Welcome to Neoport</Text>
                            <Text fontSize={10} color={"gray"}>Version 0.0.1</Text>
                    </Flex>
                    <Stack direction={"column"} alignContent={"center"} height={"30%"} px={5}>
                        <Box display={"flex"} py={0.5} px={1} role={"button"} borderRadius={2} color={"black"} gap={1} sx={{ cursor: "pointer", ":hover": { backgroundColor: "#F6F6F6" } }} onClick={handleCreateNew}>
                            <Box display={"flex"}>
                                <CiSquarePlus fontSize={45} color={primaryColor} />
                            </Box>
                            <Box display={"flex"}>
                                <Box my={'auto'} color={"inherit"}>
                                    <Text fontSize={12} fontWeight={"bold"}>Create New Neoport Project</Text>
                                    <Text fontSize={10} fontStyle={"italic"}>Create nodes, relationships and manage transformations before loading</Text>
                                </Box>
                            </Box>
                        </Box>
                        <Box display={"flex"} py={0.5} px={1} role={"button"} borderRadius={2} color={"black"} gap={1} sx={{ cursor: "pointer", ":hover": { backgroundColor: "#F6F6F6" } }}>
                            <Box display={"flex"}>
                            <CiFolderOn fontSize={45} color={primaryColor} />
                            </Box>
                            <Box display={"flex"}>
                                <Box my={'auto'} color={"inherit"}>
                                    <Text fontSize={12} fontWeight={"bold"}>Open a Neoport Project</Text>
                                    <Text fontSize={10} fontStyle={"italic"}>Open an Existing Neoport Project from your system</Text>
                                </Box>
                            </Box>
                        </Box>

                    </Stack>
                </Box>
            </Box>
        </div>
    )
}

export default WelcomeScreen