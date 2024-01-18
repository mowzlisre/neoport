import { Box, Center, Divider, Flex, HStack, Spinner, Text } from "@chakra-ui/react"
import { FcAcceptDatabase, FcDataEncryption, FcDeleteDatabase, FcEngineering } from "react-icons/fc"

const StatusBar = ({status, dbStatus, openModal, columns, n}) => {
    return (
        <Flex height={"4vh"} bg={"aliceblue"} justifyContent={"end"} px={10}>
            <Flex gap={3} my={'auto'}>
                {
                    status !== '' &&
                    <Flex gap={2}>
                        <HStack>
                            <Spinner size={"xs"} emptyColor='gray.200' color='blue.500' />
                            <Text fontSize={'xs'} my={"auto"} >{status}</Text>
                        </HStack>
                        <Center height='4vh' my={'auto'}>
                            <Divider orientation='vertical' bg={"aliceblue"} />
                        </Center>
                    </Flex>
                }
                <Flex gap={3}>
                    <Text fontSize={'xs'} my={"auto"} >{columns.length} Fields</Text>
                    <Center height='4vh' my={'auto'}>
                        <Divider orientation='vertical' bg={"aliceblue"} />
                    </Center>
                </Flex>
                <Flex gap={3}>
                    <Text fontSize={'xs'} my={"auto"} >{n} Rows</Text>
                    <Center height='4vh' my={'auto'}>
                        <Divider orientation='vertical' bg={"aliceblue"} />
                    </Center>
                </Flex>
                {
                    dbStatus === 'ServiceUnavailable' ?
                        <Flex gap={3}>
                            <Box my={"auto"}><FcDeleteDatabase /> </Box>
                            <Center height='4vh' my={'auto'}>
                                <Divider orientation='vertical' bg={"aliceblue"} />
                            </Center>
                        </Flex> :
                    dbStatus === "Neo.ClientError.Security.Unauthorized" ?
                        <Flex gap={3}>
                            <Box my={"auto"}> <FcDataEncryption /> </Box>
                            <Center height='4vh' my={'auto'}>
                                <Divider orientation='vertical' bg={"aliceblue"} />
                            </Center>
                        </Flex> :
                    dbStatus === "Neo.ClientError.Security.AuthenticationRateLimit" ?
                        <Flex gap={3}>
                            <Box my={"auto"}> <FcDataEncryption /> </Box>
                            <Center height='4vh' my={'auto'}>
                                <Divider orientation='vertical' bg={"aliceblue"} />
                            </Center>
                        </Flex> :
                    dbStatus === "ConnectionEstablished" &&
                        <Flex gap={3}>
                            <Box my={"auto"}><FcAcceptDatabase /> </Box>
                            <Center height='4vh' my={'auto'}>
                                <Divider orientation='vertical' bg={"aliceblue"} />
                            </Center>
                        </Flex>
                }
                <Box my={"auto"} role="button">
                    <FcEngineering onClick={openModal} />
                </Box>
            </Flex>
        </Flex>
    )
}

export default StatusBar