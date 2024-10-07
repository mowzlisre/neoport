import { Box, Button, Checkbox, Divider, Flex, Heading, Input, InputGroup, InputLeftAddon, InputRightElement, Spinner, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FcAcceptDatabase, FcDataEncryption, FcDataSheet, FcDatabase, FcDeleteDatabase, FcKey, FcLink, FcMindMap } from 'react-icons/fc';
import { setStoreData } from '../../redux/actions/storeActions';
import { defaultConf } from '../lib/conf';

function SettingsModal({ dbStatus, setDbStatus, storeData, closeModal }) {
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)
    const [isTesting, setIsTesting] = useState(false)
    const [pref, setPref] = useState(defaultConf)
    const [title, setTitle] = useState(storeData.projectTitle || '')
    const [oldTitle, setOldTitle] = useState(storeData.projectTitle || '')
    const [fileExists, setFileExists] = useState(false)

    const testConnection = async () => {
        setIsTesting(true)
        await window.settings.setPref(pref)
        const status = await window.settings.testConnection();
        setDbStatus(status)
        setIsTesting(false)
    }

    const handleDatabaseUriChange = (e) => {
        const newValue = e.target.value;
        setPref((prevPref) => ({
            ...prevPref,
            URI: newValue,
        }));
    };

    const handleDatabaseUsernameChange = (e) => {
        const newValue = e.target.value;
        setPref((prevPref) => ({
            ...prevPref,
            username: newValue,
        }));
    };

    const handleDatabasePasswordChange = (e) => {
        const newValue = e.target.value;
        setPref((prevPref) => ({
            ...prevPref,
            password: newValue,
        }));
    };

    useEffect(() => {
        if (
            storeData.db === undefined || 
            storeData.db.length === 0 || 
            (typeof storeData.db === 'object' && Object.keys(storeData.db).length === 0)
        ) {
            storeData["db"] = defaultConf.database;
            setStoreData(storeData);
            window.electron.saveProject(storeData, localStorage.getItem("currentProject"));
            setPref(defaultConf);
        } else {
            setPref(storeData.db);
        }
        
    }, [])

    useEffect(() => {
        storeData["db"] = pref
        setStoreData(storeData)
        window.electron.saveProject(storeData, localStorage.getItem("currentProject"));
    }, [pref])

    const handleDataSourcePref = (e, val) => {
        storeData[e] = val
        setStoreData(storeData)
        window.electron.saveProject(storeData, localStorage.getItem("currentProject"));
    }

    const renameProject = async(projectTitle, oldTitle) => {
        await window.electron.renameProject(localStorage.getItem('currentProject'), projectTitle)
        .then((result) => {
            localStorage.setItem('currentProject', result.newPath)
            storeData["projectTitle"] = projectTitle
            setStoreData(storeData)
        })
        .catch((error) => {
            if(projectTitle !== oldTitle){
                renameProject(oldTitle, oldTitle)
            }
        })
    }

    const handleProjectNameChange = (e) => {
        const projectTitle = e.target.value
        setTitle(projectTitle)
        renameProject(projectTitle, oldTitle)
    }

    return (
        <Flex width={"100%"} direction="column" p={3} gap={5}>
            <Box mb={3}>
                <Box>
                    <Flex gap={3} mb={3} ml={2}>
                        <Box my={"auto"}>
                            <FcDataSheet fontSize={25} />
                        </Box>
                        <Heading color="gray.600" as='h6' size='md' my={"auto"}>Data Source</Heading>
                    </Flex>
                    <Divider />
                </Box>
                <Box gap={3} justifyContent={"left"} px={3}>
                    <Flex mt={3} flexDirection={'column'}>
                        <Input value={title} onChange={handleProjectNameChange} isInvalid={fileExists} ></Input>
                    </Flex>
                    <Flex mt={3} flexDirection={'column'}>
                        <Checkbox defaultChecked={storeData["headers"]} onChange={() => handleDataSourcePref("headers", !storeData["headers"])}><Text fontSize={14} ml={1}>Has Headers</Text></Checkbox>
                    </Flex>
                    <Flex mt={3} flexDirection={'column'}>
                        <Checkbox defaultChecked={storeData["parseDataTypes"]} onChange={() => handleDataSourcePref("parseDataTypes", !storeData["parseDataTypes"])}><Text fontSize={14} ml={1}>Advanced Parsing</Text></Checkbox>
                        <Text fontSize={'xs'}>Recommended if the data source has Lists (Arrays) and Maps (Objects) </Text>
                    </Flex>
                </Box>
            </Box>

            <Box>
                <Box>
                    <Flex gap={3} mb={3} ml={2}>
                        <Box my={"auto"}>
                            <FcMindMap fontSize={25} />
                        </Box>
                        <Heading color="gray.600" as='h6' size='md' my={"auto"}>Database</Heading>
                    </Flex>
                    <Divider />
                </Box>
                <Box gap={3} justifyContent={"left"} px={2}>
                    <Flex mt={5} gap={3}>
                        <InputGroup width={"70%"}>
                            <InputLeftAddon bg={"white"} width={"50px"} justifyContent={"center"}>
                                <Box my={'auto'}><FcLink fontSize={20} /></Box>
                            </InputLeftAddon>
                            <Input
                                type='text'
                                placeholder='neo4j://localhost:7687'
                                _focus={{ boxShadow: 'none' }}
                                _placeholder={{ fontSize: "sm" }}
                                fontSize={"sm"}
                                value={pref.URI || ''}
                                onChange={handleDatabaseUriChange}
                            />
                        </InputGroup>
                        <Flex width={"30%"}>
                            <Text fontStyle={"italic"} my={"auto"} fontSize={'2xs'} color={"gray"}>Supports neo4j, bolt, http, https protocols</Text>
                        </Flex>
                    </Flex>
                    <Flex mt={3} gap={3}>
                        <InputGroup width={"70%"}>
                            <InputLeftAddon bg={"white"} width={"50px"} justifyContent={"center"}>
                                <Box my={'auto'}><FcDatabase fontSize={20} /></Box>
                            </InputLeftAddon>
                            <Input
                                type='text'
                                placeholder='neo4j'
                                _focus={{ boxShadow: 'none' }}
                                _placeholder={{ fontSize: "sm" }}
                                fontSize={"sm"}
                                value={pref.username || ''}
                                onChange={handleDatabaseUsernameChange}
                            />
                        </InputGroup>
                        <Flex width={"30%"}>
                            <Text fontStyle={"italic"} my={"auto"} fontSize={'2xs'} color={"gray"}>Default database username is <b>neo4j</b></Text>
                        </Flex>
                    </Flex>
                    <Flex mt={3} gap={3}>
                        <InputGroup width={"70%"}>
                            <InputLeftAddon bg={"white"}>
                                <FcKey />
                            </InputLeftAddon>
                            <Input
                                pr='4.5rem'
                                type={show ? 'text' : 'password'}
                                placeholder='Enter password'
                                _focus={{ boxShadow: 'none' }}
                                _placeholder={{ fontSize: "sm" }}
                                fontSize={"sm"}
                                value={pref.password || ''}
                                onChange={handleDatabasePasswordChange}
                            />
                            <InputRightElement width='4.5rem' role='button' onClick={handleClick}>
                                <Text fontWeight={"bold"} color={"gray"} fontSize={"xs"}>{show ? 'Hide' : 'Show'}</Text>
                            </InputRightElement>
                        </InputGroup>
                        <Flex width={"30%"} gap={3}>
                            <Button size='xs' colorScheme='green' my={'auto'} onClick={testConnection}>Test</Button>
                            {
                                isTesting === true &&
                                <Spinner color='teal' size={'sm'} thickness='3px' my={'auto'} />
                            }
                            <Box my={"auto"}>
                                {
                                    dbStatus === 'ServiceUnavailable' ?
                                        <Flex gap={1}>
                                            <FcDeleteDatabase />
                                            <Text fontWeight={"bold"} color={"red"} fontSize={"2xs"} my={"auto"}>Offline</Text>
                                        </Flex> :
                                    dbStatus === "Neo.ClientError.Security.Unauthorized" ?
                                        <Flex gap={1}>
                                            <FcDataEncryption />
                                            <Text fontWeight={"bold"} color={"orange"} fontSize={"2xs"} my={"auto"}>Unauthorized</Text>
                                        </Flex> :
                                    dbStatus === "ConnectionEstablished" &&
                                        <Flex gap={1}>
                                            <FcAcceptDatabase />
                                            <Text fontWeight={"bold"} color={"green"} fontSize={"2xs"} my={"auto"}>Online</Text>
                                        </Flex>
                                }
                            </Box>
                        </Flex>
                    </Flex>
                </Box>
            </Box>
            <Flex justifyContent={'end'}>
                <Button onClick={closeModal} size={'sm'}>Cancel</Button>
            </Flex>

        </Flex>
    );
}

export default SettingsModal;
