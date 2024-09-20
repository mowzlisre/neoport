import { Box, Button, Divider, Flex, Input, InputGroup, InputLeftAddon, Select, Text, useToast } from "@chakra-ui/react";
import { MdArrowRightAlt } from "react-icons/md";
import { TbCirclesRelation } from "react-icons/tb";

const RelationshipEntityForm = ({ current, setCurrent, storeData, columns, saveEntity, cancelSandBoxEvent }) => {
    const toast = useToast();

    const handleSave = () => {
        if (!current.node1 || !current.node2) {
            toast({
                title: "Both Node 1 and Node 2 must be selected.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        saveEntity();
    };

    const addAttribute = () => {
        setCurrent((prevCurrent) => {
            const newAttributes = {
                ...prevCurrent.attributes,
                [Object.keys(prevCurrent.attributes).length]: { key: "", value: "" },
            };
            return {
                ...prevCurrent,
                attributes: newAttributes,
            };
        });
    };


    return (
        <Box>
            <Flex direction={"column"} height={"85%"}>
                <Flex p={3}>
                    <InputGroup>
                        <InputLeftAddon bg={"white"} border={0} width={"40px"}>
                            <Text fontSize={'xs'}><TbCirclesRelation fontSize={23} /></Text>
                        </InputLeftAddon>
                        <Input
                            variant={"none"}
                            fontSize={"sm"}
                            placeholder='Entity Name'
                            value={current.name || ""}
                            fontWeight={"bold"}
                            onChange={(e) => setCurrent((prevCurrent) => ({
                                ...prevCurrent,
                                name: e.target.value,
                            }))}
                        />
                    </InputGroup>
                </Flex>
                <Divider />
                <Box height={"40vh"} overflow={"auto"}>
                    <Flex p={2} gap={2}>
                        <Select
                            value={current.node1 || ""}
                            fontSize={"sm"}
                            size={'sm'}
                            onChange={(e) => setCurrent(prevCurrent => ({
                                ...prevCurrent,
                                node1: e.target.value,
                            }))}
                        >
                            <option disabled value="">--- Select a field ---</option>
                            {Object.keys(storeData.nodes).map((item, index) => (
                                <option key={index} value={item}>
                                    {item}
                                </option>
                            ))}
                        </Select>

                        <Flex>
                            <Text m={'auto'}>
                                <MdArrowRightAlt />
                            </Text>
                        </Flex>
                        <Select
                            value={current.node2 || ""}
                            fontSize={"sm"}
                            size={'sm'}
                            onChange={(e) => setCurrent(prevCurrent => ({
                                ...prevCurrent,
                                node2: e.target.value,
                            }))}
                        >
                            <option disabled value="">--- Select a field ---</option>
                            {Object.keys(storeData.nodes).map((item, index) => (

                                <option key={index} value={item}>
                                    {item}
                                </option>
                            ))}
                        </Select>
                    </Flex>
                    <Divider />
                    <Box p={5}>
                        <Text fontSize={"sm"} fontWeight={"bold"} mb={3}>
                            Attributes
                        </Text>
                        {
                            Object.entries(current.attributes).map(([key, param]) => (
                                <Flex key={key} gap={2}>
                                    <Input
                                        size={"sm"}
                                        value={param.key}
                                        placeholder='params'
                                        onChange={(e) => setCurrent(prevCurrent => {
                                            const updatedAttributes = {
                                                ...prevCurrent.attributes,
                                                [key]: { ...prevCurrent.attributes[key], key: e.target.value }
                                            };
                                            return { ...prevCurrent, attributes: updatedAttributes };
                                        })}
                                    />

                                    <Flex>
                                        <Text m={'auto'}>
                                            <MdArrowRightAlt />
                                        </Text>
                                    </Flex>
                                    <Select
                                        size={"sm"}
                                        value={param.value}
                                        onChange={(e) => setCurrent(prevCurrent => {
                                            const updatedAttributes = {
                                                ...prevCurrent.attributes,
                                                [key]: { ...prevCurrent.attributes[key], value: e.target.value }
                                            };
                                            return { ...prevCurrent, attributes: updatedAttributes };
                                        })}
                                    >
                                        <option disabled value="">--- Select a field ---</option>
                                        {columns.map((column, index) => (
                                            <option key={index} value={column}>
                                                {column}
                                            </option>
                                        ))}
                                    </Select>
                                </Flex>
                            ))
                        }
                    </Box>
                </Box>
            </Flex>
            <Divider />
            <Flex justifyContent={"space-between"} p={2}>
                <Button size={"sm"} variant={"ghost"} onClick={cancelSandBoxEvent}>
                    <Text fontSize={"xs"}>Cancel</Text>
                </Button>
                <Flex gap={2}>
                    <Button size={"sm"} variant={"ghost"} onClick={addAttribute}>
                        <Text fontSize={"xs"}>Add Attribute</Text>
                    </Button>
                    <Button size={"sm"} variant={"ghost"} onClick={handleSave}>
                        <Text fontSize={"xs"}>Save</Text>
                    </Button>
                </Flex>
            </Flex>
        </Box>
    );
};

export default RelationshipEntityForm;
