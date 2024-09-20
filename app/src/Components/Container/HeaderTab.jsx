import { Box, Flex , Spinner, Tag, TagLabel, Text } from "@chakra-ui/react";

const HeaderTab = ({columns, storeData}) => {
    return (
        <Box p={1} width={"25%"} bg={"aliceblue"}>
            {
                storeData.filePath !== null ? columns.length !== 0 ?
                    <Flex p={1}>
                        <Box borderRadius={5} bg={"white"} w={"100%"} p={1} height={"53vh"} overflow={"auto"}>
                            {
                                columns.map((item, index) => (
                                    <Tag px={4} key={index} m={1} bg={"gray.100"} shadow={'sm'}>
                                        <TagLabel fontSize={11}>{item}</TagLabel>
                                    </Tag>
                                ))
                            }
                        </Box>
                    </Flex> :
                    <Flex borderRadius={5} bg={"white"} w={"100%"} p={5} gap={4} justifyContent={'center'}>
                        <Spinner size={'md'} thickness="4px" emptyColor='gray.200' color='blue.500' />
                        <Text my={"auto"} fontSize={'sm'}>Identifying headers</Text>
                    </Flex>
                : 
                <Flex borderRadius={5} bg={"white"} w={"100%"} p={5} gap={4} justifyContent={'center'}>
                    <Text my={"auto"} fontSize={'sm'}>Add Data Source</Text>
                </Flex>
            }
        </Box>
    )
}

export default HeaderTab;