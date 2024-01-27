import { Avatar, Box, Button, Flex, Tag, Text } from "@chakra-ui/react"
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";

const EntityTab = ({storeData, current, setCurrent}) => {
    const handleAddNewNode = () => {
        setCurrent({
            parameters: {},
            type: "node",
            index: ""
        })
    }

    const handleAddNewRelationship = () => {
        setCurrent({
            parameters: {},
            type: "relationships",
            index: ""
        })
    }

    const showStore = () => {
        console.log(storeData)
    }


    return (
        <Flex p={1} gap={3} direction={"column"}>
            <Box borderRadius={5} bg={"aliceblue"} width={"100%"} p={5}>
                <Text fontWeight={'bold'} fontSize={"sm"}>Nodes</Text>
                <Box width={"100%"} overflow={"auto"} my={2}>
                    <Flex gap={4} py={3}>
                        <Box role="button" onClick={handleAddNewNode}>
                            <Avatar icon={<FaPlus fontSize='1.5rem' />} />
                        </Box>
                        {
                            Object.keys(storeData.nodes).map((item) => (
                                <Box key={item} role="button" onClick={() => {
                                        let dat = storeData.nodes[item]
                                        dat["type"] = "node"
                                        dat["name"] = item
                                        setCurrent(dat)
                                    }}>
                                    <Avatar name={item} />
                                </Box>
                            ))
                        }
                    </Flex>
                </Box>
            </Box>
            <Box borderRadius={5} bg={"aliceblue"} width={"100%"} p={5}>
                <Text fontWeight={'bold'} fontSize={"sm"}>Relationships</Text>
                <Box width={"100%"} overflow={"auto"} my={1}>
                    <Flex gap={2} py={3}>
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
                                    <Tag bg={"gray.400"} color={"white"} justifyContent={'center'} fontSize={"xs"} fontWeight={"bold"}>
                                        <Text fontSize={"xs"} px={2}>{item}</Text>
                                    </Tag>
                                </Box>
                            ))
                        }
                    </Flex>
                </Box>
            </Box>
            <Flex justifyContent={"end"}>
                <Button size={'xs'} onClick={showStore}>Show</Button>
            </Flex>
        </Flex>
    )
}

export default EntityTab