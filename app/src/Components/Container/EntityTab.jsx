import { Avatar, AvatarBadge, Box, Button, Flex, Tag, Text, useToast } from "@chakra-ui/react"
import { FaPlus } from "react-icons/fa6";
import { validateProjectData } from "../lib/conf";

const EntityTab = ({storeData, current, setCurrent}) => {
    const toast = useToast()
    const handleAddNewNode = () => {
        setCurrent({
            attributes: {},
            type: "node",
            index: [],
            name: null
        })
    }

    const handleAddNewRelationship = () => {
        setCurrent({
            attributes: {},
            type: "relationships",
            name: null,
        })
    }

    const transformAndExport = () => {
        let result = validateProjectData(storeData)
        if(!result.valid){
            toast({
                title: <Text fontSize={'sm'}>{result.error}</Text>,
                status: "warning", duration: 3000, variant: "subtle"
            });
        } else{
            console.log("Ready for ETL")
        }
    }


    return (
        <Flex p={1} gap={2} direction={"column"}>
            <Box borderRadius={5} bg={"aliceblue"} width={"100%"} p={4} pb={3}>
                <Text fontWeight={'bold'} fontSize={"sm"}>Nodes</Text>
                <Box width={"100%"} overflow={"auto"} my={2}>
                    <Flex gap={4} pb={3}>
                        <Box role="button" onClick={handleAddNewNode}>
                            <Avatar icon={<FaPlus fontSize='1rem' />} />
                        </Box>
                        {
                            Object.keys(storeData.nodes)?.map((item) => (
                                <Box key={item} role="button" onClick={() => {
                                        let dat = storeData.nodes[item]
                                        dat["type"] = "node"
                                        dat["name"] = item
                                        setCurrent(dat)
                                    }}>
                                    <Avatar 
                                        name={(item.trim() === '' || storeData.nodes[item].name.trim() === '') ? "!" : item} 
                                        backgroundColor={(item.trim() === '' || storeData.nodes[item].name.trim() === '') ? "red.500" : undefined}>
                                    </Avatar>
                                </Box>
                            ))
                        }
                    </Flex>
                </Box>
            </Box>
            <Box borderRadius={5} bg={"aliceblue"} width={"100%"} p={4} pb={3}>
                <Text fontWeight={'bold'} fontSize={"sm"}>Relationships</Text>
                <Box width={"100%"} overflow={"auto"} my={1}>
                    <Flex gap={2} pb={3}>
                        <Box role="button" onClick={handleAddNewRelationship}>
                            <Tag bg={"gray.400"} color={"white"} justifyContent={'center'} fontSize={"xs"} fontWeight={"bold"} width={"60px"}>
                                <FaPlus fontSize={10} />
                            </Tag>
                        </Box>
                        {
                            Object.keys(storeData.relationships).map((item, index) => (
                                <Box role="button" key={index} onClick={() => {
                                        let dat = storeData.relationships[item]
                                        dat["type"] = "relationships"
                                        dat["name"] = item
                                        setCurrent(dat)
                                    }}>
                                        {storeData.relationships[item].node1 !== '' && storeData.relationships[item].node2 !== '' ? (
                                            <Tag bg="gray.400" color="white" minWidth="70px" justifyContent="center" fontSize="xs" fontWeight="bold">
                                                <Text>{item}</Text>
                                            </Tag>
                                        ) : <Tag bg="red.500" color="white" minWidth="70px" justifyContent="center" fontSize="xs" fontWeight="bold">
                                                <Text>! Error</Text>
                                            </Tag>
                                        }

                                </Box>
                            ))
                        }
                    </Flex>
                </Box>
            </Box>
            <Button fontSize={'sm'} onClick={transformAndExport}>Transform and Export to DB</Button>
        </Flex>
    )
}

export default EntityTab