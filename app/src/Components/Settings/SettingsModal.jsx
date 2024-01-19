import React, { useEffect, useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalBody, Box, Flex, Divider, Button, Text, Heading, ModalFooter, InputGroup, InputLeftAddon, Input, InputRightElement, Spinner, Checkbox } from '@chakra-ui/react';
import { FcAcceptDatabase, FcDataEncryption, FcDatabase, FcDeleteDatabase, FcKey, FcLink, FcMindMap, FcSettings } from 'react-icons/fc';
import { defaultConf } from '../lib/conf';
import { setStoreData } from '../../redux/actions/storeActions';
import { useDispatch } from 'react-redux';

function SettingsModal({ isOpen, onClose, dbStatus, setDbStatus, storeData }) {
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)
    const [isTesting, setIsTesting] = useState(false)
    const [pref, setPref] = useState(window.settings.getPref() || defaultConf)

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
            database: {
                ...prevPref.database,
                URI: newValue,
            },
        }));
    };

    const handleDatabaseUsernameChange = (e) => {
        const newValue = e.target.value;
        setPref((prevPref) => ({
            ...prevPref,
            database: {
                ...prevPref.database,
                username: newValue,
            },
        }));
    };

    const handleDatabasePasswordChange = (e) => {
        const newValue = e.target.value;
        setPref((prevPref) => ({
            ...prevPref,
            database: {
                ...prevPref.database,
                password: newValue,
            },
        }));
    };

    useEffect(() => {
        const settings = window.settings.getPref()
        setPref(settings)
        testConnection()
    }, [])

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size={"3xl"}>
            <ModalOverlay />
            <ModalContent>
                <ModalBody p={10}>
                    <Flex height={"50vh"} width={"100%"} direction="column" gap={7}>
                        <Box>
                            <Box>
                                <Flex gap={3} mb={3}>
                                    <Box my={"auto"}>
                                        <FcMindMap fontSize={25} />
                                    </Box>
                                    <Heading color="gray.600" as='h6' size='md' my={"auto"}>Database</Heading>
                                </Flex>
                                <Divider />
                            </Box>
                            <Box gap={3} justifyContent={"left"} px={3}>
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
                                            value={pref.database.URI || ''}
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
                                            value={pref.database.username || ''}
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
                                            value={pref.database.password || ''}
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

                        <Box>
                            <Box>
                                <Flex gap={3} mb={3}>
                                    <Box my={"auto"}>
                                        <FcSettings fontSize={25} />
                                    </Box>
                                    <Heading color="gray.600" as='h6' size='md' my={"auto"}>Preferences</Heading>
                                </Flex>
                                <Divider />
                            </Box>
                            <Box gap={3} justifyContent={"left"} px={3}>

                            </Box>
                        </Box>

                    </Flex>
                </ModalBody>
                <ModalFooter>
                    <Button variant={"ghost"} onClick={onClose} _focus={{ outline: "none" }}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default SettingsModal;
